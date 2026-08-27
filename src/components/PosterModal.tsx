import { useRef, useState } from 'react';
import { X, Download, Sparkles, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { type GrowthTime, formatNumberWithCommas } from '../utils/timeCalculator';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  dob: string;
  quote: string;
  avatarUrl: string;
  growthTime: GrowthTime;
}

export const PosterModal = ({
  isOpen,
  onClose,
  name,
  dob,
  quote,
  avatarUrl,
  growthTime,
}: PosterModalProps) => {
  if (!isOpen) return null;

  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      setIsGenerating(true);
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `${name}-冰雪成长纪念卡.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate poster:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="glass-frost-card bg-slate-950/95 p-6 rounded-3xl max-w-md w-full border-cyan-300/40 shadow-2xl relative my-8 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-300" />
          <h2 className="text-lg font-bold font-heading text-white">
            艾莎魔法纪念海报预览
          </h2>
        </div>

        {/* Poster Canvas Frame to Capture */}
        <div
          ref={posterRef}
          className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-cyan-400/40 shadow-2xl text-center relative overflow-hidden my-4"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-2 left-2 text-2xl opacity-30">❄️</div>
          <div className="absolute top-2 right-2 text-2xl opacity-30">❄️</div>
          <div className="absolute bottom-2 left-2 text-2xl opacity-30">✨</div>
          <div className="absolute bottom-2 right-2 text-2xl opacity-30">🏰</div>

          {/* Avatar Medallion */}
          <div className="w-20 h-20 mx-auto rounded-full p-1 border border-cyan-300/60 bg-slate-900 overflow-hidden mb-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">👑</div>
            )}
          </div>

          <span className="text-[10px] tracking-widest uppercase text-cyan-300 font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/30">
            ❄️ Frozen Time Capsule ❄️
          </span>

          <h3 className="text-xl font-black font-heading text-white my-2">
            {name} 小公主
          </h3>

          <p className="text-xs text-cyan-200/80 italic mb-4 max-w-xs mx-auto">
            {quote || '“做你自己的女王，勇敢去光芒亮丽闪耀吧！”'}
          </p>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/30 mb-4">
            <p className="text-xs text-cyan-300 mb-1">陪伴来到地球已过</p>
            <div className="text-4xl font-black font-num gradient-text-ice">
              {formatNumberWithCommas(growthTime.totalDays)} <span className="text-base text-cyan-200">天</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-cyan-500/20 text-xs font-num">
              <div>
                <div className="text-white font-bold">{growthTime.years}</div>
                <div className="text-[10px] text-cyan-300/70">岁</div>
              </div>
              <div>
                <div className="text-white font-bold">{growthTime.months}</div>
                <div className="text-[10px] text-cyan-300/70">个月</div>
              </div>
              <div>
                <div className="text-white font-bold">{growthTime.days}</div>
                <div className="text-[10px] text-cyan-300/70">天</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-cyan-300/60 flex items-center justify-between px-2 pt-2 border-t border-cyan-500/20">
            <span>记录起始: {dob.replace('T', ' ')}</span>
            <span>TimeFlies ⏱️</span>
          </div>
        </div>

        <button
          onClick={handleDownloadPoster}
          disabled={isGenerating}
          className="glass-frost-btn w-full justify-center text-sm py-3 mt-2 bg-cyan-500/30 hover:bg-cyan-500/50 border-cyan-300 text-white font-bold"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
              <span>正在生成高清冰雪海报...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-cyan-300" />
              <span>保存海报到手机/电脑 📲</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
