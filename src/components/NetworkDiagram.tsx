import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface Node {
  id: string;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
}

export interface Link {
  from: string;
  to: string;
  id: string;
}

interface NetworkDiagramProps {
  nodes: Node[];
  links: Link[];
  activePath?: string[];
  packetColor?: string;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({ nodes, links, activePath, packetColor = 'var(--color-primary)' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (dimensions.width === 0) {
    return <div ref={containerRef} className="relative w-full h-full min-h-[300px] bg-surface/20 rounded-3xl border border-border/50" />;
  }

  const minX = Math.min(...nodes.map(n => n.x));
  const maxX = Math.max(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y));
  const maxY = Math.max(...nodes.map(n => n.y));

  const nodeWidth = maxX - minX;
  const nodeHeight = maxY - minY;

  const padding = 60;
  const scaleX = nodeWidth === 0 ? 1 : (dimensions.width - padding * 2) / nodeWidth;
  const scaleY = nodeHeight === 0 ? 1 : (dimensions.height - padding * 2) / nodeHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  const offsetX = (dimensions.width - nodeWidth * scale) / 2 - minX * scale;
  const offsetY = (dimensions.height - nodeHeight * scale) / 2 - minY * scale;

  const getX = (x: number) => x * scale + offsetX;
  const getY = (y: number) => y * scale + offsetY;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] bg-surface/20 rounded-3xl border border-border/30 overflow-hidden backdrop-blur-sm"
    >
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
           style={{ backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-border)" />
            </marker>
          </defs>
          {links.map((link) => {
            const fromNode = nodes.find((n) => n.id === link.from);
            const toNode = nodes.find((n) => n.id === link.to);
            if (!fromNode || !toNode) return null;

            const isActive = activePath?.includes(link.id);

            return (
              <g key={link.id}>
                <line
                  x1={getX(fromNode.x)}
                  y1={getY(fromNode.y)}
                  x2={getX(toNode.x)}
                  y2={getY(toNode.y)}
                  stroke={isActive ? packetColor : 'var(--color-border)'}
                  strokeWidth={isActive ? "3" : "2"}
                  markerEnd="url(#arrowhead)"
                  className={`transition-all duration-500 ${isActive ? 'filter drop-shadow-[0_0_8px_var(--color-primary)]' : ''}`}
                />
                {isActive && (
                  <PacketAnimation
                    fromX={getX(fromNode.x)} fromY={getY(fromNode.y)}
                    toX={getX(toNode.x)} toY={getY(toNode.y)}
                    color={packetColor}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => {
          const isActive = activePath?.some(linkId => {
            const link = links.find(l => l.id === linkId);
            return link && (link.from === node.id || link.to === node.id);
          });

          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center gap-2 pointer-events-auto"
              style={{
                left: `${getX(node.x)}px`,
                top: `${getY(node.y)}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node Coordinates Artifact */}
              <div className="absolute -top-8 left-0 text-[8px] font-mono text-primary/40 whitespace-nowrap uppercase tracking-tighter">
                X:{node.x} Y:{node.y} {hoveredNode === node.id ? '>> ACTIVE_TARGET' : ''}
              </div>

              <div className={`relative w-16 h-16 rounded-2xl bg-card border transition-all duration-500 flex items-center justify-center text-primary shadow-md group ${
                isActive ? 'border-primary scale-110 shadow-[0_0_30px_rgba(167,139,250,0.4)]' : 'border-border/60'
              }`}>
                {/* Node Glow Ring */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-2xl border-2 border-primary"
                  />
                )}
                <div className={`transition-transform duration-300 ${isActive ? 'scale-125' : 'scale-100'}`}>
                  {node.icon}
                </div >
              </div >
              <span className="text-xs font-mono text-muted group-hover:text-text transition-colors whitespace-nowrap font-bold uppercase tracking-wider">{node.label}</span>
            </div >
          );
        })}
      </div >
    </div >
  );
};

interface PacketAnimationProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
}

const PacketAnimation: React.FC<PacketAnimationProps> = ({ fromX, fromY, toX, toY, color }) => {
  return (
    <g filter="url(#glow)">
      {/* Trailing Glow Effect */}
      <motion.circle
        r="6"
        fill={color}
        initial={{ cx: fromX, cy: fromY, opacity: 0 }}
        animate={{
          cx: toX,
          cy: toY,
          opacity: [0, 0.4, 0.4, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
          delay: 0.2
        }}
        className="blur-sm"
      />
      {/* Main Packet */}
      <motion.circle
        r="4"
        fill={color}
        initial={{ cx: fromX, cy: fromY, opacity: 0 }}
        animate={{
          cx: toX,
          cy: toY,
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="drop-shadow-[0_0_12px_var(--color-primary)]"
      />
    </g>
  );
};
