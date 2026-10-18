import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, RefreshCcw, Radio, Timer, CheckCircle, XCircle, Pin, Laptop, Server } from 'lucide-react';
import { NetworkDiagram, type Node, type Link } from '../components/NetworkDiagram';

const nodes: Node[] = [
  { id: 'client', label: 'SÉLECTIONNÉ', icon: <Laptop />, x: 400, y: 150 },
  { id: 'node1', label: 'HÔTE 1', icon: <Server />, x: 200, y: 350 },
  { id: 'node2', label: 'HÔTE 2', icon: <Server />, x: 400, y: 350 },
  { id: 'node3', label: 'HÔTE 3', icon: <Server />, x: 600, y: 350 },
];

const links: Link[] = [
  { id: 'l1', from: 'client', to: 'node1' },
  { id: 'l2', from: 'client', to: 'node2' },
  { id: 'l3', from: 'client', to: 'node3' },
  { id: 'r1', from: 'node1', to: 'client' },
  { id: 'r2', from: 'node2', to: 'client' },
  { id: 'r3', from: 'node3', to: 'client' },
];

const Slide08: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'VALIDATING' | 'SUCCESS' | 'CONFLICT'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [conflictNode, setConflictNode] = useState<string | null>(null);

  const runDAD = async () => {
    setConflictNode(null);
    setStatus('SCANNING');
    setProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 50));
    }

    setStatus('VALIDATING');
    await new Promise(r => setTimeout(r, 1000));

    if (Math.random() > 0.3) {
      setStatus('SUCCESS');
    } else {
      const nodesToConflict = ['node1', 'node2', 'node3'];
      const picked = nodesToConflict[Math.floor(Math.random() * nodesToConflict.length)];
      setConflictNode(picked);
      setStatus('CONFLICT');
    }
  };

  const getActivePath = () => {
    if (status === 'SCANNING') return ['l1', 'l2', 'l3'];
    if (status === 'CONFLICT' && conflictNode) {
      if (conflictNode === 'node1') return ['r1'];
      if (conflictNode === 'node2') return ['r2'];
      if (conflictNode === 'node3') return ['r3'];
    }
    return [];
  };

  const packetColor = status === 'CONFLICT' ? 'var(--color-warning)' : 'var(--color-primary)';

  return (
    <SlideLayout variant="standard" accentColor="var(--color-primary)">
      {/* Left Column: Process Breakdown */}
      <div className="flex flex-col justify-center space-y-10 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Sécurité IPv6</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1]">Détection d'adresse en double</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 leading-[1.4]">Vérification de l'unicité de l'adresse IPv6 pour éviter les conflits sur le réseau.</p>
        </div >

        <div className="space-y-6">
          {[
            { step: 'IDLE', text: "L'interface sélectionne une adresse IPv6 provisoire.", icon: <Pin className="w-4 h-4" /> },
            { step: 'SCANNING', text: "Envoi d'un Neighbor Solicitation (NS) pour sa propre adresse.", icon: <Radio className="w-4 h-4" /> },
            { step: 'VALIDATING', text: "Attente d'une réponse Neighbor Advertisement (NA).", icon: <Timer className="w-4 h-4" /> },
            { step: 'SUCCESS', text: "Aucune réponse. L'adresse est unique et assignée.", icon: <CheckCircle className="w-4 h-4" /> },
            { step: 'CONFLICT', text: "Réponse reçue. Adresse dupliquée ; régénération.", icon: <XCircle className="w-4 h-4" /> },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: status === item.step ? 1 : 0.3,
                x: status === item.step ? 10 : 0,
                color: status === item.step ? 'var(--color-primary)' : 'var(--color-slate-400)'
              }}
              className="flex gap-4 items-center transition-all group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 shrink-0 group-hover:border-primary/50 transition-colors">
                {item.icon}
              </div >
              <span className="text-[clamp(16px,1.5vw,19px)] font-medium text-white">{item.text}</span>
            </motion.div>
          ))}
        </div >
      </div >

      {/* Right Column: HUD-style Visualization */}
      <div className="flex items-center justify-center relative h-full">
        <div className="w-full h-full relative flex flex-col items-center justify-center" style={{ width: 'min(42vw, 650px)', maxHeight: '65vh' }}>

          <div className="w-full h-64 relative mb-8 scale-110">
            <NetworkDiagram
              nodes={nodes}
              links={links}
              activePath={getActivePath()}
              packetColor={packetColor}
            />
          </div >

          <div className="text-center mb-8">
            <span className="block text-[clamp(13px,1.5vw,15px)] uppercase tracking-[0.3em] text-slate-400 mb-2 font-bold">HUD de validation réseau</span>
            <div className="text-4xl font-mono font-black text-white drop-shadow-md tracking-tighter">
              2001:db8:acad:1::25
            </div >
          </div >

          <div className="w-full max-w-md h-1 bg-white/10 rounded-full overflow-hidden mb-8 relative">
            <motion.div
              className="h-full bg-primary shadow-[0_0_15px_var(--color-primary)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div >

          <div className="h-24 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              {status === 'IDLE' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-400 italic text-[clamp(18px,2vw,20px)] font-light">Système prêt. En attente de vérification...</motion.div>
              )}
              {status === 'SCANNING' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 text-primary font-black uppercase tracking-widest text-3xl">
                  <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
                  Scan en cours...
                </motion.div>
              )}
              {status === 'VALIDATING' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-ipv6 font-black uppercase tracking-widest text-3xl">
                  Validation en cours...
                </motion.div>
              )}
              {status === 'SUCCESS' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 text-success">
                  <ShieldCheck className="w-12 h-12" />
                  <span className="font-black uppercase tracking-tighter text-2xl">Adresse Validée</span>
                </motion.div>
              )}
              {status === 'CONFLICT' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 text-warning">
                  <ShieldAlert className="w-12 h-12" />
                  <span className="font-black uppercase tracking-tighter text-2xl">Conflit Détecté</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div >

          <div className="flex items-center gap-6">
            {status === 'IDLE' || status === 'SUCCESS' || status === 'CONFLICT' ? (
              <button
                onClick={runDAD}
                className="px-8 py-3 bg-primary text-bg rounded-full font-bold hover:bg-cyan transition-all shadow-xl uppercase text-[clamp(13px,1.5vw,15px)] tracking-widest"
              >
                Lancer le test DAD
              </button>
            ) : (
              <button
                onClick={() => { setStatus('IDLE'); setProgress(0); }}
                className="px-8 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-full font-bold hover:text-white transition-all uppercase text-[clamp(13px,1.5vw,15px)] tracking-widest"
              >
                Interrompre le Scan
              </button>
            )}
            <button
              onClick={() => { setStatus('IDLE'); setProgress(0); }}
              className="p-3 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-primary transition-colors"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div >
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide08;
