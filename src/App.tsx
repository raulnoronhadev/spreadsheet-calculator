import { useState, useRef, useCallback } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Fade, Grow,
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import * as XLSX from 'xlsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4ade80' },
    background: { default: '#0d0d0d', paper: '#141414' },
    text: { primary: '#f0fdf4', secondary: '#6b7280' },
  },
  typography: {
    fontFamily: '"DM Mono", "Fira Code", monospace',
  },
  shape: { borderRadius: 12 },
});

interface SheetRow {
  Valentia?: number | string;
  [key: string]: unknown;
}

function parseValor(raw: unknown): number {
  if (raw == null) return 0;
  const str = String(raw).replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  const n = Number(str);
  return isNaN(n) ? 0 : n;
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ─── Component ───────────────────────────────────────────── */
export default function App() {
  const [data, setData] = useState<SheetRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'array' });
      const wsname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[wsname];
      const jsonData: SheetRow[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        blankrows: false,
      });
      const hdrs = Object.keys(jsonData[0] || {});
      const sum = jsonData.reduce((acc, row) => acc + parseValor(row['Valentia']), 0);
      setHeaders(hdrs);
      setData(jsonData);
      setTotalValue(sum);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  /* Drag handlers */
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const hasData = data.length > 0;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: '100vw',
          overflow: 'hidden',
          minHeight: '100vh',
          bgcolor: 'background.default',
          px: { xs: 2, md: 6 },
          py: 6,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {/* ── Header ── */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <TableChartRoundedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight={700} letterSpacing="-0.5px">
              Leitor de Planilha
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Importe um arquivo <b>.xls</b> ou <b>.xlsx</b> para visualizar e somar a coluna <b>Valentia</b>.
          </Typography>
        </Box>

        <Box
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          sx={{
            border: '2px dashed',
            borderColor: dragging ? 'primary.main' : alpha('#4ade80', 0.25),
            borderRadius: 3,
            p: { xs: 4, md: 6 },
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            bgcolor: dragging ? alpha('#4ade80', 0.06) : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: alpha('#4ade80', 0.6),
              bgcolor: alpha('#4ade80', 0.04),
            },
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: alpha('#4ade80', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: alpha('#4ade80', 0.2),
              transition: 'transform 0.2s',
              transform: dragging ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            <UploadFileRoundedIcon sx={{ color: 'primary.main', fontSize: 30 }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography fontWeight={600} color={dragging ? 'primary.main' : 'text.primary'}>
              {dragging ? 'Solte o arquivo aqui' : 'Arraste e solte sua planilha'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              ou clique para selecionar — .xls, .xlsx
            </Typography>
          </Box>
          {fileName && (
            <Chip
              label={fileName}
              size="small"
              sx={{
                bgcolor: alpha('#4ade80', 0.12),
                color: 'primary.main',
                fontFamily: 'inherit',
                fontSize: '0.7rem',
                border: '1px solid',
                borderColor: alpha('#4ade80', 0.3),
              }}
            />
          )}
          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".xls,.xlsx"
            onChange={onInputChange}
          />
        </Box>

        <Fade in={hasData} timeout={400}>
          <Box sx={{ display: hasData ? 'block' : 'none', mb: 4 }}>
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
                  TOTAL (coluna Valentia)
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main" lineHeight={1.4}>
                  R$ {formatBRL(totalValue)}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Fade>

        {hasData && (
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
        )}
      </Box>
    </ThemeProvider>
  );
}