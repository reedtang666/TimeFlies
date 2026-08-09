import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Image, Calendar, User, Quote, Palette } from 'lucide-react';
import { PRESET_AVATARS, DEFAULT_QUOTES } from '../data/elsaPresetData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  dob: string;
  quote: string;
  avatarUrl: string;
  theme: string;
  onSave: (data: {
    name: string;
    dob: string;
    quote: string;
    avatarUrl: string;
    theme: string;
  }) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  name: initialName,
  dob: initialDob,
  quote: initialQuote,
  avatarUrl: initialAvatarUrl,
  theme: initialTheme,
  onSave,
}: SettingsModalProps) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialName);
  const [dob, setDob] = useState(initialDob);
  const [quote, setQuote] = useState(initialQuote);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [theme, setTheme] = useState(initialTheme);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, dob, quote, avatarUrl, theme });
    onClose();
  };

  const handleGenerateShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('name', name);
    url.searchParams.set('dob', dob);
    url.searchParams.set('quote', quote);
    url.searchParams.set('theme', theme);
    if (avatarUrl) url.searchParams.set('avatar', avatarUrl);

    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-frost-card p-6 sm:p-8 rounded-3xl max-w-lg w-full border-cyan-300/40 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-cyan-300" />
          <h2 className="text-xl font-bold font-heading text-white">
            定制冰雪魔盒信息
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-cyan-200 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-300" />
              女儿姓名 / 昵称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：爱莎小公主"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-sm"
              required
            />
          </div>

          {/* Date of Birth & Time */}
          <div>
            <label className="block text-xs font-semibold text-cyan-200 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-300" />
              出生日期与精确时间
            </label>
            <input
              type="datetime-local"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-sm font-num"
              required
            />
          </div>

          {/* Theme Preset Avatar Select */}
          <div>
            <label className="block text-xs font-semibold text-cyan-200 mb-1.5 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-cyan-300" />
              选择艾莎主题头像 / 自定义链接
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {PRESET_AVATARS.map((pa) => (
                <button
                  type="button"
                  key={pa.id}
                  onClick={() => setAvatarUrl(pa.url)}
                  className={`p-2 rounded-xl border text-center text-xs flex flex-col items-center gap-1 transition-all ${
                    avatarUrl === pa.url
                      ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_10px_rgba(112,228,255,0.4)]'
                      : 'border-cyan-500/20 bg-slate-900/40 text-cyan-200/70 hover:border-cyan-500/40'
                  }`}
                >
                  <span className="text-xl">{pa.emoji}</span>
                  <span className="truncate w-full">{pa.name}</span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="或粘贴自定义头像图片 URL..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-xs font-semibold text-cyan-200 mb-1.5 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-cyan-300" />
              父母寄语 / 魔法座右铭
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 text-sm"
              placeholder="填写给宝贝的成长寄语..."
            />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {DEFAULT_QUOTES.map((dq, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setQuote(dq)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/80 border border-cyan-500/30"
                >
                  + {dq.slice(0, 12)}...
                </button>
              ))}
            </div>
          </div>

          {/* Color Theme */}
          <div>
            <label className="block text-xs font-semibold text-cyan-200 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-300" />
              冰雪视觉主题
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ice-blue', label: '🧊 经典冰蓝' },
                { id: 'aurora-purple', label: '🌌 极光魅紫' },
                { id: 'winter-rose', label: '🌸 冰晶冬樱' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`py-2 px-3 rounded-xl border text-xs text-center transition-all ${
                    theme === t.id
                      ? 'border-cyan-400 bg-cyan-500/20 text-white font-semibold'
                      : 'border-cyan-500/20 bg-slate-900/40 text-cyan-200/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleGenerateShareUrl}
              className="glass-frost-btn justify-center text-xs py-2.5 flex-1 border-cyan-400/40"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '专属 URL 已复制！' : '复制零代码专属 URL 🔗'}</span>
            </button>

            <button
              type="submit"
              className="glass-frost-btn justify-center text-xs py-2.5 flex-1 bg-cyan-500/30 hover:bg-cyan-500/50 border-cyan-300 text-white font-bold"
            >
              保存魔法配置 ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
