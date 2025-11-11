import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TrendingUp } from '@mui/icons-material';

interface DividendsSummaryProps {
  totalReceived: number;
  averageYield: number;
  totalPayments: number;
  totalProjetado: number;
  totalInvestido: number;
}

export function DividendsSummary({ 
  totalReceived, 
  averageYield, 
  totalPayments,
  totalProjetado,
  totalInvestido
}: DividendsSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card 
          elevation={0} 
          sx={{ 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                  Total Investido
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {formatCurrency(totalInvestido)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                  Valor total da carteira
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 40, opacity: 0.7 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card 
          elevation={0} 
          sx={{ 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 3
          }}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Projeção 12 Meses
            </Typography>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {formatCurrency(totalProjetado)}
            </Typography>
            <Chip 
              label="Estimativa" 
              size="small" 
              sx={{ mt: 1 }}
              color="success"
              variant="outlined"
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card 
          elevation={0} 
          sx={{ 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 3
          }}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Dividend Yield Médio
            </Typography>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {averageYield.toFixed(2)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Retorno anual estimado
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

