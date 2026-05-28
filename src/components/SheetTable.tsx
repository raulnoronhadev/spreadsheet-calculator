import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Grow,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { SheetRow } from '../utils/spreadsheet';

interface SheetTableProps {
  data: SheetRow[];
  headers: string[];
}

export default function SheetTable({ data, headers }: SheetTableProps) {
  return (
    <Grow in timeout={450}>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: alpha('#ffffff', 0.08),
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <TableContainer sx={{ maxHeight: 520, overflowX: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {headers.map((h, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      bgcolor: '#1a1a1a',
                      color: 'primary.main',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid',
                      borderColor: alpha('#4ade80', 0.2),
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h || `Coluna ${i + 1}`}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, ri) => (
                <TableRow
                  key={ri}
                  sx={{
                    '&:nth-of-type(even)': { bgcolor: alpha('#ffffff', 0.02) },
                    '&:hover': { bgcolor: alpha('#4ade80', 0.04) },
                    transition: 'background 0.15s',
                    '& td': {
                      borderColor: alpha('#ffffff', 0.05),
                      fontSize: '0.82rem',
                      color: 'text.primary',
                      py: 1,
                    },
                  }}
                >
                  {headers.map((h, ci) => (
                    <TableCell key={ci}>{String(row[h] ?? '')}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: '1px solid',
            borderColor: alpha('#ffffff', 0.06),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {data.length} {data.length === 1 ? 'linha' : 'linhas'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {headers.length} colunas
          </Typography>
        </Box>
      </Paper>
    </Grow>
  );
}
