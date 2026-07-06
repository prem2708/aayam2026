'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
  variant?: 'hero' | 'page';
  className?: string;
}

const BLOBS = {
  hero: [
    { style: { background: 'rgba(0,240,255,0.18)',  width: 500, height: 500 }, className: 'top-[4%]   left-[8%]',          anim: 'aurora-drift',      parallax: 'y1' },
    { style: { background: 'rgba(188,19,254,0.15)', width: 440, height: 440 }, className: 'bottom-[12%] right-[8%]',       anim: 'aurora-drift-slow', parallax: 'y2' },
    { style: { background: 'rgba(255,0,127,0.12)',  width: 340, height: 340 }, className: 'top-[18%]  right-[18%]',        anim: 'aurora-drift',      parallax: 'y3' },
    { style: { background: 'rgba(0,240,255,0.09)',  width: 280, height: 280 }, className: 'bottom-[8%]  left-[18%]',       anim: 'pulse-glow',        parallax: null },
    { style: { background: 'rgba(255,255,255,0.04)',width: 260, height: 260 }, className: 'top-[38%]  left-1/2 -translate-x-1/2', anim: 'pulse-glow', parallax: null },
  ],
  page: [
    { style: { background: 'rgba(0,240,255,0.15)',  width: 340, height: 340 }, className: 'top-[5%]   left-[10%]',         anim: 'aurora-drift',      parallax: 'y1' },
    { style: { background: 'rgba(188,19,254,0.12)', width: 280, height: 280 }, className: 'bottom-[15%] right-[10%]',      anim: 'aurora-drift-slow', parallax: 'y2' },
    { style: { background: 'rgba(255,0,127,0.09)',  width: 200, height: 200 }, className: 'top-[20%]  right-[20%]',        anim: 'aurora-drift',      parallax: 'y3' },
    { style: { background: 'rgba(255,255,255,0.04)',width: 200, height: 200 }, className: 'top-[40%]  left-1/2 -translate-x-1/2', anim: 'pulse-glow', parallax: null },
  ],
};

export function AuroraBackground({ variant = 'page', className }: AuroraBackgroundProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, variant === 'hero' ? 100 : 50]);
  const y2 = useTransform(scrollY, [0, 600], [0, variant === 'hero' ? -72 : -36]);
  const y3 = useTransform(scrollY, [0, 600], [0, variant === 'hero' ?  55 :  28]);
  const yMap = { y1, y2, y3, null: undefined } as Record<string, any>;

  const blobs = BLOBS[variant];

  return (
    <div className={cn('absolute inset-0 -z-10 bg-background overflow-hidden', className)}>
      {/* Animated Tron grid */}
      <div className="absolute inset-0 grid-bg opacity-80" />

      {blobs.map((blob, i) => {
        const motionY = blob.parallax ? yMap[blob.parallax] : undefined;
        const animClass =
          blob.anim === 'pulse-glow'
            ? 'animate-pulse-glow'
            : blob.anim === 'aurora-drift-slow'
            ? 'animate-aurora-drift-slow'
            : 'animate-aurora-drift';

        const blobStyle = {
          ...blob.style,
          position: 'absolute' as const,
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none' as const,
        };

        if (motionY) {
          return (
            <motion.div
              key={i}
              style={{ ...blobStyle, y: motionY }}
              className={cn(blob.className, animClass)}
            />
          );
        }
        return (
          <div
            key={i}
            style={blobStyle}
            className={cn(blob.className, animClass)}
          />
        );
      })}

      {/* Depth vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_40%,transparent_45%,rgba(2,2,5,0.8)_100%)] pointer-events-none" />
    </div>
  );
}
