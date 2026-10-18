import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { NetworkDiagram, type Node, type Link } from '../components/NetworkDiagram';
import { Laptop, Router, PlayCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const nodes: Node[] = [
  { id: 'pc', label: 'PC CLIENT', icon: <Laptop />, x: 200, y: 300 },
  { id: 'rt', label: 'ROUTEUR', icon: <Router />, x: 600, y: 300 },
];

const links: Link[] = [
  { id: 'l1', from: 'pc', to: 'rt' },
];

const Slide06: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [, setAddress] = useState('');
  const [displayAddress, setDisplayAddress] = useState('');

  const chars = '0123456789abcdef:';

  const runSimulation = async () => {
    setIsSimulating(true);
    setStep(0);
    setAddress('');
    setDisplayAddress('');

    await new Promise(r => setTimeout(r, 1500));
    setStep(1);
    await new Promise(r => setTimeout(r, 1500));
    setStep(2);

    const fullAddr = '2001:db8:acad:1:abcd:ef01:2345:6789';
    for (let i = 0; i < fullAddr.length; i++) {
      // Flicker effect: rapid random chars before settling
      for (let j = 0; j < 5; j++) {
        setDisplayAddress(prev => {
          const current = prev || '';
          const next = current.slice(0, i) + chars[Math.floor(Math.random() * chars.length)];
          return next.padEnd(fullAddr.length, '.');
        });
        await new Promise(r => setTimeout(r, 20));
      }
      setAddress(prev => prev + fullAddr.charAt(i));
      setDisplayAddress(prev => prev.slice(0, i) + fullAddr.charAt(i) + prev.slice(i + 1));
      await new Promise(r => setTimeout(r, 30));
    }

    await new Promise(r => setTimeout(r, 2000));
    setStep(3);
    await new Promise(r => setTimeout(r, 2000));
    setIsSimulating(false);
    setStep(0);
    setAddress('');
    setDisplayAddress('');
  };

  const activePath = step <= 2 ? ['l1'] : [];
  const packetColor = step === 0 ? 'var(--color-primary)' : step === 1 ? 'var(--color-success)' : 'var(--color-ipv6)';

  return (
    <SlideLayout variant="standard" accentColor="var(--color-success)">
      {/* Left Column: Logic */}
      <div className="flex flex-col justify-center space-y-10 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Autoconfiguration IPv6</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text">SLAAC</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 leading-[1.4]">Autoconfiguration d'adresse sans état</p>
        </div >

        <div className="space-y-6">
          {[
            { step: 0, text: 'Le client envoie RS pour trouver les routeurs locaux.', color: 'var(--color-primary)' },
            { step: 1, text: 'Le routeur répond avec RA contenant le préfixe.', color: 'var(--color-success)' },
            { step: 2, text: 'Le client génère l\'identifiant d\'interface et construit l\'adresse complète.', color: 'var(--color-ipv6)' },
            { step: 3, text: 'L\'adresse est vérifiée via DAD et marquée PRÊTE.', color: 'var(--color-primary)' },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: step === item.step ? 1 : 0.4,
                x: step === item.step ? 10 : 0,
                scale: step === item.step ? 1.02 : 1
              }}
              className={`flex gap-4 items-center p-3 rounded-xl transition-all duration-300 ${step === item.step ? 'bg-white/5 border-l-4 border-success' : 'border-l-4 border-transparent'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${step === item.step ? 'bg-success text-bg shadow-[0_0_10px_var(--color-success)]' : 'bg-white/10 text-slate-400 border border-white/20'}`}>
                <span className="font-mono text-xs font-bold">{i + 1}</span>
              </div >
              <span className={`text-[clamp(16px,1.5vw,19px)] font-medium transition-colors ${step === item.step ? 'text-white' : 'text-slate-400'}`}>{item.text}</span>
              {step === item.step && (
                <span className="ml-auto text-[10px] font-mono-tech uppercase tracking-widest text-success animate-pulse">Processing</span>
              )}
            </motion.div>
          ))}
        </div >

        <div className="pt-10 border-t border-white/10">
          <div className="glass-panel cyber-border-glow p-6 rounded-2xl border-ipv6/30 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[clamp(13px,1.5vw,15px)] text-slate-400 uppercase tracking-widest font-mono-tech">ADDRESS_GENERATOR // BUFFER_01</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-ipv6 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-ipv6/40" />
              </div >
            </div >
            <div className="text-center py-4">
              <div className="text-4xl md:text-5xl font-mono font-black text-ipv6 tracking-tighter drop-shadow-[0_0_15px_var(--color-ipv6)] transition-all duration-300">
                {displayAddress || '.... .... .... ....'}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1 h-10 bg-ipv6 ml-1"
                />
              </div >
            </div >
            <div className="mt-4 flex justify-center">
               <span className={`text-[10px] font-mono-tech uppercase tracking-widest ${isSimulating ? 'text-ipv6 animate-pulse' : 'text-slate-500'}`}>
                 {isSimulating ? 'Computing Interface ID...' : 'System Ready'}
               </span>
            </div >
          </div >
        </div >
      </div >

      {/* Right Column: Simulation */}
      <div className="flex items-center justify-center relative h-full">
        <div className="w-full h-full relative flex flex-col items-center justify-center" style={{ width: 'min(42vw, 650px)', maxHeight: '65vh' }}>
          <div className="w-full h-full relative scale-110 glass-panel cyber-border-glow rounded-3xl p-8 flex flex-col items-center justify-center border-success/30">
            <div className="w-full h-full relative">
              <NetworkDiagram
                nodes={nodes}
                links={links}
                activePath={activePath}
                packetColor={packetColor}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="px-6 py-2 bg-primary text-bg rounded-full font-bold hover:bg-cyan transition-all flex items-center gap-2 disabled:opacity-30 text-[clamp(13px,1.5vw,15px)] uppercase tracking-widest font-mono-tech"
                >
                  <PlayCircle className="w-4 h-4" />
                  {isSimulating ? 'Simulation...' : 'Lancer'}
                </button>
                <button
                  onClick={() => { setStep(0); setAddress(''); setIsSimulating(false); }}
                  className="p-2 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div >
            </div >
          </div >
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide06;
