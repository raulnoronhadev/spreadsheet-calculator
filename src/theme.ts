import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
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
