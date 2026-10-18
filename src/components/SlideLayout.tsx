import React, { useState, useEffect } from 'react';
import { type ReactNode } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Cpu, Activity, ShieldCheck } from 'lucide-react';

interface SlideLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  variant?: 'hero' | 'standard'
  accentColor?: string
  wallpaper?: string
}

export const SlideLayout: React.FC<SlideLayoutProps> = ({ children, wallpaper }) => {
  // Resolve public/ assets against the deploy base path (works both at '/' and on GitHub Pages sub-paths)
  const resolveAsset = (path: string) =>
    path.startsWith('/') ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}` : path;
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Parallax Mouse Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const bgX = useTransform(springX, [-500, 500], [-20, 20]);
  const bgY = useTransform(springY, [-500, 500], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full relative overflow-hidden bg-bg"
    >
      {/* Layer 0: Parallax Artwork */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          x: bgX,
          y: bgY,
          scale: 1.1,
          backgroundImage: `url(${resolveAsset(wallpaper || '/wallpapers/slide08.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Layer 1: Cyber Effects */}
      <div className="cyber-noise" />
      <div className="cyber-scanline" />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(10,5,20,0.4) 100%)'
        }}
      />

      {/* Layer 2: Readability overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(7,5,18,0.92) 0%, rgba(7,5,18,0.72) 42%, rgba(7,5,18,0.30) 75%, rgba(7,5,18,0.15) 100%)'
        }}
      />

      {/* Layer 3: Technical Frame */}
      <div className="absolute inset-0 z-30 pointer-events-none border-[1px] border-border/20 m-4">
        {/* Corners with data markers */}
        <div className="absolute top-0 left-0 w-12 h-12">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40" />
          <div className="absolute top-8 left-0 w-px h-4 bg-primary/20" />
          <div className="absolute top-0 left-8 w-4 h-px bg-primary/20" />
        </div >
        <div className="absolute top-0 right-0 w-12 h-12">
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40" />
          <div className="absolute top-8 right-0 w-px h-4 bg-primary/20" />
          <div className="absolute top-0 right-0 w-4 h-px bg-primary/20" />
        </div >
        <div className="absolute bottom-0 left-0 w-12 h-12">
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40" />
          <div className="absolute bottom-8 left-0 w-px h-4 bg-primary/20" />
          <div className="absolute bottom-0 left-0 w-4 h-px bg-primary/20" />
        </div >
        <div className="absolute bottom-0 right-0 w-12 h-12">
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40" />
          <div className="absolute bottom-8 right-0 w-px h-4 bg-primary/20" />
          <div className="absolute bottom-0 right-0 w-4 h-px bg-primary/20" />
        </div >

        {/* Edge accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* HUD Bottom-Left: System Status (kept out of the content safe area) */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          <div className="flex items-center gap-3 px-3 py-1 rounded-sm border border-primary/20 bg-bg/40 backdrop-blur-md">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-primary/80">System: Nominal</span>
          </div >
          <div className="flex items-center gap-3 px-3 py-1 rounded-sm border border-primary/10 bg-bg/20 backdrop-blur-md">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-400">Core_Load: 14%</span>
          </div >
        </div >

        {/* HUD Bottom-Right: Time & Sync */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          <div className="flex items-center gap-3 px-3 py-1 rounded-sm border border-primary/10 bg-bg/20 backdrop-blur-md">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-400">Sync_Status: Locked</span>
          </div >
          <div className="flex items-center gap-3 px-3 py-1 rounded-sm border border-primary/20 bg-bg/40 backdrop-blur-md">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-primary/80">{time}</span>
            <ShieldCheck className="w-3 h-3 text-primary" />
          </div >
        </div >

        {/* HUD Slide Index */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-1 rounded-full border border-border/40 bg-bg/60 backdrop-blur-md">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-primary/60">Sess_ID: 0x4F2A</span>
          <div className="w-px h-3 bg-border/40" />
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-white/80">Module 01 / Phase_Alpha</span>
        </div >
      </div >

      {/* Layer 4: Content viewport */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 z-20"
        style={{
          padding: 'clamp(16px, 4vh, 40px) clamp(48px, 6vw, 110px) clamp(24px, 5vh, 56px)',
        }}
      >
        <div
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: 'minmax(0, 0.92fr) minmax(0, 1.08fr)',
            columnGap: 'clamp(32px, 4vw, 80px)',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          {children}
        </div >
      </motion.div>
    </motion.div>
  );
};
