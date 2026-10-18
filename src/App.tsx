import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PresentationProvider, usePresentation } from './components/SlideManager';
import { TopBar } from './components/TopBar';
import { BottomBar } from './components/BottomBar';
import { Background } from './components/Background';
import { CinematicIntro } from './components/CinematicIntro';

// Import slides
import Slide01 from './slides/Slide01';
import Slide02 from './slides/Slide02';
import Slide03 from './slides/Slide03';
import Slide04 from './slides/Slide04';
import Slide05 from './slides/Slide05';
import Slide06 from './slides/Slide06';
import Slide07 from './slides/Slide07';
import Slide08 from './slides/Slide08';
import Slide09 from './slides/Slide09';
import Slide10 from './slides/Slide10';

const slides = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07, Slide08, Slide09, Slide10];

const PresentationContent: React.FC<{ introFinished: boolean }> = ({ introFinished }) => {
  const { currentSlide, setViewMode } = usePresentation();
  const [scale, setScale] = useState(1);
  const [direction, setDirection] = useState(1);
  const prevSlideRef = useRef(currentSlide);

  // Once the intro is over, enable keyboard/navigation interactions.
  useEffect(() => {
    if (introFinished) setViewMode('PRESENT');
  }, [introFinished, setViewMode]);

  useEffect(() => {
    if (currentSlide !== prevSlideRef.current) {
      setDirection(currentSlide > prevSlideRef.current ? 1 : -1);
      prevSlideRef.current = currentSlide;
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1920;
      const targetHeight = 1080;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const scaleX = windowWidth / targetWidth;
      const scaleY = windowHeight / targetHeight;
      setScale(Math.min(scaleX, scaleY));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-bg text-text">
      <Background />
      {/* Thin CRT/Scanner overlay for aesthetic, kept minimal */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="relative bg-bg shrink-0 overflow-hidden"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: '1920px',
            height: '1080px',
          }}
        >
          <div className="w-full h-full flex flex-col relative z-10">
          <TopBar />

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar completely removed as per "no large sidebar" request */}
            <main className="flex-1 relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 30 }}
                  transition={{
                    x: { duration: 0.4, ease: 'easeOut' },
                    opacity: { duration: 0.3 },
                  }}
                  className="w-full h-full flex items-center justify-center"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {(() => {
                    const SlideComponent = slides[currentSlide - 1];
                    return SlideComponent ? <SlideComponent /> : <div className="text-white">Slide not found</div>;
                  })()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div >

          <BottomBar />

          {/* Cinematic transition flash + light sweep */}
          <motion.div
            key={`flash-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.12, 0] }}
            transition={{ duration: 0.6, times: [0, 0.2, 1], ease: 'easeInOut' }}
            className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.2), rgba(10,8,20,0) 70%)',
            }}
          >
            <motion.div
              initial={{ x: direction === 1 ? '-20vw' : '120vw' }}
              animate={{ x: direction === 1 ? '120vw' : '-20vw' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-[20vw]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
            />
          </motion.div>
        </div >
      </div >
    </div >
    </div >
  );
};

const App: React.FC = () => {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-bg">
      {!introFinished && <CinematicIntro onComplete={() => setIntroFinished(true)} />}
      <PresentationProvider>
        <PresentationContent introFinished={introFinished} />
      </PresentationProvider>
    </div >
  );
};

export default App;
