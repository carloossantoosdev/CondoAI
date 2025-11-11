'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Stars as StarsIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';

export default function PlansPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSubscribe = async () => {
    if (!user) return;

    try {
      setCheckoutLoading(true);
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao criar sessão de pagamento');
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      alert('Erro ao processar pagamento');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const freePlanFeatures = [
    { text: 'Dashboard com visão geral', included: true },
    { text: 'Explorar investimentos', included: true },
    { text: 'Conteúdo educacional completo', included: true },
    { text: 'Simulador de investimentos', included: true },
    { text: 'Quiz de perfil do investidor', included: true },
    { text: 'Investimentos limitados (até 5)', included: true },
    { text: 'Contato com gestora financeira', included: false },
    { text: 'Suporte prioritário', included: false },
  ];

  const proPlanFeatures = [
    { text: 'Dashboard com visão geral', included: true },
    { text: 'Explorar investimentos', included: true },
    { text: 'Conteúdo educacional completo', included: true },
    { text: 'Simulador de investimentos', included: true },
    { text: 'Quiz de perfil do investidor', included: true },
    { text: 'Investimentos ilimitados', included: true },
    { text: 'Contato direto com gestora financeira', included: true },
    { text: 'Agendamento de reuniões', included: true },
    { text: 'Suporte prioritário', included: true },
    { text: 'Relatórios personalizados', included: true },
  ];

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isPaidUser = user.subscriptionStatus === 'paid';

  return (
    <MainLayout>
      <Box>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Escolha seu Plano 💎
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Invista no seu futuro financeiro com as ferramentas certas
          </Typography>
          {isPaidUser && (
            <Chip
              label="Você está no Plano PRO"
              color="success"
              icon={<StarsIcon />}
              sx={{ mt: 2, py: 2, px: 1, fontSize: '1rem' }}
            />
          )}
        </Box>

        <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
          {/* Plano Gratuito */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid',
                borderColor: 'divider',
                position: 'relative',
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Gratuito
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', display: 'inline' }}>
                    R$ 0
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ display: 'inline' }}>
                    /mês
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Perfeito para começar sua jornada de investimentos
                </Typography>

                <List>
                  {freePlanFeatures.map((feature, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {feature.included ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.text}
                        primaryTypographyProps={{
                          color: feature.included ? 'text.primary' : 'text.disabled',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  disabled={!isPaidUser}
                  sx={{ mt: 3 }}
                >
                  {!isPaidUser ? 'Plano Atual' : 'Fazer Downgrade'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Plano PRO */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '3px solid',
                borderColor: 'primary.main',
                position: 'relative',
                background: 'linear-gradient(135deg, #667eea11 0%, #764ba211 100%)',
              }}
            >
              <Chip
                label="RECOMENDADO"
                color="primary"
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: 20,
                  fontWeight: 'bold',
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 1 }}>
                    PRO
                  </Typography>
                  <StarsIcon color="primary" />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', display: 'inline' }}>
                    R$ 49,90
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ display: 'inline' }}>
                    /mês
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Para investidores que querem ir além e ter suporte especializado
                </Typography>

                <List>
                  {proPlanFeatures.map((feature, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={feature.text} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isPaidUser || checkoutLoading}
                  onClick={handleSubscribe}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                  }}
                >
                  {checkoutLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isPaidUser ? (
                    'Plano Atual'
                  ) : (
                    'Assinar Agora'
                  )}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FAQ ou informações adicionais */}
        <Card sx={{ maxWidth: 1200, mx: 'auto', mt: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Por que escolher o Plano PRO?
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    🎯 Suporte Especializado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tenha acesso direto a gestores financeiros experientes para tirar dúvidas
                    e receber orientações personalizadas.
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    📊 Investimentos Ilimitados
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Construa um portfólio diversificado sem limitações, explorando todas as
                    oportunidades do mercado.
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    📅 Agendamento Flexível
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agende reuniões com gestoras nos horários que funcionam para você e
                    receba consultoria personalizada.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}

