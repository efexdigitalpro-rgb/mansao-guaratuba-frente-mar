import { ArrowDownRight, Send } from 'lucide-react';
import { HERO_MEDIA } from '../data/propertyData';
import { ResilientImage } from './ResilientImage';

const HERO_ATTRIBUTES = [
  {
    label: 'Área Construída',
    value: '1.100 m² · Triple-A',
  },
  {
    label: 'Implantação',
    value: 'Pé na Areia · Frente Mar',
  },
  {
    label: 'Localização',
    value: 'Ao lado da Ponte',
  },
  {
    label: 'Lazer Privativo',
    value: 'Cinema, Hidro, Adega & Gym',
  },
];

export function Hero() {
  return (
    <section id="topo" className="relative bg-[#0F2942] text-[#FAF8F5]">
      {/* Mobile-First Framing: Clean panoramic photo on <md so bridge & mansion aren't cropped out; full-bleed on md+ */}
      <div className="relative pt-14 md:pt-0 md:min-h-[84vh] lg:min-h-[88vh] flex flex-col md:justify-end">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:absolute md:inset-0 overflow-hidden">
          <ResilientImage
            src={HERO_MEDIA.image}
            alt={HERO_MEDIA.alt}
            loading="eager"
            fallbackTitle="Mansão Contemporânea Frente ao Mar — Guaratuba, PR"
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
              Venda Direta com o Proprietário · Guaratuba - PR · Pé na Areia
            </p>

            <h1 className="font-display text-[clamp(1.85rem,4.5vw,3.9rem)] font-semibold leading-[1.12] tracking-tight text-[#FAF8F5] text-balance mb-4 sm:mb-5">
              Mansão Contemporânea Frente ao Mar — Direto com o Proprietário
            </h1>

            <p className="text-sm sm:text-lg text-[#EAE5DC] leading-relaxed max-w-2xl mb-6 sm:mb-8">
              1.100 m² de arquitetura autoral pé na areia com piscina frente mar, espelho d&apos;água,
              escadaria flutuante em vidro, elevador privativo, adega climatizada, espaço gourmet
              com chopeira, academia e home cinema com teto estrelado.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#agendamento"
                className="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] active:scale-[0.99] rounded-md transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF8F5]"
              >
                <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                Enviar Proposta / Agendar Visita
              </a>

              <a
                href="#mansao"
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#FAF8F5] border border-white/30 hover:border-[#C59B27] hover:text-[#C59B27] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
              >
                Explorar Imóvel
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
            {HERO_ATTRIBUTES.map((attr, idx) => (
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
