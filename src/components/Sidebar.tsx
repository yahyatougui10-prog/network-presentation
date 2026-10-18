import React from 'react';
import { usePresentation } from './SlideManager';
import { presentationData } from '../data/presentation';

export const Sidebar: React.FC = () => {
  const { currentSlide, setCurrentSlide } = usePresentation();

  return (
    <aside className="h-full w-[35px] bg-transparent flex flex-col items-center py-12 z-40">
      <div className="flex flex-col gap-4">
        {presentationData.map((slide) => {
          const isActive = currentSlide === slide.id;

          return (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(slide.id)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-primary shadow-[0_0_8px_var(--color-primary)] scale-125'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Slide ${slide.id}`}
            />
          );
        })}
      </div >
    </aside>
  );
};
