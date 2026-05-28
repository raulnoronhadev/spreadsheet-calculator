import { Box, Typography } from '@mui/material';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';

export default function Header() {
  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <TableChartRoundedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700} letterSpacing="-0.5px">
          Leitor de Planilha
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Importe um arquivo <b>.xls</b> ou <b>.xlsx</b> para visualizar e somar a coluna <b>Valor</b>.
      </Typography>
    </Box>
  );
}
