import React from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ShieldCheck, Globe, Activity } from 'lucide-react';

const laSummary = [
  { title: 'DHCPv4', content: 'Configuration automatique IPv4 via le processus DORA.', color: 'text-primary', accent: 'var(--color-primary)' },
  { title: 'SLAAC', content: 'Création autonome d\'adresses IPv6 via messages RA.', color: 'text-success', accent: 'var(--color-success)' },
  { title: 'DHCPv6 Stateless', content: 'SLAAC pour l\'adresse + DHCPv6 pour les options.', color: 'text-cyan', accent: 'var(--color-cyan)' },
  { title: 'DHCPv6 Stateful', content: 'Configuration complète fournie par le serveur DHCPv6.', color: 'text-ipv6', accent: 'var(--color-ipv6)' },
  { title: 'DHCP Relay', content: 'Pontage des requêtes DHCP à travers différents sous-réseaux.', color: 'text-warning', accent: 'var(--color-warning)' },
];

const Slide10: React.FC = () => {
  return (
    <SlideLayout variant="standard" accentColor="var(--color-primary)">
      <div className="col-span-2 flex flex-col items-center justify-center text-center space-y-8 h-full">
        <div className="space-y-6 relative">
          <div className="flex items-center justify-center gap-3 text-primary text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] mb-4 font-mono-tech">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <BookOpen className="w-3 h-3" />
            </div >
            <span>SESSION_SUMMARY // MODULE_01_COMPLETE</span>
          </div >
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text">Carte des Connaissances</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_var(--color-primary)]" />
        </div >

        {/* Knowledge Grid - Tactical Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative w-full px-8">
          {laSummary.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center space-y-4 group"
            >
              <div className="glass-panel cyber-border-glow p-4 rounded-2xl border-white/10 group-hover:border-primary/40 transition-all duration-500 w-full h-full flex flex-col items-center justify-center gap-4">
                <div
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 relative"
                  style={{ color: item.accent }}
                >
                  <CheckCircle className="w-6 h-6" />
                  <div className="absolute inset-0 rounded-full animate-pulse opacity-20" style={{ boxShadow: `0 0 15px ${item.accent}` }} />
                </div >
                <div className="flex flex-col gap-1">
                  <span className={`font-black text-[clamp(14px,1.2vw,16px)] uppercase tracking-tighter ${item.color}`}>
                    {item.title}
                  </span>
                  <p className="text-[clamp(11px,1vw,13px)] text-slate-400 leading-tight max-w-[120px] mx-auto font-mono-tech">
                    {item.content}
                  </p>
                </div >
              </div >
            </motion.div>
          ))}
        </div >

        {/* Strategic Recommendations */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-8 pt-6">
          {[
            { title: 'Sécurité L2', desc: 'Implémentation obligatoire de DHCP Snooping pour bloquer les serveurs frauduleux.', icon: <ShieldCheck className="w-5 h-5" />, color: 'var(--color-primary)' },
            { title: 'Stratégie IPv6', desc: 'DHCPv6 Stateless pour le standard, Stateful pour les segments critiques/audit.', icon: <Globe className="w-5 h-5" />, color: 'var(--color-ipv6)' },
            { title: 'Haute Disponibilité', desc: 'Utilisation systématique des interfaces Loopback pour la supervision stable.', icon: <Activity className="w-5 h-5" />, color: 'var(--color-success)' },
          ].map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + (i * 0.2) }}
              className="p-4 rounded-2xl glass-panel cyber-border-glow border-white/10 flex flex-col items-center text-center space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center" style={{ color: rec.color }}>
                {rec.icon}
              </div >
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">{rec.title}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed font-mono-tech">{rec.desc}</p>
            </motion.div>
          ))}
        </div >

        {/* Final Cinematic Footer */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-6 w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan to-primary rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative px-8 py-6 bg-bg border border-white/10 rounded-2xl backdrop-blur-xl">
              <p className="text-[clamp(20px,2.5vw,28px)] text-white font-medium italic leading-relaxed drop-shadow-sm">
                "L'automatisation réseau est le pont entre la configuration manuelle et l'infrastructure évolutive."
              </p>
            </div >
          </motion.div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-1 rounded-full border border-white/10 bg-white/5 font-mono-tech text-[10px] text-slate-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              System Status: Disconnecting...
            </div >
            <span className="text-[clamp(11px,1vw,13px)] text-slate-600 uppercase font-bold tracking-[0.5em]">
              — NET/LEARN OS v4.2.0
            </span>
          </div >
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide10;
