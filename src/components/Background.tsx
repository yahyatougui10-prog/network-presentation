import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from './SlideManager';

const WARRIOR_BGS = [
  'runway10/slide-01.jpg',
  'runway10/slide-02.jpg',
  'runway10/slide-03.jpg',
  'runway10/slide-04.jpg',
  'runway10/slide-05.jpg',
  'runway10/slide-06.jpg',
  'runway10/slide-07.jpg',
  'runway10/slide-08.jpg',
  'runway10/slide-09.jpg',
  'runway10/slide-10.jpg',
];

const ELEVEN_BGS = [
  'runway/bg-01.jpg',
  'runway/bg-02.jpg',
  'runway/bg-03.jpg',
  'runway/bg-04.jpg',
  'runway/bg-05.jpg',
  'runway/bg-06.jpg',
  'runway/bg-07.jpg',
  'runway/bg-08.jpg',
  'runway/bg-09.jpg',
  'runway/bg-10.jpg',
  'runway/bg-11.jpg',
];

export const Background: React.FC = () => {
  const { currentSlide } = usePresentation();
  const bg = [...WARRIOR_BGS, ...ELEVEN_BGS][(currentSlide - 1) % (WARRIOR_BGS.length + ELEVEN_BGS.length)];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-bg">
      {/* Runway backdrop with smooth crossfade + Ken Burns effect */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={bg}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1.14 }}
          exit={{ opacity: 0, scale: 1.18 }}
          transition={{
            opacity: { duration: 1.8, ease: 'easeInOut' },
            scale: { duration: 24, ease: 'linear' },
          }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* No tinting - artwork shows at full strength */}
      {/* Soft vignette only at the very edges to blend with HUD */}
      <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(5,4,11,0.12)] pointer-events-none z-10" />

      {/* Royal Grid Overlay - very faint to keep image visible */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-20"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px),
                            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Scanline effect */}
      <div className="cyber-scanline opacity-5" />

      {/* Floating Royal Glows */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <motion.div
          animate={{
            x: [0, 90, 0],
            y: [0, 45, 0],
            opacity: [0.04, 0.08, 0.04]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -90, 0],
            y: [0, -45, 0],
            opacity: [0.04, 0.08, 0.04]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-ipv6/20 blur-[120px] rounded-full"
        />
      </div>
    </div>
  );
};