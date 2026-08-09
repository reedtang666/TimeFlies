import { memo } from 'react';
import { Sparkles, Settings, Share2, Volume2, VolumeX, Wand2 } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';

interface ElsaHeaderProps {
  name: string;
  quote: string;
  avatarUrl: string;
  theme: string;
  isMuted: boolean;
  onToggleAudio: () => void;
  onOpenSettings: () => void;
  onCastMagic: () => void;
  onOpenShare: () => void;
}

function ElsaHeaderComponent({
  name,
  quote,
  avatarUrl,
  isMuted,
  onToggleAudio,
  onOpenSettings,
  onCastMagic,
  onOpenShare,
}: ElsaHeaderProps) {
  const handleMagicClick = () => {
    frozenAudio.playMagicSpell();
    onCastMagic();
  };

  const handleAudioClick = () => {
    frozenAudio.playBell(1500, 0.3);
    frozenAudio.toggleAmbientMusic(isMuted);
    onToggleAudio();
  };

  return (
    <header className="relative w-full max-w-4xl mx-auto pt-8 pb-4 px-4 text-center z-10 flex flex-col items-center">
      {/* Top Floating Controls Bar */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          onClick={handleMagicClick}
          className="glass-frost-btn text-xs sm:text-sm"
        >
          <Wand2 className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>释放冰雪魔法 ❄️</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAudioClick}
            className="p-3 rounded-full glass-frost-card text-cyan-200 hover:text-white transition-all"
            title={isMuted ? "开启魔法沉浸音乐" : "静音"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />}
          </button>

          <button
            onClick={() => {
              frozenAudio.playBell(1200, 0.2);
              onOpenShare();
            }}
            className="p-3 rounded-full glass-frost-card text-cyan-200 hover:text-white transition-all"
            title="生成冰雪海报"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              frozenAudio.playBell(800, 0.2);
              onOpenSettings();
            }}
            className="p-3 rounded-full glass-frost-card text-cyan-200 hover:text-white transition-all"
            title="定制信息"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Princess Avatar Medallion with Crown & Ice Glow */}
      <div className="relative group mb-6">
        {/* Animated Multi-Ring Aurora Halo */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition duration-700 animate-halo"></div>

        {/* Golden Floating Crown */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-3xl sm:text-4xl animate-crown drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
          👑
        </div>

        {/* Crystalline Glass Avatar Frame */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-cyan-200/90 shadow-[0_0_40px_rgba(112,228,255,0.5)] p-1 bg-slate-950/80 backdrop-blur-xl">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/40 to-purple-600/40 flex items-center justify-center text-5xl">
              ❄️
            </div>
          )}
        </div>
      </div>

      {/* Title & Princess Quote Header */}
      <div className="space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-frost-card text-xs text-cyan-200 border border-cyan-300/40 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span className="tracking-widest font-semibold uppercase">Disney Frozen Time Capsule</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-wide text-heading-elsa">
          {name} 小公主的冰雪奇缘
        </h1>

        <p className="text-sm sm:text-base text-cyan-100/90 font-light italic max-w-md mx-auto leading-relaxed px-2 drop-shadow">
          {quote || '“做你自己的女王，勇敢去光芒亮丽闪耀吧！”'}
        </p>
      </div>
    </header>
  );
}

export const ElsaHeader = memo(ElsaHeaderComponent);
