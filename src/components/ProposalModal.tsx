import { useState, useEffect, useMemo, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import { BROKER_CONFIG } from '../content/propertyData';
import type { AttachedSimulation, InquiryContext } from '../types/inquiry';
import {
  formatPhoneByLanguage,
  validatePhoneByLanguage,
} from '../utils/phoneValidation';
import { validateEmailByLanguage } from '../utils/emailValidation';
import { handleLiveGroupedDigitsChange } from '../utils/currencyInput';
import {
  buildWhatsappDirectUrl,
  buildWhatsappProposalMessage,
} from '../utils/whatsappMessage';
import { useLanguage } from '../contexts/LanguageContext';

const LISTED_PRICE = BROKER_CONFIG.referenceValue;

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryContext: InquiryContext | null;
  onClearContext: () => void;
}

export function ProposalModal({
  isOpen,
  onClose,
  inquiryContext,
  onClearContext,
}: ProposalModalProps) {
  const {
    language,
    t,
    currencySymbol,
    convertBrlToActive,
    convertActiveToBrl,
    formatActiveCurrency,
    formatGroupingNumber,
  } = useLanguage();

  const [step, setStep] = useState<'valores' | 'dados'>('valores');
  const [isSent, setIsSent] = useState(false);
  const [isNegotiateMode, setIsNegotiateMode] = useState(false);

  // Step 1: Valores da Proposta (armazenados em BRL na base para conversão dinâmica)
  const [paymentMode, setPaymentMode] = useState<'cash' | 'financed' | 'negotiate'>('financed');
  const [proposalValue, setProposalValue] = useState<number>(LISTED_PRICE);
  const [proposalDraft, setProposalDraft] = useState<string | null>(null);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [pctDraft, setPctDraft] = useState<string | null>(null);
  const [downValueDraft, setDownValueDraft] = useState<string | null>(null);
  const [termMonths, setTermMonths] = useState<number>(48);
  const [ratePercent, setRatePercent] = useState<number>(8.4);

  // Step 2: Dados pessoais
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [city, setCity] = useState('');
  const [cityTouched, setCityTouched] = useState(false);
  const [stateRegion, setStateRegion] = useState('');
  const [stateTouched, setStateTouched] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitMode, setVisitMode] = useState<'inPerson' | 'virtual'>('inPerson');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentWhatsappUrl, setSentWhatsappUrl] = useState('');
  const [sentWhatsappText, setSentWhatsappText] = useState('');
  const [autoSent, setAutoSent] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [dnsEmailError, setDnsEmailError] = useState<{ email: string; error: string } | null>(null);

  const todayIso = new Date().toISOString().split('T')[0];

  // Sincroniza quando o modal abre ou recebe contexto externo (Simulador, Dossiê, Galeria)
  useEffect(() => {
    if (!isOpen) return;
    setIsSent(false);
    setAutoSent(false);
    setErrorMsg('');
    setProposalDraft(null);
    setPctDraft(null);
    setDownValueDraft(null);

    if (inquiryContext) {
      setStep(inquiryContext.initialStep || (inquiryContext.simulation ? 'dados' : 'valores'));
      const negotiateCtx = Boolean(inquiryContext.negotiateInPerson);
      setIsNegotiateMode(negotiateCtx);
      if (negotiateCtx) {
        setPaymentMode('negotiate');
      }
      if (inquiryContext.notes) {
        setNotes(inquiryContext.notes);
      }
      if (inquiryContext.simulation) {
        const sim = inquiryContext.simulation;
        setProposalValue(sim.proposalValue || LISTED_PRICE);
        if (sim.financedAmount <= 0 || sim.downPaymentPercent >= 100) {
          setPaymentMode('cash');
          setDownPaymentPercent(100);
        } else {
          setPaymentMode('financed');
          setDownPaymentPercent(sim.downPaymentPercent || 30);
          setTermMonths(sim.termMonths || 48);
          setRatePercent(sim.annualRate ?? 8.4);
        }
      }
    } else {
      setIsNegotiateMode(false);
      setPaymentMode('financed');
      setStep('valores');
    }
  }, [isOpen, inquiryContext]);

  // Limpa drafts ao trocar idioma
  useEffect(() => {
    setProposalDraft(null);
    setDownValueDraft(null);
    setErrorMsg('');
  }, [language]);

  // Trava a rolagem da página de fundo enquanto a janela de proposta está aberta
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const downPaymentValue = useMemo(() => {
    if (paymentMode === 'cash') return proposalValue;
    return Math.round((proposalValue * downPaymentPercent) / 100);
  }, [paymentMode, proposalValue, downPaymentPercent]);

  const computedSimulation = useMemo<AttachedSimulation>(() => {
    const safeProposal = Math.max(1_000_000, Math.min(100_000_000, Math.round(proposalValue)));
    if (paymentMode === 'cash') {
      return {
        listedPrice: LISTED_PRICE,
        proposalValue: safeProposal,
        downPaymentPercent: 100,
        downPaymentValue: safeProposal,
        financedAmount: 0,
        termMonths: 1,
        annualRate: 0,
        sacFirstInstallment: 0,
        sacLastInstallment: 0,
        sacTotalPaid: safeProposal,
        priceInstallment: 0,
        priceTotalPaid: safeProposal,
      };
    }

    const downVal = Math.round((safeProposal * downPaymentPercent) / 100);
    const financedAmount = Math.max(0, safeProposal - downVal);
    const safeMonths = Math.max(1, Math.min(360, termMonths));
    const safeAnnualRate = Math.max(0, Math.min(30, ratePercent));
    const monthlyRate = Math.pow(1 + safeAnnualRate / 100, 1 / 12) - 1;

    let sacFirst = 0;
    let sacLast = 0;
    let sacTotalInterest = 0;
    let priceInstallment = 0;
    let priceTotalInterest = 0;

    if (financedAmount > 0 && safeMonths > 0) {
      if (monthlyRate === 0) {
        const flat = financedAmount / safeMonths;
        sacFirst = flat;
        sacLast = flat;
        priceInstallment = flat;
      } else {
        const amortization = financedAmount / safeMonths;
        sacFirst = amortization + financedAmount * monthlyRate;
        sacLast = amortization + amortization * monthlyRate;
        sacTotalInterest = (financedAmount * monthlyRate * (safeMonths + 1)) / 2;

        const factor = Math.pow(1 + monthlyRate, safeMonths);
        priceInstallment = (financedAmount * (monthlyRate * factor)) / (factor - 1);
        priceTotalInterest = priceInstallment * safeMonths - financedAmount;
      }
    }

    return {
      listedPrice: LISTED_PRICE,
      proposalValue: safeProposal,
      downPaymentPercent,
      downPaymentValue: downVal,
      financedAmount,
      termMonths: safeMonths,
      annualRate: safeAnnualRate,
      sacFirstInstallment: sacFirst,
      sacLastInstallment: sacLast,
      sacTotalPaid: downVal + financedAmount + sacTotalInterest,
      priceInstallment,
      priceTotalPaid: downVal + financedAmount + priceTotalInterest,
    };
  }, [paymentMode, proposalValue, downPaymentPercent, termMonths, ratePercent]);

  const emailTrimmed = email.trim().toLowerCase();
  const baseEmailCheck = validateEmailByLanguage(email, language);
  const matchingDnsError =
    dnsEmailError && dnsEmailError.email === emailTrimmed ? dnsEmailError.error : '';
  const emailCheck =
    baseEmailCheck.valid && matchingDnsError
      ? { valid: false, error: matchingDnsError }
      : baseEmailCheck;
  const emailDomainPart = emailTrimmed.split('@')[1] || '';
  const showEmailFeedback =
    emailTrimmed.length > 0 &&
    (emailTouched || (emailTrimmed.includes('@') && /\.[a-z]{2,}$/i.test(emailDomainPart)));

  // Pré-validação DNS silenciosa ao sair do campo para domínios personalizados
  const verifyEmailDomainDns = async (targetEmail: string) => {
    const normalized = targetEmail.trim().toLowerCase();
    if (!normalized || !validateEmailByLanguage(normalized, language).valid) return;
    try {
      const res = await fetch(
        `/api/proposta?email=${encodeURIComponent(normalized)}&lang=${encodeURIComponent(language)}`
      );
      if (!res.ok) return;
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (data.ok === false && data.error) {
        setDnsEmailError({ email: normalized, error: data.error });
      } else {
        setDnsEmailError((prev) => (prev?.email === normalized ? null : prev));
      }
    } catch {
      // ignora erro de rede na pré-checagem
    }
  };

  useEffect(() => {
    if (!isOpen || !baseEmailCheck.valid || !emailTrimmed) return;
    const timer = window.setTimeout(() => {
      void verifyEmailDomainDns(emailTrimmed);
    }, 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailTrimmed, baseEmailCheck.valid, language, isOpen]);

  const phoneDigitsCount = phone.replace(/\D/g, '').length;
  const phoneCheck = validatePhoneByLanguage(phone, language);
  const minLiveCheckLen = language === 'pt' ? 10 : 8;
  const showPhoneFeedback =
    phoneDigitsCount > 0 && (phoneTouched || phoneDigitsCount >= minLiveCheckLen);

  const cleanCityLive = city.trim();
  const isCityValid =
    cleanCityLive.length >= 2 &&
    /[a-zA-ZÀ-ÿ]{2,}/.test(cleanCityLive) &&
    !/^(.)\1+$/i.test(cleanCityLive);
  const showCityFeedback = cityTouched || cleanCityLive.length >= 2;

  const cleanStateLive = stateRegion.trim();
  const isStateValid =
    cleanStateLive.length >= 2 &&
    /[a-zA-ZÀ-ÿ]{2,}/.test(cleanStateLive) &&
    !/^(.)\1+$/i.test(cleanStateLive);
  const showStateFeedback = stateTouched || cleanStateLive.length >= 2;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanCity = city.trim();
    const cleanState = stateRegion.trim();
    const emailValidation = validateEmailByLanguage(cleanEmail, language);
    const activeDnsErr =
      dnsEmailError && dnsEmailError.email === cleanEmail ? dnsEmailError.error : '';
    const phoneValidation = validatePhoneByLanguage(cleanPhone, language);

    if (cleanName.length < 3) {
      setErrorMsg(t.leadForm.errorName);
      document.getElementById('modal-lead-name')?.focus();
      return;
    }
    if (!emailValidation.valid || activeDnsErr) {
      setEmailTouched(true);
      setErrorMsg(activeDnsErr || emailValidation.error || t.leadForm.errorEmail);
      document.getElementById('modal-lead-email')?.focus();
      return;
    }
    if (!phoneValidation.valid) {
      setPhoneTouched(true);
      setErrorMsg(phoneValidation.error || t.leadForm.errorPhoneFallback);
      document.getElementById('modal-lead-phone')?.focus();
      return;
    }
    if (!isCityValid) {
      setCityTouched(true);
      setErrorMsg(t.leadForm.errorCity);
      document.getElementById('modal-lead-city')?.focus();
      return;
    }
    if (!isStateValid) {
      setStateTouched(true);
      setErrorMsg(t.leadForm.errorState);
      document.getElementById('modal-lead-state')?.focus();
      return;
    }

    const visitTypeLabel =
      visitMode === 'inPerson' ? t.leadForm.visitInPersonValue : t.leadForm.visitVirtualValue;
    const isNegotiate = paymentMode === 'negotiate' || isNegotiateMode;
    const computedSubject =
      inquiryContext?.subject ||
      (isNegotiate
        ? t.proposalModal.negotiateSubject
        : paymentMode === 'cash'
          ? t.proposalModal.cashSubject
          : t.appContexts.simulationSubject);

    const instantWhatsappText = buildWhatsappProposalMessage({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      city: cleanCity,
      state: cleanState,
      subject: computedSubject,
      visitDate,
      visitType: visitTypeLabel,
      notes: notes.trim(),
      simulation: isNegotiate ? null : computedSimulation,
    });
    const instantWhatsappUrl = buildWhatsappDirectUrl(instantWhatsappText);

    // Abre o WhatsApp SINCRONAMENTE no mesmo clique (sem esperar fetch assíncrono)
    // para não perder a permissão de navegação do navegador nem depender de clique extra.
    const anchor = document.createElement('a');
    anchor.href = instantWhatsappUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setSentWhatsappUrl(instantWhatsappUrl);
    setSentWhatsappText(instantWhatsappText);
    setAutoSent(false);
    setCopiedMsg(false);
    setIsSent(true);

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/proposta', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        signal:
          typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
            ? AbortSignal.timeout(15000)
            : undefined,
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          city: cleanCity,
          state: cleanState,
          visitDate,
          visitType: visitTypeLabel,
          subject: computedSubject,
          notes: notes.trim(),
          simulation: isNegotiate ? undefined : computedSimulation,
          lang: language,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        autoSent?: boolean;
        error?: string;
        whatsappUrl?: string;
        whatsappMessage?: string;
      };

      if (!response.ok || !data.ok) {
        if (response.status === 400 && data.error) {
          setIsSent(false);
          setErrorMsg(data.error);
        }
        return;
      }

      if (data.whatsappUrl) setSentWhatsappUrl(data.whatsappUrl);
      if (data.whatsappMessage) setSentWhatsappText(data.whatsappMessage);
      if (data.autoSent) setAutoSent(true);

      setName('');
      setEmail('');
      setEmailTouched(false);
      setDnsEmailError(null);
      setPhone('');
      setPhoneTouched(false);
      setCity('');
      setCityTouched(false);
      setStateRegion('');
      setStateTouched(false);
      setVisitDate('');
      setNotes('');
      onClearContext();
    } catch {
      // Conversa do WhatsApp já foi aberta com sucesso no clique do usuário
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const rateDisplayStr =
    language === 'en'
      ? String(computedSimulation.annualRate)
      : String(computedSimulation.annualRate).replace('.', ',');

  const activeProposalDisplay = formatGroupingNumber(convertBrlToActive(proposalValue));
  const activeDownDisplay = formatGroupingNumber(convertBrlToActive(downPaymentValue));

  const offerSummaryLine =
    paymentMode === 'negotiate' || isNegotiateMode
      ? t.proposalModal.negotiateOfferSummary(formatActiveCurrency(LISTED_PRICE))
      : paymentMode === 'cash'
        ? t.proposalModal.cashOfferSummary(formatActiveCurrency(computedSimulation.proposalValue))
        : t.proposalModal.financedOfferSummary({
            offer: formatActiveCurrency(computedSimulation.proposalValue),
            down: formatActiveCurrency(computedSimulation.downPaymentValue),
            months: computedSimulation.termMonths,
            rate: rateDisplayStr,
          });

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col bg-[#FAF8F5] text-[#1A1A1A] border border-[#C59B27]/50 rounded-t-xl sm:rounded-lg shadow-2xl overflow-hidden overscroll-contain"
      >
        {/* Top Fixed Header */}
        <div className="bg-[#0F2942] text-[#FAF8F5] px-5 sm:px-7 py-4 flex items-center justify-between gap-4 border-b border-[#C59B27]/30 shrink-0">
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-medium text-[#C59B27] truncate">
              {t.leadForm.eyebrow}
            </p>
            <h2
              id="proposal-modal-title"
              className="font-display text-lg sm:text-2xl font-semibold leading-tight"
            >
              {t.proposalModal.dialogTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.proposalModal.closeAria}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 text-[#FAF8F5] shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive 2-Step Bar (Hidden once sent) */}
        {!isSent && (
          <div className="bg-[#0B2034] px-5 sm:px-7 py-2.5 grid grid-cols-2 gap-2 border-b border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setStep('valores')}
              className={`min-h-[40px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors text-center truncate ${
                step === 'valores'
                  ? 'bg-[#C59B27] text-[#1A1A1A]'
                  : 'bg-white/5 text-[#EAE5DC] hover:bg-white/10'
              }`}
            >
              {t.proposalModal.step1Tab}
            </button>
            <button
              type="button"
              onClick={() => setStep('dados')}
              className={`min-h-[40px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors text-center truncate ${
                step === 'dados'
                  ? 'bg-[#C59B27] text-[#1A1A1A]'
                  : 'bg-white/5 text-[#EAE5DC] hover:bg-white/10'
              }`}
            >
              {t.proposalModal.step2Tab}
            </button>
          </div>
        )}

        {/* Scrollable Content Area (Background stays 100% still) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7">
          {isSent ? (
            <div className="py-6 sm:py-8 text-center max-w-md mx-auto">
              <div className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#15803D] text-[#FAF8F5] mb-5">
                <MessageCircle className="w-8 h-8" aria-hidden="true" />
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
                {autoSent ? t.leadForm.autoSentTitle : t.leadForm.modalTitle}
              </h3>

              <p className="text-sm sm:text-base font-medium text-[#0F2942] leading-relaxed mb-6">
                {autoSent ? t.leadForm.autoSentDesc : t.leadForm.modalDesc}
              </p>

              <div className="space-y-3">
                {sentWhatsappUrl && (
                  <a
                    href={sentWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {t.leadForm.openWhatsappBtn}
                  </a>
                )}

                {sentWhatsappText && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(sentWhatsappText);
                        setCopiedMsg(true);
                        setTimeout(() => setCopiedMsg(false), 2500);
                      } catch {
                        // ignore clipboard failures
                      }
                    }}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold bg-[#EAE5DC] text-[#0F2942] hover:bg-[#DFD7CA] rounded-md transition-colors"
                  >
                    {copiedMsg ? (
                      <>
                        <Check className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                        {t.leadForm.copiedMessageBtn}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {t.leadForm.copyMessageBtn}
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942]"
                >
                  {t.leadForm.modalClose}
                </button>
              </div>
            </div>
          ) : step === 'valores' ? (
            <div className="space-y-5">
              {/* Payment Structure Toggle */}
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A] mb-2">
                  {t.proposalModal.paymentTypeLabel}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('cash');
                      setIsNegotiateMode(false);
                      setDownPaymentPercent(100);
                    }}
                    className={`min-h-[48px] px-2 py-2 text-xs sm:text-sm font-semibold leading-tight rounded-md border transition-colors ${
                      paymentMode === 'cash'
                        ? 'bg-[#0F2942] text-[#FAF8F5] border-[#0F2942]'
                        : 'bg-[#F2EDE6] text-[#3A3631] border-[#D4C9B9] hover:border-[#0F2942]'
                    }`}
                  >
                    {t.proposalModal.cashOption}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('financed');
                      setIsNegotiateMode(false);
                      if (downPaymentPercent >= 100) setDownPaymentPercent(30);
                    }}
                    className={`min-h-[48px] px-2 py-2 text-xs sm:text-sm font-semibold leading-tight rounded-md border transition-colors ${
                      paymentMode === 'financed'
                        ? 'bg-[#0F2942] text-[#FAF8F5] border-[#0F2942]'
                        : 'bg-[#F2EDE6] text-[#3A3631] border-[#D4C9B9] hover:border-[#0F2942]'
                    }`}
                  >
                    {t.proposalModal.financedOption}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('negotiate');
                      setIsNegotiateMode(true);
                    }}
                    className={`min-h-[48px] px-2 py-2 text-xs sm:text-sm font-semibold leading-tight rounded-md border transition-colors ${
                      paymentMode === 'negotiate'
                        ? 'bg-[#0F2942] text-[#FAF8F5] border-[#0F2942]'
                        : 'bg-[#F2EDE6] text-[#3A3631] border-[#D4C9B9] hover:border-[#0F2942]'
                    }`}
                  >
                    {t.proposalModal.negotiateOption}
                  </button>
                </div>
              </div>

              {/* Proposal Value Input + Quick Presets (hidden when A negociar is active) */}
              {paymentMode !== 'negotiate' && (
              <div className="bg-[#F2EDE6] border border-[#DFD7CA] rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="modal-proposal-value"
                    className="text-xs font-semibold text-[#1A1A1A]"
                  >
                    {t.proposalModal.proposalValueLabel}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setProposalValue(LISTED_PRICE);
                        setProposalDraft(null);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded border border-[#C8B8A2] bg-[#FAF8F5] hover:border-[#0F2942] text-[#1A1A1A] transition-colors"
                    >
                      {t.proposalModal.presetListed}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProposalValue(Math.round(LISTED_PRICE * 0.95));
                        setProposalDraft(null);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded border border-[#C8B8A2] bg-[#FAF8F5] hover:border-[#0F2942] text-[#1A1A1A] transition-colors"
                    >
                      {t.proposalModal.presetMinus5}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProposalValue(Math.round(LISTED_PRICE * 0.9));
                        setProposalDraft(null);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded border border-[#C8B8A2] bg-[#FAF8F5] hover:border-[#0F2942] text-[#1A1A1A] transition-colors"
                    >
                      {t.proposalModal.presetMinus10}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0F2942]">
                    {currencySymbol}
                  </span>
                  <input
                    id="modal-proposal-value"
                    type="text"
                    inputMode="numeric"
                    value={proposalDraft ?? activeProposalDisplay}
                    onChange={(e) => {
                      const { formatted, numericValue } = handleLiveGroupedDigitsChange(
                        e.currentTarget,
                        formatGroupingNumber
                      );
                      setProposalDraft(formatted);
                      if (numericValue !== null) {
                        const parsed = convertActiveToBrl(numericValue);
                        if (Number.isFinite(parsed) && parsed > 0) {
                          setProposalValue(Math.min(100_000_000, Math.round(parsed)));
                        }
                      }
                    }}
                    onBlur={() => {
                      if (proposalDraft !== null) {
                        const rawDigits = proposalDraft.replace(/\D/g, '');
                        if (rawDigits !== '') {
                          const parsed = convertActiveToBrl(Number(rawDigits));
                          if (Number.isFinite(parsed) && parsed > 0) {
                            setProposalValue(Math.max(1_000_000, Math.min(100_000_000, Math.round(parsed))));
                          }
                        } else {
                          setProposalValue((v) => Math.max(1_000_000, Math.min(100_000_000, v)));
                        }
                      }
                      setProposalDraft(null);
                    }}
                    className="w-full min-h-[48px] pl-12 pr-4 py-2.5 text-lg font-semibold tabular-nums bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#0F2942] focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                  />
                </div>
              </div>
              )}

              {/* Financed Controls (Conditional cleanly inside fixed modal) */}
              {paymentMode === 'financed' && (
                <div className="bg-[#F2EDE6] border border-[#DFD7CA] rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="modal-down-pct"
                        className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                      >
                        {t.proposalModal.downPctLabel}
                      </label>
                      <div className="relative">
                        <input
                          id="modal-down-pct"
                          type="text"
                          inputMode="decimal"
                          value={
                            pctDraft ??
                            (language === 'en'
                              ? String(downPaymentPercent)
                              : String(downPaymentPercent).replace('.', ','))
                          }
                          onFocus={(e) => {
                            setPctDraft(String(downPaymentPercent));
                            requestAnimationFrame(() => e.target.select());
                          }}
                          onChange={(e) => {
                            const cleaned = e.target.value
                              .replace(',', '.')
                              .replace(/[^\d.]/g, '');
                            setPctDraft(cleaned);
                            const num = Number(cleaned);
                            if (Number.isFinite(num)) {
                              setDownPaymentPercent(Math.max(0, Math.min(95, Math.round(num * 10) / 10)));
                            }
                          }}
                          onBlur={() => setPctDraft(null)}
                          className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-base sm:text-sm font-semibold tabular-nums bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#1A1A1A] focus:outline-none focus:border-[#0F2942]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6B645B]">
                          %
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="modal-down-val"
                        className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                      >
                        {t.proposalModal.downValLabel}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#0F2942]">
                          {currencySymbol}
                        </span>
                        <input
                          id="modal-down-val"
                          type="text"
                          inputMode="numeric"
                          value={downValueDraft ?? activeDownDisplay}
                          onChange={(e) => {
                            const { formatted, numericValue } = handleLiveGroupedDigitsChange(
                              e.currentTarget,
                              formatGroupingNumber
                            );
                            setDownValueDraft(formatted);
                            if (numericValue !== null) {
                              const parsedBrl = convertActiveToBrl(numericValue);
                              if (Number.isFinite(parsedBrl) && proposalValue > 0) {
                                const clampedBrl = Math.max(0, Math.min(proposalValue, parsedBrl));
                                const pct = Math.round((clampedBrl / proposalValue) * 1000) / 10;
                                setDownPaymentPercent(Math.min(95, pct));
                              }
                            }
                          }}
                          onBlur={() => setDownValueDraft(null)}
                          className="w-full min-h-[44px] pl-10 pr-3 py-2 text-base sm:text-sm font-semibold tabular-nums bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#1A1A1A] focus:outline-none focus:border-[#0F2942]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="modal-term"
                        className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                      >
                        {t.proposalModal.termLabel}
                      </label>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {[24, 36, 48, 60, 120].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setTermMonths(m)}
                            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                              termMonths === m
                                ? 'bg-[#0F2942] text-[#FAF8F5] border-[#0F2942]'
                                : 'bg-[#FAF8F5] text-[#4A4640] border-[#D4C9B9] hover:border-[#0F2942]'
                            }`}
                          >
                            {m}m
                          </button>
                        ))}
                      </div>
                      <input
                        id="modal-term"
                        type="number"
                        min={1}
                        max={360}
                        value={termMonths}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v)) {
                            setTermMonths(Math.max(1, Math.min(360, Math.round(v))));
                          }
                        }}
                        className="w-full min-h-[42px] px-3 py-2 text-base sm:text-sm font-semibold tabular-nums bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#1A1A1A] focus:outline-none focus:border-[#0F2942]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="modal-rate"
                        className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                      >
                        {t.proposalModal.rateLabel}
                      </label>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setRatePercent(8.4)}
                          className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                            ratePercent === 8.4
                              ? 'bg-[#0F2942] text-[#FAF8F5] border-[#0F2942]'
                              : 'bg-[#FAF8F5] text-[#4A4640] border-[#D4C9B9] hover:border-[#0F2942]'
                          }`}
                        >
                          {t.proposalModal.presetDirectRate}
                        </button>
                        <button
                          type="button"
                          onClick={() => setRatePercent(12)}
                          className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                            ratePercent === 12
                              ? 'bg-[#0F2942] text-[#FAF8F5] border-[#0F2942]'
                              : 'bg-[#FAF8F5] text-[#4A4640] border-[#D4C9B9] hover:border-[#0F2942]'
                          }`}
                        >
                          {t.proposalModal.presetBankRate}
                        </button>
                      </div>
                      <input
                        id="modal-rate"
                        type="number"
                        step="0.1"
                        min={0}
                        max={30}
                        value={ratePercent}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v)) {
                            setRatePercent(Math.max(0, Math.min(30, v)));
                          }
                        }}
                        className="w-full min-h-[42px] px-3 py-2 text-base sm:text-sm font-semibold tabular-nums bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#1A1A1A] focus:outline-none focus:border-[#0F2942]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Live Calculated Summary Strip */}
              <div className="bg-[#0F2942] text-[#FAF8F5] rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-[#C59B27]/35">
                {paymentMode === 'negotiate' ? (
                  <div className="sm:col-span-3 space-y-1">
                    <p className="text-xs font-semibold text-[#C59B27]">
                      {t.proposalModal.summaryNegotiateLabel}
                    </p>
                    <p className="text-xs sm:text-sm text-[#EAE5DC]">
                      {t.proposalModal.summaryNegotiateDesc}
                    </p>
                  </div>
                ) : paymentMode === 'cash' ? (
                  <div className="sm:col-span-3 flex items-center justify-between gap-4">
                    <span className="text-xs text-[#C8B8A2]">
                      {t.proposalModal.summaryCashTotal}
                    </span>
                    <span className="font-display text-xl sm:text-2xl font-semibold text-[#C59B27] tabular-nums">
                      {formatActiveCurrency(computedSimulation.proposalValue)}
                    </span>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-[11px] text-[#C8B8A2]">
                        {t.proposalModal.summaryFinanced}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-[#FAF8F5] tabular-nums">
                        {formatActiveCurrency(computedSimulation.financedAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#C8B8A2]">
                        {t.proposalModal.summarySacFirst}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-[#C59B27] tabular-nums">
                        {formatActiveCurrency(computedSimulation.sacFirstInstallment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#C8B8A2]">
                        {t.proposalModal.summaryPriceFixed}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-[#FAF8F5] tabular-nums">
                        {formatActiveCurrency(computedSimulation.priceInstallment)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Mandatory Red Notice (when numerical values/simulation are shown) */}
              {paymentMode !== 'negotiate' && (
                <div
                  role="note"
                  className="flex items-start gap-2.5 bg-[#FEF2F2] border-2 border-[#DC2626] text-[#991B1B] rounded-md px-3.5 py-2.5 text-xs leading-relaxed"
                >
                  <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
                  <p>
                    <strong className="font-semibold">{t.leadForm.warningStrong}</strong>{' '}
                    {t.leadForm.warningText}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep('dados')}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942]"
              >
                {t.proposalModal.continueToData}
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Compact Offer Summary + Quick Edit Link */}
              <div className="bg-[#0F2942] text-[#FAF8F5] rounded-md px-4 py-3 border border-[#C59B27]/40 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  {inquiryContext?.subject && (
                    <p className="text-[11px] font-semibold text-[#C59B27] truncate">
                      {inquiryContext.subject}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-[#EAE5DC] tabular-nums">
                    {offerSummaryLine}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('valores')}
                  className="text-xs font-semibold text-[#C59B27] hover:underline shrink-0"
                >
                  {t.proposalModal.editValues}
                </button>
              </div>

              <div>
                <label
                  htmlFor="modal-lead-name"
                  className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                >
                  {t.leadForm.nameLabel} <span className="text-[#991B1B]">*</span>
                </label>
                <input
                  id="modal-lead-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={t.leadForm.namePlaceholder}
                  className="w-full min-h-[48px] px-4 py-2.5 text-base sm:text-sm bg-[#FFFFFF] border border-[#D4C9B9] rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="modal-lead-email"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    {t.leadForm.emailLabel} <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    id="modal-lead-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-invalid={showEmailFeedback && !emailCheck.valid}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (dnsEmailError) setDnsEmailError(null);
                      if (errorMsg) setErrorMsg('');
                    }}
                    onBlur={() => {
                      setEmailTouched(true);
                      void verifyEmailDomainDns(email);
                    }}
                    placeholder={t.leadForm.emailPlaceholder}
                    className={`w-full min-h-[48px] px-4 py-2.5 text-base sm:text-sm bg-[#FFFFFF] border rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] focus:outline-none focus:ring-1 ${
                      showEmailFeedback && !emailCheck.valid
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                        : showEmailFeedback && emailCheck.valid
                          ? 'border-[#15803D] focus:border-[#15803D] focus:ring-[#15803D]'
                          : 'border-[#D4C9B9] focus:border-[#0F2942] focus:ring-[#0F2942]'
                    }`}
                  />
                  {/* Fixed reserved slot height prevents layout shifting while typing */}
                  <div className="min-h-[20px] mt-1">
                    {showEmailFeedback && (
                      <p
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          emailCheck.valid ? 'text-[#15803D]' : 'text-[#991B1B]'
                        }`}
                      >
                        {emailCheck.valid ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>{t.leadForm.emailValid}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>{emailCheck.error}</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modal-lead-phone"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    {t.leadForm.phoneLabel} <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    id="modal-lead-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    aria-invalid={showPhoneFeedback && !phoneCheck.valid}
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatPhoneByLanguage(e.target.value, language));
                      if (errorMsg) setErrorMsg('');
                    }}
                    onBlur={() => setPhoneTouched(true)}
                    placeholder={t.leadForm.phonePlaceholder}
                    className={`w-full min-h-[48px] px-4 py-2.5 text-base sm:text-sm bg-[#FFFFFF] border rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] tabular-nums focus:outline-none focus:ring-1 ${
                      showPhoneFeedback && !phoneCheck.valid
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                        : showPhoneFeedback && phoneCheck.valid
                          ? 'border-[#15803D] focus:border-[#15803D] focus:ring-[#15803D]'
                          : 'border-[#D4C9B9] focus:border-[#0F2942] focus:ring-[#0F2942]'
                    }`}
                  />
                  {/* Fixed reserved slot height prevents layout shifting while typing */}
                  <div className="min-h-[20px] mt-1">
                    {showPhoneFeedback && (
                      <p
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          phoneCheck.valid ? 'text-[#15803D]' : 'text-[#991B1B]'
                        }`}
                      >
                        {phoneCheck.valid ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>{t.leadForm.phoneValid}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>{phoneCheck.error}</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="modal-lead-city"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    {t.leadForm.cityLabel} <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    id="modal-lead-city"
                    type="text"
                    autoComplete="address-level2"
                    required
                    aria-invalid={showCityFeedback && !isCityValid}
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    onBlur={() => setCityTouched(true)}
                    placeholder={t.leadForm.cityPlaceholder}
                    className={`w-full min-h-[48px] px-4 py-2.5 text-base sm:text-sm bg-[#FFFFFF] border rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] focus:outline-none focus:ring-1 ${
                      showCityFeedback && !isCityValid
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                        : showCityFeedback && isCityValid
                          ? 'border-[#15803D] focus:border-[#15803D] focus:ring-[#15803D]'
                          : 'border-[#D4C9B9] focus:border-[#0F2942] focus:ring-[#0F2942]'
                    }`}
                  />
                  <div className="min-h-[20px] mt-1">
                    {showCityFeedback && !isCityValid && (
                      <p className="flex items-center gap-1.5 text-xs font-medium text-[#991B1B]">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{t.leadForm.errorCity}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modal-lead-state"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    {t.leadForm.stateLabel} <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    id="modal-lead-state"
                    type="text"
                    autoComplete="address-level1"
                    required
                    aria-invalid={showStateFeedback && !isStateValid}
                    value={stateRegion}
                    onChange={(e) => {
                      setStateRegion(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    onBlur={() => setStateTouched(true)}
                    placeholder={t.leadForm.statePlaceholder}
                    className={`w-full min-h-[48px] px-4 py-2.5 text-base sm:text-sm bg-[#FFFFFF] border rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] focus:outline-none focus:ring-1 ${
                      showStateFeedback && !isStateValid
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                        : showStateFeedback && isStateValid
                          ? 'border-[#15803D] focus:border-[#15803D] focus:ring-[#15803D]'
                          : 'border-[#D4C9B9] focus:border-[#0F2942] focus:ring-[#0F2942]'
                    }`}
                  />
                  <div className="min-h-[20px] mt-1">
                    {showStateFeedback && !isStateValid && (
                      <p className="flex items-center gap-1.5 text-xs font-medium text-[#991B1B]">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{t.leadForm.errorState}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="modal-lead-date"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    {t.leadForm.dateLabel}
                  </label>
                  <input
                    id="modal-lead-date"
                    type="date"
                    min={todayIso}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 text-base sm:text-sm bg-[#FFFFFF] border border-[#D4C9B9] rounded-md text-[#1A1A1A] tabular-nums focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                  />
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    {t.leadForm.visitModeLabel}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['inPerson', 'virtual'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setVisitMode(mode)}
                        className={`min-h-[48px] px-3 py-2.5 text-xs font-medium rounded-md border transition-colors text-center ${
                          visitMode === mode
                            ? 'bg-[#0F2942] text-[#FAF8F5] border-[#0F2942]'
                            : 'bg-[#FFFFFF] text-[#4A4640] border-[#D4C9B9] hover:border-[#0F2942]'
                        }`}
                      >
                        {mode === 'inPerson' ? t.leadForm.visitInPerson : t.leadForm.visitVirtual}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="modal-lead-notes"
                  className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                >
                  {t.leadForm.notesLabel}
                </label>
                <textarea
                  id="modal-lead-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.leadForm.notesPlaceholder}
                  className="w-full px-4 py-2.5 text-base sm:text-sm bg-[#FFFFFF] border border-[#D4C9B9] rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                />
              </div>

              {errorMsg && (
                <p
                  role="alert"
                  className="text-xs font-medium text-[#991B1B] bg-[#FEE2E2] border border-[#FECACA] rounded-md px-3.5 py-2.5"
                >
                  {errorMsg}
                </p>
              )}

              <p className="text-[11px] text-[#6B645B]">{t.leadForm.requiredNote}</p>

              <div className="pt-1 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('valores')}
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium text-[#4A4640] bg-[#EAE5DC] hover:bg-[#DFD7CA] rounded-md transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {t.proposalModal.backToValues}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] disabled:opacity-70 disabled:cursor-not-allowed rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                      {t.leadForm.submittingButton}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {t.leadForm.submitButton}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
