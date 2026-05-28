import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { parseValor, findValorKey, type SheetRow } from '../utils/spreadsheet';

export interface UseSpreadsheet {
  data: SheetRow[];
  headers: string[];
  totalValue: number;
  fileName: string;
  valorKeyFound: boolean;
  hasData: boolean;
  processFile: (file: File) => void;
}

export function useSpreadsheet(): UseSpreadsheet {
  const [data, setData] = useState<SheetRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [fileName, setFileName] = useState('');
  const [valorKeyFound, setValorKeyFound] = useState(true);

  const processFile = useCallback((file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'array' });
      const wsname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json<SheetRow>(worksheet, {
        defval: '',
        blankrows: false,
      });
      const hdrs = Object.keys(jsonData[0] ?? {});
      const valorKey = findValorKey(hdrs);
      const sum = valorKey
        ? jsonData.reduce((acc, row) => acc + parseValor(row[valorKey]), 0)
        : 0;
      setHeaders(hdrs);
      setData(jsonData);
      setTotalValue(sum);
      setValorKeyFound(valorKey !== null);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const hasData = data.length > 0;

  return { data, headers, totalValue, fileName, valorKeyFound, hasData, processFile };
}
