import { useState, useEffect, useCallback } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { ElsaHeader } from './components/ElsaHeader';
import { TimerDisplay } from './components/TimerDisplay';
import { LifeStats } from './components/LifeStats';
import { MilestoneCrystals } from './components/MilestoneCrystals';
import { TimeCapsule } from './components/TimeCapsule';
import { PhotoGallery } from './components/PhotoGallery';
import { DailyQuoteCard } from './components/DailyQuoteCard';
import { ElsaIcePiano } from './components/ElsaIcePiano';
import { ArendellePassport } from './components/ArendellePassport';
import { SettingsModal } from './components/SettingsModal';
import { PosterModal } from './components/PosterModal';
import { IceMagicOverlay } from './components/IceMagicOverlay';
import { ElsaCastleGraphic } from './components/ElsaCastleGraphic';
import { AvatarCropModal } from './components/AvatarCropModal';
import { FloatingMusicBar } from './components/FloatingMusicBar';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from './components/GithubIcon';
import { calculateGrowthTime, type GrowthTime } from './utils/timeCalculator';
import { DEFAULT_MILESTONES, PRESET_AVATARS, GITHUB_REPO_URL } from './data/elsaPresetData';
import { triggerFrozenMagicEffect } from './utils/magicEffects';
import { loadImageSource } from './utils/imageHelper';
import { frozenAudio } from './utils/audioSystem';
import { authSystem } from './utils/authSystem';
import { cloudSync } from './utils/cloudSync';

