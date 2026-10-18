import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Info, PlayCircle, Router, Laptop, Activity, ShieldCheck } from 'lucide-react';
import { NetworkDiagram, type Node, type Link } from '../components/NetworkDiagram';

const MODES = [
  { id: 'SLAAC', flags: { A: 1, O: 0, M: 0 }, desc: 'Le client utilise SLAAC pour configurer son adresse et ses autres paramètres localement.', technical: 'RA (A=1, O=0, M=0) -> Client génère Interface ID' },
  { id: 'STATELESS', flags: { A: 1, O: 1, M: 0 }, desc: 'SLAAC pour l\'adressage, mais DHCPv6 est utilisé pour les autres informations (DNS, domaine).', technical: 'RA (A=1, O=1, M=0) -> Client demande Options via DHCPv6' },
  { id: 'STATEFUL', flags: { A: 0, O: 0, M: 1 }, desc: 'Le serveur DHCPv6 gère la configuration complète, y compris l\'adresse.', technical: 'RA (A=0, O=0, M=1) -> Client demande Adresse via DHCPv6' },
];

const nodes: Node[] = [
  { id: 'router', label: 'ROUTEUR', icon: <Router />, x: 200, y: 300 },
  { id: 'client', label: 'CLIENT', icon: <Laptop />, x: 800, y: 300 },
];

const links: Link[] = [
  { id: 'r-c', from: 'router', to: 'client' },
];

