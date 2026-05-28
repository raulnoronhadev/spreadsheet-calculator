import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';

interface DropZoneProps {
  fileName: string;
  onFile: (file: File) => void;
}

export default function DropZone({ fileName, onFile }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
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
  );
}
