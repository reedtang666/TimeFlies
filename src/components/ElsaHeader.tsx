import { memo, useRef, useState } from 'react';
import { Sparkles, Settings, Share2, Volume2, VolumeX, Wand2, Camera, UploadCloud } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';
import { processAvatarImage } from '../utils/imageHelper';

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
  onUpdateAvatar?: (newAvatarUrl: string) => void;
  onRequestCrop?: (file: File) => void;
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
  onUpdateAvatar,
  onRequestCrop,
}: ElsaHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMagicClick = () => {
    frozenAudio.playMagicSpell();
    onCastMagic();
  };

  const handleAudioClick = () => {
    frozenAudio.playBell(1500, 0.3);
    frozenAudio.toggleAmbientMusic(isMuted);
    onToggleAudio();
  };

  const handleAvatarFile = async (file: File) => {
    setErrorMessage(null);
    if (onRequestCrop) {
      onRequestCrop(file);
      return;
    }

    try {
      setIsUploading(true);
      const dataUrl = await processAvatarImage(file, 512, 0.9);
      frozenAudio.playMagicSpell();
      onUpdateAvatar?.(dataUrl);
    } catch (err) {
      console.error('Failed to process avatar:', err);
      const msg = err instanceof Error ? err.message : '上传图片失败，请重试';
      setErrorMessage(msg);
      setTimeout(() => {
        setErrorMessage((prev) => (prev === msg ? null : prev));
      }, 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarFile(file);
    }
    // reset input value so the same file can be re-uploaded if needed
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleAvatarFile(file);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="relative w-full max-w-4xl mx-auto pt-8 pb-4 px-4 text-center z-10 flex flex-col items-center">
      {/* Hidden File Input for Avatar Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

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
            className="p-3 rounded-full glass-frost-card text-cyan-200 hover:text-white transition-all flex items-center gap-1.5 px-4"
            title={isMuted ? "播放《冰雪奇缘》主题曲《Let It Go》" : "暂停背景音乐"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-cyan-300" />
                <span className="text-xs font-semibold">🎵 播放《Let It Go》</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span className="text-xs font-semibold text-cyan-300 animate-pulse">🎶 正在播放《Let It Go》</span>
              </>
            )}
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

      {/* Floating Upload Error Banner */}
      {errorMessage && (
        <div className="mb-4 px-4 py-2.5 rounded-2xl bg-rose-950/90 border border-rose-400/60 text-rose-100 text-xs shadow-xl max-w-md animate-fadeIn flex items-center justify-between gap-3 backdrop-blur-md">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setErrorMessage(null);
            }}
            className="text-rose-300 hover:text-white font-bold text-sm px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Princess Avatar Medallion with Crown, Ice Glow & Direct Upload Trigger */}
      <div
        className="relative group mb-6 cursor-pointer select-none"
        onClick={triggerSelectFile}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title="点击或将照片拖拽至此处，更换电脑/手机头像"
      >
        {/* Animated Multi-Ring Aurora Halo */}
        <div
          className={`absolute -inset-4 bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 rounded-full blur-xl transition duration-700 animate-halo ${
            isDragging ? 'opacity-100 scale-110' : 'opacity-60 group-hover:opacity-90'
          }`}
        ></div>

        {/* Golden Floating Crown */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-3xl sm:text-4xl animate-crown drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] pointer-events-none">
          👑
        </div>

        {/* Crystalline Glass Avatar Frame */}
        <div
          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 shadow-[0_0_40px_rgba(112,228,255,0.5)] p-1 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 ${
            isDragging
              ? 'border-cyan-300 scale-105 ring-4 ring-cyan-400/50'
              : 'border-cyan-200/90 group-hover:border-cyan-300 group-hover:scale-105'
          }`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/40 to-purple-600/40 flex items-center justify-center text-5xl">
              ❄️
            </div>
          )}

          {/* Hover / Drag Frost Overlay */}
          <div
            className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm rounded-full flex flex-col items-center justify-center text-cyan-200 transition-opacity duration-300 p-2 ${
              isDragging || isUploading
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-1">
                <Sparkles className="w-6 h-6 text-cyan-300 animate-spin" />
                <span className="text-[11px] font-bold text-white">处理中...</span>
              </div>
            ) : isDragging ? (
              <div className="flex flex-col items-center gap-1">
                <UploadCloud className="w-7 h-7 text-cyan-300 animate-bounce" />
                <span className="text-[11px] font-bold text-cyan-200">松开上传</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera className="w-6 h-6 text-cyan-300 animate-pulse" />
                <span className="text-[11px] font-bold text-white tracking-wide">上传头像</span>
                <span className="text-[9px] text-cyan-300/80">点击选图</span>
              </div>
            )}
          </div>
        </div>

        {/* Floating Quick Action Badge */}
        <div className="absolute -bottom-1 -right-1 z-20 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 border-2 border-cyan-200 text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
          <Camera className="w-4 h-4 text-white" />
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
