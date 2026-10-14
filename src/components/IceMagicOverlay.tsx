import { useEffect, useState, memo, useRef } from 'react';

interface IceMagicOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

function IceMagicOverlayComponent({ isActive, onComplete }: IceMagicOverlayProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; rotation: number; icon: string }>>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Generate 50 bursting ice shards and snowflakes
    const items: Array<{ id: number; x: number; y: number; size: number; rotation: number; icon: string }> = [];
    const icons = ['❄️', '✦', '💎', '✨', '❄', '✧', '👑'];

    for (let i = 0; i < 50; i++) {
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

    // Guaranteed auto-complete after 1800ms regardless of parent re-renders
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 1800);

    return () => clearTimeout(timer);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer select-none animate-fadeIn"
      title="点击即可跳过魔法动画"
    >
      {/* 1. Ice Screen Flash (Gentle soft glow rather than infinite strobe flashing) */}
      <div className="absolute inset-0 bg-cyan-400/10 backdrop-blur-[2px] transition-opacity duration-1000 ease-out"></div>

      {/* 2. Expanding Ice Magic Ring */}
      <div
        className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border-4 border-cyan-300/80 shadow-[0_0_80px_rgba(112,228,255,0.6)] flex items-center justify-center animate-spin pointer-events-none"
        style={{ animationDuration: '6s' }}
      >
        <div className="absolute inset-2 rounded-full border-2 border-purple-400/60 border-dashed"></div>
        <div className="text-cyan-200 text-6xl opacity-90 animate-pulse">❄️</div>
      </div>

      {/* 3. Bursting Shards & Starburst */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-2xl sm:text-4xl transition-all duration-1000 ease-out font-num pointer-events-none"
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
