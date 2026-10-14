import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Image, Calendar, User, Quote, Palette, Music, ShieldCheck, LogOut } from 'lucide-react';
import { PRESET_AVATARS, DEFAULT_QUOTES } from '../data/elsaPresetData';
import { frozenAudio } from '../utils/audioSystem';
import { loadImageSource } from '../utils/imageHelper';
import { authSystem } from '../utils/authSystem';
import { AvatarCropModal } from './AvatarCropModal';

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
  const [audioUrlInput, setAudioUrlInput] = useState(() => {
    return localStorage.getItem('timeflies_audio_url') || '';
  });
  const [copied, setCopied] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    frozenAudio.setAudioUrl(audioUrlInput.trim() || null);
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

  // Close modal on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="glass-frost-card bg-slate-950/95 rounded-3xl max-w-lg w-full border-cyan-300/40 shadow-2xl relative my-auto max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden">
        {/* Sticky Header with Persistent Close Button for Mobile & PC */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md flex-shrink-0 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-300" />
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
              定制冰雪魔盒信息
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭设置"
            className="p-2 -mr-1 rounded-full glass-frost-card text-cyan-300 hover:text-white hover:border-cyan-300 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-5 custom-scrollbar">
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-cyan-200 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-cyan-300" />
                女儿头像设置
              </label>

              <label className="cursor-pointer text-xs font-bold text-white bg-cyan-600/60 hover:bg-cyan-500/80 border border-cyan-300/60 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md hover:scale-105 transition-all">
                <span>📁 从手机/电脑选照片</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const src = await loadImageSource(file);
                        setCropImageSrc(src);
                        setIsCropOpen(true);
                      } catch (err) {
                        alert(err instanceof Error ? err.message : '加载图片失败');
                      }
                    }
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            {/* If local photo is uploaded, show current uploaded preview */}
            {avatarUrl.startsWith('data:') ? (
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-400/50 flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-300 shadow-md">
                    <img src={avatarUrl} alt="预览" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">✨ 已成功选好照片！</div>
                    <div className="text-[10px] text-cyan-200/70">点击下方“保存魔法配置”即可生效</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAvatarUrl(PRESET_AVATARS[0].url)}
                  className="text-xs text-rose-300 hover:text-rose-100 underline"
                >
                  重置
                </button>
              </div>
            ) : null}

            {/* Presets */}
            <div className="text-[11px] text-cyan-300/70 mb-1">或选择预设卡通图标：</div>
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

            {!avatarUrl.startsWith('data:') && (
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="或粘贴网络图片 URL（可选）..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            )}
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
            <div className="grid grid-cols-3 gap-2 mb-3">
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

          {/* Custom Audio Track */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-cyan-200 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-cyan-300" />
                背景音乐设置
              </label>

              {audioUrlInput && (
                <button
                  type="button"
                  onClick={() => setAudioUrlInput('')}
                  className="text-[11px] text-cyan-300 hover:text-white underline"
                >
                  恢复本地默认音乐
                </button>
              )}
            </div>

            {/* Current default / custom status badge */}
            {!audioUrlInput ? (
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-400/40 text-xs text-cyan-200 flex items-center gap-2 mb-2">
                <span className="text-sm">🎵</span>
                <div>
                  <div className="font-bold text-white text-[11px]">
                    已默认启用内置本地《冰雪奇缘》主题曲 · Let It Go
                  </div>
                  <div className="text-[10px] text-cyan-300/70">
                    零网络依赖 · 本地原声秒级播放 · 双语高清版
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-400/40 text-xs text-purple-200 flex items-center gap-2 mb-2">
                <span className="text-sm">🔗</span>
                <div>
                  <div className="font-bold text-white text-[11px]">正在使用自定义在线音乐链接</div>
                  <div className="text-[10px] text-purple-300/70 truncate max-w-xs">{audioUrlInput}</div>
                </div>
              </div>
            )}

            <input
              type="url"
              value={audioUrlInput}
              onChange={(e) => setAudioUrlInput(e.target.value)}
              placeholder="自定义在线 MP3 音轨链接（留空则默认使用本地 Let It Go）..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
            />
            <p className="text-[10px] text-cyan-300/60 mt-1">
              * 提示：留空即默认使用本地内置主题曲；如需特定在线网络 MP3 链接可填入上方输入框。
            </p>
          </div>

          {/* Admin Security & Password Management */}
          <div className="pt-3 border-t border-cyan-500/20">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-400/30 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>管理员权限 · 已解锁 (7天免密中)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    authSystem.logout();
                    onClose();
                  }}
                  className="text-[11px] text-rose-300 hover:text-rose-100 flex items-center gap-1 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-400/30 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  退出管理 (锁定)
                </button>
              </div>
              <div className="text-[10px] text-cyan-300/50">
                🔒 全站密码已由部署环境变量 (VITE_ADMIN_PASSWORD) 守护，访客无法修改配置。
              </div>
            </div>
          </div>
          </div>

          {/* Sticky Bottom Action Buttons for Mobile & PC */}
          <div className="px-5 sm:px-7 py-3.5 border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-md flex-shrink-0 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="glass-frost-btn justify-center text-xs py-2.5 px-4 text-slate-300 hover:text-white border-slate-700 hover:border-slate-500 hover:bg-slate-800/60 transition-colors order-last sm:order-first"
            >
              取消
            </button>

            <button
              type="button"
              onClick={handleGenerateShareUrl}
              className="glass-frost-btn justify-center text-xs py-2.5 flex-1 border-cyan-400/40 text-cyan-200 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '专属 URL 已复制！' : '复制专属 URL 🔗'}</span>
            </button>

            <button
              type="submit"
              className="glass-frost-btn justify-center text-xs py-2.5 flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-cyan-300 text-white font-bold shadow-lg shadow-cyan-500/25"
            >
              保存魔法配置 ✨
            </button>
          </div>
        </form>
      </div>

      {/* Avatar Circular Cropper Modal */}
      <AvatarCropModal
        isOpen={isCropOpen}
        imageSrc={cropImageSrc}
        onClose={() => setIsCropOpen(false)}
        onConfirmCrop={(croppedUrl) => {
          setAvatarUrl(croppedUrl);
          setIsCropOpen(false);
        }}
      />
    </div>
  );
};
