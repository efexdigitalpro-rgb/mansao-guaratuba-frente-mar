export interface LiveCurrencyChangeResult {
  formatted: string;
  numericValue: number | null;
}

/**
 * Formata um campo numérico monetário em tempo real (a cada dígito) usando
 * o separador de milhar do idioma ativo, preservando a posição do cursor.
 */
export function handleLiveGroupedDigitsChange(
  input: HTMLInputElement,
  formatGroupingNumber: (value: number) => string,
  maxDigits = 10
): LiveCurrencyChangeResult {
  const rawValue = input.value;
  const caretPos = input.selectionStart ?? rawValue.length;
  const digitsBeforeCaret = rawValue.slice(0, caretPos).replace(/\D/g, '').length;

  const digits = rawValue.replace(/\D/g, '').slice(0, maxDigits);
  if (digits === '') {
    return { formatted: '', numericValue: null };
  }

  const numericValue = Number(digits);
  if (!Number.isFinite(numericValue)) {
    return { formatted: '', numericValue: null };
  }

  const formatted = formatGroupingNumber(numericValue);

  let nextCaret = 0;
  let seenDigits = 0;
  while (nextCaret < formatted.length && seenDigits < digitsBeforeCaret) {
    if (/\d/.test(formatted[nextCaret])) {
      seenDigits++;
    }
    nextCaret++;
  }

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      if (document.activeElement === input) {
        try {
          input.setSelectionRange(nextCaret, nextCaret);
        } catch {
          // Alguns navegadores móveis ignoram setSelectionRange em determinados estados
        }
      }
    });
  }

  return { formatted, numericValue };
}
