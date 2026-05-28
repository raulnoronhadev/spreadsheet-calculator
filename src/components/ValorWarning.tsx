import { Alert } from '@mui/material';

export default function ValorWarning() {
  return (
    <Alert
      severity="warning"
      variant="outlined"
      sx={{
        mb: 4,
        borderRadius: 2,
        fontFamily: 'inherit',
        fontSize: '0.82rem',
        alignItems: 'center',
      }}
    >
      Não foi possível encontrar a coluna <b>Valor</b> nesta planilha. O total
      exibido (R$ 0,00) não reflete os dados — verifique o cabeçalho do arquivo.
    </Alert>
  );
}
