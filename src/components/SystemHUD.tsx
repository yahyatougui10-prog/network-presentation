import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, Wifi } from 'lucide-react';

export const SystemHUD: React.FC = () => {
  const [stats, setStats] = useState({ cpu: 12, ram: 45, ping: 14 });

  useEffect(() => {
    const statInterval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 20) + 10,
        ram: Math.floor(Math.random() * 10) + 40,
        ping: Math.floor(Math.random() * 5) + 12,
      });
    }, 5000);

    return () => {
      clearInterval(statInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 p-6 flex flex-col justify-between font-mono text-[9px] uppercase tracking-widest text-primary/40">
      {/* Top HUD: System Stats */}
      <div className="flex justify-between items-start">
        <div className="flex gap-6 bg-bg/20 backdrop-blur-sm border border-primary/10 p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 group">
            <Cpu className="w-3 h-3 opacity-50 group-hover:text-primary transition-colors" />
            <div className="flex flex-col">
              <span className="opacity-50">CPU</span>
              <span className="text-text/70 font-bold">{stats.cpu}%</span>
            </div>
          </div>
          <div className="w-px h-6 bg-primary/10" />
          <div className="flex items-center gap-2 group">
            <Activity className="w-3 h-3 opacity-50 group-hover:text-primary transition-colors" />
            <div className="flex flex-col">
              <span className="opacity-50">MEM</span>
              <span className="text-text/70 font-bold">{stats.ram}%</span>
            </div>
          </div>
          <div className="w-px h-6 bg-primary/10" />
          <div className="flex items-center gap-2 group">
            <Wifi className="w-3 h-3 opacity-50 group-hover:text-primary transition-colors" />
            <div className="flex flex-col">
              <span className="opacity-50">PING</span>
              <span className="text-text/70 font-bold">{stats.ping}ms</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full shadow-[0_0_5px_rgba(167,139,250,0.1)]">
            <ShieldCheck className="w-3 h-3 text-success/60" />
            <span className="text-success/60">CHIFFRÉ</span>
          </div>
          <div className="text-right opacity-30">
            SID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Bottom HUD: Version Info */}
      <div className="flex justify-end items-end">
        <div className="text-right flex flex-col gap-0.5 opacity-40">
          <div className="text-[10px] font-bold text-primary animate-pulse">NETCONFIG_OS v4.2.0</div>
          <div className="text-[8px]">STABILITÉ : NOMINALE</div>
        </div>
      </div>
    </div>
  );
};
