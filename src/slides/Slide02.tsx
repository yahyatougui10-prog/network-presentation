import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { motion } from 'framer-motion';
import { ArrowRight, Server, Laptop, Radio, Gift, FileText, CheckCircle } from 'lucide-react';
import { NetworkDiagram, type Node, type Link } from '../components/NetworkDiagram';

const steps = [
  { id: 'DISCOVER', title: 'DHCPDISCOVER', sender: 'CLIENT', receiver: 'SERVEUR', purpose: 'Recherche les serveurs DHCP disponibles par diffusion (broadcast).', color: 'var(--color-primary)', icon: <Radio className="w-5 h-5" /> },
  { id: 'OFFER', title: 'DHCPOFFER', sender: 'SERVEUR', receiver: 'CLIENT', purpose: 'Propose une adresse IP disponible et sa configuration.', color: 'var(--color-cyan)', icon: <Gift className="w-5 h-5" /> },
  { id: 'REQUEST', title: 'DHCPREQUEST', sender: 'CLIENT', receiver: 'SERVEUR', purpose: 'Demande formellement l\'adresse IP proposée.', color: 'var(--color-ipv6)', icon: <FileText className="w-5 h-5" /> },
  { id: 'ACK', title: 'DHCPACK', sender: 'SERVEUR', receiver: 'CLIENT', purpose: 'Confirme le bail et fournit les paramètres finaux.', color: 'var(--color-success)', icon: <CheckCircle className="w-5 h-5" /> },
];

const nodes: Node[] = [
  { id: 'client', label: 'CLIENT', icon: <Laptop />, x: 200, y: 300 },
  { id: 'server', label: 'SERVEUR', icon: <Server />, x: 800, y: 300 },
];

const links: Link[] = [
  { id: 'c-s', from: 'client', to: 'server' },
  { id: 's-c', from: 'server', to: 'client' },
];

const Slide02: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const activePath = activeStep % 2 === 0 ? ['c-s'] : ['s-c'];
  const packetColor = steps[activeStep].color;

  return (
    <SlideLayout variant="standard" accentColor="var(--color-primary)">
      {/* Left: Explanation */}
      <div className="flex flex-col justify-center space-y-12 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Processus DHCPv4</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1]">Séquence DORA</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 leading-[1.4]">Le processus de poignée de main fondamentale pour l'obtention d'une adresse IP.</p>
        </div >

        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              aria-pressed={activeStep === i}
              className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left glass-panel ${
                activeStep === i
                  ? 'border-primary/60 text-white shadow-[0_0_15px_rgba(167,139,250,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`text-[clamp(13px,1.5vw,15px)] font-mono w-6 h-6 flex items-center justify-center rounded-full border transition-all shrink-0 ${
                activeStep === i ? 'bg-primary text-white border-primary' : 'bg-transparent border-white/20 text-white/30'
              }`}>
                {i + 1}
              </span>
              <div className="flex flex-col">
                <span className="text-[clamp(16px,1.5vw,19px)] font-bold uppercase tracking-tighter">{step.title}</span>
                <span className="text-[clamp(13px,1.5vw,15px)] opacity-60 uppercase tracking-widest">{step.id}</span>
              </div>
            </button>
          ))}
        </div>
      </div >

      {/* Right: Diagram Area */}
      <div className="flex items-center justify-center relative h-full">
        <div className="w-full h-full relative flex flex-col items-center justify-center" style={{ width: 'min(42vw, 650px)', maxHeight: '65vh' }}>
          <div className="w-full relative py-8">
            <div className="w-full h-64 relative scale-110 mb-14">
              <NetworkDiagram
                nodes={nodes}
                links={links}
                activePath={activePath}
                packetColor={packetColor}
              />
            </div >

            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <span className="block text-[10px] font-mono uppercase tracking-widest text-primary/60">Paquet en transit</span>
                <div className="flex items-center justify-center gap-5 mb-1">
                  <span className="text-4xl" style={{ color: steps[activeStep].color }}>{steps[activeStep].icon}</span>
                  <h3 className="text-[clamp(22px,2.2vw,30px)] font-black text-white uppercase tracking-tighter">{steps[activeStep].title}</h3>
                </div >
                <p className="text-[clamp(16px,1.6vw,18px)] text-slate-200 max-w-lg leading-[1.4] mx-auto font-medium">
                  {steps[activeStep].purpose}
                </p>
                <div className="flex items-center justify-center gap-10 text-[clamp(12px,1.3vw,14px)] font-mono uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-2">De : <span className="text-white font-bold">{steps[activeStep].sender}</span></span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="flex items-center gap-2">Vers : <span className="text-white font-bold">{steps[activeStep].receiver}</span></span>
                </div >
              </motion.div>
            </div >
          </div >
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide02;
