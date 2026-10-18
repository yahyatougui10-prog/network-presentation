import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { motion } from 'framer-motion';
import { Database, Layers } from 'lucide-react';

const Slide09: React.FC = () => {
  const [isStateful, setIsStateful] = useState(false);

  return (
    <SlideLayout variant="standard" accentColor="var(--color-ipv6)">
      {/* Background HUD elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div >

      {/* Header Area */}
      <div className="col-span-2 mb-16 max-w-3xl">
        <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Stratégies IPv6</h3>
        <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1]">Sans état vs Avec état</h2>
        <p className="text-[clamp(18px,2vw,20px)] text-slate-300 mt-2 leading-[1.4]">Deux approches de l'adressage IPv6</p>
      </div >

      {/* Content Area - Split in 2 */}
      <div className="col-span-2 flex flex-col h-full justify-center">
        {/* High-Fidelity Comparison Toggle */}
        <div className="flex items-center justify-center gap-12 mb-20">
          <span className={`text-[clamp(13px,1.5vw,15px)] font-black uppercase tracking-[0.3em] transition-all duration-500 ${!isStateful ? 'text-primary scale-110 drop-shadow-[0_0_8px_var(--color-primary)]' : 'text-slate-500'}`}>Sans état</span>
          <button
            onClick={() => setIsStateful(!isStateful)}
            role="switch"
            aria-checked={isStateful}
            aria-label="Basculer entre configuration sans état et avec état"
            className="w-24 h-12 bg-white/5 border border-white/20 rounded-full relative p-1 transition-all hover:border-primary/50 group"
          >
            <motion.div
              animate={{ x: isStateful ? 48 : 0 }}
              className="w-10 h-10 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)] group-hover:scale-110 transition-transform"
            />
          </button>
          <span className={`text-[clamp(13px,1.5vw,15px)] font-black uppercase tracking-[0.3em] transition-all duration-500 ${isStateful ? 'text-ipv6 scale-110 drop-shadow-[0_0_8px_var(--color-ipv6)]' : 'text-slate-500'}`}>Avec état</span>
        </div >

        {/* Comparison Matrix - Tactical HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Stateless Side */}
          <motion.div
            animate={{
              opacity: !isStateful ? 1 : 0.3,
              scale: !isStateful ? 1.02 : 1,
              x: !isStateful ? 0 : -10
            }}
            className="flex flex-col space-y-6"
          >
            <div className="flex items-center gap-4 text-primary text-3xl font-black uppercase tracking-tighter mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(167,139,250,0.2)]">
                <Layers className="w-5 h-5" />
              </div >
              <span>SLAAC / Stateless</span>
            </div >

            <div className="space-y-3">
              {[
                { label: 'Gestion état', val: 'Sans état (Host-based)', color: 'text-slate-300' },
                { label: 'Attribution IP', val: 'Auto-générée (Préfixe)', color: 'text-success' },
                { label: 'Paramètres', val: 'Basiques (Préfixe/Passerelle)', color: 'text-slate-300' },
                { label: 'Contrôle Admin', val: 'Faible (Décentralisé)', color: 'text-slate-300' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center p-3 glass-panel cyber-border-glow border-primary/20 rounded-xl font-mono text-xs">
                  <span className="text-slate-500 uppercase font-bold tracking-widest">{row.label}</span>
                  <span className={`font-bold ${row.color}`}>{row.val}</span>
                </div >
              ))}
            </div >

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl font-mono text-[clamp(13px,1.5vw,15px)] text-primary text-center font-bold uppercase tracking-widest">
              Configuration : <span className="text-sm">A=1, O=1, M=0</span>
            </div >
          </motion.div>

          {/* Stateful Side */}
          <motion.div
            animate={{
              opacity: isStateful ? 1 : 0.3,
              scale: isStateful ? 1.02 : 1,
              x: isStateful ? 0 : 10
            }}
            className="flex flex-col space-y-6"
          >
            <div className="flex items-center gap-4 text-ipv6 text-3xl font-black uppercase tracking-tighter mb-4">
              <div className="w-10 h-10 rounded-full bg-ipv6/10 border border-ipv6/30 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Database className="w-5 h-5" />
              </div >
              <span>DHCPv6 Stateful</span>
            </div >

            <div className="space-y-3">
              {[
                { label: 'Gestion état', val: 'Avec état (Server-based)', color: 'text-slate-300' },
                { label: 'Attribution IP', val: 'Attribuée par le Serveur', color: 'text-ipv6' },
                { label: 'Paramètres', val: 'Configuration complète', color: 'text-slate-300' },
                { label: 'Contrôle Admin', val: 'Très élevé (Audit/Baux)', color: 'text-ipv6' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center p-3 glass-panel cyber-border-glow border-ipv6/20 rounded-xl font-mono text-xs">
                  <span className="text-slate-500 uppercase font-bold tracking-widest">{row.label}</span>
                  <span className={`font-bold ${row.color}`}>{row.val}</span>
                </div >
              ))}
            </div >

            <div className="p-4 bg-ipv6/10 border border-ipv6/20 rounded-xl font-mono text-[clamp(13px,1.5vw,15px)] text-ipv6 text-center font-bold uppercase tracking-widest">
              Configuration : <span className="text-sm">A=0, O=0, M=1</span>
            </div >
          </motion.div>
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide09;