const Slide07: React.FC = () => {
  const [config, setConfig] = useState({ A: 1, O: 0, M: 0 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<'IDLE' | 'SENDING' | 'RECEIVED'>('IDLE');

  const currentMode = MODES.find(m =>
    m.flags.A === config.A && m.flags.O === config.O && m.flags.M === config.M
  ) || { id: 'CUSTOM', desc: 'Configuration non standard', technical: ' la configuration ne correspond à aucun mode standard.' };

  const runSimulation = async () => {
    setIsSimulating(true);
    setSimulationStep('SENDING');
    await new Promise(r => setTimeout(r, 1500));
    setSimulationStep('RECEIVED');
    await new Promise(r => setTimeout(r, 2000));
    setSimulationStep('IDLE');
    setIsSimulating(false);
  };

  const activePath = simulationStep !== 'IDLE' ? ['r-c'] : [];
  const packetColor = 'var(--color-ipv6)';

  return (
    <SlideLayout variant="standard" accentColor="var(--color-ipv6)">
      {/* Left: Controls */}
      <div className="flex flex-col justify-center space-y-10 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Routage IPv6</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text">Drapeaux A / O / M</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 mt-2 leading-[1.4]">Détermination du mode de configuration IPv6</p>
        </div >

        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-4 text-[clamp(13px,1.5vw,15px)] font-bold text-primary uppercase tracking-[0.3em] opacity-80">
            <Settings className="w-4 h-4" />
            <span className="font-mono-tech">Drapeaux de contrôle RA</span>
          </div >

          <div className="space-y-4">
            {[
              { key: 'A', label: 'Autonome', desc: 'SLAAC autorisé' },
              { key: 'O', label: 'Autre config', desc: 'DHCPv6 pour infos' },
              { key: 'M', label: 'Géré', desc: 'DHCPv6 pour l\'adresse' },
            ].map((flag) => (
              <div key={flag.key} className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 glass-panel ${
                config[flag.key as keyof typeof config] ? 'border-ipv6/60 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'border-white/10'
              }`}>
                <div className="flex flex-col">
                  <span className={`text-xl font-black transition-colors ${config[flag.key as keyof typeof config] ? 'text-ipv6' : 'text-slate-400'}`}>{flag.key}</span>
                  <span className="text-[clamp(13px,1.5vw,15px)] text-slate-400 uppercase font-bold tracking-widest">{flag.label}</span>
                </div >

                <button
                  onClick={() => setConfig(prev => ({ ...prev, [flag.key]: prev[flag.key as keyof typeof config] === 1 ? 0 : 1 }))}
                  role="switch"
                  aria-checked={config[flag.key as keyof typeof config] === 1}
                  aria-label={`Drapeau ${flag.key} — ${flag.label}`}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${config[flag.key as keyof typeof config] ? 'bg-ipv6 shadow-[0_0_10px_var(--color-ipv6)]' : 'bg-white/10'}`}
                >
                  <motion.div
                    animate={{ x: config[flag.key as keyof typeof config] ? 24 : 4 }}
                    className={`absolute top-1 w-4 h-4 rounded-full shadow-md transition-colors ${config[flag.key as keyof typeof config] ? 'bg-white' : 'bg-white/20'}`}
                  />
                </button>
              </div >
            ))}
          </div >
        </div >

        <div className="flex items-center justify-between p-6 glass-panel rounded-2xl transition-all border-primary/30 cyber-border-glow">
          <div className="flex flex-col">
            <span className="text-[clamp(13px,1.5vw,15px)] uppercase text-slate-400 font-bold tracking-widest mb-1 font-mono-tech">Mode Actuel</span>
            <span className={`text-4xl font-black transition-colors duration-500 ${currentMode.id !== 'CUSTOM' ? 'text-primary' : 'text-slate-500'}`}>{currentMode.id}</span>
          </div >
          <div className="flex gap-3 text-xs font-mono-tech font-bold">
            <span className={`px-2 py-1 rounded-md transition-colors ${config.A ? 'bg-ipv6/20 text-ipv6 border border-ipv6/30' : 'text-slate-500'}`}>A={config.A}</span>
            <span className={`px-2 py-1 rounded-md transition-colors ${config.O ? 'bg-ipv6/20 text-ipv6 border border-ipv6/30' : 'text-slate-500'}`}>O={config.O}</span>
            <span className={`px-2 py-1 rounded-md transition-colors ${config.M ? 'bg-ipv6/20 text-ipv6 border border-ipv6/30' : 'text-slate-500'}`}>M={config.M}</span>
          </div >
        </div >
      </div >

      {/* Right: Simulation Panel */}
      <div className="flex items-center justify-center relative h-full">
        <div className="w-full h-full relative flex flex-col justify-center p-12" style={{ width: 'min(42vw, 650px)', maxHeight: '80vh' }}>

          <div className="w-full h-40 relative scale-110 mb-16">
            <NetworkDiagram
              nodes={nodes}
              links={links}
              activePath={activePath}
              packetColor={packetColor}
            />
          </div >

          <AnimatePresence mode="wait">
            <motion.div
              key={currentMode.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-auto flex flex-col justify-center glass-panel p-8 rounded-3xl border-ipv6/30 overflow-hidden"
            >
              {/* Scanning Line Effect */}
              {isSimulating && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-px bg-ipv6/40 z-10 pointer-events-none"
                />
              )}

              <div className="absolute top-0 right-0 opacity-10">
                <Info className="w-24 h-24 text-ipv6" />
              </div >
              <div className="flex items-center gap-3 mb-4 text-ipv6/60 uppercase tracking-widest text-xs font-mono-tech">
                <Activity className="w-3 h-3" />
                <span>Analyse du flux RA...</span>
              </div >
              <h3 className="relative z-10 text-[clamp(44px,4vw,56px)] font-black text-white mb-8 uppercase tracking-tighter glitch-text">
                {currentMode.id === 'CUSTOM' ? 'Non standard' : currentMode.id}
              </h3>
              <p className="relative z-10 text-[clamp(18px,2vw,20px)] text-slate-200 leading-relaxed mb-6 max-w-xl">
                {currentMode.desc}
              </p>
              <div className="relative z-10 p-4 bg-bg/40 rounded-xl border border-border/30 font-mono-tech text-xs text-primary/80 mb-8">
                <span className="text-white/40 block mb-1 uppercase tracking-tighter font-bold">[ Technical Spec ]</span>
                {currentMode.technical}
              </div >
              {currentMode.id !== 'CUSTOM' && (
                <div className="relative z-10 flex items-center gap-4 px-5 py-2 bg-success/10 border border-success/30 rounded-full text-success font-bold uppercase text-[clamp(13px,1.5vw,15px)] tracking-widest w-fit">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-mono-tech">Configuration Validée</span>
                </div >
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-12">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="px-8 py-3 bg-primary text-bg rounded-full font-bold hover:bg-cyan transition-all flex items-center gap-3 disabled:opacity-30 shadow-xl uppercase text-[clamp(13px,1.5vw,15px)] tracking-widest font-mono-tech"
            >
              <PlayCircle className="w-5 h-5" />
              {isSimulating ? 'Simulation en cours...' : 'Lancer Simulation RA'}
            </button>
          </div >
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide07;
