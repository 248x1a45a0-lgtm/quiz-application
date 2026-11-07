import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-1 text-xs font-semibold select-none bg-slate-900 text-slate-200 dark:bg-slate-950 dark:text-slate-300 transition-colors">
      <span className="tracking-wide">{time}</span>
      <div className="flex items-center space-x-2">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-0.5">
          <span className="text-[10px]">98%</span>
          <Battery className="w-4 h-4 fill-current" />
        </div>
      </div>
    </div>
  );
};
