import { memo } from 'react';
import { Heart, Wind, Sun, Moon } from 'lucide-react';
import { type GrowthTime, formatNumberWithCommas } from '../utils/timeCalculator';

interface LifeStatsProps {
  growthTime: GrowthTime;
  name: string;
}

function LifeStatsComponent({ growthTime, name }: LifeStatsProps) {
  if (!growthTime.isValid) return null;

  const stats = [
    {
      title: '在地球上的心跳',
      value: formatNumberWithCommas(growthTime.heartbeats),
      unit: '次',
      icon: <Heart className="w-6 h-6 text-rose-400 animate-heartbeat" />,
      desc: '每一次心跳，都是生命的奇迹',
      accentColor: 'border-rose-400/40 bg-rose-950/20',
    },
    {
      title: '呼吸魔法气息',
      value: formatNumberWithCommas(growthTime.breaths),
      unit: '次',
      icon: <Wind className="w-6 h-6 text-sky-300 animate-pulse" />,
      desc: '感受世界风吹与纯真快乐',
      accentColor: 'border-sky-400/40 bg-sky-950/20',
    },
    {
      title: '度过的清晨与落日',
      value: formatNumberWithCommas(growthTime.sunrises),
      unit: '个',
      icon: <Sun className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '25s' }} />,
      desc: `温情陪伴 ${name} 每一个美好的早安`,
      accentColor: 'border-amber-400/40 bg-amber-950/20',
    },
    {
      title: '奇幻梦境探索时长',
      value: formatNumberWithCommas(growthTime.sleepDays),
      unit: '天',
      icon: <Moon className="w-6 h-6 text-indigo-300" />,
      desc: '在阿伦黛尔城堡的甜美梦乡',
      accentColor: 'border-indigo-400/40 bg-indigo-950/20',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-10 relative">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-heading-elsa tracking-wide flex items-center justify-center gap-2">
          <span>✨</span>
          <span>生命的奇迹维度 (Life Metrics)</span>
          <span>✨</span>
        </h2>
        <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">
          用心记录 {name} 每一个微小而伟大的时刻
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`glass-frost-card p-6 rounded-2xl flex items-start gap-4 ${item.accentColor} relative overflow-hidden`}
          >
            <div className="p-3.5 rounded-xl glass-frost-card border border-white/30 shrink-0 shadow-lg">
              {item.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-cyan-200 font-semibold">
                  {item.title}
                </span>
                <span className="text-xs text-cyan-300/70 font-num">{item.unit}</span>
              </div>

              <div className="my-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-num-crystal tracking-wide">
                  {item.value}
                </span>
              </div>

              <p className="text-xs text-cyan-100/70 truncate">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const LifeStats = memo(LifeStatsComponent);
