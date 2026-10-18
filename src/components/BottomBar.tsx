import React from 'react';
import { usePresentation } from './SlideManager';
import { presentationData } from '../data/presentation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const BottomBar: React.FC = () => {
  const { currentSlide, nextSlide, prevSlide, setCurrentSlide } = usePresentation();
  const totalSlides = presentationData.length;

  return (
    <footer
      className="w-full bg-transparent flex items-center justify-between px-12 z-50 relative"
      style={{ height: '48px', paddingBottom: '6px' }}
    >
      <button
        onClick={prevSlide}
        disabled={currentSlide === 1}
        className="group flex items-center gap-2 text-white/40 hover:text-white transition-all disabled:opacity-0 text-[11px] font-bold uppercase tracking-widest"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden md:inline">Précédent</span>
      </button>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 text-[11px] font-mono text-white/40 uppercase tracking-widest">
          <span>{currentSlide.toString().padStart(2, '0')} / {totalSlides.toString().padStart(2, '0')}</span>
        </div>
        {/* Segmented progress — each segment jumps straight to its slide */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Navigation des diapositives">
          {presentationData.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(slide.id)}
              role="tab"
              aria-selected={currentSlide === slide.id}
              aria-label={`Diapositive ${slide.id} — ${slide.title}`}
              title={`${slide.id.toString().padStart(2, '0')} · ${slide.title}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentSlide === slide.id
                  ? 'w-6 bg-primary shadow-[0_0_8px_var(--color-primary)]'
                  : i < currentSlide
                    ? 'w-3 bg-primary/40 hover:bg-primary/80'
                    : 'w-3 bg-white/15 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={nextSlide}
        disabled={currentSlide === totalSlides}
        className="group flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all hover:text-white disabled:opacity-0 text-white/40"
      >
        <span className="hidden md:inline">Suivant</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </footer>
  );
};
