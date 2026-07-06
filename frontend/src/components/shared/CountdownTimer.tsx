'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEST_DATE } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = FEST_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function DigitSegment({ value, label, color }: { value: number; label: string; color: string }) {
  const display = String(value).padStart(2, '0');
  const prevRef = useRef(display);
  const changed = prevRef.current !== display;
  if (changed) prevRef.current = display;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Panel */}
      <div
        className="relative rounded-2xl overflow-hidden countdown-segment"
        style={{
          minWidth: '80px',
          minHeight: '88px',
          padding: '0',
          background: 'rgba(0,15,22,0.9)',
          border: `1px solid ${color}33`,
          boxShadow: `0 0 20px ${color}22, inset 0 1px 0 ${color}18`,
        }}
      >
        {/* Top half */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '50%',
            background: 'linear-gradient(to bottom, rgba(0,240,255,0.04), rgba(0,0,0,0))',
            borderBottom: `1px solid ${color}22`,
          }}
        />

        {/* Digit with flip animation */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={display}
            initial={{ y: -16, opacity: 0, scaleY: 0.7 }}
            animate={{ y: 0, opacity: 1, scaleY: 1 }}
            exit={{ y: 16, opacity: 0, scaleY: 0.7 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <span
              className="text-3xl sm:text-5xl font-black tabular-nums font-heading"
              style={{
                color,
                textShadow: `0 0 12px ${color}cc, 0 0 30px ${color}55`,
                letterSpacing: '0.04em',
              }}
            >
              {display}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Corner accent dots */}
        <span className="absolute top-1.5 left-1.5 h-1 w-1 rounded-full" style={{ background: color, opacity: 0.6 }} />
        <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full" style={{ background: color, opacity: 0.6 }} />
        <span className="absolute bottom-1.5 left-1.5 h-1 w-1 rounded-full" style={{ background: color, opacity: 0.6 }} />
        <span className="absolute bottom-1.5 right-1.5 h-1 w-1 rounded-full" style={{ background: color, opacity: 0.6 }} />

        {/* Data stream sweep on change */}
        {changed && (
          <div
            key={`sweep-${display}`}
            className="absolute top-0 left-0 w-12 h-full pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}44, transparent)`,
              animation: 'data-stream 0.5s ease-out forwards',
            }}
          />
        )}
      </div>

      {/* Label */}
      <span
        className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] font-heading"
        style={{ color: `${color}bb` }}
      >
        {label}
      </span>
    </div>
  );
}

const SEGMENT_COLORS = [
  '#60a5fa', // days   — soft electric blue
  '#a78bfa', // hours  — gentle lavender violet
  '#f59e0b', // mins   — warm gold / amber
  '#f472b6', // secs   — soft rose
];

export function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days',    value: time.days },
    { label: 'Hours',   value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center items-end gap-3 sm:gap-5 min-h-[110px]">
      {units.map((unit, i) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 24, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <DigitSegment
            value={unit.value}
            label={unit.label}
            color={SEGMENT_COLORS[i]}
          />
        </motion.div>
      ))}
    </div>
  );
}
