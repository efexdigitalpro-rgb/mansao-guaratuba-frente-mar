import { useState, useMemo } from 'react';
import { AlertCircle, Calculator, Send, RotateCcw } from 'lucide-react';
import { BROKER_CONFIG } from '../data/propertyData';
import type { AttachedSimulation } from '../types/inquiry';

const LISTED_PRICE = BROKER_CONFIG.referenceValue; // R$ 30.000.000
const DEFAULT_DOWN_PCT = 30;
const DEFAULT_TERM_MONTHS = 48;
const DEFAULT_ANNUAL_RATE = 12;

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const formatGrouping = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const formatCompactSummaryBRL = (value: number) => {
  if (value >= 1_000_000 && value % 100_000 === 0) {
    const millions = value / 1_000_000;
    const label = millions === 1 ? 'milhão' : 'milhões';
    return `R$ ${millions.toFixed(1).replace('.0', '').replace('.', ',')} ${label}`;
  }
  return formatBRL(value);
};

const formatApproxDiff = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    const rounded = Math.round(millions * 10) / 10;
    const label = rounded === 1 ? 'milhão' : 'milhões';
    return `R$ ${rounded.toFixed(1).replace('.0', '').replace('.', ',')} ${label}`;
  }
  if (abs >= 1_000) {
    return `R$ ${Math.round(abs / 1_000).toLocaleString('pt-BR')} mil`;
  }
  return formatBRL(abs);
};

