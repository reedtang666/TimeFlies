import { useRef, useState, useMemo, useEffect } from 'react';
import {
  X,
  Download,
  Sparkles,
  Loader2,
  Camera,
  Crown,
  Heart,
  RefreshCw,
  Image as ImageIcon,
  Award,
  Calendar,
  Activity,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { type GrowthTime, formatNumberWithCommas } from '../utils/timeCalculator';
import { frozenAudio } from '../utils/audioSystem';
import { DEFAULT_QUOTES } from '../data/elsaPresetData';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  dob: string;
  quote: string;
  avatarUrl: string;
  growthTime: GrowthTime;
}

type TemplateType = 'polaroid' | 'certificate' | 'aurora_stats';

interface GalleryPhotoLite {
  id: string;
  title: string;
  url: string;
}

/**
 * Automatically cleans any legacy black corners from circular avatar images.
 * Replaces the black corners with pure white (#ffffff) to seamlessly blend
 * into the Polaroid card paper, ensuring ZERO black background!
 */
function cleanAvatarBlackCorners(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    if (!imageSrc || !imageSrc.startsWith('data:image')) {
      return resolve(imageSrc);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imageSrc);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const r = Math.min(cx, cy) - 1;

        // Clip circular photo area
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        ctx.restore();

        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

export const PosterModal = ({
  isOpen,
  onClose,
  name,
  dob,
  quote: initialQuote,
  avatarUrl,
  growthTime,
}: PosterModalProps) => {
  if (!isOpen) return null;

  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('polaroid');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(avatarUrl || '');
  const [cleanedPhoto, setCleanedPhoto] = useState<string>(avatarUrl || '');
  const [currentQuote, setCurrentQuote] = useState<string>(
    initialQuote || '“做你自己的女王，勇敢去光芒亮丽闪耀吧！”'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoLite[]>([]);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);

  // Sync initial photo if changed
  useEffect(() => {
    if (avatarUrl && !selectedPhoto) {
      setSelectedPhoto(avatarUrl);
    }
  }, [avatarUrl, selectedPhoto]);

  // Clean black corners automatically whenever selectedPhoto changes
  useEffect(() => {
    if (selectedPhoto) {
      cleanAvatarBlackCorners(selectedPhoto).then((res) => {
        setCleanedPhoto(res);
      });
    } else {
      setCleanedPhoto('');
    }
  }, [selectedPhoto]);

  // Load photos from gallery storage for quick selection
  useEffect(() => {
    try {
      const saved = localStorage.getItem('timeflies_gallery_photos_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setGalleryPhotos(
            parsed.filter((p: any) => p && p.url).map((p: any) => ({
              id: p.id || Math.random().toString(),
              title: p.title || '纪念照片',
              url: p.url,
            }))
          );
        }
      }
    } catch (e) {
      console.warn('Failed to load gallery photos for poster picker', e);
    }
  }, [isOpen]);

  // Handle local photo upload directly into the card (clean original full photo)
  const handleLocalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择有效的图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedPhoto(event.target.result as string);
        setPhotoPickerOpen(false);
        frozenAudio.playBell(1000, 0.15);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Switch to next quote
  const handleNextQuote = () => {
    const list = [
      ...DEFAULT_QUOTES,
      '“陪伴你长大的每一秒，都是时光送给我们最美妙的魔法。”',
      '“唐望月小公主，全宇宙最爱你的人永远在你身后。”',
      '“愿你拥有艾莎般的勇敢，安娜般的温暖。”',
      '“做自己的太阳，无须凭借谁的光。”',
    ];
    const currentIndex = list.indexOf(currentQuote);
    const nextIndex = (currentIndex + 1) % list.length;
    setCurrentQuote(list[nextIndex]);
    frozenAudio.playBell(900, 0.1);
  };

  // High resolution PNG generation
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      setIsGenerating(true);
      frozenAudio.playSparkle();

      // Small delay for DOM paint
      await new Promise((resolve) => setTimeout(resolve, 80));

      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 2.5, // Crisp 2.5x retina export
      });

      const templateNameMap: Record<TemplateType, string> = {
        polaroid: '冰雪拍立得',
        certificate: '阿伦黛尔小公主认证函',
        aurora_stats: '极光成长战报',
      };

      const link = document.createElement('a');
      link.download = `${name}-${templateNameMap[activeTemplate]}-第${growthTime.totalDays}天.png`;
      link.href = dataUrl;
      link.click();

      // Trigger celebration confetti
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#70e4ff', '#38bdf8', '#fbbf24', '#ffffff', '#e879f9'],
      });
      frozenAudio.playMagicSpell();
    } catch (err) {
      console.error('Failed to generate poster:', err);
      alert('生成海报失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // Metrics for aurora template
  const heartbeats = useMemo(() => {
    return Math.floor(growthTime.totalDays * 24 * 60 * 105);
  }, [growthTime.totalDays]);

  const breaths = useMemo(() => {
    return Math.floor(growthTime.totalDays * 24 * 60 * 24);
  }, [growthTime.totalDays]);

  const todayFormatted = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-fadeIn select-none">
      {/* Hidden File Input for Custom Photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLocalPhotoUpload}
      />

      <div className="glass-frost-card bg-slate-900/95 p-4 sm:p-6 rounded-3xl max-w-lg w-full border-cyan-300/40 shadow-2xl relative my-auto text-center flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-400/20 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              📸
            </span>
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>魔法拍立得与成长海报</span>
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
              </h2>
              <p className="text-[11px] text-cyan-200/70">
                纯净相纸质感，一键保存发送朋友圈
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white transition-all"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => {
              setActiveTemplate('polaroid');
              frozenAudio.playBell(800, 0.1);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeTemplate === 'polaroid'
                ? 'bg-cyan-500/30 border-cyan-300 text-white shadow-[0_0_15px_rgba(112,228,255,0.3)]'
                : 'glass-frost-card border-slate-700/60 text-cyan-200/70 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>经典拍立得</span>
          </button>

          <button
            onClick={() => {
              setActiveTemplate('certificate');
              frozenAudio.playBell(1000, 0.1);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeTemplate === 'certificate'
                ? 'bg-amber-500/30 border-amber-300 text-white shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'glass-frost-card border-slate-700/60 text-cyan-200/70 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>皇家认证函</span>
          </button>

          <button
            onClick={() => {
              setActiveTemplate('aurora_stats');
              frozenAudio.playBell(1200, 0.1);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeTemplate === 'aurora_stats'
                ? 'bg-purple-500/30 border-purple-300 text-white shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                : 'glass-frost-card border-slate-700/60 text-cyan-200/70 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-300" />
            <span>极光战报</span>
          </button>
        </div>

        {/* Toolbar: Quick Switch Photo & Quote */}
        <div className="flex items-center justify-between gap-2 px-2.5 py-2 mb-2 bg-slate-950/60 rounded-xl border border-cyan-400/20 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 flex items-center gap-1.5 border border-cyan-400/40 text-xs font-semibold transition-all shadow-sm"
              title="选择手机/电脑里的生活照原图"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-300" />
              <span>上传生活照 📷</span>
            </button>

            <button
              onClick={() => setPhotoPickerOpen(!photoPickerOpen)}
              className="px-2.5 py-1.5 rounded-lg glass-frost-card hover:bg-cyan-500/20 text-cyan-200 flex items-center gap-1 border border-cyan-400/30 text-xs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
              <span>相册库</span>
            </button>
          </div>

          <button
            onClick={handleNextQuote}
            className="px-2.5 py-1.5 rounded-lg glass-frost-card hover:bg-cyan-500/20 text-cyan-200 flex items-center gap-1 border border-cyan-400/30 text-xs"
            title="换一句金句"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
            <span>换句寄语</span>
          </button>
        </div>

        {/* Photo Picker Drawer */}
        {photoPickerOpen && (
          <div className="p-3 mb-3 bg-slate-950/95 rounded-2xl border border-cyan-400/40 text-left animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-200">
                从相册选择照片 ({galleryPhotos.length + (avatarUrl ? 1 : 0)} 张可选):
              </span>
              <button
                onClick={() => setPhotoPickerOpen(false)}
                className="text-[10px] text-cyan-300/70 hover:text-white"
              >
                收起
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 max-h-24">
              {avatarUrl && (
                <div
                  onClick={() => {
                    setSelectedPhoto(avatarUrl);
                    setPhotoPickerOpen(false);
                    frozenAudio.playBell(1000, 0.1);
                  }}
                  className={`w-14 h-14 rounded-xl flex-shrink-0 cursor-pointer overflow-hidden border-2 relative ${
                    selectedPhoto === avatarUrl ? 'border-cyan-300 scale-95' : 'border-cyan-400/40'
                  }`}
                >
                  <img src={avatarUrl} alt="当前头像" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] text-center text-cyan-200 font-bold py-0.5">
                    当前头像
                  </span>
                </div>
              )}

              {galleryPhotos.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPhoto(p.url);
                    setPhotoPickerOpen(false);
                    frozenAudio.playBell(1000, 0.1);
                  }}
                  className={`w-14 h-14 rounded-xl flex-shrink-0 cursor-pointer overflow-hidden border-2 relative ${
                    selectedPhoto === p.url ? 'border-cyan-300 scale-95' : 'border-cyan-400/40'
                  }`}
                >
                  <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                </div>
              ))}

              {galleryPhotos.length === 0 && !avatarUrl && (
                <p className="text-xs text-cyan-300/60 py-2">相册暂无其他照片，点击“上传生活照”挑一张。</p>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Canvas Preview Area */}
        <div className="overflow-y-auto flex-1 p-2 flex items-center justify-center my-1 custom-scrollbar">
          {/* THE CAPTURED CONTAINER (Strict Polaroid Dimensions) */}
          <div
            ref={posterRef}
            className="w-[320px] sm:w-[340px] mx-auto text-left relative transition-all select-none shadow-2xl rounded-2xl overflow-hidden"
          >
            {/* ========================================================
                TEMPLATE 1: AUTHENTIC CLASSIC POLAROID (纯正经典拍立得 - 0黑边)
               ======================================================== */}
            {activeTemplate === 'polaroid' && (
              <div className="bg-[#fcfbf9] text-slate-800 p-4 pb-6 rounded-2xl border-2 border-slate-200 shadow-2xl relative font-sans">
                {/* Photo Window (Square Classic Polaroid ratio with clean border) */}
                <div className="w-full aspect-square bg-[#f3f4f6] rounded-lg overflow-hidden border border-slate-200/80 relative shadow-inner flex items-center justify-center">
                  {cleanedPhoto ? (
                    <img
                      src={cleanedPhoto}
                      alt={name}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-cyan-600 cursor-pointer p-4 text-center transition-colors"
                    >
                      <Camera className="w-8 h-8 mb-2 text-slate-300" />
                      <span className="text-xs font-semibold">点击上传生活照</span>
                    </div>
                  )}

                  {/* Days badge neatly positioned in corner */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-[10px] text-white font-num font-bold shadow">
                    第 {growthTime.totalDays} 天
                  </div>
                </div>

                {/* Polaroid Hand-writing bottom area */}
                <div className="pt-4 px-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-800 font-bold mb-1">
                    <span>👑</span>
                    <span className="tracking-wide">阿伦黛尔小公主 · {name}</span>
                    <span>👑</span>
                  </div>

                  <p className="text-sm font-bold text-slate-800 leading-snug my-2 min-h-[2.4rem] flex items-center justify-center italic font-serif">
                    {currentQuote}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 text-[10px] text-slate-400 font-num">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-700" />
                      {todayFormatted}
                    </span>
                    <span className="font-bold tracking-wider text-cyan-800">
                      TIMEFLIES · 陪伴成长
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TEMPLATE 2: ROYAL CERTIFICATE (阿伦黛尔皇家官方认证函)
               ======================================================== */}
            {activeTemplate === 'certificate' && (
              <div className="bg-gradient-to-b from-slate-950 via-[#0a192f] to-[#051329] text-white p-5 rounded-2xl border-2 border-amber-300/80 shadow-[0_0_30px_rgba(251,191,36,0.25)] relative overflow-hidden font-sans">
                {/* Vintage Royal Border inlays */}
                <div className="absolute inset-2 border border-cyan-400/30 rounded-xl pointer-events-none"></div>
                <div className="absolute top-3 left-3 text-amber-300 text-xs">✦</div>
                <div className="absolute top-3 right-3 text-amber-300 text-xs">✦</div>
                <div className="absolute bottom-3 left-3 text-amber-300 text-xs">✦</div>
                <div className="absolute bottom-3 right-3 text-amber-300 text-xs">✦</div>

                {/* Certificate Header */}
                <div className="text-center relative z-10 pt-2 pb-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[9px] font-black uppercase tracking-widest text-amber-300 mb-1">
                    <Crown className="w-3 h-3 text-amber-300" />
                    Kingdom of Arendelle · Royal Decree
                  </div>
                  <h3 className="text-base font-black text-heading-elsa tracking-wide mt-1">
                    阿伦黛尔王国 · 官方小公主认证函
                  </h3>
                </div>

                {/* Royal Portrait Medallion */}
                <div className="flex justify-center my-3 relative z-10">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-amber-300/90 p-1 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)] overflow-hidden flex items-center justify-center">
                      {cleanedPhoto ? (
                        <img
                          src={cleanedPhoto}
                          alt={name}
                          className="w-full h-full object-cover rounded-full"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">👸</div>
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-md">
                      👑
                    </span>
                  </div>
                </div>

                {/* Certificate Body Paragraph */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-cyan-500/30 text-xs leading-relaxed relative z-10 text-cyan-100">
                  <p className="indent-4 mb-2">
                    兹证明敬爱的 <strong className="text-amber-300 font-bold text-sm">{name} 小公主</strong>，自降临星海以来，已在阿伦黛尔快乐航行：
                  </p>
                  <div className="text-center py-1.5 px-2 my-1 bg-cyan-950/60 rounded-lg border border-cyan-400/40">
                    <span className="text-2xl font-black font-num text-amber-300">
                      {formatNumberWithCommas(growthTime.totalDays)}
                    </span>
                    <span className="text-xs text-cyan-200 ml-1 font-bold">个日夜</span>
                    <span className="text-[11px] text-cyan-300/80 ml-2">
                      ({growthTime.years}岁 {growthTime.months}个月 {growthTime.days}天)
                    </span>
                  </div>
                  <p className="italic text-[11px] text-cyan-200/90 pt-1 text-center">
                    “{currentQuote}”
                  </p>
                </div>

                {/* Royal Stamp Seal & Signature Block */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-cyan-400/20 relative z-10">
                  <div className="text-[9px] text-cyan-300/70 leading-tight">
                    <div>皇家编号: ARENDELLE-WY-2026</div>
                    <div>签发日期: {todayFormatted}</div>
                    <div className="text-emerald-400 mt-0.5">✦ 真实有效 · 永不失效</div>
                  </div>

                  {/* Golden Wax Seal */}
                  <div className="w-14 h-14 rounded-full border-2 border-amber-300 bg-gradient-to-br from-amber-500 to-amber-700 flex flex-col items-center justify-center text-slate-950 rotate-[-10deg] shadow-[0_0_15px_rgba(251,191,36,0.6)] font-black">
                    <Crown className="w-4 h-4 text-slate-950" />
                    <span className="text-[7px] tracking-tighter uppercase leading-none">ROYAL SEAL</span>
                    <span className="text-[6px] tracking-tighter leading-none">QUEEN ELSA</span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TEMPLATE 3: AURORA GLOW STATS (极光多维数据战报)
               ======================================================== */}
            {activeTemplate === 'aurora_stats' && (
              <div className="bg-gradient-to-b from-slate-950 via-[#071731] to-[#1a0a2a] text-white p-5 rounded-2xl border border-cyan-300/60 shadow-[0_0_35px_rgba(112,228,255,0.25)] relative overflow-hidden font-sans">
                {/* Aurora background glow balls */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

                {/* Top Profile Bar */}
                <div className="flex items-center gap-3 pb-3 border-b border-cyan-400/20 relative z-10">
                  <div className="w-14 h-14 rounded-full border-2 border-cyan-300/80 p-0.5 bg-slate-900 overflow-hidden flex-shrink-0">
                    {cleanedPhoto ? (
                      <img
                        src={cleanedPhoto}
                        alt={name}
                        className="w-full h-full object-cover rounded-full"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👸</div>
                    )}
                  </div>

                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-cyan-300" />
                      FROZEN LIFE REPORT
                    </div>
                    <h3 className="text-base font-black text-white truncate">
                      {name} · 成长时光战报
                    </h3>
                    <div className="text-[10px] text-cyan-200/70 font-num">
                      启航于: {dob.split('T')[0] || '出生首日'}
                    </div>
                  </div>
                </div>

                {/* Hero Total Days */}
                <div className="text-center py-3 my-3 bg-slate-900/80 rounded-xl border border-cyan-400/30 relative z-10">
                  <span className="text-[10px] text-cyan-300 uppercase tracking-widest font-semibold block">
                    已在美丽地球探索
                  </span>
                  <div className="text-3xl font-black font-num gradient-text-ice">
                    {formatNumberWithCommas(growthTime.totalDays)}{' '}
                    <span className="text-sm text-cyan-200">DAYS</span>
                  </div>
                  <div className="text-[11px] text-cyan-100 font-num font-bold mt-0.5">
                    {growthTime.years} 岁 · {growthTime.months} 个月 · {growthTime.days} 天
                  </div>
                </div>

                {/* 2x2 Stats Grid */}
                <div className="grid grid-cols-2 gap-2 my-2 relative z-10 text-left">
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-1 text-[10px] text-rose-300 mb-0.5">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40" />
                      <span>心脏跳动约</span>
                    </div>
                    <div className="text-sm font-bold font-num text-white">
                      {(heartbeats / 100000000).toFixed(2)}{' '}
                      <span className="text-[10px] text-cyan-300/80">亿次</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-1 text-[10px] text-cyan-300 mb-0.5">
                      <Activity className="w-3 h-3 text-cyan-400" />
                      <span>纯净呼吸约</span>
                    </div>
                    <div className="text-sm font-bold font-num text-white">
                      {(breaths / 10000).toFixed(0)}{' '}
                      <span className="text-[10px] text-cyan-300/80">万次</span>
                    </div>
                  </div>
                </div>

                {/* Quote Box */}
                <div className="bg-cyan-950/40 p-3 rounded-lg border border-cyan-400/30 text-center my-2 text-xs italic text-cyan-100/90 relative z-10 leading-relaxed">
                  “{currentQuote}”
                </div>

                {/* Footer brand */}
                <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-[9px] text-cyan-300/60 relative z-10">
                  <span>⏱️ TimeFlies 亲子时光</span>
                  <span>{todayFormatted}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate / Download Action Button */}
        <div className="pt-3 border-t border-cyan-400/20 mt-2">
          <button
            onClick={handleDownloadPoster}
            disabled={isGenerating}
            className="glass-frost-btn w-full justify-center text-sm py-3 bg-gradient-to-r from-cyan-500/40 via-cyan-400/50 to-blue-600/40 hover:from-cyan-500/60 hover:to-blue-600/60 border-cyan-300 text-white font-black shadow-[0_0_20px_rgba(112,228,255,0.3)] transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                <span>正在施展魔法渲染 2.5x 高清海报...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-cyan-200" />
                <span>保存海报到手机/电脑 📲</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
