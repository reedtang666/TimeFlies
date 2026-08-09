import { useState } from 'react';
import { LockKeyhole, Mail, Sparkles, Heart, Calendar } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';

export interface TimeLetter {
  id: string;
  title: string;
  targetAge: number; // e.g. 18 years old
  targetDate: string; // YYYY-MM-DD
  sender: string;
  content: string;
  icon: string;
}

interface TimeCapsuleProps {
  currentAgeYears: number;
  name: string;
}

export const DEFAULT_LETTERS: TimeLetter[] = [
  {
    id: 'l1',
    title: '给 18 岁成人礼上的小女王 👑',
    targetAge: 18,
    targetDate: '未来 18 岁生日当天解锁',
    sender: '最最爱你的爸爸妈妈',
    content:
      '亲爱的宝贝，当你打开封印的这一刻，你已经长成了一位勇敢、自信、闪闪发光的女王！无论世界有多大，家永远是你最温暖的港湾。要永远相信爱与魔法，快乐自由地去探索属于你的星辰大海吧！',
    icon: '✉️',
  },
  {
    id: 'l2',
    title: '给 10 岁小公主的第一封信 🎈',
    targetAge: 10,
    targetDate: '10 岁生日特权信件',
    sender: '爸爸的秘密信箱',
    content:
      '十岁啦！现在的你应该学会了骑自行车，有了许多要好的小伙伴。愿你保持好奇心，勇敢去探索新奇的世界，做最真实美好的自己！',
    icon: '💌',
  },
];

export const TimeCapsule = ({ currentAgeYears, name }: TimeCapsuleProps) => {
  const [selectedLetter, setSelectedLetter] = useState<TimeLetter | null>(null);
  const [unlockedIds] = useState<string[]>([]);

  const handleOpenLetter = (letter: TimeLetter) => {
    const isReady = currentAgeYears >= letter.targetAge || unlockedIds.includes(letter.id);

    if (isReady) {
      frozenAudio.playMagicSpell();
      setSelectedLetter(letter);
    } else {
      frozenAudio.playBell(600, 0.4);
      alert(`🔒 这封信件被冰雪魔法封印中！需要等到 ${name} ${letter.targetAge} 岁生日当天才会自动开启哦！`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-12 z-10 relative">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-frost-card text-xs text-cyan-200 border border-cyan-400/30 mb-2">
          <Mail className="w-3.5 h-3.5 text-cyan-300" />
          <span>Disney Frozen Time Capsule Letters</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-heading-elsa tracking-wide flex items-center justify-center gap-2">
          <span>💌</span>
          <span>爸爸妈妈的时光寄语信箱</span>
          <span>💌</span>
        </h2>
        <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">
          封印着写给未来 {name} 的魔法书信，待时光成熟时自动解锁
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DEFAULT_LETTERS.map((letter) => {
          const isUnlocked = currentAgeYears >= letter.targetAge || unlockedIds.includes(letter.id);

          return (
            <div
              key={letter.id}
              onClick={() => handleOpenLetter(letter)}
              className={`glass-frost-card p-6 rounded-2xl cursor-pointer relative overflow-hidden transition-all flex flex-col justify-between border ${
                isUnlocked
                  ? 'border-cyan-300/60 bg-cyan-950/40 shadow-[0_0_25px_rgba(112,228,255,0.2)]'
                  : 'border-slate-700/60 opacity-90 hover:border-cyan-400/50'
              }`}
            >
              {/* Frozen Seal Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl glass-frost-card flex items-center justify-center text-2xl border border-white/20">
                  {letter.icon}
                </div>

                <div className="px-3 py-1 rounded-full glass-frost-card text-[11px] font-bold flex items-center gap-1.5 border border-cyan-400/30">
                  {isUnlocked ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 可随时重温
                    </span>
                  ) : (
                    <span className="text-amber-300 flex items-center gap-1">
                      <LockKeyhole className="w-3 h-3 text-amber-400" /> {letter.targetAge}岁封印中
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">{letter.title}</h3>
                <p className="text-xs text-cyan-200/70 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-300" /> {letter.targetDate}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs text-cyan-200/80 font-medium">
                <span>寄件人: {letter.sender}</span>
                <span className="text-cyan-300 font-bold underline underline-offset-2">
                  {isUnlocked ? '阅读信件 📖' : '查看魔法封印 🔒'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Letter Reading Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="glass-frost-card p-8 rounded-3xl max-w-lg w-full border-cyan-300/60 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full glass-frost-card text-cyan-300 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{selectedLetter.icon}</span>
              <div>
                <h3 className="text-xl font-black text-heading-elsa">{selectedLetter.title}</h3>
                <p className="text-xs text-cyan-300/70 font-medium">来自: {selectedLetter.sender}</p>
              </div>
            </div>

            {/* Letter Content Card */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-cyan-400/40 shadow-inner my-4 text-cyan-100 text-sm leading-relaxed font-serif relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 pointer-events-none select-none">
                ❄️
              </div>
              <p className="indent-6 mb-4">{selectedLetter.content}</p>
              <div className="text-right text-xs text-cyan-300 font-semibold mt-4">
                —— 永远爱你的爸爸妈妈 💖
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-cyan-300/60 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>爱是开启冰雪奇缘的唯一钥匙</span>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="glass-frost-btn text-xs py-2 px-5"
              >
                收好这封信 ❄️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
