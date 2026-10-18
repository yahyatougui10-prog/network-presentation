import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Zap, Database, Activity } from 'lucide-react';

const Slide05: React.FC = () => {
  const [hoveredPart, setHoveredPart] = useState<'prefix' | 'interface' | null>(null);

  const address = "2001:0db8:acad:0001:0000:0000:0000:0001";
  const parts = address.split(':');
  const prefixParts = parts.slice(0, 4).join(':');
  const interfaceParts = parts.slice(4).join(':');

  const togglePart = (part: 'prefix' | 'interface') =>
    setHoveredPart(prev => (prev === part ? null : part));

  const partKeyDown = (part: 'prefix' | 'interface') => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePart(part);
    }
  };

  return (
    <SlideLayout variant="standard" accentColor="var(--color-ipv6)">
      {/* Left Column: Tactical Anatomy */}
      <div className="flex flex-col justify-center space-y-12 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 font-mono-tech">Architecture IPv6 // Spec_05</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text">Anatomie d'une Adresse</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 leading-[1.4]">Analyse structurelle des 128 bits de l'identifiant réseau.</p>
        </div >

        <div className="relative flex flex-col gap-10">
          <div className="flex flex-wrap justify-center items-baseline gap-x-2 font-mono text-3xl md:text-5xl font-black tracking-tighter text-center">
            <motion.span
              onMouseEnter={() => setHoveredPart('prefix')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => togglePart('prefix')}
              onKeyDown={partKeyDown('prefix')}
              role="button"
              tabIndex={0}
              aria-pressed={hoveredPart === 'prefix'}
              aria-label="Explorer le préfixe réseau"
              className={`cursor-help transition-all duration-500 px-2 rounded relative ${hoveredPart === 'prefix' ? 'text-ipv6 scale-110 drop-shadow-[0_0_15px_var(--color-ipv6)]' : 'text-white'}`}
            >
              {prefixParts}
              {hoveredPart === 'prefix' && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono-tech uppercase text-ipv6 whitespace-nowrap"
                >
                  Network Prefix
                </motion.div>
              )}
            </motion.span>
            <span className="text-white/30">:</span>
            <motion.span
              onMouseEnter={() => setHoveredPart('interface')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => togglePart('interface')}
              onKeyDown={partKeyDown('interface')}
              role="button"
              tabIndex={0}
              aria-pressed={hoveredPart === 'interface'}
              aria-label="Explorer l'identifiant d'interface"
              className={`cursor-help transition-all duration-500 px-2 rounded relative ${hoveredPart === 'interface' ? 'text-cyan scale-110 drop-shadow-[0_0_15px_var(--color-cyan)]' : 'text-white'}`}
            >
              {interfaceParts}
              {hoveredPart === 'interface' && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono-tech uppercase text-cyan whitespace-nowrap"
                >
                  Interface ID
                </motion.div>
              )}
            </motion.span>
            <span className="text-primary ml-4">/64</span>
          </div >

          <div className="flex gap-12 justify-center">
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${hoveredPart === 'prefix' ? 'text-ipv6 scale-110' : 'text-slate-400 opacity-50'}`}>
              <span className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-widest font-mono-tech">Préfixe réseau</span>
              <span className="text-2xl font-mono font-black">64 bits</span>
            </div >
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${hoveredPart === 'interface' ? 'text-cyan scale-110' : 'text-slate-400 opacity-50'}`}>
              <span className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-widest font-mono-tech">Identifiant d'interface</span>
              <span className="text-2xl font-mono font-black">64 bits</span>
            </div >
          </div >
        </div >
      </div >

      {/* Right Column: Technical Inspector */}
      <div className="flex flex-col justify-center relative h-full">
        <div className="relative min-h-[350px] flex flex-col justify-center max-w-lg">
          <AnimatePresence mode="wait">
            {hoveredPart === 'prefix' ? (
              <motion.div
                key="prefix-info"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6 glass-panel cyber-border-glow p-8 rounded-3xl border-ipv6/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-ipv6 font-black text-2xl uppercase tracking-tighter">
                    <Globe className="w-6 h-6" /> <span>Préfixe Global</span>
                  </div >
                  <span className="text-[10px] font-mono-tech px-2 py-1 rounded bg-ipv6/20 text-ipv6 border border-ipv6/30">STATUS: ACTIVE</span>
                </div >
                <p className="text-slate-200 leading-relaxed text-[clamp(16px,1.8vw,18px)] font-medium">
                  Le préfixe identifie le réseau à l'échelle mondiale. Il est généralement attribué par
                  un FAI et permet d'acheminer le paquet sur Internet.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Scope</span>
                    <span className="text-sm font-mono-tech text-white">Global Unicast</span>
                  </div >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Bit Length</span>
                    <span className="text-sm font-mono-tech text-white">64 Bits</span>
                  </div >
                </div >
              </motion.div>
            ) : hoveredPart === 'interface' ? (
              <motion.div
                key="interface-info"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6 glass-panel cyber-border-glow p-8 rounded-3xl border-cyan/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-cyan font-black text-2xl uppercase tracking-tighter">
                    <Zap className="w-6 h-6" /> <span>Interface ID</span>
                  </div >
                  <span className="text-[10px] font-mono-tech px-2 py-1 rounded bg-cyan/20 text-cyan border border-cyan/30">STATUS: UNIQUE</span>
                </div >
                <p className="text-slate-200 leading-relaxed text-[clamp(16px,1.8vw,18px)] font-medium">
                  L'identifiant d'interface identifie de manière unique un appareil sur ce réseau.
                  Il peut être généré aléatoirement ou dérivé de l'adresse MAC (EUI-64).
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Generation</span>
                    <span className="text-sm font-mono-tech text-white">Random / EUI-64</span>
                  </div >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Bit Length</span>
                    <span className="text-sm font-mono-tech text-white">64 Bits</span>
                  </div >
                </div >
              </motion.div>
            ) : (
              <motion.div
                key="default-info"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center space-y-12"
              >
                <div className="glass-panel p-10 rounded-3xl border-white/10 space-y-8">
                  <p className="text-slate-400 italic text-[clamp(18px,2vw,20px)] font-light">
                    Survolez ou cliquez une partie de l'adresse pour explorer son anatomie.
                  </p>
                  <div className="flex justify-center gap-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-2">
                        <Database className="w-5 h-5" />
                      </div >
                      <span className="block text-[clamp(13px,1.5vw,15px)] uppercase text-slate-500 font-bold tracking-widest">Unicast global</span>
                      <span className="font-mono text-primary font-black text-lg">2000::/3</span>
                    </div >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan mb-2">
                        <Activity className="w-5 h-5" />
                      </div >
                      <span className="block text-[clamp(13px,1.5vw,15px)] uppercase text-slate-500 font-bold tracking-widest">Lien-local</span>
                      <span className="font-mono text-cyan font-black text-lg">fe80::/10</span>
                    </div >
                  </div >
                </div >
              </motion.div>
            )}
          </AnimatePresence>
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide05;
