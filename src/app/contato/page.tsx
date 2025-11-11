'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Send as SendIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { Appointment } from '@/types';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

export default function ContactPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // STRIPE DESABILITADO: Remover verificação de plano pago
    // else if (!loading && user && user.subscriptionStatus !== 'paid') {
    //   router.push('/planos');
    // }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;

    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);

      const appointmentsList: Appointment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Appointment));

      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !selectedDate || !selectedTime || !message.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      setSubmitting(true);

      const dateObj = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate;
      if (!dateObj) return;

      const appointmentsRef = collection(db, 'appointments');
      await addDoc(appointmentsRef, {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhone: phone,
        date: dateObj.toISOString().split('T')[0],
        time: selectedTime,
        message,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setMessage('');
      setPhone('');
      setSelectedTime('');
      
      // Recarregar agendamentos
      await loadAppointments();

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // STRIPE DESABILITADO: Comentado verificação de plano pago
  // if (user.subscriptionStatus !== 'paid') {
  //   return (
  //     <MainLayout>
  //       <Card sx={{ maxWidth: 600, mx: 'auto', mt: 8, textAlign: 'center' }}>
  //         <CardContent sx={{ p: 6 }}>
  //           <LockIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
  //           <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
  //             Recurso Exclusivo PRO
  //           </Typography>
  //           <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
  //             O contato direto com gestora financeira está disponível apenas para assinantes do plano PRO.
  //           </Typography>
  //           <Button
  //             variant="contained"
  //             size="large"
  //             onClick={() => router.push('/planos')}
  //             sx={{
  //               background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  //               boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
  //             }}
  //           >
  //             Ver Planos
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </MainLayout>
  //   );
  // }

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header com melhor espaçamento */}
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            Contato com Gestora 📞
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Agende uma reunião e receba orientação especializada para seus investimentos
          </Typography>
        </Box>

        {success && (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />} 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '0.95rem'
              }
            }}
          >
            Solicitação enviada com sucesso! A gestora entrará em contato em breve.
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Formulário de Agendamento */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4, fontSize: '1.5rem' }}>
                  Agendar Reunião
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      Selecione a Data
                    </Typography>
                    <Box sx={{ 
                      '& .react-calendar': { 
                        width: '100%', 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        padding: 2,
                        fontFamily: 'inherit',
                      },
                      '& .react-calendar__tile--active': {
                        background: 'primary.main',
                        borderRadius: 2,
                      },
                      '& .react-calendar__tile:hover': {
                        background: 'grey.100',
                        borderRadius: 2,
                      }
                    }}>
                      <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        minDate={new Date()}
                        locale="pt-BR"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      Selecione o Horário
                    </Typography>
                    <Grid container spacing={1.5}>
                      {AVAILABLE_TIMES.map((time) => (
                        <Grid key={time} size={{ xs: 4 }}>
                          <Chip
                            label={time}
                            onClick={() => setSelectedTime(time)}
                            color={selectedTime === time ? 'primary' : 'default'}
                            sx={{
                              width: '100%',
                              cursor: 'pointer',
                              fontWeight: 600,
                              py: 2.5,
                              borderRadius: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <TextField
                    label="Telefone (opcional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    placeholder="(11) 99999-9999"
                  />

                  <TextField
                    label="Mensagem"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    sx={{ 
                      mb: 4,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    placeholder="Descreva brevemente o assunto que gostaria de discutir..."
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={submitting || !selectedTime || !message.trim()}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    {submitting ? 'Enviando...' : 'Solicitar Reunião'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Agendamentos */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                mb: 3
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4, fontSize: '1.5rem' }}>
                  Suas Solicitações
                </Typography>

                {loadingAppointments ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : appointments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                      Você ainda não tem agendamentos
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {appointments.map((appointment) => (
                      <Card 
                        key={appointment.id} 
                        elevation={0}
                        sx={{ 
                          mb: 2, 
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              {appointment.date}
                            </Typography>
                            <Chip
                              label={
                                appointment.status === 'pending' ? 'Pendente' :
                                appointment.status === 'confirmed' ? 'Confirmado' :
                                'Cancelado'
                              }
                              color={
                                appointment.status === 'pending' ? 'warning' :
                                appointment.status === 'confirmed' ? 'success' :
                                'error'
                              }
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                            Horário: {appointment.time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {appointment.message}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card 
              elevation={0}
              sx={{ 
                bgcolor: 'info.light',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'info.main'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1rem' }}>
                  💡 Dica
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                  Prepare suas dúvidas com antecedência para aproveitar melhor a reunião com a gestora.
                  Tenha em mãos informações sobre seus investimentos atuais e objetivos financeiros.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}

