import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TrendingUp, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function GuabirubaFloatingInfo() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t.guabiruba.fabAria}
        title={t.guabiruba.fabTitle}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0F2942] text-[#C59B27] border-2 border-[#C59B27] shadow-2xl hover:bg-[#173B5E] hover:scale-105 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] focus-visible:ring-offset-2"
      >
        <TrendingUp className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Modal with Guabiruba Investment Content */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guabiruba-modal-title"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-[#FAF8F5] text-[#1A1A1A] border border-[#C59B27]/50 rounded-lg shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#0F2942] text-[#FAF8F5] px-5 sm:px-7 py-5 flex items-start justify-between gap-4 border-b border-[#C59B27]/30 shrink-0">
                <div>
                  <p className="text-xs font-medium text-[#C59B27] mb-1">
                    {t.guabiruba.eyebrow}
                  </p>
                  <h2
                    id="guabiruba-modal-title"
                    className="font-display text-xl sm:text-2xl font-semibold leading-snug"
                  >
                    {t.guabiruba.modalTitle}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={t.guabiruba.closeAria}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 text-[#FAF8F5] shrink-0 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-sm sm:text-[15px] leading-relaxed text-[#3A3631]">
                <p className="text-[#1A1A1A] font-medium">{t.guabiruba.intro1}</p>
                <p className="text-sm font-semibold text-[#0F2942]">{t.guabiruba.intro2}</p>

                <div className="space-y-4">
                  {t.guabiruba.topics.map((topic) => (
                    <div
                      key={topic.number}
                      className="bg-[#F2EDE6] border border-[#DFD7CA] rounded-md p-4 sm:p-5"
                    >
                      <h3 className="font-display text-base sm:text-lg font-semibold text-[#0F2942] mb-2.5">
                        {topic.number}. {topic.title}
                      </h3>
                      <ul className="space-y-2">
                        {topic.points.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                            <span
                              aria-hidden="true"
                              className="text-[#C59B27] font-bold mt-0.5 shrink-0"
                            >
                              •
                            </span>
                            <span>
                              {pt.label && (
                                <strong className="text-[#1A1A1A]">{pt.label} </strong>
                              )}
                              {pt.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-7 py-4 bg-[#F2EDE6] border-t border-[#DFD7CA] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] px-5 py-2.5 text-sm font-semibold bg-[#0F2942] text-[#FAF8F5] hover:bg-[#173B5E] rounded-md transition-colors"
                >
                  {t.guabiruba.closeBtn}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
