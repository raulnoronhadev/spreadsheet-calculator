import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { useSpreadsheet } from './hooks/useSpreadsheet';
import Header from './components/Header';
import DropZone from './components/DropZone';
import ValorWarning from './components/ValorWarning';
import TotalCard from './components/TotalCard';
import SheetTable from './components/SheetTable';

export default function App() {
  const {
    data, headers, totalValue, fileName, valorKeyFound, hasData, processFile,
  } = useSpreadsheet();

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
        <Header />
        <DropZone fileName={fileName} onFile={processFile} />
        {hasData && !valorKeyFound && <ValorWarning />}
        <TotalCard total={totalValue} show={hasData} />
        {hasData && <SheetTable data={data} headers={headers} />}
      </Box>
    </ThemeProvider>
  );
}
