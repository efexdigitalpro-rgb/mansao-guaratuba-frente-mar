import 'dotenv/config';
import { resolve4, resolve6, resolveMx } from 'node:dns/promises';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

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

async function withDnsTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
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
      const mxRecords = await withDnsTimeout(resolveMx(domain), 2200);
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
      const ipv4 = await withDnsTimeout(resolve4(domain), 1800).catch(() => [] as string[]);
      if (ipv4.length > 0) return null;
      const ipv6 = await withDnsTimeout(resolve6(domain), 1800).catch(() => [] as string[]);
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

interface RateCache {
  usdToBrl: number;
  updatedAt: string;
  provider: string;
  cachedAt: number;
}

const RATE_CACHE_TTL_MS = 15 * 60 * 1000;
const FALLBACK_USD_TO_BRL = 5.65;
let rateCache: RateCache | null = null;

async function fetchLiveUsdToBrl(): Promise<{
  usdToBrl: number;
  updatedAt: string;
  provider: string;
  source: 'live' | 'fallback';
}> {
  if (rateCache && Date.now() - rateCache.cachedAt < RATE_CACHE_TTL_MS) {
    return {
      usdToBrl: rateCache.usdToBrl,
      updatedAt: rateCache.updatedAt,
      provider: rateCache.provider,
      source: 'live',
    };
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        rates?: { BRL?: number };
        time_last_update_utc?: string;
      };
      const rate = data?.rates?.BRL;
      if (typeof rate === 'number' && Number.isFinite(rate) && rate > 1 && rate < 20) {
        rateCache = {
          usdToBrl: Number(rate.toFixed(4)),
          updatedAt: data.time_last_update_utc || new Date().toISOString(),
          provider: 'ExchangeRate-API',
          cachedAt: Date.now(),
        };
        return { ...rateCache, source: 'live' };
      }
    }
  } catch {
    // try next
  }

  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=BRL', {
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        date?: string;
        rates?: { BRL?: number };
      };
      const rate = data?.rates?.BRL;
      if (typeof rate === 'number' && Number.isFinite(rate) && rate > 1 && rate < 20) {
        rateCache = {
          usdToBrl: Number(rate.toFixed(4)),
          updatedAt: data.date || new Date().toISOString(),
          provider: 'Frankfurter / ECB',
          cachedAt: Date.now(),
        };
        return { ...rateCache, source: 'live' };
      }
    }
  } catch {
    // try next
  }

  try {
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL', {
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        USDBRL?: { bid?: string; create_date?: string };
      };
      const bid = Number(data?.USDBRL?.bid);
      if (Number.isFinite(bid) && bid > 1 && bid < 20) {
        rateCache = {
          usdToBrl: Number(bid.toFixed(4)),
          updatedAt: data?.USDBRL?.create_date || new Date().toISOString(),
          provider: 'AwesomeAPI',
          cachedAt: Date.now(),
        };
        return { ...rateCache, source: 'live' };
      }
    }
  } catch {
    // fallback below
  }

  return {
    usdToBrl: rateCache?.usdToBrl ?? FALLBACK_USD_TO_BRL,
    updatedAt: rateCache?.updatedAt ?? new Date().toISOString(),
    provider: 'Referência',
    source: 'fallback',
  };
}

const DATA_DIR = path.join(__dirname, 'data');
const PROPOSALS_FILE = path.join(DATA_DIR, 'propostas.json');

interface SimulationPayload {
  listedPrice: number;
  proposalValue: number;
  downPaymentPercent: number;
  downPaymentValue: number;
  financedAmount: number;
  termMonths: number;
  annualRate: number;
  sacFirstInstallment: number;
  sacLastInstallment: number;
  sacTotalPaid: number;
  priceInstallment: number;
  priceTotalPaid: number;
}

interface ProposalRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  subject: string;
  visitDate: string;
  visitType: string;
  notes: string;
  simulation: SimulationPayload | null;
  deliveryChannel: 'whatsapp';
}

const formatBRL = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Math.round(value));

async function persistProposal(record: ProposalRecord): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let existing: ProposalRecord[] = [];
    try {
      const raw = await fs.readFile(PROPOSALS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        existing = parsed;
      }
    } catch {
      // Arquivo ainda não existe
    }
    existing.push(record);
    await fs.writeFile(PROPOSALS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.error('[proposta] Falha ao gravar backup local:', err);
  }
}

