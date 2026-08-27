import { useState } from 'react';
import { Sparkles, CheckCircle2, Lock, X } from 'lucide-react';
import type { Milestone } from '../data/elsaPresetData';

interface MilestoneCrystalsProps {
  milestones: Milestone[];
  totalDays: number;
  name: string;
}

export const MilestoneCrystals = ({
  milestones,
  totalDays,
  name,
}: MilestoneCrystalsProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-10 relative">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-heading-elsa tracking-wide flex items-center justify-center gap-2">
          <span>🏰</span>
          <span>{name} 的冰雪时光纪念册 (Milestones)</span>
          <span>🏰</span>
        </h2>
        <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">
          记录成长路上的每一个重要魔法时刻
        </p>
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {milestones.map((m) => {
          const isUnlocked = totalDays >= m.days;
          const daysRemaining = m.days - totalDays;

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMilestone({ ...m, isUnlocked })}
              className={`glass-frost-card p-5 rounded-2xl cursor-pointer text-center flex flex-col items-center justify-between border transition-all ${
                isUnlocked
                  ? 'border-cyan-300/60 bg-cyan-950/40 shadow-[0_0_20px_rgba(112,228,255,0.25)]'
                  : 'border-slate-700/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="text-4xl mb-2 animate-crown">{m.icon}</div>

              <h3 className="text-xs sm:text-sm font-bold text-white mb-1 line-clamp-1">
                {m.title}
              </h3>

              <p className="text-[11px] text-cyan-200/80 font-num mb-3">
                {m.days === 0 ? '出生第一天' : `第 ${m.days} 天`}
              </p>

              <div className="w-full pt-2.5 border-t border-cyan-400/20 flex items-center justify-center">
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    已解锁
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    还剩 {daysRemaining} 天
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="glass-frost-card bg-slate-950/95 p-8 rounded-3xl max-w-md w-full border-cyan-300/60 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full glass-frost-card text-cyan-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-6xl mb-4">{selectedMilestone.icon}</div>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              {selectedMilestone.isUnlocked ? '成长历程成就已达成' : '未来期待里程碑'}
            </span>

            <h3 className="text-2xl font-black text-heading-elsa my-2">
              {selectedMilestone.title}
            </h3>

            <p className="text-sm text-cyan-100/90 leading-relaxed my-5 bg-slate-950/60 p-5 rounded-2xl border border-cyan-500/30 shadow-inner">
              {selectedMilestone.description}
            </p>

            <button
              onClick={() => setSelectedMilestone(null)}
              className="glass-frost-btn w-full justify-center text-sm py-3 mt-2"
            >
              收入冰雪回忆盒 ❄️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
