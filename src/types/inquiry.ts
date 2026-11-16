export interface AttachedSimulation {
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

export interface InquiryContext {
  id: number;
  subject: string;
  notes?: string;
  simulation?: AttachedSimulation;
  negotiateInPerson?: boolean;
  initialStep?: 'valores' | 'dados';
}
