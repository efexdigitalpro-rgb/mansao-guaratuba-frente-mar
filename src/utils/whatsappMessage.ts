import type { AttachedSimulation } from '../types/inquiry';

export const OWNER_WHATSAPP_NUMBER = '5548998351959';

const formatBRL = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Math.round(value));

export interface WhatsappProposalInput {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  subject: string;
  visitDate?: string;
  visitType?: string;
  notes?: string;
  simulation?: AttachedSimulation | null;
}

export function buildWhatsappProposalMessage(input: WhatsappProposalInput): string {
  const createdBr = `${new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })} (Horário de Brasília)`;

  const simulationLines: string[] = [];
  if (input.simulation) {
    const s = input.simulation;
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
    `Assunto: ${input.subject}`,
    `Horário: ${createdBr}`,
    '',
    '*Dados do Interessado:*',
    `• Nome: ${input.name}`,
    `• E-mail: ${input.email}`,
    `• Telefone / WhatsApp: ${input.phone}`,
    `• Cidade / Estado: ${input.city} - ${input.state}`,
    '',
    '*Atendimento:*',
    input.visitType ? `• Modalidade: ${input.visitType}` : '',
    input.visitDate ? `• Data preferencial: ${input.visitDate}` : '',
    '',
    '*Proposta / Condições:*',
    ...simulationLines,
    input.notes ? `\n*Observações:*\n${input.notes}` : '',
  ]
    .filter((line, idx, arr) => {
      if (line !== '') return true;
      return idx > 0 && arr[idx - 1] !== '';
    })
    .join('\n');
}

export function buildWhatsappDirectUrl(
  message: string,
  whatsappNumber: string = OWNER_WHATSAPP_NUMBER
): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '') || OWNER_WHATSAPP_NUMBER;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
