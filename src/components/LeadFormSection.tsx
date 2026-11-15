import { useState, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Lock,
  Loader2,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { InquiryContext } from '../types/inquiry';
import {
  formatPhoneByLanguage,
  validatePhoneByLanguage,
} from '../utils/phoneValidation';
import { useLanguage } from '../contexts/LanguageContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadFormSectionProps {
  inquiryContext: InquiryContext | null;
  onClearContext: () => void;
}

export function LeadFormSection({ inquiryContext, onClearContext }: LeadFormSectionProps) {
  const { language, t, formatActiveCurrency } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitMode, setVisitMode] = useState<'inPerson' | 'virtual'>('inPerson');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const todayIso = new Date().toISOString().split('T')[0];
  const phoneDigitsCount = phone.replace(/\D/g, '').length;
  const phoneCheck = validatePhoneByLanguage(phone, language);
  const minLiveCheckLen = language === 'pt' ? 10 : 8;
  const showPhoneFeedback =
    phoneDigitsCount > 0 && (phoneTouched || phoneDigitsCount >= minLiveCheckLen);

  useEffect(() => {
    setErrorMsg('');
  }, [language]);

  useEffect(() => {
    if (!inquiryContext) return;
    setShowSuccessModal(false);
    setErrorMsg('');
    if (inquiryContext.notes) {
      setNotes(inquiryContext.notes);
    }
  }, [inquiryContext]);

  useEffect(() => {
    if (!showSuccessModal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSuccessModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [showSuccessModal]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const phoneValidation = validatePhoneByLanguage(cleanPhone, language);

    if (cleanName.length < 3) {
      setErrorMsg(t.leadForm.errorName);
      return;
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrorMsg(t.leadForm.errorEmail);
      return;
    }
    if (!phoneValidation.valid) {
      setPhoneTouched(true);
      setErrorMsg(phoneValidation.error || t.leadForm.errorPhoneFallback);
      document.getElementById('lead-phone')?.focus();
      return;
    }

    const visitTypeLabel =
      visitMode === 'inPerson' ? t.leadForm.visitInPersonValue : t.leadForm.visitVirtualValue;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/proposta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          visitDate,
          visitType: visitTypeLabel,
          subject: inquiryContext?.subject || t.leadForm.defaultSubject,
          notes: notes.trim(),
          simulation: inquiryContext?.simulation || undefined,
          lang: language,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setErrorMsg(data.error || t.leadForm.errorServerFallback);
        return;
      }

      setName('');
      setEmail('');
      setPhone('');
      setPhoneTouched(false);
      setVisitDate('');
      setNotes('');
      onClearContext();
      setShowSuccessModal(true);
    } catch {
      setErrorMsg(t.leadForm.errorConnection);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="agendamento" className="bg-[#FAF8F5] text-[#1A1A1A] py-14 sm:py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Editorial Pitch */}
          <div className="lg:col-span-5">
            <p className="text-xs sm:text-sm font-medium text-[#0F2942] mb-2 sm:mb-3">
              {t.leadForm.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.85rem)] font-semibold leading-[1.15] tracking-tight mb-4 sm:mb-5">
              {t.leadForm.title}
            </h2>
            <p className="text-sm sm:text-base text-[#4A4640] leading-relaxed mb-6 sm:mb-8">
              {t.leadForm.intro}
            </p>

            <div className="space-y-3.5 sm:space-y-4 pt-5 sm:pt-6 border-t border-[#DCD3C6] text-xs sm:text-sm text-[#3A3631]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t.leadForm.bullets[0]}</span>
              </div>
              <div className="flex items-start gap-3">
                <CalendarCheck
                  className="w-5 h-5 text-[#C59B27] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{t.leadForm.bullets[1]}</span>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#C59B27] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t.leadForm.bullets[2]}</span>
              </div>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="lg:col-span-7 bg-[#F2EDE6] border border-[#DFD7CA] rounded-lg p-5 sm:p-9">
            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              {/* Optional Attached Simulation or Topic Banner */}
              {inquiryContext && (
                <div className="bg-[#0F2942] text-[#FAF8F5] rounded-md p-4 border border-[#C59B27]/40 flex items-start justify-between gap-3">
                  <div className="text-xs sm:text-sm space-y-1">
                    <p className="font-semibold text-[#C59B27]">{inquiryContext.subject}</p>
                    {inquiryContext.simulation && (
                      <p className="text-[#EAE5DC] tabular-nums leading-relaxed">
                        {t.leadForm.attachedProposal}{' '}
                        <strong>
                          {formatActiveCurrency(inquiryContext.simulation.proposalValue)}
                        </strong>{' '}
                        · {t.leadForm.attachedDown} ({inquiryContext.simulation.downPaymentPercent}%):{' '}
                        <strong>
                          {formatActiveCurrency(inquiryContext.simulation.downPaymentValue)}
                        </strong>{' '}
                        · {inquiryContext.simulation.termMonths} {t.leadForm.attachedMonths} (
                        {inquiryContext.simulation.annualRate}% {t.simulator.rateUnit})
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClearContext}
                    aria-label={t.leadForm.removeAttachmentAria}
                    className="inline-flex items-center justify-center w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-[#FAF8F5] shrink-0 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div>
                <label
                  htmlFor="lead-name"
                  className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                >
                  {t.leadForm.nameLabel} <span className="text-[#991B1B]">*</span>
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.leadForm.namePlaceholder}
                  className="w-full min-h-[48px] px-4 py-3 text-base sm:text-sm bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    {t.leadForm.emailLabel} <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.leadForm.emailPlaceholder}
                    className="w-full min-h-[48px] px-4 py-3 text-base sm:text-sm bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-phone"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    {t.leadForm.phoneLabel} <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    id="lead-phone"
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
                    className={`w-full min-h-[48px] px-4 py-3 text-base sm:text-sm bg-[#FAF8F5] border rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] tabular-nums focus:outline-none focus:ring-1 ${
                      showPhoneFeedback && !phoneCheck.valid
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
                        : showPhoneFeedback && phoneCheck.valid
                          ? 'border-[#15803D] focus:border-[#15803D] focus:ring-[#15803D]'
                          : 'border-[#D4C9B9] focus:border-[#0F2942] focus:ring-[#0F2942]'
                    }`}
                  />
                  {showPhoneFeedback && (
                    <p
                      className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${
                        phoneCheck.valid ? 'text-[#15803D]' : 'text-[#991B1B]'
                      }`}
                    >
                      {phoneCheck.valid ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          {t.leadForm.phoneValid}
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          {phoneCheck.error}
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label
                    htmlFor="lead-date"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    {t.leadForm.dateLabel}
                  </label>
                  <input
                    id="lead-date"
                    type="date"
                    min={todayIso}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-3 text-base sm:text-sm bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#1A1A1A] tabular-nums focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
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
                        className={`min-h-[48px] px-3 py-3 text-xs font-medium rounded-md border transition-colors text-center ${
                          visitMode === mode
                            ? 'bg-[#0F2942] text-[#FAF8F5] border-[#0F2942]'
                            : 'bg-[#FAF8F5] text-[#4A4640] border-[#D4C9B9] hover:border-[#0F2942]'
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
                  htmlFor="lead-notes"
                  className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                >
                  {t.leadForm.notesLabel}
                </label>
                <textarea
                  id="lead-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.leadForm.notesPlaceholder}
                  className="w-full px-4 py-3 text-base sm:text-sm bg-[#FAF8F5] border border-[#D4C9B9] rounded-md text-[#1A1A1A] placeholder:text-[#8A8175] focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
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

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] disabled:opacity-70 disabled:cursor-not-allowed rounded-md transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942]"
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
                <span className="text-xs text-[#6B645B] text-center sm:text-left">
                  {t.leadForm.requiredNote}
                </span>
              </div>
            </form>

            <div
              role="note"
              className="mt-5 flex items-start gap-2.5 bg-[#FEF2F2] border-2 border-[#DC2626] text-[#991B1B] rounded-md px-4 py-3 text-xs sm:text-sm leading-relaxed"
            >
              <AlertCircle
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#DC2626] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p>
                <strong className="font-semibold">{t.leadForm.warningStrong}</strong>{' '}
                {t.leadForm.warningText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup Modal rendered in document.body for true viewport centering */}
      {showSuccessModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
            onClick={() => setShowSuccessModal(false)}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md my-auto bg-[#FAF8F5] text-[#1A1A1A] border border-[#C59B27]/50 rounded-lg shadow-2xl p-6 sm:p-8 text-center"
            >
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                aria-label={t.leadForm.modalCloseAria}
                className="absolute top-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-md text-[#6B645B] hover:text-[#1A1A1A] hover:bg-[#EAE5DC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0F2942] text-[#C59B27] mb-5">
                <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
              </div>

              <h3
                id="success-modal-title"
                className="font-display text-2xl font-semibold text-[#1A1A1A] mb-2"
              >
                {t.leadForm.modalTitle}
              </h3>

              <p className="text-base font-medium text-[#0F2942] leading-relaxed mb-6">
                {t.leadForm.modalDesc}
              </p>

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full min-h-[48px] inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942]"
              >
                {t.leadForm.modalClose}
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
