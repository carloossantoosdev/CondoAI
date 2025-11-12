import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/services/stripe/config';
import { createClient } from '@supabase/supabase-js';

// Função para criar cliente Supabase admin (evita erro de build)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId } = await req.json();
    console.log('🔍 Verificando pagamento:', { sessionId, userId });

    if (!sessionId || !userId) {
      console.error('❌ Dados incompletos:', { sessionId, userId });
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Buscar a sessão no Stripe
    console.log('📡 Buscando sessão no Stripe...');
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('✅ Sessão encontrada:', {
      payment_status: session.payment_status,
      subscription: session.subscription,
      customer: session.customer,
    });

    // Verificar se o pagamento foi concluído
    if (session.payment_status === 'paid' && session.subscription) {
      console.log('💰 Pagamento confirmado! Atualizando usuário...');
      
      // Buscar email da sessão do Stripe
      const customerEmail = session.customer_details?.email || session.customer_email;
      console.log('📧 Email do cliente:', customerEmail);

      if (!customerEmail) {
        console.error('❌ Email não encontrado na sessão do Stripe!');
        return NextResponse.json(
          { error: 'Email não encontrado' },
          { status: 400 }
        );
      }
      
      // Usar UPSERT para criar/atualizar automaticamente
      console.log('📝 Executando UPSERT para:', { userId, email: customerEmail });
      const supabaseAdmin = getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from('users')
        .upsert({
          id: userId,
          email: customerEmail,
          display_name: customerEmail.split('@')[0],
          subscription_status: 'paid',
          subscription_id: session.subscription as string,
          customer_id: session.customer as string,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select();

      console.log('📊 Resultado do UPSERT:', { data, error, rowCount: data?.length });

      if (error) {
        console.error('❌ Erro ao atualizar usuário no Supabase:', error);
        return NextResponse.json(
          { error: 'Erro ao atualizar status', details: error },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        console.error('⚠️ UPSERT não afetou nenhuma linha!');
        console.error('🔍 Possível causa: RLS bloqueando ou usuário não existe no auth');
        return NextResponse.json(
          { error: 'UPSERT não afetou nenhuma linha. Verifique RLS policies.', userId },
          { status: 500 }
        );
      }

      console.log('✅ Usuário atualizado com sucesso!', data[0]);
      return NextResponse.json({ 
        success: true, 
        subscription_status: 'paid',
        message: 'Status atualizado com sucesso!',
        data 
      });
    }

    console.log('⚠️ Pagamento ainda não confirmado:', session.payment_status);
    return NextResponse.json({ 
      success: false, 
      message: 'Pagamento ainda não foi confirmado',
      payment_status: session.payment_status 
    });
  } catch (error: any) {
    console.error('❌ Erro ao verificar pagamento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar pagamento', details: error },
      { status: 500 }
    );
  }
}

