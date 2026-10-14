import React, { useState, useEffect } from 'react';
import { LockKeyhole, Mail, Sparkles, Calendar, Plus, Edit3, Trash2, X, Check, ShieldCheck, Lock } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';
import { authSystem } from '../utils/authSystem';

export interface TimeLetter {
  id: string;
  title: string;
  targetAge: number; // e.g. 18 years old
  targetDate: string; // descriptive text
  sender: string;
  content: string;
  icon: string;
}

interface TimeCapsuleProps {
  currentAgeYears: number;
  name: string;
  onRequireAuth?: (actionHint: string, onSuccess: () => void) => void;
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

const STORAGE_KEY = 'timeflies_time_capsule_letters_v2';
const LETTER_ICONS = ['✉️', '💌', '🎈', '👑', '🎁', '🌟', '🌸', '💖', '🦄', '🕊️'];

export const TimeCapsule: React.FC<TimeCapsuleProps> = ({ currentAgeYears, name, onRequireAuth }) => {
  const [letters, setLetters] = useState<TimeLetter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load time capsule letters:', e);
    }
    return DEFAULT_LETTERS;
  });

  const [selectedLetter, setSelectedLetter] = useState<TimeLetter | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);
  const [sealedNoticeLetter, setSealedNoticeLetter] = useState<TimeLetter | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formTargetAge, setFormTargetAge] = useState(18);
  const [formSender, setFormSender] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIcon, setFormIcon] = useState('💌');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
    } catch (e) {
      console.warn('Failed to save time capsule letters:', e);
    }
  }, [letters]);

  // Check if current visitor has admin rights
  const isAdmin = authSystem.isAuthenticated();

  const handleCardClick = (letter: TimeLetter) => {
    const isReady = currentAgeYears >= letter.targetAge;

    if (isReady) {
      frozenAudio.playMagicSpell();
      setSelectedLetter(letter);
      return;
    }

    // If still sealed but already authenticated as admin
    if (authSystem.isAuthenticated()) {
      frozenAudio.playMagicSpell();
      setSelectedLetter(letter);
      return;
    }

    // Sealed notice for visitor/child
    frozenAudio.playBell(600, 0.4);
    setSealedNoticeLetter(letter);
  };

  const handleAdminOpenSealed = (letter: TimeLetter) => {
    const action = () => {
      setSealedNoticeLetter(null);
      setSelectedLetter(letter);
      frozenAudio.playMagicSpell();
    };

    if (onRequireAuth) {
      onRequireAuth('管理员特权查阅时光信件', action);
    } else {
      action();
    }
  };

  const handleStartCompose = () => {
    const action = () => {
      setEditingLetterId(null);
      setFormTitle('');
      setFormTargetAge(Math.max(10, Math.floor(currentAgeYears) + 1));
      setFormSender('最爱你的爸爸妈妈');
      setFormContent('');
      setFormIcon('💌');
      setIsComposing(true);
      frozenAudio.playBell(1200, 0.15);
    };

    if (onRequireAuth) {
      onRequireAuth('撰写并封印新的时光信件', action);
    } else {
      action();
    }
  };

  const handleStartEdit = (letter: TimeLetter) => {
    const action = () => {
      setEditingLetterId(letter.id);
      setFormTitle(letter.title);
      setFormTargetAge(letter.targetAge);
      setFormSender(letter.sender);
      setFormContent(letter.content);
      setFormIcon(letter.icon || '💌');
      setSelectedLetter(null);
      setIsComposing(true);
      frozenAudio.playBell(1100, 0.15);
    };

    if (onRequireAuth) {
      onRequireAuth('修改时光信件内容', action);
    } else {
      action();
    }
  };

  const handleDeleteLetter = (letterId: string, title: string) => {
    const action = () => {
      if (window.confirm(`确定要删除这封信件【${title}】吗？`)) {
        frozenAudio.playBell(700, 0.2);
        setLetters((prev) => prev.filter((l) => l.id !== letterId));
        setSelectedLetter(null);
      }
    };

    if (onRequireAuth) {
      onRequireAuth('删除时光信件', action);
    } else {
      action();
    }
  };

  const handleSaveCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert('请填写信件标题与信件正文');
      return;
    }

    if (editingLetterId) {
      // Update existing
      setLetters((prev) =>
        prev.map((l) =>
          l.id === editingLetterId
            ? {
                ...l,
                title: formTitle.trim(),
                targetAge: Number(formTargetAge),
                targetDate: `未来 ${formTargetAge} 岁生日当天解锁`,
                sender: formSender.trim() || '最爱你的爸爸妈妈',
                content: formContent.trim(),
                icon: formIcon,
              }
            : l
        )
      );
    } else {
      // Create new
      const newLetter: TimeLetter = {
        id: `letter-${Date.now()}`,
        title: formTitle.trim(),
        targetAge: Number(formTargetAge),
        targetDate: `未来 ${formTargetAge} 岁生日当天解锁`,
        sender: formSender.trim() || '最爱你的爸爸妈妈',
        content: formContent.trim(),
        icon: formIcon,
      };
      setLetters((prev) => [...prev, newLetter]);
    }

    frozenAudio.playMagicSpell();
    setIsComposing(false);
    setEditingLetterId(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-12 relative">
      {/* Header section */}
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
          封印着写给未来 {name} 的魔法书信 · 待时光成熟时自动解锁
        </p>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {letters.map((letter) => {
          const isUnlocked = currentAgeYears >= letter.targetAge;

          return (
            <div
              key={letter.id}
              onClick={() => handleCardClick(letter)}
              className={`glass-frost-card p-5 sm:p-6 rounded-2xl cursor-pointer relative overflow-hidden transition-all flex flex-col justify-between border group hover:scale-[1.02] duration-300 ${
                isUnlocked
                  ? 'border-cyan-300/60 bg-cyan-950/40 shadow-[0_0_25px_rgba(112,228,255,0.2)]'
                  : 'border-slate-700/60 bg-slate-950/60 opacity-95 hover:border-cyan-400/50'
              }`}
            >
              {/* Frozen Seal Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl glass-frost-card flex items-center justify-center text-2xl border border-white/20 group-hover:scale-110 transition-transform">
                  {letter.icon}
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="px-3 py-1 rounded-full glass-frost-card text-[11px] font-bold flex items-center gap-1.5 border border-cyan-400/30">
                    {isUnlocked ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 可随时重温
                      </span>
                    ) : (
                      <span className="text-amber-300 flex items-center gap-1">
                        <LockKeyhole className="w-3 h-3 text-amber-400" /> {letter.targetAge} 岁封印中
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                  {letter.title}
                </h3>
                <p className="text-xs text-cyan-200/70 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-300" /> {letter.targetDate}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs text-cyan-200/80 font-medium">
                <span className="truncate max-w-[150px]">寄件人: {letter.sender}</span>
                <span className="text-cyan-300 font-bold flex items-center gap-1 group-hover:text-white transition-colors">
                  {isUnlocked ? (
                    '阅读信件 📖'
                  ) : isAdmin ? (
                    <span className="text-cyan-200 flex items-center gap-1 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-400/30 text-[11px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> 管理员查看 👑
                    </span>
                  ) : (
                    '查看魔法封印 🔒'
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Add / Compose Time Letter Button */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleStartCompose}
          className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass-frost-card border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 hover:text-white bg-slate-900/60 hover:bg-cyan-950/60 shadow-[0_0_20px_rgba(112,228,255,0.15)] hover:shadow-[0_0_25px_rgba(112,228,255,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide">
            封印一封写给未来的时光信
          </span>
          <span className="text-[10px] text-cyan-300/70 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-400/20 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" /> 管理员专属
          </span>
        </button>
      </div>

      {/* Sealed Notice Modal (Shown to visitor/child when letter is not yet ready) */}
      {sealedNoticeLetter && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSealedNoticeLetter(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="glass-frost-card bg-slate-950/95 p-6 sm:p-7 rounded-3xl max-w-md w-full border-cyan-300/50 shadow-2xl relative text-center text-slate-100">
            <button
              onClick={() => setSealedNoticeLetter(null)}
              aria-label="关闭"
              className="absolute top-4 right-4 p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-3xl mx-auto mb-3 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
              🔒
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5 flex items-center justify-center gap-1.5">
              <span>冰雪魔法封印中</span>
            </h3>

            <p className="text-xs sm:text-sm text-cyan-200/80 leading-relaxed max-w-xs mx-auto mb-5">
              这封【{sealedNoticeLetter.title}】被艾莎的冰雪魔法紧紧守护着，需要等到 <span className="text-white font-bold">{name}</span> 满 <span className="text-amber-300 font-bold">{sealedNoticeLetter.targetAge} 周岁</span> 生日当天才会自动解封哦！
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleAdminOpenSealed(sealedNoticeLetter)}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-600/40 hover:bg-cyan-500/60 border border-cyan-300/60 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>我是爸爸/妈妈 · 管理员特权查阅 👑</span>
              </button>

              <button
                type="button"
                onClick={() => setSealedNoticeLetter(null)}
                className="w-full py-2 px-4 rounded-xl glass-frost-card text-xs text-slate-300 hover:text-white"
              >
                静待时光盛开 ❄️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Letter Reading Modal (Full Letter Content) */}
      {selectedLetter && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLetter(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn"
        >
          <div className="glass-frost-card bg-slate-950/95 p-6 sm:p-8 rounded-3xl max-w-lg w-full border-cyan-300/60 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setSelectedLetter(null)}
              aria-label="关闭"
              className="absolute top-4 right-4 p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Letter Header */}
            <div className="flex items-center gap-3 mb-4 pr-10">
              <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-cyan-950/50 border border-cyan-400/30">
                {selectedLetter.icon}
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-heading-elsa leading-tight">
                  {selectedLetter.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-cyan-300/70 font-medium">
                  <span>来自: {selectedLetter.sender}</span>
                  <span>·</span>
                  <span className="text-amber-300/80">{selectedLetter.targetAge} 岁封印</span>
                </div>
              </div>
            </div>

            {/* Letter Content Card */}
            <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-400/40 shadow-inner my-4 text-cyan-100 text-xs sm:text-sm leading-relaxed font-serif relative overflow-hidden whitespace-pre-line">
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 pointer-events-none select-none">
                ❄️
              </div>
              <p className="indent-6">{selectedLetter.content}</p>
              <div className="text-right text-xs text-cyan-300 font-semibold mt-4">
                —— {selectedLetter.sender} 💖
              </div>
            </div>

            {/* Modal Bottom Controls & Admin Actions */}
            <div className="pt-2 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleStartEdit(selectedLetter)}
                  className="glass-frost-btn text-xs py-2 px-3 text-cyan-200 hover:text-white border-cyan-400/40 flex items-center gap-1.5"
                  title="管理员修改信件"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-300" />
                  <span>编辑信件</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteLetter(selectedLetter.id, selectedLetter.title)}
                  className="glass-frost-btn text-xs py-2 px-3 text-rose-300 hover:text-white border-rose-500/40 flex items-center gap-1.5"
                  title="删除信件"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="glass-frost-btn text-xs py-2 px-5 w-full sm:w-auto justify-center"
              >
                收好这封信 ❄️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose / Edit Modal (Admin Only) */}
      {isComposing && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsComposing(false);
          }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="glass-frost-card bg-slate-950/95 rounded-3xl max-w-lg w-full border-cyan-300/40 shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <h3 className="text-lg font-bold text-white">
                  {editingLetterId ? '编辑时光寄语信件' : '封印一封写给未来的时光信'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="p-1.5 rounded-full glass-frost-card text-cyan-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCompose} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-4 custom-scrollbar">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-cyan-200 mb-1.5">
                    信件主题 / 标题
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="例如：给 18 岁成人礼上的小女王 👑"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-xs sm:text-sm"
                    required
                  />
                </div>

                {/* Target Age & Sender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-200 mb-1.5">
                      解锁周岁（满几岁可阅读）
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formTargetAge}
                        onChange={(e) => setFormTargetAge(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-xs sm:text-sm font-num"
                        required
                      />
                      <span className="text-xs text-cyan-200 flex-shrink-0">周岁</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cyan-200 mb-1.5">
                      寄件人称谓
                    </label>
                    <input
                      type="text"
                      value={formSender}
                      onChange={(e) => setFormSender(e.target.value)}
                      placeholder="最最爱你的爸爸妈妈"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="block text-xs font-semibold text-cyan-200 mb-1.5">
                    信封魔法印章
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LETTER_ICONS.map((icon) => (
                      <button
                        type="button"
                        key={icon}
                        onClick={() => setFormIcon(icon)}
                        className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all ${
                          formIcon === icon
                            ? 'border-cyan-300 bg-cyan-500/30 scale-110 shadow-[0_0_10px_rgba(112,228,255,0.4)]'
                            : 'border-cyan-500/20 bg-slate-900/50 hover:border-cyan-400/40'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-semibold text-cyan-200 mb-1.5">
                    信件正文内容（写给宝贝的心里话）
                  </label>
                  <textarea
                    rows={6}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="亲爱的宝贝，当你打开这封信的时候..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-xs sm:text-sm font-serif leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-5 sm:px-7 py-3.5 border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-md flex items-center justify-end gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="glass-frost-btn text-xs py-2 px-4 text-slate-300 hover:text-white"
                >
                  取消
                </button>

                <button
                  type="submit"
                  className="glass-frost-btn text-xs py-2 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-cyan-300 text-white font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>以冰雪魔法封印此信 ✨</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
