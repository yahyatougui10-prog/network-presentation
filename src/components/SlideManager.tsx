import React, { createContext, useContext, useState, useEffect } from 'react';
import { presentationData } from '../data/presentation';

export type ViewMode = 'INTRO' | 'BROWSE' | 'PRESENT';

interface PresentationContextType {
  currentSlide: number;
  viewMode: ViewMode;
  setCurrentSlide: (slide: number) => void;
  setViewMode: (mode: ViewMode) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  toggleFullscreen: () => void;
  restartAnimation: () => void;
  showHelp: (show: boolean) => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export const PresentationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('INTRO');

  const totalSlides = presentationData.length;

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 1));

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err: unknown) {
        console.error(`Error attempting to enable full-screen mode: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const restartAnimation = () => {
    window.dispatchEvent(new CustomEvent('restart-animation'));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'INTRO') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setViewMode('BROWSE');
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'r' || e.key === 'R') {
        restartAnimation();
      } else if (e.key === 'Home') {
        setCurrentSlide(1);
      } else if (e.key === 'End') {
        setCurrentSlide(totalSlides);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, nextSlide, prevSlide, totalSlides]);

  return (
    <PresentationContext.Provider value={{ 
      currentSlide, 
      viewMode, 
      setCurrentSlide, 
      setViewMode, 
      nextSlide, 
      prevSlide, 
      toggleFullscreen, 
      restartAnimation,
      showHelp: () => undefined 
    }}>
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) throw new Error('usePresentation must be used within a PresentationProvider');
  return context;
};
