import { memo } from 'react';

function ElsaCastleGraphicComponent() {
  return (
    <div className="w-full max-w-5xl mx-auto my-8 relative px-4 pointer-events-none select-none">
      <div className="relative w-full h-32 sm:h-48 flex items-end justify-center overflow-hidden rounded-3xl glass-frost-card border-cyan-400/30">
        {/* Glow Aurora Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-purple-500/10 to-transparent"></div>

        {/* SVG Ice Castle Spires Silhouette */}
        <svg
          viewBox="0 0 1200 300"
          className="w-full h-full text-cyan-200/40 fill-current drop-shadow-[0_0_15px_rgba(112,228,255,0.4)]"
          preserveAspectRatio="none"
        >
          {/* Main Spires */}
          <path d="M0,300 L0,220 L50,180 L100,220 L150,160 L200,230 L250,140 L300,220 L350,100 L400,210 L450,150 L500,240 L550,80 L600,0 L650,80 L700,240 L750,150 L800,210 L850,100 L900,220 L950,140 L1000,230 L1050,160 L1100,220 L1150,180 L1200,220 L1200,300 Z" />
          {/* Accent Windows / Stars */}
          <polygon points="600,40 595,55 605,55" fill="#ffffff" opacity="0.9" />
          <polygon points="350,120 346,132 354,132" fill="#ffffff" opacity="0.8" />
          <polygon points="850,120 846,132 854,132" fill="#ffffff" opacity="0.8" />
        </svg>

        {/* Floating Text Overlay */}
        <div className="absolute bottom-4 text-center">
          <span className="text-xs tracking-widest text-cyan-200 uppercase font-semibold font-heading drop-shadow">
            🏰 阿伦黛尔冰雪城堡 · Arendelle Ice Palace 🏰
          </span>
        </div>
      </div>
    </div>
  );
}

export const ElsaCastleGraphic = memo(ElsaCastleGraphicComponent);
