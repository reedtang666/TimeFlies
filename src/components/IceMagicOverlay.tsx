import { useEffect, useState, memo } from 'react';

interface IceMagicOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

function IceMagicOverlayComponent({ isActive, onComplete }: IceMagicOverlayProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; rotation: number; icon: string }>>([]);

  useEffect(() => {
    if (!isActive) return;

    // Generate 60 bursting ice shards and snowflakes
    const items: Array<{ id: number; x: number; y: number; size: number; rotation: number; icon: string }> = [];
    const icons = ['❄️', '✦', '💎', '✨', '❄', '✧', '👑'];

    for (let i = 0; i < 60; i++) {
      items.push({
        id: i,
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        size: Math.random() * 2 + 1,
        rotation: Math.random() * 720 - 360,
        icon: icons[Math.floor(Math.random() * icons.length)],
      });
    }

    setParticles(items);

    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* 1. Ice Screen Flash */}
      <div className="absolute inset-0 bg-cyan-300/20 backdrop-blur-sm animate-ping duration-500"></div>

      {/* 2. Expanding Ice Magic Ring */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border-4 border-cyan-300/80 shadow-[0_0_100px_#70e4ff] flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
        <div className="absolute inset-2 rounded-full border-2 border-purple-400/60 border-dashed"></div>
        <div className="text-cyan-200 text-6xl opacity-80 animate-pulse">❄️</div>
      </div>

      {/* 3. Bursting Shards & Starburst */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-2xl sm:text-4xl transition-all duration-1000 ease-out font-num"
          style={{
            transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${p.size})`,
            opacity: 0,
            transitionProperty: 'transform, opacity',
            filter: 'drop-shadow(0 0 15px #70e4ff)',
          }}
        >
          {p.icon}
        </div>
      ))}
    </div>
  );
}

export const IceMagicOverlay = memo(IceMagicOverlayComponent);
