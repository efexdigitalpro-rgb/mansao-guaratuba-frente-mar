import { useState } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import {
  ARCHITECTURAL_HIGHLIGHTS,
  TECHNICAL_ACCORDIONS,
} from '../content/propertyData';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyShowcaseProps {
  onRequestDossier: () => void;
}

export function PropertyShowcase({ onRequestDossier }: PropertyShowcaseProps) {
  const { t } = useLanguage();
  const [openAccordionId, setOpenAccordionId] = useState<string>(TECHNICAL_ACCORDIONS[0].id);

  const toggleAccordion = (id: string) => {
    setOpenAccordionId((current) => (current === id ? '' : id));
  };

  return (
    <section id="mansao" className="bg-[#FAF8F5] text-[#1A1A1A] py-14 sm:py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Intro Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-end pb-10 sm:pb-14 border-b border-[#DCD3C6]">
          <div className="lg:col-span-7">
            <p className="text-xs sm:text-sm font-medium text-[#0F2942] mb-2 sm:mb-3">
              {t.showcase.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.65rem,3.2vw,2.85rem)] font-semibold leading-[1.15] tracking-tight text-[#1A1A1A] text-balance">
              {t.showcase.title}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#4A4640] leading-relaxed">
              {t.showcase.intro}
            </p>
          </div>
        </div>

        {/* Asymmetric Bento Grid of Differentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-10 sm:py-14">
          {ARCHITECTURAL_HIGHLIGHTS.map((item) => {
            const loc = t.showcase.highlights[item.index] ?? item;
            return (
              <article
                key={item.index}
                className={`bg-[#F2EDE6] border border-[#DFD7CA] rounded-lg p-5 sm:p-7 flex flex-col justify-between transition-colors duration-150 hover:border-[#C59B27] ${
                  item.spanWide ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3 sm:mb-5 text-xs font-medium text-[#6B645B]">
                    <span>{loc.category}</span>
                    <span className="tabular-nums font-semibold text-[#0F2942]">{item.index}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-2xl font-semibold text-[#1A1A1A] leading-snug mb-2 sm:mb-3">
                    {loc.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#4A4640] leading-relaxed">
                    {loc.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Technical Specifications Accordion + Direct Dossier Request */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6 sm:pt-8 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs sm:text-sm font-medium text-[#0F2942] mb-2">
              {t.showcase.dossierEyebrow}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A] leading-tight mb-3 sm:mb-4">
              {t.showcase.dossierTitle}
            </h3>
            <p className="text-sm sm:text-base text-[#4A4640] leading-relaxed mb-5 sm:mb-6">
              {t.showcase.dossierDesc}
            </p>
            <button
              type="button"
              onClick={onRequestDossier}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-[#0F2942] text-[#FAF8F5] hover:bg-[#173B5E] rounded-md transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
            >
              <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0" aria-hidden="true" />
              {t.showcase.dossierButton}
            </button>
          </div>

          <div className="lg:col-span-7 border-t border-[#DCD3C6]">
            {TECHNICAL_ACCORDIONS.map((spec) => {
              const isOpen = openAccordionId === spec.id;
              const locSpec = t.showcase.accordions[spec.id] ?? spec;
              return (
                <div key={spec.id} className="border-b border-[#DCD3C6]">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(spec.id)}
                    aria-expanded={isOpen}
                    aria-controls={`spec-panel-${spec.id}`}
                    className="w-full min-h-[56px] py-4 sm:py-5 flex items-center justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
                  >
                    <div>
                      <span className="block font-display text-base sm:text-xl font-semibold text-[#1A1A1A] group-hover:text-[#0F2942] transition-colors">
                        {locSpec.title}
                      </span>
                      <span className="block text-xs sm:text-sm text-[#6B645B] mt-0.5">
                        {locSpec.summary}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0F2942] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div id={`spec-panel-${spec.id}`} className="pb-5 sm:pb-6 pr-2 sm:pr-8">
                      <ul className="space-y-2.5 sm:space-y-3">
                        {locSpec.items.map((line) => (
                          <li
                            key={line}
                            className="flex items-start gap-2.5 sm:gap-3 text-sm sm:text-base text-[#3A3631] leading-relaxed"
                          >
                            <Check
                              className="w-4 h-4 text-[#C59B27] shrink-0 mt-1"
                              aria-hidden="true"
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
