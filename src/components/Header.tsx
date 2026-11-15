import { useState, useEffect } from 'react';
import { Menu, X, Calendar, ChevronRight } from 'lucide-react';
import { BROKER_CONFIG } from '../data/propertyData';

const NAV_LINKS = [
  { href: '#mansao', label: 'A Mansão' },
  { href: '#ambientes', label: 'Ambientes' },
  { href: '#localizacao', label: 'Localização & Distâncias' },
  { href: '#simulador', label: 'Simulador' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#0F2942]/95 backdrop-blur-md border-b border-white/10 shadow-sm'
          : 'bg-[#0F2942]/80 md:bg-gradient-to-b md:from-[#0F2942]/80 md:to-transparent backdrop-blur-sm md:backdrop-blur-none'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#topo"
          className="font-display text-lg sm:text-2xl font-semibold tracking-tight text-[#FAF8F5] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] rounded-sm"
        >
          {BROKER_CONFIG.company}
        </a>

        {/* Zone 2: Clean single-line navigation links (Desktop) */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#EAE5DC]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#FAF8F5] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#C59B27] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#agendamento"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF8F5]"
          >
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            Agendar Visita Exclusiva
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-[#FAF8F5] hover:bg-white/10 active:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden bg-[#0F2942] border-t border-white/10 px-4 sm:px-6 pt-2 pb-6 shadow-xl"
        >
          <nav aria-label="Navegação mobile" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[48px] py-3 flex items-center justify-between text-base font-medium text-[#EAE5DC] hover:text-[#C59B27] border-b border-white/10 transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
              </a>
            ))}
            <a
              href="#agendamento"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Agendar Visita Exclusiva
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
