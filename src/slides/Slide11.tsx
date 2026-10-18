import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Search, Terminal, ShieldAlert, Zap, Filter } from 'lucide-react';

const DIAGNOSTIC_METRICS = [
  {
    id: 'RUNTS',
    label: 'Runts',
    desc: 'Trames < 64 octets',
    impact: 'Collisions excessives sur le segment',
    severity: 'warning',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: 'GIANTS',
    label: 'Giants',
    desc: 'Trames > 1518 octets',
    impact: 'Problèmes de MTU ou erreurs de tramage',
    severity: 'warning',
    icon: <Activity className="w-5 h-5" />
  },
  {
    id: 'CRC',
    label: 'CRC Errors',
    desc: 'Somme de contrôle invalide',
    impact: 'Corruption de données / Support physique défectueux',
    severity: 'critical',
    icon: <ShieldAlert className="w-5 h-5" />
  },
  {
    id: 'LATE_COLL',
    label: 'Late Collisions',
    desc: 'Collision après 64 octets',
    impact: 'Duplex Mismatch ou distance câble excessive',
    severity: 'critical',
    icon: <Zap className="w-5 h-5" />
  },
];

const auditCommands = [
  { cmd: 'show running-config', purpose: 'Validation des pools et exclusions' },
  { cmd: 'show ip interface brief', purpose: 'Vérification des états administratifs' },
  { cmd: 'show controllers ethernet-controller', purpose: 'Analyse Auto-MDIX et PHY' },
];

const FILTERS = [
  { id: 'include', label: 'include', desc: 'Lignes contenant le motif', example: 'show ip int br | include up' },
  { id: 'exclude', label: 'exclude', desc: 'Lignes sans le motif', example: 'show run | exclude !' },
  { id: 'section', label: 'section', desc: 'Bloc spécifique', example: 'show run | section dhcp' },
  { id: 'begin', label: 'begin', desc: 'Début au motif', example: 'show run | begin interface' },
];

const Slide11: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState(0);
  const [activeFilter, setActiveFilter] = useState('include');

  return (
    <SlideLayout variant="standard" accentColor="var(--color-warning)">
      {/* Left: Audit Console */}
      <div className="flex flex-col justify-center space-y-10 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 font-mono-tech">System Audit // Diagnostic_L2</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text">Surveillance & Diagnostic</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 leading-[1.4]">Analyse des erreurs de support physique entravant la distribution DHCP.</p>
        </div >

        <div className="space-y-8">
          <div className="flex items-center gap-3 text-warning py-2 px-4 border-l-4 border-warning bg-warning/10 rounded-r-lg">
            <Search className="w-4 h-4" />
            <span className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-widest font-mono-tech">Commandes d'Audit</span>
          </div >

          <div className="grid gap-4">
            {auditCommands.map((item, i) => (
              <div key={i} className="p-4 glass-panel cyber-border-glow rounded-xl border-warning/20 flex items-center justify-between group hover:border-warning/50 transition-all">
                <div className="flex flex-col">
                  <span className="font-mono text-white font-bold text-sm">{item.cmd}</span>
                  <span className="text-slate-400 text-xs uppercase tracking-tighter">{item.purpose}</span>
                </div >
                <Terminal className="w-4 h-4 text-warning/40 group-hover:text-warning transition-colors" />
              </div >
            ))}
          </div >

          {/* Filter Engine Module */}
          <div className="p-6 glass-panel cyber-border-glow rounded-3xl border-warning/30 space-y-6">
            <div className="flex items-center gap-3 text-warning uppercase tracking-widest text-xs font-mono-tech mb-4">
              <Filter className="w-4 h-4" />
              <span>Moteur de Filtrage IOS</span>
            </div >
            <div className="flex flex-wrap gap-2 mb-6">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono-tech transition-all border ${
                    activeFilter === f.id ? 'bg-warning text-bg border-warning' : 'bg-white/5 text-slate-400 border-white/10 hover:border-warning/50'
                  }`}
                >
                  | {f.label}
                </button>
              ))}
            </div >
            <div className="bg-black/60 rounded-lg p-4 font-mono text-xs border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-warning/30 animate-pulse" />
              <div className="flex justify-between items-center mb-2 text-slate-500 border-b border-white/5 pb-1">
                <span className="uppercase text-[9px] tracking-widest">Console Output</span>
                <span className="text-warning">Filtered</span>
              </div >
              <div className="text-slate-300 space-y-1">
                <span className="text-warning/60"># {FILTERS.find(f => f.id === activeFilter)?.example}</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFilter}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 5 }}
                    className="text-white font-bold"
                  >
                    {activeFilter === 'include' && 'FastEthernet0/0  192.168.1.1  YES manual up  up'}
                    {activeFilter === 'exclude' && 'interface Loopback0\n ip address 10.0.0.1 255.255.255.255'}
                    {activeFilter === 'section' && 'ip dhcp pool LAN\n network 192.168.1.0 255.255.255.0\n default-router 192.168.1.1'}
                    {activeFilter === 'begin' && 'interface GigabitEthernet0/0\n description Liaison_Vers_LAN_Production\n ip address 192.168.11.1 255.255.255.0'}
                  </motion.div>
                </AnimatePresence>
              </div >
            </div >
          </div >
        </div >
      </div >

      {/* Right: Error Matrix */}
      <div className="flex flex-col justify-center relative h-full">
        <div className="w-full h-full relative flex flex-col justify-center" style={{ width: 'min(42vw, 650px)', maxHeight: '80vh' }}>
          <div className="grid grid-cols-2 gap-6">
            {DIAGNOSTIC_METRICS.map((metric, i) => (
              <motion.div
                key={metric.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedMetric(i)}
                className={`p-6 rounded-3xl glass-panel cyber-border-glow transition-all cursor-pointer ${
                  selectedMetric === i
                    ? 'border-warning shadow-[0_0_20px_rgba(240,171,191,0.2)]'
                    : 'border-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  metric.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-warning/20 text-warning'
                }`}>
                  {metric.icon}
                </div >
                <h4 className="text-white font-black uppercase tracking-tighter mb-1">{metric.label}</h4>
                <p className="text-slate-400 text-xs font-mono mb-4">{metric.desc}</p>

                {selectedMetric === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-slate-200 text-sm leading-relaxed border-t border-white/10 pt-4"
                  >
                    <span className="text-warning font-bold uppercase text-[10px] block mb-1 font-mono-tech">Impact Opérationnel:</span>
                    {metric.impact}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div >

          <div className="mt-12 p-6 glass-panel rounded-3xl border-warning/30 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-warning/5 to-transparent pointer-events-none" />
            <span className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-warning/60 block mb-2">Recommendation de l'Architecte</span>
            <p className="text-slate-200 italic text-sm leading-relaxed">
              "Une erreur CRC persistante est le signe irréfutable d'un support physique défaillant. Ne perdez pas de temps avec la configuration; remplacez le câble."
            </p>
          </div >
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide11;
