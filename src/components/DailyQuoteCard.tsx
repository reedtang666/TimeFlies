import { useState } from 'react';
import { Sparkles, Dices, Quote } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';

const FROZEN_DAILY_CARDS = [
  {
    quote: '“做你自己的女王，勇敢去光芒亮丽闪耀吧！”',
    author: '艾莎女王 (Queen Elsa)',
    icon: '👑',
    bgGradient: 'from-cyan-950/60 to-sky-950/60',
  },
  {
    quote: '“只要有爱与温暖，就没有融化不了的冰雪。”',
    author: '安娜公主 (Princess Anna)',
    icon: '🌻',
    bgGradient: 'from-amber-950/60 to-purple-950/60',
  },
  {
    quote: '“有些值得你为之融化的人，就是家人。”',
    author: '雪宝 (Olaf)',
    icon: '⛄',
    bgGradient: 'from-blue-950/60 to-indigo-950/60',
  },
  {
    quote: '“拥抱改变，勇敢地踏入未知的奇妙之地 (Into the Unknown)。”',
    author: '阿伦黛尔冰雪契约',
    icon: '❄️',
    bgGradient: 'from-purple-950/60 to-cyan-950/60',
  },
];

interface DailyQuoteCardProps {
  name: string;
}

export const DailyQuoteCard = ({ name }: DailyQuoteCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleDrawNewCard = () => {
    frozenAudio.playMagicSpell();
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % FROZEN_DAILY_CARDS.length);
      setIsFlipping(false);
    }, 250);
  };

  const card = FROZEN_DAILY_CARDS[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-10 z-10 relative">
      <div className="glass-frost-card p-6 sm:p-8 rounded-3xl border-cyan-300/50 shadow-2xl relative overflow-hidden text-center bg-gradient-to-br from-cyan-950/30 via-slate-950/80 to-purple-950/30">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-frost-card text-xs text-cyan-200 border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>{name} 的每日冰雪祝福签卡</span>
          </div>

          <button
            onClick={handleDrawNewCard}
            disabled={isFlipping}
            className="glass-frost-btn text-xs py-1.5 px-3.5 flex items-center gap-1.5"
            title="抽取今日魔法签语"
          >
            <Dices className={`w-3.5 h-3.5 text-cyan-300 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>换一张魔法卡片 ✨</span>
          </button>
        </div>

        {/* Card Body with Flip Transition */}
        <div
          className={`transition-all duration-300 transform ${
            isFlipping ? 'scale-95 opacity-0 rotate-y-90' : 'scale-100 opacity-100'
          }`}
        >
          <div className="text-5xl my-3 animate-crown">{card.icon}</div>

          <div className="relative max-w-xl mx-auto my-3">
            <Quote className="w-6 h-6 text-cyan-400/40 absolute -top-3 -left-2" />
            <p className="text-base sm:text-xl font-bold font-serif text-white leading-relaxed px-6">
              {card.quote}
            </p>
            <Quote className="w-6 h-6 text-cyan-400/40 absolute -bottom-3 -right-2 rotate-180" />
          </div>

          <p className="text-xs text-cyan-300/80 font-semibold tracking-wider uppercase mt-3">
            —— {card.author} ——
          </p>
        </div>
      </div>
    </div>
  );
};