export function App() {
  const getInitialParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const savedName = localStorage.getItem('timeflies_name');
    const savedDob = localStorage.getItem('timeflies_dob');
    const savedQuote = localStorage.getItem('timeflies_quote');
    const savedAvatar = localStorage.getItem('timeflies_avatar');
    const savedTheme = localStorage.getItem('timeflies_theme');

    const defaultDob = new Date(Date.now() - 365 * 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

    return {
      name: urlParams.get('name') || savedName || '爱莎小公主',
      dob: urlParams.get('dob') || savedDob || defaultDob,
      quote:
        urlParams.get('quote') ||
        savedQuote ||
        '“做你自己的女王，勇敢去光芒亮丽闪耀吧！”',
      avatarUrl: urlParams.get('avatar') || savedAvatar || PRESET_AVATARS[0].url,
      theme: urlParams.get('theme') || savedTheme || 'ice-blue',
    };
  };

  const initial = getInitialParams();

  const [name, setName] = useState(initial.name);
  const [dob, setDob] = useState(initial.dob);
  const [quote, setQuote] = useState(initial.quote);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [theme, setTheme] = useState(initial.theme);

  const [growthTime, setGrowthTime] = useState<GrowthTime>(() =>
    calculateGrowthTime(initial.dob)
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMagicActive, setIsMagicActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  }, []);

  const handleMagicComplete = useCallback(() => {
    setIsMagicActive(false);
  }, []);

  // Avatar Cropper state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Admin Auth state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);
  const [authActionHint, setAuthActionHint] = useState<string>('');

  const runWithAuth = (hint: string, action: () => void) => {
    if (authSystem.isAuthenticated()) {
      action();
    } else {
      setAuthActionHint(hint);
      setPendingAuthAction(() => action);
      setIsAuthModalOpen(true);
    }
  };

  // Subscribe to global audio state
  useEffect(() => {
    const unsub = frozenAudio.subscribe((state) => {
      setIsAudioPlaying(state.isPlaying);
    });
    return unsub;
  }, []);

  // Apply Theme attribute to document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Update growth time once per second (1000ms)
  useEffect(() => {
    setGrowthTime(calculateGrowthTime(dob));
    const timer = setInterval(() => {
      setGrowthTime(calculateGrowthTime(dob));
    }, 1000);

    return () => clearInterval(timer);
  }, [dob]);

  // Auto-load cloud capsule if ?id=xxx is in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const capsuleId = urlParams.get('id') || urlParams.get('capsule');
    if (!capsuleId) return;

    const loadCloudCapsule = async () => {
      try {
        const cloudData = await cloudSync.loadFromCloud(capsuleId);
        if (cloudData) {
          if (cloudData.name) {
            setName(cloudData.name);
            localStorage.setItem('timeflies_name', cloudData.name);
          }
          if (cloudData.dob) {
            setDob(cloudData.dob);
            localStorage.setItem('timeflies_dob', cloudData.dob);
            setGrowthTime(calculateGrowthTime(cloudData.dob));
          }
          if (cloudData.quote) {
            setQuote(cloudData.quote);
            localStorage.setItem('timeflies_quote', cloudData.quote);
          }
          if (cloudData.avatarUrl) {
            setAvatarUrl(cloudData.avatarUrl);
            localStorage.setItem('timeflies_avatar', cloudData.avatarUrl);
          }
          if (cloudData.theme) {
            setTheme(cloudData.theme);
            localStorage.setItem('timeflies_theme', cloudData.theme);
          }
          if (cloudData.photos && Array.isArray(cloudData.photos)) {
            localStorage.setItem('timeflies_gallery_photos_v5', JSON.stringify(cloudData.photos));
            window.dispatchEvent(new Event('timeflies_storage_updated'));
          }
          if (cloudData.letters && Array.isArray(cloudData.letters)) {
            localStorage.setItem('timeflies_time_capsule_letters_v2', JSON.stringify(cloudData.letters));
            window.dispatchEvent(new Event('timeflies_storage_updated'));
          }

          showToast(`✨ 成功载入【${cloudData.name}】的云端专属档案！`);
        }
      } catch (e) {
        console.warn('Failed to load cloud capsule:', e);
      }
    };

    loadCloudCapsule();
  }, [showToast]);

  // Save Settings
  const handleSaveSettings = (data: {
    name: string;
    dob: string;
    quote: string;
    avatarUrl: string;
    theme: string;
  }) => {
    setName(data.name);
    setDob(data.dob);
    setQuote(data.quote);
    setAvatarUrl(data.avatarUrl);
    setTheme(data.theme);

    localStorage.setItem('timeflies_name', data.name);
    localStorage.setItem('timeflies_dob', data.dob);
    localStorage.setItem('timeflies_quote', data.quote);
    localStorage.setItem('timeflies_avatar', data.avatarUrl);
    localStorage.setItem('timeflies_theme', data.theme);

    setIsMagicActive(true);
    triggerFrozenMagicEffect();
    showToast('✨ 冰雪魔法配置已成功保存！');
  };

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    localStorage.setItem('timeflies_avatar', newAvatarUrl);
    setIsMagicActive(true);
    triggerFrozenMagicEffect();
    showToast('👑 专属头像已更新！');
  };

  const handleRequestCrop = async (file: File) => {
    try {
      const src = await loadImageSource(file);
      setCropImageSrc(src);
      setIsCropModalOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : '加载图片失败');
    }
  };

  const handleConfirmCrop = (croppedDataUrl: string) => {
    handleUpdateAvatar(croppedDataUrl);
    setIsCropModalOpen(false);
  };

  const handleCastMagic = () => {
    setIsMagicActive(true);
    triggerFrozenMagicEffect();
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden text-slate-100 pb-12 select-none">
      {/* 60fps Canvas Aurora & Snow Particle System */}
      <BackgroundCanvas />

      {/* Floating Save/Status Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[150] px-5 py-2.5 rounded-full bg-slate-900/95 border border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.5)] text-cyan-200 text-xs sm:text-sm font-semibold flex items-center gap-2 backdrop-blur-md animate-bounce pointer-events-none">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Full-Screen Ice Magic Blast Overlay */}
      <IceMagicOverlay
        isActive={isMagicActive}
        onComplete={handleMagicComplete}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full flex-1 flex flex-col pb-16 sm:pb-20">
        {/* Header Section */}
        <ElsaHeader
          name={name}
          quote={quote}
          avatarUrl={avatarUrl}
          theme={theme}
          isMuted={!isAudioPlaying}
          onToggleAudio={() => (isAudioPlaying ? frozenAudio.pause() : frozenAudio.play())}
          onOpenSettings={() => runWithAuth('修改站点配置', () => setIsSettingsOpen(true))}
          onCastMagic={handleCastMagic}
          onOpenShare={() => setIsShareOpen(true)}
          onUpdateAvatar={(newAvatar) => runWithAuth('更换专属头像', () => handleUpdateAvatar(newAvatar))}
          onRequestCrop={(file) => runWithAuth('更换专属头像', () => handleRequestCrop(file))}
        />

        {/* Hero Counter */}
        <TimerDisplay growthTime={growthTime} name={name} />

        {/* Arendelle Royal Princess Passport Certificate */}
        <ArendellePassport
          name={name}
          dob={dob}
          avatarUrl={avatarUrl}
          onUpdateAvatar={(newAvatar) => runWithAuth('更换专属头像', () => handleUpdateAvatar(newAvatar))}
          onRequestCrop={(file) => runWithAuth('更换专属头像', () => handleRequestCrop(file))}
          onExportPoster={() => setIsShareOpen(true)}
        />

        {/* Elsa's Magical Ice Chime / Piano */}
        <ElsaIcePiano name={name} />

        {/* Daily Quote Card */}
        <DailyQuoteCard name={name} />

        {/* Multi-dimension Life Metrics */}
        <LifeStats growthTime={growthTime} name={name} />

        {/* Milestone Memory Crystals */}
        <MilestoneCrystals
          milestones={DEFAULT_MILESTONES}
          totalDays={growthTime.totalDays}
          name={name}
          onOpenShare={() => setIsShareOpen(true)}
        />

        {/* Photo Gallery Timeline */}
        <PhotoGallery
          name={name}
          currentAgeYears={growthTime.years}
          onRequireAuth={runWithAuth}
        />

        {/* Time Capsule Letters from Dad & Mom */}
        <TimeCapsule
          currentAgeYears={growthTime.years}
          name={name}
          onRequireAuth={runWithAuth}
        />

        {/* Ice Castle Horizon Graphic */}
        <ElsaCastleGraphic />
      </div>

      {/* Persistent Floating Music Controller with Draggable Seek Bar */}
      <FloatingMusicBar />

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        actionHint={authActionHint}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAuthAction(null);
        }}
        onSuccess={() => {
          if (pendingAuthAction) {
            pendingAuthAction();
            setPendingAuthAction(null);
          }
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        name={name}
        dob={dob}
        quote={quote}
        avatarUrl={avatarUrl}
        theme={theme}
        onSave={handleSaveSettings}
      />

      {/* Poster Generation Modal */}
      <PosterModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        name={name}
        dob={dob}
        quote={quote}
        avatarUrl={avatarUrl}
        growthTime={growthTime}
      />

      {/* Avatar Circular Cropper Modal */}
      <AvatarCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        onClose={() => setIsCropModalOpen(false)}
        onConfirmCrop={handleConfirmCrop}
      />

      {/* Footer & DIY GitHub Prompt */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full px-4 pt-4 pb-8 flex flex-col gap-6">
        {/* Glowing Ice Glassmorphism GitHub Callout Card */}
        <div className="glass-frost-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
          <div className="flex items-center gap-3 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-300/40 flex items-center justify-center text-cyan-200 flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <GithubIcon className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span>想要自己制作一份吗？</span>
                <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-cyan-400/15 border border-cyan-300/30 text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                  开源免费 · 纯前端零门槛
                </span>
              </div>
              <p className="text-xs text-cyan-200/70 mt-1">
                欢迎关注并 Star 我的 GitHub 仓库，即可获取完整源码制作属于你家宝贝的时光胶囊 ❄️
              </p>
            </div>
          </div>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => frozenAudio.playBell(1200, 0.2)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/80 via-sky-500/80 to-blue-600/80 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap group"
          >
            <GithubIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>关注 GitHub 仓库</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-2 border-t border-cyan-500/15 text-xs text-cyan-200/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>⏱️ TimeFlies</span>
            <span>·</span>
            <span>用心陪伴孩子长大的每一秒</span>
          </div>
          <div className="text-[11px] text-cyan-300/40">
            Pure Front-end Magic · Zero Data Collection 🔒
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
