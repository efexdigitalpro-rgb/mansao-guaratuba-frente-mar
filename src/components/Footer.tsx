import { BROKER_CONFIG } from '../content/propertyData';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onOpenProposal: () => void;
  onOpenSimulator: () => void;
}

export function Footer({ onOpenProposal, onOpenSimulator }: FooterProps) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-[#EAE5DC] border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <a
              href="#topo"
              className="font-display text-2xl font-semibold tracking-tight text-[#FAF8F5]"
            >
              {BROKER_CONFIG.company}
            </a>
            <p className="text-sm text-[#C8B8A2] leading-relaxed mt-3 max-w-md">
              {t.footer.desc}
            </p>
            <div className="mt-5 text-xs text-[#EAE5DC] space-y-1.5">
              <p>
                <span className="text-[#C8B8A2]">{t.footer.modeLabel}</span> {t.footer.modeValue}
              </p>
              <p>
                <span className="text-[#C8B8A2]">{t.footer.serviceLabel}</span>{' '}
                <button
                  type="button"
                  onClick={onOpenProposal}
                  className="text-[#C59B27] hover:underline text-left"
                >
                  {t.footer.serviceLink}
                </button>
              </p>
              <p>
                <span className="text-[#C8B8A2]">{t.footer.locationLabel}</span>{' '}
                {t.footer.locationValue}
              </p>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold text-[#FAF8F5] mb-3 sm:mb-4">
              {t.footer.navTitle}
            </p>
            <ul className="space-y-1 sm:space-y-2.5 text-sm text-[#C8B8A2]">
              <li>
                <a
                  href="#mansao"
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors"
                >
                  {t.footer.navLinks.mansao}
                </a>
              </li>
              <li>
                <a
                  href="#ambientes"
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors"
                >
                  {t.footer.navLinks.galeria}
                </a>
              </li>
              <li>
                <a
                  href="#localizacao"
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors"
                >
                  {t.footer.navLinks.localizacao}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSimulator}
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors text-left"
                >
                  {t.footer.navLinks.simulador}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenProposal}
                  className="inline-flex items-center min-h-[38px] sm:min-h-0 hover:text-[#C59B27] transition-colors text-left"
                >
                  {t.footer.navLinks.agendar}
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold text-[#FAF8F5] mb-3 sm:mb-4">
              {t.footer.legalTitle}
            </p>
            <p className="text-xs text-[#C8B8A2] leading-relaxed">{t.footer.legalText}</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left text-xs text-[#9E9589]">
          <p>{t.footer.copyright(year)}</p>
          <p>{t.footer.bottomTag}</p>
        </div>
      </div>
    </footer>
  );
}
