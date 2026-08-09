import { memo } from 'react';
import { type GrowthTime, formatNumberWithCommas } from '../utils/timeCalculator';
import { MillisecondTicker } from './MillisecondTicker';

interface TimerDisplayProps {
  growthTime: GrowthTime;
  name: string;
}

function TimerDisplayComponent({ growthTime, name }: TimerDisplayProps) {
  if (!growthTime.isValid) {
    return (
      <div className="glass-frost-card p-8 max-w-lg mx-auto text-center my-8 border-rose-400/40">
        <p className="text-rose-300 text-lg">⚠️ 请设置有效的出生日期与时间</p>
      </div>
    );
  }

  const timeUnits = [
    { label: '年 / Years', value: growthTime.years, unit: '岁' },
    { label: '月 / Months', value: growthTime.months, unit: '个月' },
    { label: '天 / Days', value: growthTime.days, unit: '天' },
    { label: '小时 / Hours', value: growthTime.hours, unit: '时' },
    { label: '分钟 / Mins', value: growthTime.minutes, unit: '分' },
    { label: '秒钟 / Secs', value: growthTime.seconds, unit: '秒' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-8 z-10 relative">
      {/* Featured Banner: Total Days & Hours with Ice Palace Visuals */}
      <div className="glass-frost-card p-8 sm:p-10 text-center mb-8 border-cyan-300/50 shadow-[0_0_50px_rgba(112,228,255,0.2)] relative overflow-hidden ice-shimmer-bg">
        {/* Background Castle Watermark */}
        <div className="absolute right-4 bottom-2 text-8xl opacity-15 pointer-events-none select-none">
          🏰
        </div>

        <p className="text-xs sm:text-sm tracking-widest text-cyan-200 uppercase font-semibold mb-2">
          ✨ 陪伴 {name} 到来地球已过 ✨
        </p>

        <div className="flex items-baseline justify-center gap-3 my-3">
          <span className="text-5xl sm:text-7xl md:text-8xl font-black text-num-crystal tracking-tight">
            {formatNumberWithCommas(growthTime.totalDays)}
          </span>
          <span className="text-xl sm:text-3xl font-extrabold text-cyan-200">天</span>
        </div>

        <p className="text-xs sm:text-base text-cyan-100/90 font-light mt-2">
          相当于 <span className="font-num font-bold text-gold-glow text-lg sm:text-xl px-1">{formatNumberWithCommas(growthTime.totalHours)}</span> 小时 闪耀时光
        </p>
      </div>

      {/* Grid of Crystalline Time Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {timeUnits.map((item, idx) => (
          <div
            key={idx}
            className="glass-frost-card p-4 sm:p-5 text-center flex flex-col justify-between relative group"
          >
            <span className="text-[10px] sm:text-xs text-cyan-200/80 font-medium tracking-wider">
              {item.label}
            </span>

            <div className="my-3">
              <span className="text-3xl sm:text-5xl font-black text-num-crystal group-hover:scale-105 transition-transform inline-block">
                {String(item.value).padStart(2, '0')}
              </span>
            </div>

            <span className="text-xs text-cyan-200/70 font-medium">
              {item.unit}
            </span>
          </div>
        ))}
      </div>

      {/* Millisecond Live Ticker */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <MillisecondTicker />
      </div>
    </div>
  );
}

export const TimerDisplay = memo(TimerDisplayComponent);
