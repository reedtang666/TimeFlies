import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Disc,
} from 'lucide-react';
import { frozenAudio, type AudioState } from '../utils/audioSystem';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const FloatingMusicBar: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>(() => frozenAudio.getState());
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const unsubscribe = frozenAudio.subscribe((state) => {
      setAudioState(state);
      if (!isSeeking) {
        setSeekTime(state.currentTime);
      }
    });
    return unsubscribe;
  }, [isSeeking]);

  const handleTogglePlay = () => {
    frozenAudio.playBell(1300, 0.2);
    if (audioState.isPlaying) {
      frozenAudio.pause();
    } else {
      frozenAudio.play();
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSeekTime(val);
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    frozenAudio.seek(val);
    setIsSeeking(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    frozenAudio.setVolume(vol);
  };

  const currentDisplayTime = isSeeking ? seekTime : audioState.currentTime;
  const progressPercent =
    audioState.duration > 0 ? (currentDisplayTime / audioState.duration) * 100 : 0;

  // Mini collapsed button when user collapses the bar
  if (isCollapsed) {
    return (
      <div className="fixed bottom-5 right-5 z-[60] animate-fadeIn">
        <button
          onClick={() => setIsCollapsed(false)}
          className={`p-3 rounded-full glass-frost-card bg-slate-950/90 border border-cyan-300/60 shadow-[0_0_25px_rgba(112,228,255,0.4)] text-cyan-200 hover:text-white hover:scale-110 transition-all flex items-center gap-2 ${
            audioState.isPlaying ? 'ring-2 ring-cyan-400 animate-pulse' : ''
          }`}
          title="展开音乐播放控制栏"
        >
          <Disc className={`w-5 h-5 text-cyan-300 ${audioState.isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span className="text-xs font-bold text-white pr-1 hidden sm:inline">
            {audioState.isPlaying ? 'Let It Go 🎶' : '音乐控制 🎵'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-cyan-300" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-xl px-2 animate-fadeIn">
      <div className="glass-frost-card bg-slate-950/90 backdrop-blur-2xl p-3 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-full border border-cyan-300/50 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(112,228,255,0.2)] flex flex-col gap-2">
        {/* Main Control Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Disc Icon & Track info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`w-9 h-9 rounded-full bg-cyan-950/80 border border-cyan-300/60 flex items-center justify-center text-cyan-300 shrink-0 shadow-md ${
                audioState.isPlaying ? 'shadow-[0_0_15px_rgba(112,228,255,0.5)]' : ''
              }`}
            >
              <Disc
                className={`w-5 h-5 ${audioState.isPlaying ? 'animate-spin' : ''}`}
                style={{ animationDuration: '4s' }}
              />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[220px]">
                  {frozenAudio.isUsingDefaultLocal()
                    ? '《Let It Go》- 冰雪奇缘'
                    : '自定义背景音轨'}
                </span>
                {audioState.isPlaying && (
                  <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    <Sparkles className="w-2.5 h-2.5 animate-spin" />
                    播放中
                  </span>
                )}
              </div>

              {/* Time Indicators */}
              <div className="text-[10px] text-cyan-300/80 font-mono flex items-center gap-1">
                <span className="font-semibold text-cyan-200">
                  {formatTime(currentDisplayTime)}
                </span>
                <span>/</span>
                <span>{formatTime(audioState.duration)}</span>
                <span className="hidden sm:inline text-[9px] text-cyan-400/60 ml-1">
                  (已记住进度)
                </span>
              </div>
            </div>
          </div>

          {/* Center: Play/Pause Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTogglePlay}
              className="p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(112,228,255,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              title={audioState.isPlaying ? '暂停' : '播放'}
            >
              {audioState.isPlaying ? (
                <Pause className="w-4 h-4 fill-slate-950" />
              ) : (
                <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
              )}
            </button>
          </div>

          {/* Right: Volume & Collapse controls */}
          <div className="flex items-center gap-1.5 shrink-0 relative">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white text-xs transition-colors"
              title="调节音量"
            >
              {audioState.isMuted || audioState.volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-300" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Floating volume popup */}
            {showVolume && (
              <div className="absolute bottom-12 right-0 p-3 rounded-2xl glass-frost-card bg-slate-950/95 border border-cyan-400/50 shadow-2xl flex flex-col items-center gap-2 w-10 animate-fadeIn">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioState.isMuted ? 0 : audioState.volume}
                  onChange={handleVolumeChange}
                  className="h-20 w-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 [writing-mode:bt-lr] [-webkit-appearance:slider-vertical]"
                />
                <button
                  onClick={() => frozenAudio.toggleMute()}
                  className="text-[10px] text-cyan-300 hover:text-white"
                >
                  {audioState.isMuted ? '静音' : `${Math.round(audioState.volume * 100)}%`}
                </button>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white text-xs transition-colors"
              title="收起播放器"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom: Draggable & Clickable Progress Scrubber Bar */}
        <div className="w-full px-1 relative flex items-center group">
          <div className="w-full relative flex items-center">
            {/* Background Track */}
            <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden border border-cyan-500/20 pointer-events-none">
              {/* Glowing Active Progress fill */}
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 rounded-full shadow-[0_0_10px_rgba(112,228,255,0.8)] transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Native Slider Input overlaid on top for precise touch & mouse dragging */}
            <input
              type="range"
              min="0"
              max={audioState.duration || 225}
              step="0.5"
              value={currentDisplayTime}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="拖动跳转播放进度"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
