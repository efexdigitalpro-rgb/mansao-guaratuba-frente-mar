import { useState, useEffect, type ReactNode } from 'react';
import { Menu, X, Calendar, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../content/translations';

function FlagSpain() {
  return (
    <svg viewBox="0 0 24 16" className="w-5 h-3.5 sm:w-6 sm:h-4 rounded-[2px] block" aria-hidden="true">
      <rect width="24" height="16" fill="#AA151B" />
      <rect y="4" width="24" height="8" fill="#F1BF00" />
      <rect x="5" y="5.5" width="3" height="4.5" rx="0.6" fill="#AA151B" opacity="0.85" />
      <rect x="5.8" y="6.2" width="1.4" height="2" fill="#F1BF00" />
    </svg>
  );
}

function FlagBrazil() {
  return (
    <svg viewBox="0 0 24 16" className="w-5 h-3.5 sm:w-6 sm:h-4 rounded-[2px] block" aria-hidden="true">
      <rect width="24" height="16" fill="#009C3B" />
      <polygon points="12,2 22,8 12,14 2,8" fill="#FFDF00" />
      <circle cx="12" cy="8" r="3.4" fill="#002776" />
      <path d="M9.1 7.6 Q12 6.8 14.9 8.5" stroke="#FFFFFF" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

function FlagUSA() {
  return (
    <svg viewBox="0 0 24 16" className="w-5 h-3.5 sm:w-6 sm:h-4 rounded-[2px] block" aria-hidden="true">
      <rect width="24" height="16" fill="#FFFFFF" />
      <rect y="0" width="24" height="2.3" fill="#B22234" />
      <rect y="4.6" width="24" height="2.3" fill="#B22234" />
      <rect y="9.2" width="24" height="2.3" fill="#B22234" />
      <rect y="13.7" width="24" height="2.3" fill="#B22234" />
      <rect width="10.5" height="9.2" fill="#3C3B6E" />
      <circle cx="2.5" cy="2.3" r="0.55" fill="#FFFFFF" />
      <circle cx="5.2" cy="2.3" r="0.55" fill="#FFFFFF" />
      <circle cx="7.9" cy="2.3" r="0.55" fill="#FFFFFF" />
      <circle cx="3.8" cy="4.6" r="0.55" fill="#FFFFFF" />
      <circle cx="6.6" cy="4.6" r="0.55" fill="#FFFFFF" />
      <circle cx="2.5" cy="6.9" r="0.55" fill="#FFFFFF" />
      <circle cx="5.2" cy="6.9" r="0.55" fill="#FFFFFF" />
      <circle cx="7.9" cy="6.9" r="0.55" fill="#FFFFFF" />
    </svg>
  );
}

const FLAG_OPTIONS: {
  lang: Language;
  code: string;
  label: string;
  renderFlag: () => ReactNode;
}[] = [
  {
    lang: 'es',
    code: 'ES',
    label: 'Español (USD)',
    renderFlag: () => <FlagSpain />,
  },
  {
    lang: 'pt',
    code: 'BR',
    label: 'Português (R$)',
    renderFlag: () => <FlagBrazil />,
  },
  {
    lang: 'en',
    code: 'EN',
    label: 'English (USD)',
    renderFlag: () => <FlagUSA />,
  },
];

interface HeaderProps {
  onOpenProposal: () => void;
  onOpenSimulator: () => void;
}

export function Header({ onOpenProposal, onOpenSimulator }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#mansao', label: t.header.nav.mansao },
    { href: '#ambientes', label: t.header.nav.ambientes },
    { href: '#localizacao', label: t.header.nav.localizacao },
  ];

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
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#topo"
          className="font-display text-base sm:text-2xl font-semibold tracking-tight text-[#FAF8F5] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] rounded-sm"
        >
          {t.header.brand}
        </a>

        {/* Zone 2: Clean single-line navigation links (Desktop) */}
        <nav
          aria-label={t.header.navAria}
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#EAE5DC]"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#FAF8F5] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#C59B27] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] rounded-sm"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenSimulator}
            className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#FAF8F5] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#C59B27] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] rounded-sm"
          >
            {t.header.nav.simulador}
          </button>
        </nav>

        {/* Zone 3: 3 Language/Currency Flags (ES, BR, US) + CTA + Mobile Menu Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div
            role="group"
            aria-label={t.header.languageSelectorLabel}
            className="inline-flex items-center gap-1 bg-[#0B2034]/85 border border-white/15 rounded-md p-1"
          >
            {FLAG_OPTIONS.map((option) => {
              const isActive = language === option.lang;
              return (
                <button
                  key={option.lang}
                  type="button"
                  onClick={() => setLanguage(option.lang)}
                  aria-pressed={isActive}
                  aria-label={option.label}
                  title={option.label}
                  className={`inline-flex items-center justify-center rounded px-1.5 py-1 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] ${
                    isActive
                      ? 'bg-[#C59B27]/25 ring-1 ring-[#C59B27] scale-105'
                      : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                  }`}
                >
                  {option.renderFlag()}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenProposal}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 lg:px-4 py-2 text-xs font-semibold tracking-wide bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF8F5]"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {t.header.cta}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? t.header.closeMenu : t.header.openMenu}
            className="lg:hidden inline-flex items-center justify-center min-w-[40px] min-h-[40px] rounded-md text-[#FAF8F5] hover:bg-white/10 active:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
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
          <nav aria-label={t.header.mobileNavAria} className="flex flex-col">
            {navLinks.map((link) => (
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
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSimulator();
              }}
              className="min-h-[48px] py-3 flex items-center justify-between text-base font-medium text-[#EAE5DC] hover:text-[#C59B27] border-b border-white/10 transition-colors text-left"
            >
              <span>{t.header.nav.simulador}</span>
              <ChevronRight className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProposal();
              }}
              className="mt-4 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              {t.header.cta}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
