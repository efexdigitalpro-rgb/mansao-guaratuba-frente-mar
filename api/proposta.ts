import type { IncomingMessage, ServerResponse } from 'node:http';
import nodemailer from 'nodemailer';

const DESTINATION_EMAIL = (
  process.env.PROPOSAL_DESTINATION_EMAIL || 'imoveisgrupolrv@gmail.com'
).trim();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

function validateBrazilianWhatsApp(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  }
  if (digits.length < 10 || digits.length > 11) {
    return 'Informe um número de WhatsApp / telefone válido com DDD.';
  }
  const ddd = digits.slice(0, 2);
  if (!VALID_BR_DDDS.has(ddd)) {
    return `DDD (${ddd}) inválido. Informe um DDD válido do Brasil.`;
  }
  const local = digits.slice(2);
  const lastEight = local.slice(-8);
  if (/^(\d)\1+$/.test(digits) || /^(\d)\1+$/.test(local) || /^(\d)\1+$/.test(lastEight)) {
    return 'Número inválido ou repetido. Informe um WhatsApp verdadeiro.';
  }
  if (SEQUENTIAL_PHONE_PATTERNS.has(local) || SEQUENTIAL_PHONE_PATTERNS.has(lastEight)) {
    return 'Número sequencial inválido. Informe um WhatsApp verdadeiro.';
  }
  if (digits.length === 11) {
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

const formatBRL = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

  if (name.length < 3) {
    sendJson(res, 400, {
      ok: false,
      error: 'Informe seu nome completo para enviar a mensagem.',
    });
    return;
  }
  if (!EMAIL_REGEX.test(email)) {
    sendJson(res, 400, {
      ok: false,
      error: 'Informe um endereço de e-mail válido para enviar a mensagem.',
    });
    return;
  }
  const phoneError = validateBrazilianWhatsApp(phone);
  if (phoneError) {
    sendJson(res, 400, { ok: false, error: phoneError });
    return;
  }

  const subject =
    typeof body.subject === 'string' && body.subject.trim()
      ? body.subject.trim().slice(0, 140)
      : 'Agendamento de Visita / Proposta';
  const visitDate = typeof body.visitDate === 'string' ? body.visitDate.trim().slice(0, 32) : '';
  const visitType = typeof body.visitType === 'string' ? body.visitType.trim().slice(0, 80) : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : '';

  let simulationSummary = '';
  if (body.simulation && typeof body.simulation === 'object') {
    const s = body.simulation as Record<string, unknown>;
    const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
    simulationSummary = [
      `Preço anunciado: ${formatBRL(num(s.listedPrice))}`,
      `Valor da proposta: ${formatBRL(num(s.proposalValue))}`,
      `Entrada (${num(s.downPaymentPercent)}%): ${formatBRL(num(s.downPaymentValue))}`,
      `Saldo a financiar: ${formatBRL(num(s.financedAmount))}`,
      `Prazo: ${num(s.termMonths)} meses`,
      `Taxa anual: ${num(s.annualRate)}% a.a.`,
      `SAC: 1ª ${formatBRL(num(s.sacFirstInstallment))} | última ${formatBRL(num(s.sacLastInstallment))} | total ${formatBRL(num(s.sacTotalPaid))}`,
      `Price: parcela ${formatBRL(num(s.priceInstallment))} | total ${formatBRL(num(s.priceTotalPaid))}`,
    ].join(' | ');
  }

  const emailSubject = `[Mansão Guaratuba] ${subject} — ${name}`;
  const createdBr = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const textLines = [
    `Assunto: ${subject}`,
    `Recebido em: ${createdBr}`,
    `Nome: ${name}`,
    `E-mail: ${email}`,
    `Telefone / WhatsApp: ${phone}`,
    visitType ? `Modalidade: ${visitType}` : '',
    visitDate ? `Data preferencial: ${visitDate}` : '',
    simulationSummary ? `Proposta simulada: ${simulationSummary}` : '',
    notes ? `Observações: ${notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#FAF8F5;color:#1A1A1A;border:1px solid #DFD7CA;border-radius:8px;">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#C59B27;font-weight:700;">Mansão Frente ao Mar · Guaratuba</p>
      <h2 style="margin:0 0 16px;color:#0F2942;">${escapeHtml(subject)}</h2>
      <p style="margin:0 0 16px;font-size:13px;color:#6B645B;">Recebido em ${escapeHtml(createdBr)}</p>
      <div style="background:#FFFFFF;padding:16px;border-radius:6px;border:1px solid #EAE2D6;">
        <p style="margin:0 0 8px;"><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px;"><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p style="margin:0 0 8px;"><strong>Telefone / WhatsApp:</strong> ${escapeHtml(phone)}</p>
        ${visitType ? `<p style="margin:0 0 8px;"><strong>Modalidade:</strong> ${escapeHtml(visitType)}</p>` : ''}
        ${visitDate ? `<p style="margin:0 0 8px;"><strong>Data preferencial:</strong> ${escapeHtml(visitDate)}</p>` : ''}
        ${simulationSummary ? `<p style="margin:0 0 8px;"><strong>Proposta simulada:</strong><br/>${escapeHtml(simulationSummary)}</p>` : ''}
        ${notes ? `<p style="margin:8px 0 0;"><strong>Observações:</strong><br/>${escapeHtml(notes).replace(/\n/g, '<br/>')}</p>` : ''}
      </div>
    </div>
  `;

  // 1. Resend (se configurado)
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM?.trim() || 'Mansão Guaratuba <onboarding@resend.dev>',
          to: [DESTINATION_EMAIL],
          reply_to: email,
          subject: emailSubject,
          text: textLines,
          html,
        }),
      });
      if (r.ok) {
        sendJson(res, 200, {
          ok: true,
          message: 'Mensagem enviada com sucesso. Dentro de 24h entraremos em contato.',
        });
        return;
      }
    } catch (err) {
      console.error('[api/proposta] Resend error:', err);
    }
  }

  // 2. SMTP (se configurado)
  const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim();
  if (smtpPass) {
    try {
      const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
      const smtpPort = Number(process.env.SMTP_PORT || 465);
      const smtpUser = (
        process.env.SMTP_USER ||
        process.env.GMAIL_USER ||
        DESTINATION_EMAIL
      ).trim();
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: (process.env.SMTP_FROM || `Mansão Guaratuba <${smtpUser}>`).trim(),
        to: DESTINATION_EMAIL,
        replyTo: email,
        subject: emailSubject,
        text: textLines,
        html,
      });
      sendJson(res, 200, {
        ok: true,
        message: 'Mensagem enviada com sucesso. Dentro de 24h entraremos em contato.',
      });
      return;
    } catch (err) {
      console.error('[api/proposta] SMTP error:', err);
    }
  }

  // 3. FormSubmit server-side (sem Secret, e-mail oculto apenas no servidor)
  try {
    const formSubmitTarget = encodeURIComponent(
      (process.env.FORMSUBMIT_TOKEN || DESTINATION_EMAIL).trim()
    );
    const originHeader = 'https://mansao-guaratuba-frente-mar.vercel.app';
    const refererHeader = 'https://mansao-guaratuba-frente-mar.vercel.app/';

    const payload: Record<string, string> = {
      name,
      email,
      Telefone: phone,
      Assunto: subject,
      _subject: emailSubject,
      _replyto: email,
      _template: 'table',
      _captcha: 'false',
    };
    if (visitType) payload.Modalidade = visitType;
    if (visitDate) payload.Data_Preferencial = visitDate;
    if (simulationSummary) payload.Proposta_Simulada = simulationSummary;
    if (notes) payload.Observacoes = notes;

    await fetch(`https://formsubmit.co/ajax/${formSubmitTarget}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: originHeader,
        Referer: refererHeader,
        'User-Agent': 'MansaoGuaratubaVercel/1.0',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[api/proposta] FormSubmit error:', err);
  }

  sendJson(res, 200, {
    ok: true,
    message: 'Mensagem enviada com sucesso. Dentro de 24h entraremos em contato.',
  });
}
