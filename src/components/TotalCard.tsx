import { Box, Paper, Typography, Fade } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import { formatBRL } from '../utils/spreadsheet';

interface TotalCardProps {
  total: number;
  show: boolean;
}

export default function TotalCard({ total, show }: TotalCardProps) {
  return (
    <Fade in={show} timeout={400}>
      <Box sx={{ display: show ? 'block' : 'none', mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: 2,
            border: '1px solid',
            borderColor: alpha('#4ade80', 0.3),
            bgcolor: alpha('#4ade80', 0.07),
            borderRadius: 2,
          }}
        >
          <AttachMoneyRoundedIcon sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
              TOTAL (coluna Valor)
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main" lineHeight={1.4}>
              R$ {formatBRL(total)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
