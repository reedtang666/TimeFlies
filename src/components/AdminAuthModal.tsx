import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, X, Sparkles, AlertCircle } from 'lucide-react';
import { authSystem } from '../utils/authSystem';
import { frozenAudio } from '../utils/audioSystem';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionHint?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionHint,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const isValid = await authSystem.verifyPassword(password);
      if (!isValid) {
        frozenAudio.playBell(300, 0.2);
        throw new Error('管理密码错误，请重新输入');
      }
      frozenAudio.playMagicSpell();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-frost-card bg-slate-950/95 p-6 sm:p-8 rounded-3xl max-w-md w-full border-cyan-400/50 shadow-[0_0_50px_rgba(34,211,238,0.25)] relative text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600/40 to-blue-500/30 border border-cyan-400/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Lock className="w-7 h-7 text-cyan-300 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            管理员身份验证
          </h3>
          <p className="text-xs text-cyan-200/70 mt-1.5 max-w-xs">
            {actionHint
              ? `“${actionHint}”需要管理员权限，请输入管理密码：`
              : '输入管理密码以解锁修改、相册与定制权限（解锁后 7 天免密）。'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cyan-200 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-300" />
              管理密码
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理员密码..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm tracking-widest transition-all"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? '验证中...' : '解锁管理权限'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-cyan-300/40">
            🔒 密码由部署环境变量预设 · 访客无法修改或初始化
          </span>
        </div>
      </div>
    </div>
  );
};
