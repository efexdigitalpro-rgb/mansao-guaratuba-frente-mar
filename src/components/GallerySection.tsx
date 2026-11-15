import { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { Expand, X, ChevronLeft, ChevronRight, Send, ChevronDown, ChevronUp } from 'lucide-react';
import {
  GALLERY_CATEGORIES,
  GALLERY_ITEMS,
  GalleryCategory,
} from '../content/propertyData';
import { ResilientImage } from './ResilientImage';
import { useLanguage } from '../contexts/LanguageContext';

const MOBILE_INITIAL_LIMIT = 6;

interface GallerySectionProps {
  onConsultRoom: (roomTitle: string) => void;
}

export function GallerySection({ onConsultRoom }: GallerySectionProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('Todos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const filteredItems =
    activeCategory === 'Todos'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const hasHiddenMobileItems =
    activeCategory === 'Todos' && filteredItems.length > MOBILE_INITIAL_LIMIT;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredItems.length - 1 : prev - 1;
    });
  }, [filteredItems.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredItems.length - 1 ? 0 : prev + 1;
    });
  }, [filteredItems.length]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        showPrev();
      } else {
        showNext();
      }
    }
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const activePhoto = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;
  const activePhotoLoc = activePhoto ? t.gallery.items[activePhoto.id] ?? activePhoto : null;

  return (
    <section id="ambientes" className="bg-[#1A1A1A] text-[#FAF8F5] py-14 sm:py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-8 mb-6 sm:mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-[#C59B27] mb-2">
              {t.gallery.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.85rem)] font-semibold leading-[1.15] tracking-tight text-balance">
              {t.gallery.title}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#C8B8A2] max-w-md tabular-nums">
            {t.gallery.showingPrefix} {filteredItems.length}{' '}
            {filteredItems.length === 1 ? t.gallery.photoSingular : t.gallery.photoPlural}{' '}
            {t.gallery.tapHint}
          </p>
        </div>

        {/* Interactive Category Filter Bar (Horizontal swipeable rail on mobile) */}
        <div
          role="tablist"
          aria-label={t.gallery.filterAria}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-4 mb-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:pb-8 sm:mb-10 border-b border-white/10"
        >
          {GALLERY_CATEGORIES.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveCategory(category);
                  setShowAllMobile(false);
                  setLightboxIndex(null);
                }}
                className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] ${
                  isSelected
                    ? 'bg-[#C59B27] text-[#1A1A1A] font-semibold'
                    : 'bg-[#252525] text-[#EAE5DC] hover:bg-[#303030]'
                }`}
              >
                {t.gallery.categories[category]}
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item, idx) => {
            const hideOnCollapsedMobile =
              hasHiddenMobileItems && !showAllMobile && idx >= MOBILE_INITIAL_LIMIT;
            const locItem = t.gallery.items[item.id] ?? item;
            const locCategory = t.gallery.categories[item.category];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className={`group text-left bg-[#232323] border border-white/10 rounded-lg overflow-hidden transition-colors duration-150 hover:border-[#C59B27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] ${
                  idx === 0 && filteredItems.length >= 4 ? 'md:col-span-2 lg:col-span-2' : ''
                } ${hideOnCollapsedMobile ? 'hidden md:flex md:flex-col' : 'flex flex-col'}`}
              >
                <div
                  className={`relative overflow-hidden w-full ${
                    idx === 0 && filteredItems.length >= 4
                      ? 'aspect-[16/10] sm:aspect-[16/9]'
                      : 'aspect-[4/3]'
                  }`}
                >
                  <ResilientImage
                    src={item.image}
                    alt={locItem.alt}
                    fallbackTitle={locItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"
                  />
                  <span className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center justify-center w-9 h-9 rounded-md bg-black/55 text-[#FAF8F5] border border-white/15 group-hover:bg-[#C59B27] group-hover:text-[#1A1A1A] transition-colors">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>

                <div className="p-4 sm:p-6">
                  <p className="text-[11px] sm:text-xs font-medium text-[#C59B27] mb-1">
                    {locCategory} · {locItem.subtitle}
                  </p>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#FAF8F5] mb-1.5 sm:mb-2">
                    {locItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C8B8A2] leading-relaxed">
                    {locItem.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Expand / Collapse Control for Full Gallery */}
        {hasHiddenMobileItems && (
          <div className="mt-6 md:hidden">
            <button
              type="button"
              onClick={() => setShowAllMobile((prev) => !prev)}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-[#252525] hover:bg-[#303030] text-[#FAF8F5] border border-white/15 rounded-md transition-colors"
            >
              {showAllMobile ? (
                <>
                  <ChevronUp className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                  {t.gallery.collapseBtn}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-[#C59B27]" aria-hidden="true" />
                  {t.gallery.expandAllTemplate(filteredItems.length)}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal with Touch Swipe */}
      {activePhoto &&
        activePhotoLoc &&
        lightboxIndex !== null &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${t.gallery.lightboxAriaPrefix} ${activePhotoLoc.title}`}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col justify-between p-4 sm:p-6 lg:p-8"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 text-[#FAF8F5]">
              <div className="text-xs sm:text-sm text-[#C8B8A2] tabular-nums">
                <span>{t.gallery.photoCounter(lightboxIndex + 1, filteredItems.length)}</span>
                <span aria-hidden="true" className="mx-2">
                  ·
                </span>
                <span className="text-[#C59B27]">
                  {t.gallery.categories[activePhoto.category]}
                </span>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                aria-label={t.gallery.closeLabel}
                className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-white/10 hover:bg-white/20 text-[#FAF8F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative flex-1 flex items-center justify-center my-3 sm:my-4 min-h-0 touch-pan-y"
            >
              <button
                type="button"
                onClick={showPrev}
                aria-label={t.gallery.prevLabel}
                className="absolute left-0 sm:left-2 z-10 inline-flex items-center justify-center w-11 h-11 rounded-md bg-black/75 hover:bg-[#C59B27] text-white hover:text-[#1A1A1A] border border-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-5xl max-h-[56vh] sm:max-h-[68vh] w-full h-full flex items-center justify-center px-11 sm:px-16">
                <ResilientImage
                  src={activePhoto.image}
                  alt={activePhotoLoc.alt}
                  fallbackTitle={activePhotoLoc.title}
                  loading="eager"
                  className="max-w-full max-h-[56vh] sm:max-h-[68vh] object-contain rounded-md select-none"
                />
              </div>

              <button
                type="button"
                onClick={showNext}
                aria-label={t.gallery.nextLabel}
                className="absolute right-0 sm:right-2 z-10 inline-flex items-center justify-center w-11 h-11 rounded-md bg-black/75 hover:bg-[#C59B27] text-white hover:text-[#1A1A1A] border border-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27]"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption & Owner Action */}
            <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10">
              <div>
                <h4 className="font-display text-base sm:text-xl font-semibold text-[#FAF8F5]">
                  {activePhotoLoc.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#C8B8A2] mt-1 line-clamp-2 sm:line-clamp-none">
                  {activePhotoLoc.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const title = activePhotoLoc.title;
                  closeLightbox();
                  onConsultRoom(title);
                }}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AA36] rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                {t.gallery.consultRoom}
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
