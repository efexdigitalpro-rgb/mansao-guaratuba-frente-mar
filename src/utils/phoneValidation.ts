const VALID_BR_DDDS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
]);

const SEQUENTIAL_PATTERNS = new Set([
  '01234567',
  '12345678',
  '23456789',
  '87654321',
  '76543210',
  '98765432',
  '123456789',
  '912345678',
  '987654321',
]);

export function normalizeBrPhoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 11);
}

export function formatBrPhoneInput(raw: string): string {
  const digits = normalizeBrPhoneDigits(raw);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export interface PhoneValidationResult {
  valid: boolean;
  error?: string;
}

export function validateBrazilianWhatsApp(raw: string): PhoneValidationResult {
  const digits = normalizeBrPhoneDigits(raw);

  if (digits.length === 0) {
    return { valid: false, error: 'Informe seu telefone / WhatsApp com DDD.' };
  }

  if (digits.length >= 2) {
    const ddd = digits.slice(0, 2);
    if (!VALID_BR_DDDS.has(ddd)) {
      return {
        valid: false,
        error: `DDD (${ddd}) inválido. Informe um DDD válido do Brasil.`,
      };
    }
  }

  if (digits.length < 10) {
    return {
      valid: false,
      error: 'Número incompleto. Informe DDD + 9 dígitos do WhatsApp.',
    };
  }

  const local = digits.slice(2);
  const lastEight = local.slice(-8);

  if (/^(\d)\1+$/.test(digits) || /^(\d)\1+$/.test(local) || /^(\d)\1+$/.test(lastEight)) {
    return {
      valid: false,
      error: 'Número inválido ou repetido. Informe um WhatsApp verdadeiro.',
    };
  }

  if (SEQUENTIAL_PATTERNS.has(local) || SEQUENTIAL_PATTERNS.has(lastEight)) {
    return {
      valid: false,
      error: 'Número sequencial inválido. Informe um WhatsApp verdadeiro.',
    };
  }

  if (digits.length === 11) {
    if (!/^9[1-9]\d{7}$/.test(local)) {
      return {
        valid: false,
        error: 'WhatsApp celular deve começar com 9 após o DDD (ex.: (41) 99999-8888).',
      };
    }
    return { valid: true };
  }

  // 10 dígitos: apenas telefone fixo comercial válido (iniciado por 2 a 5)
  if (/^[6-9]/.test(local)) {
    return {
      valid: false,
      error: 'Falta o dígito 9 na frente do número de celular/WhatsApp.',
    };
  }

  if (!/^[2-5]\d{7}$/.test(local)) {
    return {
      valid: false,
      error: 'Número de telefone inválido após o DDD.',
    };
  }

  return { valid: true };
}

export function formatPhoneByLanguage(raw: string, lang: 'pt' | 'es' | 'en'): string {
  if (lang === 'pt') {
    return formatBrPhoneInput(raw);
  }
  const hasPlus = raw.trim().startsWith('+');
  const cleaned = raw.replace(/[^\d+\s()-]/g, '').slice(0, 22);
  if (!hasPlus && cleaned.replace(/\D/g, '').length > 0) {
    return cleaned;
  }
  return cleaned;
}

export function validatePhoneByLanguage(
  raw: string,
  lang: 'pt' | 'es' | 'en'
): PhoneValidationResult {
  if (lang === 'pt') {
    return validateBrazilianWhatsApp(raw);
  }

  const digits = raw.replace(/\D/g, '');
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    return validateBrazilianWhatsApp(raw);
  }

  if (digits.length === 0) {
    return {
      valid: false,
      error:
        lang === 'es'
          ? 'Ingrese su teléfono / WhatsApp con código de país.'
          : 'Please enter your phone / WhatsApp with country code.',
    };
  }

  if (digits.length < 8 || digits.length > 15) {
    return {
      valid: false,
      error:
        lang === 'es'
          ? 'Número incompleto. Ingrese código de país y número válido.'
          : 'Incomplete number. Please enter country code and a valid number.',
    };
  }

  if (/^(\d)\1+$/.test(digits) || SEQUENTIAL_PATTERNS.has(digits.slice(-8))) {
    return {
      valid: false,
      error:
        lang === 'es'
          ? 'Número inválido o repetido. Ingrese un WhatsApp real.'
          : 'Invalid or repeated number. Please enter a real WhatsApp number.',
    };
  }

  return { valid: true };
}
