import { useState } from 'react';
import { Sparkles, Music } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';
import confetti from 'canvas-confetti';

interface NoteKey {
  note: string;
  name: string;
  freq: number;
  icon: string;
  color: string;
}

const LET_IT_GO_NOTES: NoteKey[] = [
  { note: 'F4', name: 'Do', freq: 698.46, icon: '❄️', color: 'from-cyan-500/30 to-sky-600/30' },
  { note: 'G4', name: 'Re', freq: 783.99, icon: '💎', color: 'from-sky-500/30 to-blue-600/30' },
  { note: 'Ab4', name: 'Mi', freq: 830.61, icon: '✨', color: 'from-indigo-500/30 to-purple-600/30' },
  { note: 'Bb4', name: 'Fa', freq: 932.33, icon: '🌟', color: 'from-purple-500/30 to-pink-600/30' },
  { note: 'C5', name: 'Sol', freq: 1046.5, icon: '👑', color: 'from-cyan-400/40 to-teal-500/40' },
  { note: 'Eb5', name: 'La', freq: 1244.51, icon: '🌸', color: 'from-sky-400/40 to-indigo-500/40' },
  { note: 'F5', name: 'Ti', freq: 1396.91, icon: '🏰', color: 'from-blue-400/40 to-purple-500/40' },
];

interface ElsaIcePianoProps {
  name: string;
}

export const ElsaIcePiano = ({ name }: ElsaIcePianoProps) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const handlePlayNote = (item: NoteKey) => {
    setActiveNote(item.note);
    frozenAudio.playBell(item.freq, 0.6);

    // Burst small icy magic particles
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#70e4ff', '#e0f8ff', '#c084fc', '#fbbf24'],
      scalar: 0.8,
    });

    setTimeout(() => setActiveNote(null), 300);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-10 relative">
      <div className="glass-frost-card p-6 sm:p-8 rounded-3xl border-cyan-300/50 shadow-2xl text-center relative overflow-hidden bg-gradient-to-b from-slate-950/80 via-cyan-950/20 to-slate-950/90">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-frost-card text-xs text-cyan-200 border border-cyan-400/30">
            <Music className="w-3.5 h-3.5 text-cyan-300" />
            <span>Elsa's Magical Ice Chime</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-heading-elsa tracking-wide flex items-center justify-center gap-2 my-1">
          <span>🎹</span>
          <span>艾莎的冰雪魔法音律琴</span>
          <span>🎹</span>
        </h2>
        <p className="text-xs sm:text-sm text-cyan-200/80 mb-6 font-light">
          点击下方的冰晶琴键，帮 {name} 奏响属于她的《Let It Go》魔法乐章！
        </p>

        {/* 7 Crystal Keys Row */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 max-w-2xl mx-auto my-4">
          {LET_IT_GO_NOTES.map((item) => {
            const isActive = activeNote === item.note;

            return (
              <button
                key={item.note}
                onClick={() => handlePlayNote(item)}
                className={`py-6 sm:py-8 rounded-2xl border transition-all flex flex-col items-center justify-between cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'border-white bg-gradient-to-t from-cyan-400/60 to-white/60 scale-95 shadow-[0_0_25px_rgba(112,228,255,0.9)]'
                    : `border-cyan-400/30 bg-gradient-to-b ${item.color} hover:border-cyan-300 hover:scale-105 shadow-lg`
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-2 animate-crown">{item.icon}</span>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">{item.name}</div>
                  <div className="text-[10px] text-cyan-200/70 font-num">{item.note}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-cyan-300/60 flex items-center justify-center gap-1 mt-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>带有迪士尼原声高音音律 · 自由指尖弹奏</span>
        </div>
      </div>
    </div>
  );
};