function buildWhatsappMessage(record: ProposalRecord): string {
  const createdBr = `${new Date(record.createdAt).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })} (Horário de Brasília)`;

  const simulationLines: string[] = [];
  if (record.simulation) {
    const s = record.simulation;
    simulationLines.push(`• Valor anunciado: ${formatBRL(s.listedPrice)}`);
    simulationLines.push(`• Valor da proposta: ${formatBRL(s.proposalValue)}`);
    if (s.financedAmount <= 0) {
      simulationLines.push('• Forma de pagamento: À vista (100%)');
    } else {
      simulationLines.push(`• Entrada (${s.downPaymentPercent}%): ${formatBRL(s.downPaymentValue)}`);
      simulationLines.push(`• Saldo a financiar: ${formatBRL(s.financedAmount)}`);
      simulationLines.push(`• Prazo / Taxa: ${s.termMonths} meses · ${s.annualRate}% a.a.`);
      simulationLines.push(
        `• SAC: 1ª ${formatBRL(s.sacFirstInstallment)} | última ${formatBRL(s.sacLastInstallment)}`
      );
      simulationLines.push(`• Price: parcela fixa ${formatBRL(s.priceInstallment)}`);
    }
  } else {
    simulationLines.push('• Condição: A negociar diretamente com o proprietário');
  }

  return [
    '*NOVA PROPOSTA — MANSÃO GUARATUBA*',
    `Assunto: ${record.subject}`,
    `Horário: ${createdBr}`,
    '',
    '*Dados do Interessado:*',
    `• Nome: ${record.name}`,
    `• E-mail: ${record.email}`,
    `• Telefone / WhatsApp: ${record.phone}`,
    `• Cidade / Estado: ${record.city} - ${record.state}`,
    '',
    '*Atendimento:*',
    record.visitType ? `• Modalidade: ${record.visitType}` : '',
    record.visitDate ? `• Data preferencial: ${record.visitDate}` : '',
    '',
    '*Proposta / Condições:*',
    ...simulationLines,
    record.notes ? `\n*Observações:*\n${record.notes}` : '',
  ]
    .filter((line, idx, arr) => {
      if (line !== '') return true;
      return idx > 0 && arr[idx - 1] !== '';
    })
    .join('\n');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/cotacao', async (_req: Request, res: Response) => {
    const quote = await fetchLiveUsdToBrl();
    res.status(200).json({
      ok: true,
      base: 'USD',
      target: 'BRL',
      usdToBrl: quote.usdToBrl,
      updatedAt: quote.updatedAt,
      provider: quote.provider,
      source: quote.source,
    });
  });

  app.post('/api/proposta', async (req: Request, res: Response) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const lang = body.lang === 'es' || body.lang === 'en' ? body.lang : 'pt';

    if (name.length < 3) {
      res.status(400).json({
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
      res.status(400).json({
        ok: false,
        error: emailError,
      });
      return;
    }
    const phoneError = validatePhoneByLanguage(phone, lang);
    if (phoneError) {
      res.status(400).json({
        ok: false,
        error: phoneError,
      });
      return;
    }

    const city = typeof body.city === 'string' ? body.city.trim().slice(0, 80) : '';
    const state = typeof body.state === 'string' ? body.state.trim().slice(0, 80) : '';
    const isCityValid =
      city.length >= 2 && /[a-zA-ZÀ-ÿ]{2,}/.test(city) && !/^(.)\1+$/i.test(city);
    const isStateValid =
      state.length >= 2 && /[a-zA-ZÀ-ÿ]{2,}/.test(state) && !/^(.)\1+$/i.test(state);
    if (!isCityValid) {
      res.status(400).json({
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
      res.status(400).json({
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

    let simulation: SimulationPayload | null = null;
    if (body.simulation && typeof body.simulation === 'object') {
      const s = body.simulation as Record<string, unknown>;
      const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
      simulation = {
        listedPrice: num(s.listedPrice),
        proposalValue: num(s.proposalValue),
        downPaymentPercent: num(s.downPaymentPercent),
        downPaymentValue: num(s.downPaymentValue),
        financedAmount: num(s.financedAmount),
        termMonths: num(s.termMonths),
        annualRate: num(s.annualRate),
        sacFirstInstallment: num(s.sacFirstInstallment),
        sacLastInstallment: num(s.sacLastInstallment),
        sacTotalPaid: num(s.sacTotalPaid),
        priceInstallment: num(s.priceInstallment),
        priceTotalPaid: num(s.priceTotalPaid),
      };
    }

    const record: ProposalRecord = {
      id: `prop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      name,
      email,
      phone,
      city,
      state,
      subject,
      visitDate,
      visitType,
      notes,
      simulation,
      deliveryChannel: 'whatsapp',
    };

    await persistProposal(record);

    const whatsappMessage = buildWhatsappMessage(record);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    res.status(200).json({
      ok: true,
      channel: 'whatsapp',
      whatsappUrl,
      whatsappMessage,
      message: 'Proposta validada para envio direto pelo WhatsApp.',
    });
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
