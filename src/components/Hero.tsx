import { ArrowDownRight, Send } from 'lucide-react';
import { BROKER_CONFIG, HERO_MEDIA } from '../content/propertyData';
import { ResilientImage } from './ResilientImage';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onOpenProposal: () => void;
}

export function Hero({ onOpenProposal }: HeroProps) {
  const { t, isUsd, formatActiveCurrency, formatUsdRateLabel } = useLanguage();

  return (
    <section id="topo" className="relative bg-[#0F2942] text-[#FAF8F5]">
      {/* Mobile-First Framing: Clean panoramic photo on <md so bridge & mansion aren't cropped out; full-bleed on md+ */}
      <div className="relative pt-14 md:pt-0 md:min-h-[84vh] lg:min-h-[88vh] flex flex-col md:justify-end">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:absolute md:inset-0 overflow-hidden">
          <ResilientImage
            src={HERO_MEDIA.image}
            alt={t.hero.heroAlt}
            loading="eager"
            fallbackTitle={t.hero.fallbackTitle}
            className="w-full h-full object-cover object-center"
          />
          {/* Measured Scrim for >= 4.5:1 WCAG AA legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0F2942] via-[#0F2942]/30 md:via-[#0F2942]/55 to-transparent md:to-[#0F2942]/25"
          />
        </div>

        {/* Hero Typography & Primary Actions */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-14 md:pt-28 lg:pb-20 -mt-6 md:mt-0">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-base font-medium tracking-wide text-[#C59B27] mb-2.5 sm:mb-4">
              {t.hero.eyebrow}
            </p>

            <h1 className="font-display text-[clamp(1.85rem,4.5vw,3.9rem)] font-semibold leading-[1.12] tracking-tight text-[#FAF8F5] text-balance mb-4 sm:mb-5">
              {t.hero.h1}
            </h1>

            <p className="text-sm sm:text-lg text-[#EAE5DC] leading-relaxed max-w-2xl mb-5 sm:mb-6">
              {t.hero.description}
            </p>

            {/* Clear Reference Value + Live Daily USD Exchange Rate Readout */}
            <div className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 bg-[#0B2034]/85 backdrop-blur-sm border border-[#C59B27]/45 rounded-md px-4 py-2.5 mb-6 sm:mb-7">
              <span className="text-xs font-medium text-[#C8B8A2]">{t.hero.askingPriceLabel}:</span>
              <span className="font-display text-xl sm:text-2xl font-semibold text-[#FAF8F5] tabular-nums">
                {formatActiveCurrency(BROKER_CONFIG.referenceValue)}
              </span>
              {isUsd && (
                <span className="text-[11px] sm:text-xs text-[#C59B27] tabular-nums">
                  ({t.hero.liveRatePrefix}: {formatUsdRateLabel()})
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onOpenProposal}
                className="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] active:scale-[0.99] rounded-md transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF8F5]"
              >
                <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                {t.hero.ctaPrimary}
              </button>

              <a
                href="#mansao"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#FAF8F5] border border-white/30 hover:border-[#C59B27] hover:text-[#C59B27] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
              >
                {t.hero.ctaSecondary}
                <ArrowDownRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Harmonious 2x2 Mobile / 4-Column Desktop Architectural Summary Strip */}
      <div className="border-t border-white/15 bg-[#0B2034]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {t.hero.attributes.map((attr, idx) => (
              <div
                key={attr.label}
                className={`py-4 sm:py-5 px-3 sm:px-6 ${
                  idx % 2 === 1 ? 'border-l border-white/10' : 'pl-0'
                } ${idx >= 2 ? 'border-t border-white/10 lg:border-t-0 lg:border-l' : ''} ${
                  idx === 3 ? 'lg:pr-0' : ''
                }`}
              >
                <p className="text-[11px] sm:text-xs font-medium text-[#C8B8A2] mb-0.5 sm:mb-1">
                  {attr.label}
                </p>
                <p className="text-xs sm:text-base font-semibold text-[#FAF8F5] tabular-nums leading-snug">
                  {attr.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
