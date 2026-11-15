import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

// Mantido exclusivamente no servidor — nunca exposto ao cliente
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

function validateBrazilianWhatsAppServer(raw: string): string | null {
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
  subject: string;
  visitDate: string;
  visitType: string;
  notes: string;
  simulation: SimulationPayload | null;
  deliveryChannel: string;
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

function buildEmailContent(record: ProposalRecord): {
  subject: string;
  text: string;
  html: string;
} {
  const createdBr = new Date(record.createdAt).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

  const subjectLine = `[Mansão Guaratuba] ${record.subject} — ${record.name}`;

  const lines: string[] = [
    'NOVA PROPOSTA / CONTATO RECEBIDO PELO SITE',
    '==========================================',
    `Assunto: ${record.subject}`,
    `Recebido em: ${createdBr}`,
    '',
    'DADOS DO INTERESSADO:',
    `• Nome: ${record.name}`,
    `• E-mail: ${record.email}`,
    `• Telefone: ${record.phone}`,
  ];

  if (record.visitDate || record.visitType) {
    lines.push('');
    lines.push('ATENDIMENTO / VISITA:');
    if (record.visitType) lines.push(`• Modalidade: ${record.visitType}`);
    if (record.visitDate) lines.push(`• Data preferencial: ${record.visitDate}`);
  }

  if (record.simulation) {
    const s = record.simulation;
    lines.push('');
    lines.push('PROPOSTA SIMULADA:');
    lines.push(`• Preço anunciado: ${formatBRL(s.listedPrice)}`);
    lines.push(`• Valor da proposta: ${formatBRL(s.proposalValue)}`);
    lines.push(`• Entrada (${s.downPaymentPercent}%): ${formatBRL(s.downPaymentValue)}`);
    lines.push(`• Saldo a financiar: ${formatBRL(s.financedAmount)}`);
    lines.push(`• Prazo: ${s.termMonths} meses`);
    lines.push(`• Taxa efetiva anual: ${s.annualRate}% a.a.`);
    lines.push(
      `• SAC: 1ª parcela ${formatBRL(s.sacFirstInstallment)} | última ${formatBRL(s.sacLastInstallment)} | total ${formatBRL(s.sacTotalPaid)}`
    );
    lines.push(
      `• Price: parcela fixa ${formatBRL(s.priceInstallment)} | total ${formatBRL(s.priceTotalPaid)}`
    );
  }

  if (record.notes) {
    lines.push('');
    lines.push('OBSERVAÇÕES:');
    lines.push(record.notes);
  }

  const simHtml = record.simulation
    ? `
      <h3 style="color:#0F2942;margin:20px 0 8px;">Proposta Simulada</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#555;">Preço anunciado</td><td style="padding:6px 0;text-align:right;font-weight:600;">${escapeHtml(formatBRL(record.simulation.listedPrice))}</td></tr>
        <tr><td style="padding:6px 0;color:#555;">Valor da proposta</td><td style="padding:6px 0;text-align:right;font-weight:700;color:#0F2942;">${escapeHtml(formatBRL(record.simulation.proposalValue))}</td></tr>
        <tr><td style="padding:6px 0;color:#555;">Entrada (${escapeHtml(String(record.simulation.downPaymentPercent))}%)</td><td style="padding:6px 0;text-align:right;font-weight:600;">${escapeHtml(formatBRL(record.simulation.downPaymentValue))}</td></tr>
        <tr><td style="padding:6px 0;color:#555;">Saldo a financiar</td><td style="padding:6px 0;text-align:right;font-weight:600;">${escapeHtml(formatBRL(record.simulation.financedAmount))}</td></tr>
        <tr><td style="padding:6px 0;color:#555;">Prazo / Taxa anual</td><td style="padding:6px 0;text-align:right;font-weight:600;">${escapeHtml(String(record.simulation.termMonths))} meses · ${escapeHtml(String(record.simulation.annualRate))}% a.a.</td></tr>
        <tr><td style="padding:6px 0;color:#555;">SAC (1ª / última / total)</td><td style="padding:6px 0;text-align:right;">${escapeHtml(formatBRL(record.simulation.sacFirstInstallment))} / ${escapeHtml(formatBRL(record.simulation.sacLastInstallment))} / ${escapeHtml(formatBRL(record.simulation.sacTotalPaid))}</td></tr>
        <tr><td style="padding:6px 0;color:#555;">Price (parcela fixa / total)</td><td style="padding:6px 0;text-align:right;">${escapeHtml(formatBRL(record.simulation.priceInstallment))} / ${escapeHtml(formatBRL(record.simulation.priceTotalPaid))}</td></tr>
      </table>
    `
    : '';

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#FAF8F5;color:#1A1A1A;border:1px solid #DFD7CA;border-radius:8px;">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#C59B27;font-weight:700;">Mansão Frente ao Mar · Guaratuba</p>
      <h2 style="margin:0 0 16px;color:#0F2942;">${escapeHtml(record.subject)}</h2>
      <p style="margin:0 0 16px;font-size:13px;color:#6B645B;">Recebido em ${escapeHtml(createdBr)}</p>

      <div style="background:#FFFFFF;padding:16px;border-radius:6px;border:1px solid #EAE2D6;">
        <p style="margin:0 0 8px;"><strong>Nome:</strong> ${escapeHtml(record.name)}</p>
        <p style="margin:0 0 8px;"><strong>E-mail:</strong> ${escapeHtml(record.email)}</p>
        <p style="margin:0 0 8px;"><strong>Telefone:</strong> ${escapeHtml(record.phone)}</p>
        ${record.visitType ? `<p style="margin:0 0 8px;"><strong>Modalidade:</strong> ${escapeHtml(record.visitType)}</p>` : ''}
        ${record.visitDate ? `<p style="margin:0 0 8px;"><strong>Data preferencial:</strong> ${escapeHtml(record.visitDate)}</p>` : ''}
        ${record.notes ? `<p style="margin:8px 0 0;"><strong>Observações:</strong><br/>${escapeHtml(record.notes).replace(/\n/g, '<br/>')}</p>` : ''}
      </div>

      ${simHtml}
    </div>
  `;

  return {
    subject: subjectLine,
    text: lines.join('\n'),
    html,
  };
}

async function dispatchEmail(
  record: ProposalRecord,
  requestOrigin: string,
  requestReferer: string
): Promise<string> {
  const { subject, text, html } = buildEmailContent(record);

  // 1. Resend API (HTTPS — opcional via Secret)
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const from = process.env.RESEND_FROM?.trim() || 'Mansão Guaratuba <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [DESTINATION_EMAIL],
          reply_to: record.email,
          subject,
          text,
          html,
        }),
      });
      if (res.ok) {
        return 'resend';
      }
      const errBody = await res.text();
      console.error('[proposta] Erro no envio via Resend:', res.status, errBody);
    } catch (err) {
      console.error('[proposta] Exceção no envio via Resend:', err);
    }
  }

  // 2. SMTP / Gmail via Nodemailer (opcional via Secret)
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
      const smtpFrom = (process.env.SMTP_FROM || `Mansão Guaratuba <${smtpUser}>`).trim();

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: DESTINATION_EMAIL,
        replyTo: record.email,
        subject,
        text,
        html,
      });
      return 'smtp';
    } catch (err) {
      console.error('[proposta] Erro no envio via SMTP:', err);
    }
  }

  // 3. Webhook HTTP (opcional via Secret)
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: DESTINATION_EMAIL,
          replyTo: record.email,
          subject,
          text,
          html,
          lead: record,
        }),
      });
      if (res.ok) {
        return 'webhook';
      }
      console.error('[proposta] Erro no envio via webhook:', res.status);
    } catch (err) {
      console.error('[proposta] Exceção no envio via webhook:', err);
    }
  }

  // 4. FormSubmit server-side (sem Secret, e-mail oculto apenas no servidor)
  try {
    const formSubmitTarget = encodeURIComponent(
      (process.env.FORMSUBMIT_TOKEN || DESTINATION_EMAIL).trim()
    );
    const originHeader = 'https://mansao-guaratuba-frente-mar.vercel.app';
    const refererHeader = 'https://mansao-guaratuba-frente-mar.vercel.app/';

    const simulationSummary = record.simulation
      ? [
          `Preço anunciado: ${formatBRL(record.simulation.listedPrice)}`,
          `Valor da proposta: ${formatBRL(record.simulation.proposalValue)}`,
          `Entrada (${record.simulation.downPaymentPercent}%): ${formatBRL(record.simulation.downPaymentValue)}`,
          `Saldo a financiar: ${formatBRL(record.simulation.financedAmount)}`,
          `Prazo: ${record.simulation.termMonths} meses`,
          `Taxa anual: ${record.simulation.annualRate}% a.a.`,
          `SAC: 1ª ${formatBRL(record.simulation.sacFirstInstallment)} | última ${formatBRL(record.simulation.sacLastInstallment)} | total ${formatBRL(record.simulation.sacTotalPaid)}`,
          `Price: parcela ${formatBRL(record.simulation.priceInstallment)} | total ${formatBRL(record.simulation.priceTotalPaid)}`,
        ].join(' | ')
      : '';

    const payload: Record<string, string> = {
      name: record.name,
      email: record.email,
      Telefone: record.phone,
      Assunto: record.subject,
      _subject: subject,
      _replyto: record.email,
      _template: 'table',
      _captcha: 'false',
    };

    if (record.visitType) payload.Modalidade = record.visitType;
    if (record.visitDate) payload.Data_Preferencial = record.visitDate;
    if (simulationSummary) payload.Proposta_Simulada = simulationSummary;
    if (record.notes) payload.Observacoes = record.notes;

    const res = await fetch(`https://formsubmit.co/ajax/${formSubmitTarget}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: originHeader,
        Referer: refererHeader,
        'User-Agent': 'MansaoGuaratubaServer/1.0',
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as {
      success?: string | boolean;
      message?: string;
    } | null;

    if (res.ok && (data?.success === 'true' || data?.success === true)) {
      return 'formsubmit';
    }

    console.warn('[proposta] Resposta FormSubmit:', res.status, data);
  } catch (err) {
    console.error('[proposta] Exceção no envio via FormSubmit:', err);
  }

  return 'stored';
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.post('/api/proposta', async (req: Request, res: Response) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

    if (name.length < 3) {
      res.status(400).json({
        ok: false,
        error: 'Informe seu nome completo para enviar a mensagem.',
      });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({
        ok: false,
        error: 'Informe um endereço de e-mail válido para enviar a mensagem.',
      });
      return;
    }
    const phoneError = validateBrazilianWhatsAppServer(phone);
    if (phoneError) {
      res.status(400).json({
        ok: false,
        error: phoneError,
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
      subject,
      visitDate,
      visitType,
      notes,
      simulation,
      deliveryChannel: 'pending',
    };

    const reqOrigin = req.get('origin') || '';
    const reqReferer = req.get('referer') || '';
    record.deliveryChannel = await dispatchEmail(record, reqOrigin, reqReferer);
    await persistProposal(record);

    // Resposta limpa sem jamais revelar o e-mail de destino
    res.status(200).json({
      ok: true,
      message: 'Mensagem enviada com sucesso. Dentro de 24h entraremos em contato.',
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
