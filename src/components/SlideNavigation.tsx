import React from 'react';
import { usePresentation } from './SlideManager';
import { presentationData } from '../data/presentation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const SlideNavigation: React.FC = () => {
  const { currentSlide, nextSlide, prevSlide } = usePresentation();
  const totalSlides = presentationData.length;
  const progress = (currentSlide / totalSlides) * 100;

  return (
    <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-surface/60 backdrop-blur-xl border border-border rounded-full flex items-center gap-8 z-40 shadow-2xl">
      <div className="flex items-center gap-2">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 1}
          className="p-2 rounded-full bg-card border border-border text-muted hover:text-primary hover:border-primary disabled:opacity-30 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides}
          className="p-2 rounded-full bg-card border border-border text-muted hover:text-primary hover:border-primary disabled:opacity-30 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div >

      <div className="h-8 w-px bg-border/50" />

      <div className="flex items-center gap-4">
        <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div >
        <span className="text-[10px] font-mono text-muted uppercase tracking-tighter">
          Slide {currentSlide} / {totalSlides}
        </span >
      </div >
    </footer>
  );
};
