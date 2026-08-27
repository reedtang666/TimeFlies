import { useState, useEffect } from 'react';
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
import { calculateGrowthTime, type GrowthTime } from './utils/timeCalculator';
import { DEFAULT_MILESTONES, PRESET_AVATARS } from './data/elsaPresetData';
import { triggerFrozenMagicEffect } from './utils/magicEffects';
import { loadImageSource } from './utils/imageHelper';
import { frozenAudio } from './utils/audioSystem';

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

  // Avatar Cropper state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

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
  };

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    localStorage.setItem('timeflies_avatar', newAvatarUrl);
    setIsMagicActive(true);
    triggerFrozenMagicEffect();
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

      {/* Full-Screen Ice Magic Blast Overlay */}
      <IceMagicOverlay
        isActive={isMagicActive}
        onComplete={() => setIsMagicActive(false)}
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
          onOpenSettings={() => setIsSettingsOpen(true)}
          onCastMagic={handleCastMagic}
          onOpenShare={() => setIsShareOpen(true)}
          onUpdateAvatar={handleUpdateAvatar}
          onRequestCrop={handleRequestCrop}
        />

        {/* Hero Counter */}
        <TimerDisplay growthTime={growthTime} name={name} />

        {/* Arendelle Royal Princess Passport Certificate */}
        <ArendellePassport
          name={name}
          dob={dob}
          avatarUrl={avatarUrl}
          onUpdateAvatar={handleUpdateAvatar}
          onRequestCrop={handleRequestCrop}
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
        />

        {/* Photo Gallery Timeline */}
        <PhotoGallery name={name} />

        {/* Time Capsule Letters from Dad & Mom */}
        <TimeCapsule currentAgeYears={growthTime.years} name={name} />

        {/* Ice Castle Horizon Graphic */}
        <ElsaCastleGraphic />
      </div>

      {/* Persistent Floating Music Controller with Draggable Seek Bar */}
      <FloatingMusicBar />

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

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-cyan-500/20 max-w-4xl mx-auto w-full px-4 text-xs text-cyan-200/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span>⏱️ TimeFlies</span>
          <span>·</span>
          <span>陪伴女儿长大的每一秒</span>
        </div>
        <div className="text-[11px] text-cyan-300/40">
          Pure Front-end Magic · Zero Data Collection 🔒
        </div>
      </footer>
    </div>
  );
}

export default App;
