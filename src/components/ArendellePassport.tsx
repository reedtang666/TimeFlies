import { useRef, useState } from 'react';
import { Crown, ShieldCheck, Award, Camera } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';
import { processAvatarImage } from '../utils/imageHelper';
import confetti from 'canvas-confetti';

interface ArendellePassportProps {
  name: string;
  dob: string;
  avatarUrl: string;
  onUpdateAvatar?: (newAvatarUrl: string) => void;
  onRequestCrop?: (file: File) => void;
}

export const ArendellePassport = ({
  name,
  dob,
  avatarUrl,
  onUpdateAvatar,
  onRequestCrop,
}: ArendellePassportProps) => {
  const [isStamped, setIsStamped] = useState(false);
  const passportFileInputRef = useRef<HTMLInputElement>(null);

  const handleStampPassport = () => {
    if (!isStamped) {
      setIsStamped(true);
      frozenAudio.playMagicSpell();

      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#70e4ff', '#fbbf24', '#ffffff'],
      });
    }
  };

  const handlePassportAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onRequestCrop) {
        onRequestCrop(file);
      } else {
        try {
          const dataUrl = await processAvatarImage(file, 512, 0.9);
          frozenAudio.playMagicSpell();
          onUpdateAvatar?.(dataUrl);
        } catch (err) {
          alert(err instanceof Error ? err.message : '上传图片失败');
        }
      }
    }
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-10 relative">
      {/* Hidden File Input for Passport Avatar Upload */}
      <input
        ref={passportFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePassportAvatarChange}
      />

      <div className="glass-frost-card p-6 sm:p-8 rounded-3xl border-cyan-300/60 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950/40 to-slate-950">
        {/* Top Passport Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-cyan-400/20 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl glass-frost-card flex items-center justify-center text-3xl border border-cyan-300/50 shadow-md">
              ❄️
            </div>
            <div className="text-left">
              <div className="text-xs text-cyan-300 font-semibold uppercase tracking-widest flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                Kingdom of Arendelle Official Passport
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-heading-elsa">
                阿伦黛尔冰雪王国 · 皇家小公主通行证
              </h2>
            </div>
          </div>

          <button
            onClick={handleStampPassport}
            className={`glass-frost-btn text-xs py-2 px-4 flex items-center gap-1.5 ${
              isStamped ? 'border-emerald-400 text-emerald-300' : 'border-amber-400 text-amber-300'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>{isStamped ? '已加盖艾莎女王皇家魔法金印 ✨' : '点击盖上艾莎女王皇家金印 👑'}</span>
          </button>
        </div>

        {/* Passport Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Avatar with Royal Medallion */}
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => passportFileInputRef.current?.click()}
              title="点击更换护照照片"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-cyan-300/80 shadow-2xl p-1 bg-slate-900 group-hover:scale-105 transition-transform duration-300">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-cyan-900 flex items-center justify-center text-4xl">
                    👑
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-950/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-cyan-200">
                  <Camera className="w-5 h-5 text-cyan-300 mb-1" />
                  <span className="text-[10px] font-bold text-white">更换照片</span>
                </div>
              </div>

              {/* Camera icon badge */}
              <div className="absolute -bottom-1 -right-1 z-20 w-7 h-7 rounded-full bg-cyan-600 border border-cyan-200 text-white shadow-md flex items-center justify-center">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-xs font-bold text-amber-300 px-3 py-1 rounded-full glass-frost-card border border-amber-400/40">
                阿伦黛尔 · 首席小公主
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="md:col-span-2 space-y-3 text-left bg-slate-950/60 p-5 rounded-2xl border border-cyan-500/30 shadow-inner relative">
            {/* Royal Stamp Watermark */}
            {isStamped && (
              <div className="absolute right-4 bottom-4 w-24 h-24 rounded-full border-4 border-amber-400/80 flex flex-col items-center justify-center text-amber-300 rotate-[-12deg] animate-scaleIn shadow-[0_0_20px_rgba(251,191,36,0.5)] bg-amber-950/30">
                <span className="text-2xl">👑</span>
                <span className="text-[9px] font-black tracking-widest uppercase">APPROVED</span>
                <span className="text-[8px]">QUEEN ELSA</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-cyan-300/70 block">皇家姓名 (Royal Name):</span>
                <span className="text-white font-black text-base">{name} 小公主</span>
              </div>

              <div>
                <span className="text-cyan-300/70 block">守护者 (Royal Guardians):</span>
                <span className="text-white font-bold text-sm">最最爱你的爸爸妈妈 💖</span>
              </div>

              <div>
                <span className="text-cyan-300/70 block">降临星海日期 (Birthdate):</span>
                <span className="text-cyan-100 font-num font-bold text-sm">
                  {dob ? dob.replace('T', ' ') : '阿伦黛尔魔法元年'}
                </span>
              </div>

              <div>
                <span className="text-cyan-300/70 block">皇家护照编号 (Passport No):</span>
                <span className="text-gold-glow font-num font-bold text-sm">FROZEN-2026-QUEEN</span>
              </div>
            </div>

            <div className="pt-2 border-t border-cyan-500/20 text-[11px] text-cyan-200/80 italic">
              “受艾莎女王 (Queen Elsa) 与安娜女王 (Queen Anna) 的特许守护，持本护照者有权在全宇宙拥有无限的快乐、自由与爱！”
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>官方皇家身份真实有效 · 永不过期</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
