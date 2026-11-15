import { MapPin, Navigation, Compass } from 'lucide-react';
import { LANDMARKS } from '../data/propertyData';
import { ResilientImage } from './ResilientImage';

export function LocationSection() {
  return (
    <section id="localizacao" className="bg-[#FAF8F5] text-[#1A1A1A] py-14 sm:py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strategic Connectivity Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start pb-10 sm:pb-14 border-b border-[#DCD3C6]">
          <div className="lg:col-span-7">
            <p className="text-xs sm:text-sm font-medium text-[#0F2942] mb-2 sm:mb-3">
              Localização Estratégica &amp; Pontos Turísticos
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.85rem)] font-semibold leading-[1.15] tracking-tight text-[#1A1A1A] text-balance">
              Frente ao mar em Guaratuba, conectada aos principais cartões-postais
            </h2>
          </div>

          <div className="lg:col-span-5 bg-[#0F2942] text-[#FAF8F5] rounded-lg p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-[11px] sm:text-xs text-[#C8B8A2] mb-1">Capital do Estado</p>
                <p className="font-display text-xl sm:text-3xl font-semibold text-[#C59B27] tabular-nums">
                  120 km
                </p>
                <p className="text-[11px] sm:text-xs text-[#EAE5DC] mt-1">
                  De Curitiba via BR-376 / Ponte
                </p>
              </div>
              <div className="border-l border-white/15 pl-4 sm:pl-6">
                <p className="text-[11px] sm:text-xs text-[#C8B8A2] mb-1">Entorno Imediato</p>
                <p className="font-display text-xl sm:text-3xl font-semibold text-[#FAF8F5] tabular-nums">
                  Pé na Areia
                </p>
                <p className="text-[11px] sm:text-xs text-[#EAE5DC] mt-1">
                  Ao lado da Ponte de Guaratuba
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex items-center justify-between pt-8 pb-3 md:hidden">
          <p className="text-xs font-medium text-[#6B645B]">
            Pontos turísticos e distâncias reais
          </p>
          <span className="text-xs font-semibold text-[#0F2942]">Deslize →</span>
        </div>

        {/* 5 Landmarks + Connectivity Summary (Horizontal snap rail on mobile, Grid on md+) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-2 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:mx-0 md:px-0 md:pb-0 md:pt-14 md:overflow-visible">
          {LANDMARKS.map((spot, idx) => (
            <article
              key={spot.id}
              className={`w-[84vw] max-w-[330px] shrink-0 snap-start md:w-auto md:max-w-none bg-[#F2EDE6] border border-[#DFD7CA] rounded-lg overflow-hidden flex flex-col ${
                idx === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  idx === 0 ? 'aspect-[16/10] lg:aspect-[21/10]' : 'aspect-[16/10] md:aspect-[4/3]'
                }`}
              >
                <ResilientImage
                  src={spot.image}
                  alt={spot.alt}
                  fallbackTitle={spot.name}
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"
                />
                <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-3.5 sm:left-4 sm:right-4 flex items-center justify-between gap-2 text-[11px] sm:text-xs font-medium text-[#FAF8F5]">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0" aria-hidden="true" />
                    <span className="truncate">{spot.region}</span>
                  </span>
                  <span className="tabular-nums font-semibold text-[#FAF8F5] whitespace-nowrap shrink-0">
                    {spot.distance} · {spot.travelTime}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#1A1A1A] mb-2">
                    {spot.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A4640] leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-[#DCD3C6] flex items-center justify-between text-xs text-[#0F2942] font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#C59B27]" aria-hidden="true" />
                    Partindo da mansão
                  </span>
                  <span className="tabular-nums font-semibold">{spot.distance}</span>
                </div>
              </div>
            </article>
          ))}

          {/* Connectivity Summary Card */}
          <div className="w-[84vw] max-w-[330px] shrink-0 snap-start md:w-auto md:max-w-none bg-[#0F2942] text-[#FAF8F5] rounded-lg p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <Compass className="w-6 h-6 text-[#C59B27] mb-4 sm:mb-5" aria-hidden="true" />
              <h3 className="font-display text-xl sm:text-2xl font-semibold leading-snug mb-3">
                Valorização com a Nova Ponte de Guaratuba
              </h3>
              <p className="text-xs sm:text-sm text-[#EAE5DC] leading-relaxed">
                Situada ao lado do eixo de ligação mais aguardado do litoral paranaense, a
                propriedade une acesso ágil sem filas de travessia à tranquilidade de uma enseada
                reservada.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/15 text-xs text-[#C8B8A2]">
              Acesso terrestre direto · Proximidade de marinas e aeroporto regional de Joinville /
              Curitiba
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
