import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { NetworkDiagram, type Node, type Link } from '../components/NetworkDiagram';
import { Server, Router, Laptop, AlertCircle, PlayCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const nodes: Node[] = [
  { id: 'client', label: 'CLIENT', icon: <Laptop />, x: 200, y: 300 },
  { id: 'router', label: 'RELAIS', icon: <Router />, x: 500, y: 300 },
  { id: 'server', label: 'SERVEUR', icon: <Server />, x: 800, y: 300 },
];

const links: Link[] = [
  { id: 'l1', from: 'client', to: 'router' },
  { id: 'l2', from: 'router', to: 'server' },
];

const Slide04: React.FC = () => {
  const [simulationStep, setSimulationStep] = useState<'IDLE' | 'DISCOVER' | 'RELAY' | 'OFFER'>('IDLE');

  const runSimulation = async () => {
    setSimulationStep('DISCOVER');
    await new Promise(r => setTimeout(r, 1500));
    setSimulationStep('RELAY');
    await new Promise(r => setTimeout(r, 1500));
    setSimulationStep('OFFER');
    await new Promise(r => setTimeout(r, 2000));
    setSimulationStep('IDLE');
  };

  const activePath = simulationStep === 'DISCOVER' ? ['l1'] : simulationStep === 'RELAY' ? ['l2'] : simulationStep === 'OFFER' ? ['l2', 'l1'] : [];
  const packetColor = simulationStep === 'OFFER' ? 'var(--color-success)' : 'var(--color-warning)';

  return (
    <SlideLayout variant="standard" accentColor="var(--color-warning)">
      {/* Left: Explanation & Logic */}
      <div className="flex flex-col justify-center space-y-10 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Réseau L3</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text">Agent de Relais DHCP</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 leading-[1.4]">Passerelle permettant aux requêtes DHCP de traverser les frontières de sous-réseaux.</p>
        </div >

        <div className="flex items-center gap-4 text-warning py-4 px-6 border-l-4 border-warning bg-warning/10 rounded-r-xl">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-wide leading-snug">
            Les broadcasts DHCP ne traversent pas les routeurs. Le Relay Agent convertit le broadcast en unicast.
          </p>
        </div >

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[clamp(13px,1.5vw,15px)] font-bold text-primary uppercase tracking-widest opacity-80">
            <Router className="w-4 h-4" />
            <span className="font-mono-tech">Configuration Cisco</span>
          </div >
          <div className="glass-panel cyber-border-glow p-0 rounded-2xl overflow-hidden">
            <div className="bg-white/10 px-4 py-2 border-b border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-tighter">CONFIG_MODULE // IOS_VERSION_15</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-600" />
                <div className="w-2 h-2 rounded-full bg-slate-600" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div >
            </div >
            <div className="p-4 font-mono text-[clamp(13px,1.5vw,15px)] bg-bg/40">
              <div className="text-slate-400 mb-1">interface GigabitEthernet0/0</div >
              <div className="text-primary font-black text-base drop-shadow-[0_0_8px_var(--color-primary)]">ip helper-address 192.168.11.6</div >
            </div >
          </div >
        </div >
      </div >

      {/* Right: Diagram & Simulation */}
      <div className="flex items-center justify-center relative h-full">
        <div className="w-full h-full relative flex flex-col items-center justify-center" style={{ width: 'min(42vw, 650px)', maxHeight: '65vh' }}>
          <div className="w-full h-full relative scale-110 glass-panel cyber-border-glow rounded-3xl p-8 flex flex-col items-center justify-center border-warning/30">
            <div className="w-full h-full relative">
              <NetworkDiagram
                nodes={nodes}
                links={links}
                activePath={activePath}
                packetColor={packetColor}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <button
                  onClick={runSimulation}
                  disabled={simulationStep !== 'IDLE'}
                  className="px-8 py-3 bg-primary text-bg rounded-full font-bold hover:bg-cyan transition-all flex items-center gap-3 disabled:opacity-30 shadow-xl uppercase text-[clamp(13px,1.5vw,15px)] tracking-widest font-mono-tech"
                >
                  <PlayCircle className="w-5 h-5" />
                  {simulationStep === 'IDLE' ? 'Lancer la Simulation' : 'Simulation...'}
                </button>
              </div >
            </div >
          </div >

          <div className="mt-16 w-full space-y-4">
            {[
              { step: 'DISCOVER', text: 'Client envoie DHCPDISCOVER (Broadcast)', color: 'var(--color-primary)', icon: <Globe /> },
              { step: 'RELAY', text: 'Relay Agent encapsule en Unicast', color: 'var(--color-warning)', icon: <Router /> },
              { step: 'OFFER', text: 'Serveur répond via Relay (Unicast)', color: 'var(--color-success)', icon: <Server /> },
            ].map((item) => (
              <motion.div
                key={item.step}
                animate={{
                  opacity: simulationStep === item.step ? 1 : 0.4,
                  x: simulationStep === item.step ? 10 : 0,
                  scale: simulationStep === item.step ? 1.02 : 1
                }}
                className={`flex gap-4 items-center p-3 rounded-xl transition-all duration-300 ${simulationStep === item.step ? 'bg-white/5 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${simulationStep === item.step ? 'bg-primary text-bg shadow-[0_0_10px_var(--color-primary)]' : 'bg-white/10 text-slate-400 border border-white/20'}`}>
                  {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
                </div >
                <span className={`text-[clamp(16px,1.5vw,19px)] font-medium transition-colors ${simulationStep === item.step ? 'text-white' : 'text-slate-400'}`}>{item.text}</span>
                {simulationStep === item.step && (
                  <span className="ml-auto text-[10px] font-mono-tech uppercase tracking-widest text-primary animate-pulse">Active</span>
                )}
              </motion.div>
            ))}
          </div >
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide04;
