import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Minimize } from 'lucide-react';
import { usePresentation } from './SlideManager';
import { presentationData } from '../data/presentation';

export const TopBar: React.FC = () => {
  const { currentSlide, toggleFullscreen } = usePresentation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const meta = presentationData[currentSlide - 1];

  return (
    <header
      className="w-full bg-transparent flex items-center justify-between px-12 z-50 relative"
      style={{ height: '52px', paddingTop: '8px' }}
    >
      {/* Left: Deck Indicator */}
      <div className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.3em] text-white/30">
        <span className="text-primary/80">PRÉSENTATION DHCP</span>
        <span className="opacity-30">/</span>
        <span>MODULE 01</span>
      </div>

      {/* Right: Current Section + Slide Number + Fullscreen */}
      <div className="flex items-center gap-5">
        {meta && (
          <motion.span
            key={currentSlide}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="hidden md:inline text-[13px] font-bold uppercase tracking-[0.3em] text-white/40"
          >
            {meta.title}
          </motion.span>
        )}
        <span className="text-[13px] font-mono font-black text-white/20 uppercase tracking-widest">
          S{currentSlide.toString().padStart(2, '0')}
        </span>
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Quitter le plein écran (F)' : 'Passer en plein écran (F)'}
          title={isFullscreen ? 'Quitter le plein écran (F)' : 'Plein écran (F)'}
          className="p-1 rounded-md text-white/20 hover:text-white hover:bg-white/5 transition-colors"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
