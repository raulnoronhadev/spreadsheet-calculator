export type SheetRow = Record<string, unknown>;

const NBSP = String.fromCharCode(0xa0);

/** Removes combining diacritical marks (U+0300 to U+036F) left behind by NFD. */
function stripDiacritics(value: string): string {
  let out = '';
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0x300 && code <= 0x36f) continue;
    out += ch;
  }
  return out;
}

/**
 * Normalizes a header string for tolerant matching: strips accents, converts
 * non-breaking spaces to regular spaces, trims, and lowercases.
 */
export function normalize(value: string): string {
  return stripDiacritics(value.normalize('NFD'))
    .split(NBSP)
    .join(' ')
    .trim()
    .toLowerCase();
}

/** Finds the actual header key whose normalized form equals "valor". */
export function findValorKey(headers: string[]): string | null {
  return headers.find((h) => normalize(h) === 'valor') ?? null;
}

/** Parses a Brazilian-currency cell value into a number, tolerating text exports. */
export function parseValor(raw: unknown): number {
  if (typeof raw === 'number') return raw;
  if (raw == null) return 0;

  let str = String(raw).split(NBSP).join(' ').trim();
  if (str === '') return 0;

  str = str.replace(/r\$/gi, '').trim();

  // Parenthesized values denote negatives, e.g. "(1.234,56)".
  let negative = false;
  const paren = str.match(/^\((.*)\)$/);
  if (paren) {
    negative = true;
    str = paren[1].trim();
  }

  // pt-BR: "." is a thousands separator and "," is the decimal mark.
  str = str.replace(/\./g, '').replace(',', '.');
  const n = Number(str);
  if (Number.isNaN(n)) return 0;
  return negative ? -n : n;
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
