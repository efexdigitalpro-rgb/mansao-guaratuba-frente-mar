import { resolve4, resolve6, resolveMx } from 'node:dns/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';

const WHATSAPP_NUMBER =
  (process.env.WHATSAPP_NUMBER || '5548998351959').replace(/\D/g, '') || '5548998351959';

const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;
const BLOCKED_EMAIL_DOMAINS = new Set([
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
const EMAIL_DOMAIN_TYPOS: Record<string, string> = {
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
const TRUSTED_EMAIL_PROVIDERS = new Set([
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'yahoo.com',
  'yahoo.com.br',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'globo.com',
  'proton.me',
  'protonmail.com',
]);
const BLOCKED_EMAIL_LOCALS = new Set([
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
const SEQUENTIAL_PHONE_PATTERNS = new Set([
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

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

function validatePhoneByLanguage(raw: string, lang: string): string | null {
  const digits = raw.replace(/\D/g, '');
  const isBrazilFormat =
    lang === 'pt' || ((digits.length === 12 || digits.length === 13) && digits.startsWith('55'));

  if (!isBrazilFormat) {
    if (digits.length < 8 || digits.length > 15) {
      return lang === 'es'
        ? 'Ingrese un número de WhatsApp o teléfono válido con código de país.'
        : 'Please enter a valid WhatsApp or phone number with country code.';
    }
    if (/^(\d)\1+$/.test(digits) || SEQUENTIAL_PHONE_PATTERNS.has(digits.slice(-8))) {
      return lang === 'es'
        ? 'Número inválido o repetido. Ingrese un teléfono real.'
        : 'Invalid or repeated phone number. Please enter a real number.';
    }
    return null;
  }

  let brDigits = digits;
  if (
    brDigits.startsWith('55') &&
    (raw.trim().startsWith('+') || brDigits.length >= 12)
  ) {
    brDigits = brDigits.slice(2);
  }
  if (brDigits.startsWith('0') && brDigits.length >= 11) {
    brDigits = brDigits.slice(1);
  }
  if (brDigits.length < 10 || brDigits.length > 11) {
    return 'Informe um número de WhatsApp / telefone válido com DDD.';
  }
  const ddd = brDigits.slice(0, 2);
  if (!VALID_BR_DDDS.has(ddd)) {
    return `DDD (${ddd}) inválido. Informe um DDD válido do Brasil.`;
  }
  const local = brDigits.slice(2);
  const lastEight = local.slice(-8);
  if (/^(\d)\1+$/.test(brDigits) || /^(\d)\1+$/.test(local) || /^(\d)\1+$/.test(lastEight)) {
    return 'Número inválido ou repetido. Informe um WhatsApp verdadeiro.';
  }
  if (SEQUENTIAL_PHONE_PATTERNS.has(local) || SEQUENTIAL_PHONE_PATTERNS.has(lastEight)) {
    return 'Número sequencial inválido. Informe um WhatsApp verdadeiro.';
  }
  if (brDigits.length === 11) {
    if (!/^9[1-9]\d{7}$/.test(local)) {
      return 'WhatsApp celular deve começar com 9 após o DDD.';
    }
    return null;
  }
  if (/^[6-9]/.test(local)) {
    return 'Falta o dígito 9 na frente do número de celular/WhatsApp.';
  }
  if (!/^[2-5]\d{7}$/.test(local)) {
    return 'Número de telefone inválido após o DDD.';
  }
  return null;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('DNS_TIMEOUT')), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function validateEmailByLanguage(raw: string, lang: string): Promise<string | null> {
  const email = raw.trim().toLowerCase();
  const msg = (pt: string, es: string, en: string) =>
    lang === 'es' ? es : lang === 'en' ? en : pt;

  if (!email) {
    return msg(
      'Informe um endereço de e-mail válido para enviar a mensagem.',
      'Ingrese una dirección de correo electrónico válida para enviar el mensaje.',
      'Please enter a valid email address to send the message.'
    );
  }
  if (email.length > 254 || /\s/.test(email) || !EMAIL_REGEX.test(email)) {
    return msg(
      'Formato de e-mail inválido (ex.: nome@dominio.com).',
      'Formato de correo inválido (ej.: nombre@dominio.com).',
      'Invalid email format (e.g. name@domain.com).'
    );
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || localPart.length > 64 || !domain || domain.length > 253) {
    return msg(
      'Informe um endereço de e-mail válido.',
      'Ingrese una dirección de correo válida.',
      'Please enter a valid email address.'
    );
  }

  const suggestedDomain = EMAIL_DOMAIN_TYPOS[domain];
  if (suggestedDomain) {
    return msg(
      `Verifique o domínio do e-mail (você quis dizer @${suggestedDomain}?).`,
      `Verifique el dominio del correo (¿quiso decir @${suggestedDomain}?).`,
      `Please check the email domain (did you mean @${suggestedDomain}?).`
    );
  }

  if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
    return msg(
      'Informe um e-mail real e ativo (e-mails de teste ou temporários não são aceitos).',
      'Ingrese un correo real y activo (no se aceptan correos de prueba o temporales).',
      'Please enter a real, active email address (test or temporary emails are not accepted).'
    );
  }

  const domainBase = domain.split('.')[0] || '';
  if (
    /^([a-z0-9])\1{2,}$/.test(localPart) ||
    (BLOCKED_EMAIL_LOCALS.has(localPart) && domainBase === localPart)
  ) {
    return msg(
      'Informe seu endereço de e-mail verdadeiro.',
      'Ingrese su correo electrónico real.',
      'Please enter your real email address.'
    );
  }

  if (!TRUSTED_EMAIL_PROVIDERS.has(domain)) {
    try {
      const mxRecords = await withTimeout(resolveMx(domain), 2200);
      if (mxRecords.length > 0 && mxRecords.some((r) => Boolean(r.exchange))) {
        return null;
      }
    } catch (err) {
      const code = (err as NodeJS.ErrnoException)?.code;
      if (err instanceof Error && err.message === 'DNS_TIMEOUT') {
        return null;
      }
      if (code && code !== 'ENOTFOUND' && code !== 'ENODATA' && code !== 'ENOTIMP') {
        return null;
      }
    }

    try {
      const ipv4 = await withTimeout(resolve4(domain), 1800).catch(() => [] as string[]);
      if (ipv4.length > 0) return null;
      const ipv6 = await withTimeout(resolve6(domain), 1800).catch(() => [] as string[]);
      if (ipv6.length > 0) return null;
    } catch {
      return null;
    }

    return msg(
      'O domínio deste e-mail não existe ou não recebe mensagens. Informe um e-mail válido.',
      'El dominio de este correo no existe o no recibe mensajes. Ingrese un correo válido.',
      'This email domain does not exist or cannot receive email. Please enter a valid email.'
    );
  }

  return null;
}

const formatBRL = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Math.round(value));

async function readJsonBody(req: VercelRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer));
  }
  const raw = Buffer.concat(chunks).toString('utf-8');
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function sendJson(res: ServerResponse, statusCode: number, payload: Record<string, unknown>) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default async function handler(req: VercelRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Método não permitido.' });
    return;
  }

  const body = await readJsonBody(req);
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const lang = body.lang === 'es' || body.lang === 'en' ? body.lang : 'pt';

  if (name.length < 3) {
    sendJson(res, 400, {
      ok: false,
      error:
        lang === 'es'
          ? 'Por favor, ingrese su nombre completo para enviar el mensaje.'
          : lang === 'en'
            ? 'Please enter your full name to send the message.'
            : 'Informe seu nome completo para enviar a mensagem.',
    });
    return;
  }
  const emailError = await validateEmailByLanguage(email, lang);
  if (emailError) {
    sendJson(res, 400, {
      ok: false,
      error: emailError,
    });
    return;
  }
  const phoneError = validatePhoneByLanguage(phone, lang);
  if (phoneError) {
    sendJson(res, 400, { ok: false, error: phoneError });
    return;
  }

  const city = typeof body.city === 'string' ? body.city.trim().slice(0, 80) : '';
  const state = typeof body.state === 'string' ? body.state.trim().slice(0, 80) : '';
  const isCityValid =
    city.length >= 2 && /[a-zA-ZÀ-ÿ]{2,}/.test(city) && !/^(.)\1+$/i.test(city);
  const isStateValid =
    state.length >= 2 && /[a-zA-ZÀ-ÿ]{2,}/.test(state) && !/^(.)\1+$/i.test(state);
  if (!isCityValid) {
    sendJson(res, 400, {
      ok: false,
      error:
        lang === 'es'
          ? 'Ingrese su ciudad para enviar el mensaje.'
          : lang === 'en'
            ? 'Please enter your city.'
            : 'Informe sua cidade para enviar a mensagem.',
    });
    return;
  }
  if (!isStateValid) {
    sendJson(res, 400, {
      ok: false,
      error:
        lang === 'es'
          ? 'Ingrese su estado o provincia para enviar el mensaje.'
          : lang === 'en'
            ? 'Please enter your state or province.'
            : 'Informe seu estado (UF) para enviar a mensagem.',
    });
    return;
  }

  const subject =
    typeof body.subject === 'string' && body.subject.trim()
      ? body.subject.trim().slice(0, 140)
      : 'Agendamento de Visita / Proposta';
  const visitDate = typeof body.visitDate === 'string' ? body.visitDate.trim().slice(0, 32) : '';
  const visitType = typeof body.visitType === 'string' ? body.visitType.trim().slice(0, 80) : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : '';

  const createdBr = `${new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })} (Horário de Brasília)`;

  const simulationLines: string[] = [];
  if (body.simulation && typeof body.simulation === 'object') {
    const s = body.simulation as Record<string, unknown>;
    const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
    const financed = num(s.financedAmount);
    simulationLines.push(`• Valor anunciado: ${formatBRL(num(s.listedPrice))}`);
    simulationLines.push(`• Valor da proposta: ${formatBRL(num(s.proposalValue))}`);
    if (financed <= 0) {
      simulationLines.push('• Forma de pagamento: À vista (100%)');
    } else {
      simulationLines.push(
        `• Entrada (${num(s.downPaymentPercent)}%): ${formatBRL(num(s.downPaymentValue))}`
      );
      simulationLines.push(`• Saldo a financiar: ${formatBRL(financed)}`);
      simulationLines.push(
        `• Prazo / Taxa: ${num(s.termMonths)} meses · ${num(s.annualRate)}% a.a.`
      );
      simulationLines.push(
        `• SAC: 1ª ${formatBRL(num(s.sacFirstInstallment))} | última ${formatBRL(num(s.sacLastInstallment))}`
      );
      simulationLines.push(`• Price: parcela fixa ${formatBRL(num(s.priceInstallment))}`);
    }
  } else {
    simulationLines.push('• Condição: A negociar diretamente com o proprietário');
  }

  const whatsappMessage = [
    '*NOVA PROPOSTA — MANSÃO GUARATUBA*',
    `Assunto: ${subject}`,
    `Horário: ${createdBr}`,
    '',
    '*Dados do Interessado:*',
    `• Nome: ${name}`,
    `• E-mail: ${email}`,
    `• Telefone / WhatsApp: ${phone}`,
    `• Cidade / Estado: ${city} - ${state}`,
    '',
    '*Atendimento:*',
    visitType ? `• Modalidade: ${visitType}` : '',
    visitDate ? `• Data preferencial: ${visitDate}` : '',
    '',
    '*Proposta / Condições:*',
    ...simulationLines,
    notes ? `\n*Observações:*\n${notes}` : '',
  ]
    .filter((line, idx, arr) => {
      if (line !== '') return true;
      return idx > 0 && arr[idx - 1] !== '';
    })
    .join('\n');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  sendJson(res, 200, {
    ok: true,
    channel: 'whatsapp',
    whatsappUrl,
    whatsappMessage,
    message: 'Proposta validada para envio direto pelo WhatsApp.',
  });
}
