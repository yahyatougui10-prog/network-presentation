import React from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { Globe, Server, Zap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Slide01: React.FC = () => {
  return (
    <SlideLayout variant="hero" accentColor="var(--color-primary)">
      <div className="col-span-2 flex flex-col items-center text-center space-y-12 max-w-4xl mx-auto">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-mono-tech uppercase tracking-widest mb-4"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Système Initialisé · Module 01
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
            className="text-[clamp(44px,6vw,64px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text"
          >
            Maîtriser <br />
            <span className="text-primary drop-shadow-[0_0_15px_var(--color-primary)]">L'automatisation IP</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[clamp(18px,2vw,24px)] text-slate-300 max-w-2xl mx-auto leading-[1.4] font-light"
          >
            Plongez au cœur de l'adressage réseau automatique.
            <br />
            <span className="text-slate-500 text-sm uppercase tracking-[0.2em] font-mono-tech">
              Du handshake DHCPv4 à l'autonomie SLAAC IPv6
            </span>
          </motion.p>
        </div >

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 w-full">
          {[
            { label: 'Infrastructure', val: 'Cœur L3', icon: <Server />, desc: 'Architecture centralisée' },
            { label: 'Protocoles', val: 'L2/L3', icon: <Globe />, desc: 'Standard RFC' },
            { label: 'Objectif', val: 'Automatisation', icon: <Zap />, desc: 'Efficacité réseau' },
            { label: 'Norme', val: 'RFC 2131/4862', icon: <BookOpen />, desc: 'Standard industriel' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8 + (i * 0.15), duration: 0.5, ease: "backOut" }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary transition-all duration-500 group-hover:border-primary/60 group-hover:bg-primary/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]">
                {stat.icon}
              </div >
              <div className="flex flex-col items-center">
                <span className="text-[clamp(16px,1.5vw,19px)] font-bold text-white uppercase tracking-tight transition-colors group-hover:text-primary">{stat.val}</span>
                <span className="text-[clamp(11px,1vw,13px)] text-slate-500 uppercase tracking-wider text-center font-mono-tech group-hover:text-slate-300 transition-colors">{stat.label}</span>
              </div >
            </motion.div>
          ))}
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide01;
