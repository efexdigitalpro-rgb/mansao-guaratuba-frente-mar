import type { Language } from '../content/translations';

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

const STRICT_EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

const BLOCKED_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'exemplo.com',
  'exemplo.com.br',
  'test.com',
  'teste.com',
  'teste.com.br',
  'fake.com',
  'invalid.com',
  'domain.com',
  'email.com',
  'seuemail.com',
  'seuemail.com.br',
  'noemail.com',
  'sememail.com',
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.info',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'yopmail.com',
  'throwawaymail.com',
  'trashmail.com',
  'sharklasers.com',
  'getnada.com',
  'dispostable.com',
  'mintemail.com',
]);

const DOMAIN_TYPOS: Record<string, string> = {
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.com.br': 'gmail.com',
  'hotmal.com': 'hotmail.com',
  'hotamil.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'icloud.con': 'icloud.com',
};

const BLOCKED_LOCAL_PARTS = new Set([
  'teste',
  'test',
  'asdf',
  'qwerty',
  'seuemail',
  'email',
  'noemail',
  'sememail',
  'fake',
  'none',
  'null',
]);

function msg(lang: Language, pt: string, es: string, en: string): string {
  if (lang === 'es') return es;
  if (lang === 'en') return en;
  return pt;
}

export function validateEmailByLanguage(
  raw: string,
  lang: Language
): EmailValidationResult {
  const email = raw.trim().toLowerCase();

  if (!email) {
    return {
      valid: false,
      error: msg(
        lang,
        'Informe seu e-mail para continuar.',
        'Ingrese su correo electrónico para continuar.',
        'Please enter your email address to continue.'
      ),
    };
  }

  if (email.length > 254 || /\s/.test(email)) {
    return {
      valid: false,
      error: msg(
        lang,
        'Informe um endereço de e-mail válido (sem espaços).',
        'Ingrese un correo electrónico válido (sin espacios).',
        'Please enter a valid email address (no spaces).'
      ),
    };
  }

  if (!STRICT_EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      error: msg(
        lang,
        'Formato de e-mail inválido (ex.: nome@dominio.com).',
        'Formato de correo inválido (ej.: nombre@dominio.com).',
        'Invalid email format (e.g. name@domain.com).'
      ),
    };
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || localPart.length > 64 || !domain || domain.length > 253) {
    return {
      valid: false,
      error: msg(
        lang,
        'Informe um endereço de e-mail válido.',
        'Ingrese una dirección de correo válida.',
        'Please enter a valid email address.'
      ),
    };
  }

  const suggestedDomain = DOMAIN_TYPOS[domain];
  if (suggestedDomain) {
    return {
      valid: false,
      error: msg(
        lang,
        `Verifique o domínio do e-mail (você quis dizer @${suggestedDomain}?).`,
        `Verifique el dominio del correo (¿quiso decir @${suggestedDomain}?).`,
        `Please check the email domain (did you mean @${suggestedDomain}?).`
      ),
    };
  }

  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: msg(
        lang,
        'Informe um e-mail real e ativo (e-mails de teste ou temporários não são aceitos).',
        'Ingrese un correo real y activo (no se aceptan correos de prueba o temporales).',
        'Please enter a real, active email address (test or temporary emails are not accepted).'
      ),
    };
  }

  const domainBase = domain.split('.')[0] || '';
  if (
    /^([a-z0-9])\1{2,}$/.test(localPart) ||
    (BLOCKED_LOCAL_PARTS.has(localPart) && domainBase === localPart)
  ) {
    return {
      valid: false,
      error: msg(
        lang,
        'Informe seu endereço de e-mail verdadeiro.',
        'Ingrese su correo electrónico real.',
        'Please enter your real email address.'
      ),
    };
  }

  return { valid: true };
}
