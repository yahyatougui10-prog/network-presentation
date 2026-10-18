import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { motion } from 'framer-motion';
import { Cpu, Database, Terminal, Search, FileText, Activity } from 'lucide-react';

const BOOT_STEPS = [
  {
    id: 1,
    title: 'POST',
    label: 'Power-On Self Test',
    desc: 'Vérification du matériel critique (RAM, CPU, Flash).',
    icon: <Cpu className="w-5 h-5" />,
    status: 'HARDWARE'
  },
  {
    id: 2,
    title: 'BOOTLOADER',
    label: 'Lookup & Load',
    desc: 'Localisation et chargement de l\'image IOS depuis la Flash.',
    icon: <Search className="w-5 h-5" />,
    status: 'SYSTEM'
  },
  {
    id: 3,
    title: 'IOS KERNEL',
    label: 'Operating System',
    desc: 'Initialisation du noyau IOS et des services de base.',
    icon: <Database className="w-5 h-5" />,
    status: 'SOFTWARE'
  },
  {
    id: 4,
    title: 'CONFIGURATION',
    label: 'config.text',
    desc: 'Chargement des paramètres utilisateur depuis la NVRAM.',
    icon: <FileText className="w-5 h-5" />,
    status: 'USER'
  },
  {
    id: 5,
    title: 'INTERFACES',
    label: 'Link Init',
    desc: 'Activation des interfaces et établissement des liaisons.',
    icon: <Activity className="w-5 h-5" />,
    status: 'NETWORK'
  },
];

const Slide12: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <SlideLayout variant="standard" accentColor="var(--color-primary)">
      {/* Left: Boot Timeline */}
      <div className="flex flex-col justify-center space-y-10 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 font-mono-tech">System Lifecycle // Boot_Sequence</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text">Séquence de Démarrage</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 leading-[1.4]">Processus critique de mise sous tension d'un équipement Cisco IOS.</p>
        </div >

        <div className="relative space-y-8">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

          {BOOT_STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setActiveStep(i)}
              className="relative pl-16 group cursor-pointer"
            >
              {/* Step Indicator */}
              <div className={`absolute left-4 top-1 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 ${
                activeStep === i ? 'bg-primary border-primary shadow-[0_0_10px_var(--color-primary)] scale-125' : 'bg-bg border-white/20 group-hover:border-primary/50'
              }`} />

              <div className={`p-4 rounded-2xl transition-all duration-300 ${
                activeStep === i ? 'bg-white/10 border-l-4 border-primary translate-x-2' : 'bg-transparent border-l-4 border-transparent opacity-60'
              }`}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-primary font-mono-tech text-xs font-bold">STEP_0{step.id}</span>
                  <span className="text-white font-black uppercase tracking-tighter text-lg">{step.title}</span>
                </div >
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono-tech mb-2">
                  {step.icon}
                  <span>{step.label}</span>
                </div >
                <p className="text-slate-300 text-sm leading-relaxed">{step.desc}</p>
              </div >
            </motion.div>
          ))}
        </div >
      </div >

      {/* Right: Recovery & Bootloader Console */}
      <div className="flex flex-col justify-center relative h-full">
        <div className="w-full h-full relative flex flex-col justify-center" style={{ width: 'min(42vw, 650px)', maxHeight: '80vh' }}>
          <div className="glass-panel cyber-border-glow p-8 rounded-3xl border-primary/30 space-y-8">
            <div className="flex items-center gap-3 text-primary uppercase tracking-widest text-xs font-mono-tech">
              <Terminal className="w-4 h-4" />
              <span>ROMMON Recovery Mode</span>
            </div >

            <div className="bg-black/80 rounded-xl p-6 font-mono text-sm border border-white/10 shadow-inner">
              <div className="text-slate-500 mb-4">
                {`switch: `}
                <span className="text-white animate-pulse">_</span>
              </div >
              <div className="space-y-3">
                <div className="flex gap-4">
                  <span className="text-primary"># flash_init</span>
                  <span className="text-slate-600">Initialize flash memory... OK</span>
                </div >
                <div className="flex gap-4">
                  <span className="text-primary"># boot</span>
                  <span className="text-slate-600">Loading IOS image...</span>
                </div >
                <div className="flex gap-4">
                  <span className="text-primary"># confreg 0x2142</span>
                  <span className="text-success">Password recovery mode enabled</span>
                </div >
              </div >
            </div>

            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-slate-300 text-sm leading-relaxed">
              <span className="text-primary font-bold uppercase text-[10px] block mb-2 font-mono-tech">Architect's Note: Recovery</span>
              Le bootloader permet de contourner le fichier config.text pour réinitialiser les mots de passe ou réinstaller l'IOS via TFTP en cas de corruption critique.
            </div >
          </div >
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide12;
