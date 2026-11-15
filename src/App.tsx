import { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PropertyShowcase } from './components/PropertyShowcase';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { FinancingSimulator } from './components/FinancingSimulator';
import { LeadFormSection } from './components/LeadFormSection';
import { Footer } from './components/Footer';
import type { AttachedSimulation, InquiryContext } from './types/inquiry';

export function App() {
  const [inquiryContext, setInquiryContext] = useState<InquiryContext | null>(null);

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

  const scrollToFormWithContext = useCallback((ctx: Omit<InquiryContext, 'id'>) => {
    setInquiryContext({ id: Date.now(), ...ctx });
    const target = document.getElementById('agendamento');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleRequestDossier = useCallback(() => {
    scrollToFormWithContext({
      subject: 'Solicitação de Dossiê Completo',
      notes:
        'Gostaria de receber o memorial descritivo completo e informações sobre a mansão em Guaratuba.',
    });
  }, [scrollToFormWithContext]);

  const handleConsultRoom = useCallback(
    (roomTitle: string) => {
      scrollToFormWithContext({
        subject: `Consulta sobre ambiente: ${roomTitle}`,
        notes: `Gostaria de mais detalhes sobre o ambiente "${roomTitle}".`,
      });
    },
    [scrollToFormWithContext]
  );

  const handleSendSimulation = useCallback(
    (simulation: AttachedSimulation) => {
      scrollToFormWithContext({
        subject: 'Proposta Simulada — Mansão Frente ao Mar',
        simulation,
      });
    },
    [scrollToFormWithContext]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
      <Header />
      <main className="flex-1">
        <Hero />
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
          <FinancingSimulator onSendProposal={handleSendSimulation} />
        </div>
        <div className="reveal-section">
          <LeadFormSection
            inquiryContext={inquiryContext}
            onClearContext={() => setInquiryContext(null)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
