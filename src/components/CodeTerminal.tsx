import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, RotateCcw, Play } from 'lucide-react';

interface CodeTerminalProps {
  lines: string[];
  speed?: number;
  /** Counter: every new value (> 0) replays the simulation from scratch. 0 = never started. */
  trigger: number;
  highlightColor?: string;
  loop?: boolean;
  onLineChange?: (lineIdx: number) => void;
  /** Message shown before the first run. */
  hint?: string;
}

export const CodeTerminal: React.FC<CodeTerminalProps> = ({
  lines,
  speed = 30,
  trigger,
  highlightColor = 'var(--color-primary)',
  loop = false,
  onLineChange,
  hint = 'Appuyez sur ▶ pour lancer la simulation.',
}) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [runId, setRunId] = useState(0);

  const startRun = useCallback(() => {
    setDisplayedLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
    setRunId((r) => r + 1);
    setIsRunning(true);
  }, []);

  // External trigger: the parent bumps this counter to (re)start the run.
  useEffect(() => {
    if (trigger > 0) startRun();
  }, [trigger, startRun]);

  // Notify the parent about the line being typed (for the guide highlight).
  useEffect(() => {
    if (onLineChange) onLineChange(currentLineIdx);
  }, [currentLineIdx, onLineChange]);

  // Typing engine
  useEffect(() => {
    if (!isRunning) return;

    if (currentLineIdx >= lines.length) {
      if (loop) {
        const timer = setTimeout(() => {
          setDisplayedLines([]);
          setCurrentLineIdx(0);
          setCurrentCharIdx(0);
        }, speed * 12);
        return () => clearTimeout(timer);
      }
      // Finished: keep the output on screen.
      setIsRunning(false);
      return;
    }

    const currentLine = lines[currentLineIdx];
    if (currentCharIdx < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[currentLineIdx] = currentLine.substring(0, currentCharIdx + 1);
          return next;
        });
        setCurrentCharIdx((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentLineIdx((prev) => prev + 1);
      setCurrentCharIdx(0);
    }, speed * 5);
    return () => clearTimeout(timer);
  }, [isRunning, currentLineIdx, currentCharIdx, lines, speed, loop, runId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(lines.join('\n'));
  };

  const handleReset = () => {
    setIsRunning(false);
    setDisplayedLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
  };

  const cursor = (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      className="inline-block w-[7px] h-[13px] bg-primary shadow-[0_0_8px_var(--color-primary)] align-middle ml-0.5"
    />
  );

  return (
    <div className="w-full bg-bg/45 rounded-xl border border-border overflow-hidden font-mono text-[13px] shadow-2xl relative group">
      {/* Terminal Header */}
      <div className="bg-surface px-4 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
          <div className="ml-3 flex items-center gap-2 px-2 py-0.5 bg-bg/45 rounded border border-border/30">
            <Terminal className="w-3 h-3 text-muted" />
            <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Router-Core-01#</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-white/10 transition-colors" title="Copier le code" aria-label="Copier le code">
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={startRun} className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-white/10 transition-colors" title="Lancer la simulation" aria-label="Lancer la simulation">
            <Play className="w-3 h-3" />
          </button>
          <button onClick={handleReset} className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-white/10 transition-colors" title="Réinitialiser" aria-label="Réinitialiser le terminal">
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 min-h-[140px] space-y-0.5 relative">
        {/* Subtle CRT Scanline */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px] z-10" />

        <div className="relative z-20">
          {displayedLines.map((line, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-muted/30 select-none w-4 text-right">{idx + 1}</span>
              <span style={{ color: highlightColor }} className="whitespace-pre-wrap leading-relaxed">
                {line}
                {isRunning && idx === currentLineIdx && cursor}
              </span>
            </div>
          ))}

          {/* Cursor on its own row before the next line starts typing */}
          {isRunning && currentLineIdx < lines.length && displayedLines.length <= currentLineIdx && (
            <div className="flex gap-3">
              <span className="text-muted/30 select-none w-4 text-right">{currentLineIdx + 1}</span>
              <span className="leading-relaxed">{cursor}</span>
            </div>
          )}

          {/* Idle hint before the first run */}
          {!isRunning && displayedLines.length === 0 && (
            <div className="flex gap-3 items-baseline">
              <span className="text-muted/30 select-none w-4 text-right">›</span>
              <span className="text-muted/50 italic text-[12px] tracking-wide">{hint}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
