'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

export function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 min-h-[85px] sm:min-h-[110px]">
      {units.map((unit, i) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-xl px-4 py-3 sm:px-6 sm:py-4 min-w-[85px] sm:min-w-[120px] min-h-[85px] sm:min-h-[110px] flex flex-col justify-center items-center text-center glow"
        >
          <div className="text-2xl sm:text-4xl font-bold gradient-text tabular-nums leading-none">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2 leading-none">{unit.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
