import { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PropertyShowcase } from './components/PropertyShowcase';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { LeadFormSection } from './components/LeadFormSection';
import { Footer } from './components/Footer';
import { GuabirubaFloatingInfo } from './components/GuabirubaFloatingInfo';
import { ProposalModal } from './components/ProposalModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import type { InquiryContext } from './types/inquiry';

function AppContent() {
  const { t } = useLanguage();
  const [inquiryContext, setInquiryContext] = useState<InquiryContext | null>(null);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.reveal-section');
    if (!('IntersectionObserver' in window)) {
      sections.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const openBlankProposal = useCallback(() => {
    setInquiryContext((prev) => (prev?.simulation ? prev : null));
    setIsProposalOpen(true);
  }, []);

  const openSimulatorModal = useCallback(() => {
    setInquiryContext(null);
    setIsProposalOpen(true);
  }, []);

  const openProposalWithContext = useCallback((ctx: Omit<InquiryContext, 'id'>) => {
    setInquiryContext({ id: Date.now(), ...ctx });
    setIsProposalOpen(true);
  }, []);

  const handleRequestDossier = useCallback(() => {
    openProposalWithContext({
      subject: t.appContexts.dossierSubject,
      notes: t.appContexts.dossierNotes,
      initialStep: 'dados',
    });
  }, [openProposalWithContext, t.appContexts.dossierNotes, t.appContexts.dossierSubject]);

  const handleConsultRoom = useCallback(
    (roomTitle: string) => {
      openProposalWithContext({
        subject: t.appContexts.consultRoomSubject(roomTitle),
        notes: t.appContexts.consultRoomNotes(roomTitle),
        initialStep: 'dados',
      });
    },
    [openProposalWithContext, t.appContexts]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
      <Header onOpenProposal={openBlankProposal} onOpenSimulator={openSimulatorModal} />
      <main className="flex-1">
        <Hero onOpenProposal={openBlankProposal} />
        <div className="reveal-section">
          <PropertyShowcase onRequestDossier={handleRequestDossier} />
        </div>
        <div className="reveal-section">
          <GallerySection onConsultRoom={handleConsultRoom} />
        </div>
        <div className="reveal-section">
          <LocationSection />
        </div>
        <div className="reveal-section">
          <LeadFormSection onOpenProposal={openBlankProposal} />
        </div>
      </main>
      <Footer onOpenProposal={openBlankProposal} onOpenSimulator={openSimulatorModal} />
      <GuabirubaFloatingInfo />
      <ProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        inquiryContext={inquiryContext}
        onClearContext={() => setInquiryContext(null)}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