const formatDurationLabel = (months: number) => {
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  if (remMonths === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remMonths} ${
    remMonths === 1 ? 'mês' : 'meses'
  }`;
};

interface SystemMetrics {
  firstInstallment: number;
  lastInstallment: number;
  totalInterest: number;
  totalPaid: number;
}

interface FinancingSimulatorProps {
  onSendProposal: (simulation: AttachedSimulation) => void;
}

export function FinancingSimulator({ onSendProposal }: FinancingSimulatorProps) {
  const [proposalValue, setProposalValue] = useState<number>(LISTED_PRICE);
  const [proposalDraft, setProposalDraft] = useState<string | null>(null);

  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(DEFAULT_DOWN_PCT);
  const [pctDraft, setPctDraft] = useState<string | null>(null);

  const [downPaymentValue, setDownPaymentValue] = useState<number>(
    Math.round((LISTED_PRICE * DEFAULT_DOWN_PCT) / 100)
  );
  const [downValueDraft, setDownValueDraft] = useState<string | null>(null);

  const [termMonths, setTermMonths] = useState<number>(DEFAULT_TERM_MONTHS);
  const [termDraft, setTermDraft] = useState<string | null>(null);

  const [annualRate, setAnnualRate] = useState<number>(DEFAULT_ANNUAL_RATE);
  const [rateDraft, setRateDraft] = useState<string | null>(null);

  const updateProposal = (nextProposal: number) => {
    const safeProposal = Math.max(1_000_000, Math.min(100_000_000, Math.round(nextProposal)));
    setProposalValue(safeProposal);
    setDownPaymentValue(Math.round((safeProposal * downPaymentPercent) / 100));
  };

  const updateFromPercent = (nextPct: number) => {
    const clampedPct = Math.max(0, Math.min(95, Math.round(nextPct * 10) / 10));
    setDownPaymentPercent(clampedPct);
    setDownPaymentValue(Math.round((proposalValue * clampedPct) / 100));
  };

  const updateFromDownValue = (nextValue: number) => {
    const clampedValue = Math.max(0, Math.min(proposalValue, Math.round(nextValue)));
    setDownPaymentValue(clampedValue);
    const computedPct = proposalValue > 0 ? (clampedValue / proposalValue) * 100 : 0;
    setDownPaymentPercent(Math.round(computedPct * 10) / 10);
  };

  const simulation = useMemo(() => {
    const financedAmount = Math.max(0, proposalValue - downPaymentValue);
    const safeMonths = Math.max(1, Math.min(360, termMonths));
    const safeAnnualRate = Math.max(0, Math.min(30, annualRate));
    const monthlyRate = Math.pow(1 + safeAnnualRate / 100, 1 / 12) - 1;

    const sac: SystemMetrics = {
      firstInstallment: 0,
      lastInstallment: 0,
      totalInterest: 0,
      totalPaid: downPaymentValue,
    };

    const price: SystemMetrics = {
      firstInstallment: 0,
      lastInstallment: 0,
      totalInterest: 0,
      totalPaid: downPaymentValue,
    };

    if (financedAmount > 0 && safeMonths > 0) {
      if (monthlyRate === 0) {
        const flat = financedAmount / safeMonths;
        sac.firstInstallment = flat;
        sac.lastInstallment = flat;
        sac.totalInterest = 0;
        sac.totalPaid = downPaymentValue + financedAmount;

        price.firstInstallment = flat;
        price.lastInstallment = flat;
        price.totalInterest = 0;
        price.totalPaid = downPaymentValue + financedAmount;
      } else {
        // SAC
        const amortization = financedAmount / safeMonths;
        const sacFirst = amortization + financedAmount * monthlyRate;
        const sacLast = amortization + amortization * monthlyRate;
        const sacTotalFinanced = ((sacFirst + sacLast) / 2) * safeMonths;
        sac.firstInstallment = sacFirst;
        sac.lastInstallment = sacLast;
        sac.totalInterest = Math.max(0, sacTotalFinanced - financedAmount);
        sac.totalPaid = downPaymentValue + sacTotalFinanced;

        // Price
        const factor = Math.pow(1 + monthlyRate, safeMonths);
        const priceInstallment = (financedAmount * (monthlyRate * factor)) / (factor - 1);
        const priceTotalFinanced = priceInstallment * safeMonths;
        price.firstInstallment = priceInstallment;
        price.lastInstallment = priceInstallment;
        price.totalInterest = Math.max(0, priceTotalFinanced - financedAmount);
        price.totalPaid = downPaymentValue + priceTotalFinanced;
      }
    }

    return {
      financedAmount,
      safeMonths,
      safeAnnualRate,
      sac,
      price,
      firstInstallmentDiff: Math.max(0, sac.firstInstallment - price.firstInstallment),
      interestSavingsSac: Math.max(0, price.totalInterest - sac.totalInterest),
    };
  }, [proposalValue, downPaymentValue, termMonths, annualRate]);

  const handleReset = () => {
    setProposalValue(LISTED_PRICE);
    setProposalDraft(null);
    setDownPaymentPercent(DEFAULT_DOWN_PCT);
    setPctDraft(null);
    setDownPaymentValue(Math.round((LISTED_PRICE * DEFAULT_DOWN_PCT) / 100));
    setDownValueDraft(null);
    setTermMonths(DEFAULT_TERM_MONTHS);
    setTermDraft(null);
    setAnnualRate(DEFAULT_ANNUAL_RATE);
    setRateDraft(null);
  };

  const formattedPct = downPaymentPercent.toFixed(1).replace('.0', '').replace('.', ',');
  const formattedRate = simulation.safeAnnualRate.toFixed(1).replace('.0', '').replace('.', ',');

  const handleSendSimulation = () => {
    onSendProposal({
      listedPrice: LISTED_PRICE,
      proposalValue,
      downPaymentPercent,
      downPaymentValue,
      financedAmount: simulation.financedAmount,
      termMonths: simulation.safeMonths,
      annualRate: simulation.safeAnnualRate,
      sacFirstInstallment: simulation.sac.firstInstallment,
      sacLastInstallment: simulation.sac.lastInstallment,
      sacTotalPaid: simulation.sac.totalPaid,
      priceInstallment: simulation.price.firstInstallment,
      priceTotalPaid: simulation.price.totalPaid,
    });
  };

  return (
    <section id="simulador" className="bg-[#0F2942] text-[#FAF8F5] py-14 sm:py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Fixed Listed Price */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
              <p className="text-xs sm:text-sm font-medium text-[#C59B27]">
                Planejamento Financeiro &amp; Proposta
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="lg:hidden min-h-[36px] inline-flex items-center gap-1.5 text-xs font-medium text-[#C8B8A2] hover:text-[#FAF8F5] transition-colors rounded-sm shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Restaurar padrão
              </button>
            </div>

            <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.85rem)] font-semibold leading-[1.15] tracking-tight mb-3">
              Simulador de Financiamento &amp; Proposta
            </h2>
            <p className="text-sm sm:text-base text-[#EAE5DC] leading-relaxed">
              Simule sua proposta editando os valores ou ajustando as barras para comparar entrada,
              parcelas mensais e custo total nos sistemas SAC e Price lado a lado.
            </p>
          </div>

          {/* Fixed Listed Price Badge + Desktop Reset */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <div className="bg-[#153350] border border-[#C59B27]/40 rounded-lg px-4 py-3 sm:px-5 sm:py-3.5">
              <p className="text-[11px] font-medium text-[#C8B8A2]">Preço anunciado (fixo)</p>
              <p className="font-display text-2xl sm:text-[1.65rem] font-semibold text-[#FAF8F5] tabular-nums leading-tight mt-0.5">
                {formatBRL(LISTED_PRICE)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-[#C8B8A2] hover:text-[#FAF8F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] rounded-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Restaurar cenário padrão
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          {/* Left Controls Column */}
          <div className="lg:col-span-5 space-y-6 bg-[#153350] border border-white/10 rounded-lg p-5 sm:p-7">
            {/* 1. Valor da Proposta */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label htmlFor="sim-valor-input" className="text-sm font-medium text-[#EAE5DC]">
                  Valor da proposta
                </label>
                <div className="flex items-center bg-[#0B2034] border border-white/15 focus-within:border-[#C59B27] rounded-md px-3 py-1.5 min-h-[44px]">
                  <span className="text-xs font-semibold text-[#C59B27] mr-1.5">R$</span>
                  <input
                    id="sim-valor-input"
                    type="text"
                    inputMode="numeric"
                    value={proposalDraft ?? formatGrouping(proposalValue)}
                    onFocus={() => setProposalDraft(String(proposalValue))}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      setProposalDraft(digits);
                      const parsed = Number(digits);
                      if (parsed >= 1_000_000) {
                        updateProposal(parsed);
                      }
                    }}
                    onBlur={() => {
                      if (proposalDraft !== null) {
                        const parsed = Number(proposalDraft);
                        if (!Number.isNaN(parsed) && parsed > 0) {
                          updateProposal(parsed);
                        }
                      }
                      setProposalDraft(null);
                    }}
                    aria-label="Valor da proposta em reais"
                    className="w-36 bg-transparent text-right text-base sm:text-sm font-semibold text-[#FAF8F5] tabular-nums focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-[#C8B8A2] leading-relaxed">
                Baseado no valor de <strong className="text-[#FAF8F5]">R$ 30.000.000</strong>.
                Clique no campo acima caso deseje digitar outro valor para simular.
              </p>
            </div>

            {/* 2. Entrada (% e R$ sincronizados) + Saldo a Financiar */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-sm font-medium text-[#EAE5DC]">Entrada</span>
                <span className="text-xs text-[#C8B8A2]">Edite % ou valor em R$</span>
              </div>

              <div className="grid grid-cols-12 gap-2.5 mb-3">
                <div className="col-span-5 flex items-center justify-between bg-[#0B2034] border border-white/15 focus-within:border-[#C59B27] rounded-md px-3 py-1.5 min-h-[44px]">
                  <input
                    id="sim-entrada-pct"
                    type="text"
                    inputMode="decimal"
                    value={pctDraft ?? formattedPct}
                    onFocus={() => setPctDraft(String(downPaymentPercent).replace('.', ','))}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9.,]/g, '');
                      setPctDraft(raw);
                      const parsed = parseFloat(raw.replace(',', '.'));
                      if (!Number.isNaN(parsed)) {
                        updateFromPercent(parsed);
                      }
                    }}
                    onBlur={() => {
                      if (pctDraft !== null) {
                        const parsed = parseFloat(pctDraft.replace(',', '.'));
                        if (!Number.isNaN(parsed)) {
                          updateFromPercent(parsed);
                        }
                      }
                      setPctDraft(null);
                    }}
                    aria-label="Percentual de entrada"
                    className="w-full bg-transparent text-base sm:text-sm font-semibold text-[#FAF8F5] tabular-nums focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-[#C59B27] ml-1 shrink-0">%</span>
                </div>

                <div className="col-span-7 flex items-center bg-[#0B2034] border border-white/15 focus-within:border-[#C59B27] rounded-md px-3 py-1.5 min-h-[44px]">
                  <span className="text-xs font-semibold text-[#C59B27] mr-1.5 shrink-0">R$</span>
                  <input
                    id="sim-entrada-valor"
                    type="text"
                    inputMode="numeric"
                    value={downValueDraft ?? formatGrouping(downPaymentValue)}
                    onFocus={() => setDownValueDraft(String(downPaymentValue))}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      setDownValueDraft(digits);
                      const parsed = Number(digits);
                      if (!Number.isNaN(parsed)) {
                        updateFromDownValue(parsed);
                      }
                    }}
                    onBlur={() => {
                      if (downValueDraft !== null) {
                        const parsed = Number(downValueDraft);
                        if (!Number.isNaN(parsed)) {
                          updateFromDownValue(parsed);
                        }
                      }
                      setDownValueDraft(null);
                    }}
                    aria-label="Valor da entrada em reais"
                    className="w-full bg-transparent text-right text-base sm:text-sm font-semibold text-[#FAF8F5] tabular-nums focus:outline-none"
                  />
                </div>
              </div>

              <input
                aria-label="Barra deslizante de percentual de entrada"
                type="range"
                min={20}
                max={80}
                step={1}
                value={Math.max(20, Math.min(80, downPaymentPercent))}
                onChange={(e) => {
                  setPctDraft(null);
                  setDownValueDraft(null);
                  updateFromPercent(Number(e.target.value));
                }}
                className="luxury-slider"
              />
              <div className="flex justify-between text-xs text-[#C8B8A2] mt-2 tabular-nums">
                <span>Faixa simulada: 20% a 80%</span>
                <span>{formattedPct}%</span>
              </div>

              {/* Automatic Saldo a Financiar Readout right below Entrada */}
              <div className="mt-4 bg-[#0B2034] border border-white/10 rounded-md px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-medium text-[#C8B8A2]">
                  Saldo a financiar
                </span>
                <span className="font-display text-lg sm:text-xl font-semibold text-[#C59B27] tabular-nums">
                  {formatBRL(simulation.financedAmount)}
                </span>
              </div>
            </div>

            {/* 3. Prazo (meses digitáveis + barra) */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div>
                  <label htmlFor="sim-prazo-input" className="text-sm font-medium text-[#EAE5DC]">
                    Prazo
                  </label>
                  <span className="block text-xs text-[#C8B8A2] tabular-nums">
                    Equivalente a {formatDurationLabel(simulation.safeMonths)}
                  </span>
                </div>
                <div className="flex items-center bg-[#0B2034] border border-white/15 focus-within:border-[#C59B27] rounded-md px-3 py-1.5 min-h-[42px]">
                  <input
                    id="sim-prazo-input"
                    type="text"
                    inputMode="numeric"
                    value={termDraft ?? String(termMonths)}
                    onFocus={() => setTermDraft(String(termMonths))}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      setTermDraft(digits);
                      const parsed = Number(digits);
                      if (parsed >= 1 && parsed <= 360) {
                        setTermMonths(parsed);
                      }
                    }}
                    onBlur={() => {
                      if (termDraft !== null) {
                        const parsed = Number(termDraft);
                        if (!Number.isNaN(parsed) && parsed >= 1) {
                          setTermMonths(Math.min(360, parsed));
                        }
                      }
                      setTermDraft(null);
                    }}
                    aria-label="Prazo em meses"
                    className="w-16 bg-transparent text-right text-base sm:text-sm font-semibold text-[#FAF8F5] tabular-nums focus:outline-none"
                  />
                  <span className="text-xs font-medium text-[#C8B8A2] ml-1.5">meses</span>
                </div>
              </div>

              <input
                aria-label="Barra deslizante de prazo em meses"
                type="range"
                min={12}
                max={240}
                step={12}
                value={Math.max(12, Math.min(240, termMonths))}
                onChange={(e) => {
                  setTermDraft(null);
                  setTermMonths(Number(e.target.value));
                }}
                className="luxury-slider"
              />
              <div className="flex justify-between text-xs text-[#C8B8A2] mt-2 tabular-nums">
                <span>12 meses</span>
                <span>240 meses</span>
              </div>
            </div>

            {/* 4. Taxa Efetiva Anual da Simulação */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <label htmlFor="sim-taxa-input" className="text-sm font-medium text-[#EAE5DC]">
                  Taxa efetiva anual da simulação
                </label>
                <div className="flex items-center bg-[#0B2034] border border-white/15 focus-within:border-[#C59B27] rounded-md px-3 py-1.5 min-h-[42px]">
                  <input
                    id="sim-taxa-input"
                    type="text"
                    inputMode="decimal"
                    value={rateDraft ?? formattedRate}
                    onFocus={() => setRateDraft(String(annualRate).replace('.', ','))}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9.,]/g, '');
                      setRateDraft(raw);
                      const parsed = parseFloat(raw.replace(',', '.'));
                      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 30) {
                        setAnnualRate(parsed);
                      }
                    }}
                    onBlur={() => {
                      if (rateDraft !== null) {
                        const parsed = parseFloat(rateDraft.replace(',', '.'));
                        if (!Number.isNaN(parsed)) {
                          setAnnualRate(Math.max(0, Math.min(30, Math.round(parsed * 10) / 10)));
                        }
                      }
                      setRateDraft(null);
                    }}
                    aria-label="Taxa efetiva anual em porcentagem"
                    className="w-16 bg-transparent text-right text-base sm:text-sm font-semibold text-[#FAF8F5] tabular-nums focus:outline-none"
                  />
                  <span className="text-xs font-medium text-[#C59B27] ml-1.5">% a.a.</span>
                </div>
              </div>

              {/* Scenario Presets: 12% bancário vs 8,4% direta */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setRateDraft(null);
                    setAnnualRate(12);
                  }}
                  className={`min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded border transition-colors ${
                    Math.abs(annualRate - 12) < 0.05
                      ? 'bg-[#C59B27] text-[#1A1A1A] border-[#C59B27] font-semibold'
                      : 'bg-[#0B2034] text-[#EAE5DC] border-white/15 hover:border-[#C59B27]'
                  }`}
                >
                  12% · Cenário bancário
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRateDraft(null);
                    setAnnualRate(8.4);
                  }}
                  className={`min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded border transition-colors ${
                    Math.abs(annualRate - 8.4) < 0.05
                      ? 'bg-[#C59B27] text-[#1A1A1A] border-[#C59B27] font-semibold'
                      : 'bg-[#0B2034] text-[#EAE5DC] border-white/15 hover:border-[#C59B27]'
                  }`}
                >
                  8,4% · Negociação direta
                </button>
              </div>

              <input
                aria-label="Barra deslizante de taxa efetiva anual"
                type="range"
                min={6}
                max={18}
                step={0.2}
                value={Math.max(6, Math.min(18, annualRate))}
                onChange={(e) => {
                  setRateDraft(null);
                  setAnnualRate(Number(e.target.value));
                }}
                className="luxury-slider"
              />
              <div className="flex justify-between text-xs text-[#C8B8A2] mt-2 tabular-nums">
                <span>6% a.a.</span>
                <span>18% a.a.</span>
              </div>
            </div>
          </div>

          {/* Right Results Column: 3 Highlight KPIs + Full SAC vs Price Comparison Table */}
          <div className="lg:col-span-7 space-y-5">
            {/* Highlight Strip (Immediately below controls on mobile: Entrada, Saldo a financiar, Primeira parcela) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-[#FAF8F5] text-[#1A1A1A] border border-[#DFD7CA] rounded-lg p-4 sm:p-5">
                <p className="text-xs font-medium text-[#6B645B]">Entrada ({formattedPct}%)</p>
                <p className="font-display text-2xl font-semibold text-[#0F2942] tabular-nums mt-1">
                  {formatBRL(downPaymentValue)}
                </p>
              </div>

              <div className="bg-[#FAF8F5] text-[#1A1A1A] border border-[#DFD7CA] rounded-lg p-4 sm:p-5">
                <p className="text-xs font-medium text-[#6B645B]">Saldo a financiar</p>
                <p className="font-display text-2xl font-semibold text-[#0F2942] tabular-nums mt-1">
                  {formatBRL(simulation.financedAmount)}
                </p>
              </div>

              <div className="bg-[#FAF8F5] text-[#1A1A1A] border border-[#DFD7CA] rounded-lg p-4 sm:p-5">
                <p className="text-xs font-medium text-[#6B645B]">Primeira parcela</p>
                <p className="font-display text-2xl font-semibold text-[#0F2942] tabular-nums mt-1">
                  {formatBRL(simulation.price.firstInstallment)}
                </p>
                <p className="text-[11px] text-[#6B645B] tabular-nums mt-0.5">
                  Price · ou {formatBRL(simulation.sac.firstInstallment)} no SAC
                </p>
              </div>
            </div>

            {/* Full Side-by-Side Comparison Card */}
            <div className="bg-[#FAF8F5] text-[#1A1A1A] rounded-lg p-5 sm:p-7 border border-[#DFD7CA]">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#DCD3C6]">
                <div>
                  <p className="text-xs font-semibold text-[#0F2942]">
                    Mansão Frente ao Mar · Guaratuba, Paraná, Brasil
                  </p>
                  <p className="text-xs text-[#4A4640] mt-1 tabular-nums">
                    Preço anunciado:{' '}
                    <strong className="text-[#1A1A1A]">{formatBRL(LISTED_PRICE)}</strong>
                    {proposalValue !== LISTED_PRICE && (
                      <>
                        {' '}
                        · Proposta simulada:{' '}
                        <strong className="text-[#0F2942]">{formatBRL(proposalValue)}</strong>
                      </>
                    )}
                  </p>
                </div>
                <Calculator className="w-5 h-5 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
              </div>

              <p className="text-xs sm:text-sm font-medium text-[#1A1A1A] py-4 border-b border-[#EAE2D6] tabular-nums">
                Simulação de {formatCompactSummaryBRL(downPaymentValue)} de entrada,{' '}
                {formatCompactSummaryBRL(simulation.financedAmount)} a financiar,{' '}
                {simulation.safeMonths} meses e {formattedRate}% efetivos ao ano.
              </p>

              {/* Side-by-Side SAC vs Price Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#DCD3C6] text-[11px] sm:text-xs font-semibold text-[#0F2942]">
                      <th scope="col" className="py-3 pr-2 font-semibold">
                        Resultado
                      </th>
                      <th scope="col" className="py-3 px-2 text-right font-semibold">
                        <span className="block">SAC</span>
                        <span className="block font-normal text-[10px] sm:text-[11px] text-[#6B645B]">
                          parcelas decrescentes
                        </span>
                      </th>
                      <th scope="col" className="py-3 pl-2 text-right font-semibold">
                        <span className="block">Price</span>
                        <span className="block font-normal text-[10px] sm:text-[11px] text-[#6B645B]">
                          parcelas iguais*
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D6] text-xs sm:text-sm">
                    <tr>
                      <td className="py-3 pr-2 text-[#4A4640]">Entrada</td>
                      <td className="py-3 px-2 text-right font-semibold text-[#1A1A1A] tabular-nums whitespace-nowrap">
                        {formatBRL(downPaymentValue)}
                      </td>
                      <td className="py-3 pl-2 text-right font-semibold text-[#1A1A1A] tabular-nums whitespace-nowrap">
                        {formatBRL(downPaymentValue)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 text-[#4A4640]">Primeira parcela</td>
                      <td className="py-3 px-2 text-right font-semibold text-[#0F2942] tabular-nums whitespace-nowrap">
                        {formatBRL(simulation.sac.firstInstallment)}
                      </td>
                      <td className="py-3 pl-2 text-right font-semibold text-[#0F2942] tabular-nums whitespace-nowrap">
                        {formatBRL(simulation.price.firstInstallment)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 text-[#4A4640]">Última parcela</td>
                      <td className="py-3 px-2 text-right font-semibold text-[#1A1A1A] tabular-nums whitespace-nowrap">
                        {formatBRL(simulation.sac.lastInstallment)}
                      </td>
                      <td className="py-3 pl-2 text-right font-semibold text-[#1A1A1A] tabular-nums whitespace-nowrap">
                        {formatBRL(simulation.price.lastInstallment)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 text-[#4A4640]">
                        Juros totais em {simulation.safeMonths} meses
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-[#1A1A1A] tabular-nums whitespace-nowrap">
                        {formatBRL(simulation.sac.totalInterest)}
                      </td>
                      <td className="py-3 pl-2 text-right font-semibold text-[#1A1A1A] tabular-nums whitespace-nowrap">
                        {formatBRL(simulation.price.totalInterest)}
                      </td>
                    </tr>
                    <tr className="bg-[#F2EDE6]">
                      <td className="py-3.5 pl-2 pr-2 font-semibold text-[#1A1A1A]">
                        Total pago, incluindo a entrada
                      </td>
                      <td className="py-3.5 px-2 text-right font-bold text-[#0F2942] tabular-nums whitespace-nowrap">
                        {formatBRL(simulation.sac.totalPaid)}
                      </td>
                      <td className="py-3.5 pl-2 pr-2 text-right font-bold text-[#0F2942] tabular-nums whitespace-nowrap">
                        {formatBRL(simulation.price.totalPaid)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Dynamic Comparative Insight Note */}
              {simulation.financedAmount > 0 && simulation.safeAnnualRate > 0 && (
                <p className="text-xs text-[#4A4640] leading-relaxed mt-4 pt-3.5 border-t border-[#EAE2D6]">
                  *Valores aproximados, sem correção monetária, seguros ou tarifas. Na simulação, a
                  Price reduz a primeira parcela em cerca de{' '}
                  <strong className="text-[#1A1A1A]">
                    {formatApproxDiff(simulation.firstInstallmentDiff)}
                  </strong>
                  , enquanto o SAC economiza cerca de{' '}
                  <strong className="text-[#1A1A1A]">
                    {formatApproxDiff(simulation.interestSavingsSac)}
                  </strong>{' '}
                  em juros ao longo de {formatDurationLabel(simulation.safeMonths)}.
                </p>
              )}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleSendSimulation}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942]"
                >
                  <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">Enviar Proposta ao Proprietário</span>
                </button>
              </div>

              <div
                role="note"
                className="mt-4 flex items-start gap-2.5 bg-[#FEF2F2] border-2 border-[#DC2626] text-[#991B1B] rounded-md px-3.5 py-3 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <strong className="font-semibold">Atenção:</strong> Os valores acima são apenas uma
                  simulação. As taxas podem alterar para mais ou para menos conforme as condições do
                  seu banco, e não incluem correção monetária, seguros ou tarifas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
