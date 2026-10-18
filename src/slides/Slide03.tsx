import React, { useState } from 'react';
import { SlideLayout } from '../components/SlideLayout';
import { CodeTerminal } from '../components/CodeTerminal';
import { Terminal, Cpu, ShieldCheck, Zap, Globe, Router, Database, PlayCircle, Activity } from 'lucide-react';

const configLines = [
  'Router# configure terminal',
  'Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10',
  'Router(config)# ip dhcp pool LAN',
  'Router(dhcp-config)# network 192.168.1.0 255.255.255.0',
  'Router(dhcp-config)# default-router 192.168.1.1',
  'Router(dhcp-config)# dns-server 8.8.8.8',
  'Router(dhcp-config)# exit',
  'Router(config)# interface loopback 0',
  'Router(config-if)# ip address 10.0.0.1 255.255.255.255',
  'Router(config-if)# exit',
];

const verifyLines = [
  'Router# show ip dhcp binding',
  '192.168.1.11  00:0a:95:9d:68:16  expiring 2026-09-14',
  '192.168.1.12  00:0a:95:9d:68:17  expiring 2026-09-14',
  '!',
  'Router# show ip interface brief',
  'Interface              IP-Address      OK? Method Status                Protocol',
  'Loopback0              10.0.0.1        YES manual up                    up',
  'FastEthernet0/0        192.168.1.1     YES manual up                    up',
];

const Slide03: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(-1);
  const [configRun, setConfigRun] = useState(0);
  const [verifyRun, setVerifyRun] = useState(0);

  const handleLineChange = (idx: number) => {
    setCurrentLine(idx);
  };

  return (
    <SlideLayout variant="standard" accentColor="var(--color-primary)">
      {/* Left: Configuration */}
      <div className="flex flex-col justify-center space-y-10 max-w-[600px]">
        <div className="space-y-6">
          <h3 className="text-[clamp(13px,1.5vw,15px)] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Administration Cisco</h3>
          <h2 className="text-[clamp(44px,4vw,56px)] font-black text-white uppercase tracking-tighter leading-[1.1] glitch-text">Configuration DHCP</h2>
          <p className="text-[clamp(18px,2vw,20px)] text-slate-300 leading-[1.4]">Mise en œuvre du pool et des exclusions d'adresses sur Cisco IOS.</p>
        </div >

        <div className="space-y-8">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-[clamp(13px,1.5vw,15px)] font-bold text-primary uppercase tracking-widest opacity-80">
                <Terminal className="w-4 h-4" />
                <span className="font-mono-tech">Configuration IOS</span>
              </div >
              <div className="flex gap-2">
                <button
                  onClick={() => setConfigRun((r) => r + 1)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/30 transition-all"
                >
                  <PlayCircle className="w-3 h-3" />
                  {configRun > 0 ? 'Rejouer' : 'Simuler'}
                </button>
              </div >
            </div >
            <div className="p-4 glass-panel rounded-2xl shadow-xl overflow-hidden cyber-border-glow">
              <CodeTerminal
                lines={configLines}
                trigger={configRun}
                loop={true}
                highlightColor="var(--color-primary)"
                onLineChange={handleLineChange}
                hint="Appuyez sur « Simuler » pour lancer la configuration."
              />
            </div >
          </div >

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-[clamp(13px,1.5vw,15px)] font-bold text-success uppercase tracking-widest opacity-80">
                <Terminal className="w-4 h-4" />
                <span className="font-mono-tech">Vérification État</span>
              </div >
              <button
                onClick={() => setVerifyRun((r) => r + 1)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 border border-success/40 text-success text-[10px] font-bold uppercase tracking-widest hover:bg-success/30 transition-all"
              >
                <PlayCircle className="w-3 h-3" />
                {verifyRun > 0 ? 'Rejouer' : 'Vérifier'}
              </button>
            </div >
            <div className="p-4 glass-panel rounded-2xl shadow-xl overflow-hidden border-success/20">
              <CodeTerminal
                lines={verifyLines}
                trigger={verifyRun}
                loop={verifyRun > 0}
                speed={50}
                highlightColor="var(--color-success)"
                hint="Appuyez sur « Vérifier » pour afficher les bindings DHCP."
              />
            </div >
          </div >
        </div >
      </div >

      {/* Right: Reference Guide */}
      <div className="flex flex-col justify-center space-y-8">
        <div className="flex items-center gap-3 mb-4 text-[clamp(13px,1.5vw,15px)] font-bold text-primary uppercase tracking-widest opacity-80">
          <Cpu className="w-4 h-4" />
          <span className="font-mono-tech">Guide des commandes</span>
        </div >

        <div className="flex flex-col gap-6">
          {[
            { cmd: 'excluded-address', desc: 'Protège les IPs critiques.', icon: <ShieldCheck className="w-4 h-4" />, color: 'var(--color-primary)', lineIdx: 1 },
            { cmd: 'ip dhcp pool', desc: 'Définit le nom du pool.', icon: <Database className="w-4 h-4" />, color: 'var(--color-primary)', lineIdx: 2 },
            { cmd: 'network', desc: 'Spécifie le subnet et le masque.', icon: <Globe className="w-4 h-4" />, color: 'var(--color-primary)', lineIdx: 3 },
            { cmd: 'default-router', desc: 'Définit la passerelle par défaut.', icon: <Router className="w-4 h-4" />, color: 'var(--color-primary)', lineIdx: 4 },
            { cmd: 'dns-server', desc: 'Configure la résolution DNS.', icon: <Zap className="w-4 h-4" />, color: 'var(--color-primary)', lineIdx: 5 },
            { cmd: 'Interface Loopback', desc: 'Garantit une gestion stable (SNMP/SSH).', icon: <Activity className="w-4 h-4" />, color: 'var(--color-success)', lineIdx: 7 },
          ].map((item) => (
            <div
              key={item.cmd}
              className={`flex items-start gap-4 group transition-all duration-500 p-3 rounded-xl glass-panel ${currentLine === item.lineIdx ? 'border-primary/60 scale-105 shadow-[0_0_15px_rgba(167,139,250,0.1)]' : 'border-white/10'}`}
            >
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${currentLine === item.lineIdx ? 'bg-primary text-bg border-primary shadow-lg' : 'bg-white/10 border-white/20 text-primary group-hover:border-primary/50'}`} style={{ color: currentLine === item.lineIdx ? 'var(--color-bg)' : item.color }}>
                {item.icon}
              </div >
              <div className="flex flex-col">
                <span className={`text-[clamp(16px,1.5vw,19px)] font-bold uppercase tracking-tight transition-colors ${currentLine === item.lineIdx ? 'text-white' : 'text-white/80'}`}>{item.cmd}</span>
                <span className={`text-[clamp(13px,1.5vw,15px)] transition-colors ${currentLine === item.lineIdx ? 'text-slate-200' : 'text-slate-400'}`}>{item.desc}</span>
              </div >
            </div >
          ))}
        </div >
      </div >
    </SlideLayout>
  );
};

export default Slide03;
