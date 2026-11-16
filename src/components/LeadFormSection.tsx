import {
  AlertCircle,
  CalendarCheck,
  Lock,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { BROKER_CONFIG } from '../content/propertyData';
import { useLanguage } from '../contexts/LanguageContext';

interface LeadFormSectionProps {
  onOpenProposal: () => void;
}

export function LeadFormSection({ onOpenProposal }: LeadFormSectionProps) {
  const { t, formatActiveCurrency } = useLanguage();

  return (
    <section
      id="agendamento"
      className="bg-[#FAF8F5] text-[#1A1A1A] border-t border-[#DCD3C6] py-14 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Pitch */}
          <div className="lg:col-span-6">
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

          {/* Right Dedicated Proposal Trigger Card (No inline inputs that jump on mobile) */}
          <div className="lg:col-span-6 bg-[#0F2942] text-[#FAF8F5] border border-[#C59B27]/40 rounded-lg p-6 sm:p-9 shadow-sm">
            <p className="text-xs font-medium text-[#C59B27] mb-2">
              {t.leadForm.cardEyebrow}
            </p>

            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF8F5] leading-snug mb-3">
              {t.leadForm.cardTitle}
            </h3>

            <p className="text-sm text-[#C8B8A2] mb-5">
              {t.hero.askingPriceLabel}:{' '}
              <strong className="text-[#FAF8F5] font-semibold tabular-nums">
                {formatActiveCurrency(BROKER_CONFIG.referenceValue)}
              </strong>
            </p>

            <div className="space-y-2.5 bg-[#0B2034] border border-white/10 rounded-md p-4 mb-6 text-xs sm:text-sm text-[#EAE5DC]">
              <p>{t.leadForm.cardStep1}</p>
              <p className="pt-2.5 border-t border-white/10">{t.leadForm.cardStep2}</p>
            </div>

            <button
              type="button"
              onClick={onOpenProposal}
              className="w-full min-h-[52px] inline-flex items-center justify-center gap-2.5 px-6 py-4 text-sm sm:text-base font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] active:scale-[0.99] rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF8F5]"
            >
              <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t.leadForm.openFormCta}
            </button>

            <p className="mt-3 text-center text-xs text-[#C8B8A2]">
              {t.leadForm.openFormSubnote}
            </p>

            <div
              role="note"
              className="mt-5 flex items-start gap-2.5 bg-[#FEF2F2] border-2 border-[#DC2626] text-[#991B1B] rounded-md px-3.5 py-2.5 text-xs leading-relaxed"
            >
              <AlertCircle
                className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5"
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
    </section>
  );
}
