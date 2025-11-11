import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/services/stripe/config';
import { db } from '@/services/firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura ausente' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Erro ao verificar webhook:', error);
    return NextResponse.json(
      { error: 'Webhook inválido' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.firebaseUID;
        
        if (userId && session.subscription) {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            subscriptionStatus: 'paid',
            subscriptionId: session.subscription,
            customerId: session.customer,
            updatedAt: serverTimestamp(),
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        
        if ('metadata' in customer && customer.metadata?.firebaseUID) {
          const userId = customer.metadata.firebaseUID;
          const userRef = doc(db, 'users', userId);
          
          const status = subscription.status === 'active' ? 'paid' : 'free';
          
          await updateDoc(userRef, {
            subscriptionStatus: status,
            updatedAt: serverTimestamp(),
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        
        if ('metadata' in customer && customer.metadata?.firebaseUID) {
          const userId = customer.metadata.firebaseUID;
          const userRef = doc(db, 'users', userId);
          
          await updateDoc(userRef, {
            subscriptionStatus: 'free',
            subscriptionId: null,
            updatedAt: serverTimestamp(),
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

