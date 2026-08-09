import { useState, useEffect, memo } from 'react';

function MillisecondTickerComponent() {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    let animId: number;
    const update = () => {
      setMs(Math.floor((Date.now() % 1000) / 10));
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="glass-ice px-4 py-1.5 rounded-full text-xs text-cyan-200 flex items-center gap-2 border border-cyan-400/30 shadow-[0_0_12px_rgba(112,228,255,0.15)]">
      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
      <span>实时毫秒刻度：</span>
      <span className="font-num font-mono font-bold text-cyan-300 text-sm w-8 text-left">
        {String(ms).padStart(2, '0')}
      </span>
    </div>
  );
}

export const MillisecondTicker = memo(MillisecondTickerComponent);
