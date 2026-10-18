import React from 'react';
import { motion } from 'framer-motion';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  footer?: string;
  className?: string;
  active?: boolean;
  color?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  description,
  footer,
  className = '',
  active = false,
  color = 'var(--color-primary)'
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-6 bg-surface border-2 rounded-3xl transition-all duration-300 shadow-sm group ${
        active
          ? `border-primary shadow-[0_0_20px_${color}20]`
          : 'border-border/40 hover:border-primary/50'
      } ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
          active ? 'bg-primary text-bg shadow-lg' : 'bg-bg/40 text-primary border border-primary/20'
        }`}>
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
        </div>

        <div className="space-y-2">
          <h3 className={`text-xl font-black uppercase tracking-tight transition-colors ${
            active ? 'text-primary' : 'text-text'
          }`}>
            {title}
          </h3>
          <p className="text-muted leading-relaxed text-base">
            {description}
          </p>
        </div>

        {footer && (
          <div className="pt-4 mt-auto border-t border-border/30">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted/60">
              {footer}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
