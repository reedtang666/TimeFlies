import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, X, Upload, RotateCcw, Eye, Heart, Plus, Trash2, Edit3, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';
import { processGalleryImage } from '../utils/imageHelper';

export interface PhotoMilestoneItem {
  id: string;
  age: number;
  title: string;
  date: string;
  url: string;
  blessing: string;
}

const PRESET_AGE_TEMPLATES: Record<number, { title: string; blessing: string; url: string }> = {
  1: {
    title: '一周岁 · 蹒跚学步的小精灵 👣',
    blessing: '“第一步摇摇晃晃，却勇敢地迈向了无垠的奇妙世界。愿你永远被爱与温柔环绕，无忧无虑，健康快乐成长！”',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  },
  2: {
    title: '两周岁 · 牙牙学语的小太阳 ☀️',
    blessing: '“清脆的笑声与软糯的声音，是世间最动听的魔法咒语。愿你的小世界里永远充满阳光、欢歌与数不尽的惊喜！”',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  3: {
    title: '三周岁 · 戴上皇冠的小公主 👑',
    blessing: '“穿上艾莎最亮眼的冰晶长裙，眼里闪耀着对梦想的憧憬。做自己可爱纯真又勇敢骄傲的小公主，尽情奔跑在星光之下！”',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  4: {
    title: '四周岁 · 闪耀绽放的冰雪小女王 ✨',
    blessing: '“四周岁的你像晶莹璀璨的冰晶，聪明懂事、自信闪亮。愿你如艾莎女王般勇敢坚定，乘风破浪，绽放独一无二的光芒！”',
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
  },
  5: {
    title: '五周岁 · 充满奇思妙想的探索家 🚀',
    blessing: '“五周岁的你开始用天马行空的想象力装点世界，每一天都有新的好奇与发现。愿你保持热爱，勇敢奔向属于你的星辰大海！”',
    url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
  },
  6: {
    title: '六周岁 · 背上小书包的快乐精灵 🎒',
    blessing: '“六周岁迎来了崭新的成长篇章，学会独立、拥抱知识与纯真友谊。愿你心中永远盛开温暖与阳光，自由而快乐地飞翔！”',
    url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
  },
  7: {
    title: '七周岁 · 智慧与勇气兼备的小小骑士 🌟',
    blessing: '“七周岁的你眼眸明亮，学会了更多的本领与包容。愿你像冰雪王国里的晨曦，自信坚韧，温暖自己也照亮身边的人！”',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
  },
  8: {
    title: '八周岁 · 优雅独立的小小艺术家 🎨',
    blessing: '“八周岁的你用画笔与笑颜记录美好生活，拥有独特的灵气与光芒。愿你随心追逐热爱，在广阔天地间尽情绽放光彩！”',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  },
  9: {
    title: '九周岁 · 怀揣梦想与初心的追光者 🌈',
    blessing: '“九周岁的成长脚步愈发沉稳有力，懂得坚持也懂得关爱。愿你永葆纯真善良，无惧未知挑战，书写属于你的精彩篇章！”',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  10: {
    title: '十周岁 · 十全十美的美丽少年 🌷',
    blessing: '“转眼迎来了人生第一个十年圆满！十周岁的你亭亭玉立、明朗通透。愿你的未来如繁花似锦，长风破浪，一生欢喜被爱！”',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
  },
};

export function createAgePhotoItem(age: number): PhotoMilestoneItem {
  const preset = PRESET_AGE_TEMPLATES[age];
  if (preset) {
    return {
      id: `age-${age}`,
      age,
      title: preset.title,
      date: `${age} 周岁纪念`,
      url: preset.url,
      blessing: preset.blessing,
    };
  }

  return {
    id: `age-${age}`,
    age,
    title: `${age} 周岁 · 闪耀如初的青春华章 👑`,
    date: `${age} 周岁纪念`,
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    blessing: `“时光轻拂，记录你在第 ${age} 个春夏秋冬里的每一步成长。愿你心怀皓月，步履从容，永远充满勇气与对世界的热爱！”`,
  };
}

const STORAGE_KEY_V5 = 'timeflies_gallery_photos_v5';
const STORAGE_KEY_V4 = 'timeflies_gallery_photos_v4';

interface PhotoGalleryProps {
  name: string;
  currentAgeYears?: number;
  onRequireAuth?: (actionHint: string, onSuccess: () => void) => void;
}

export const PhotoGallery = ({ name, currentAgeYears = 4, onRequireAuth }: PhotoGalleryProps) => {
  const [photos, setPhotos] = useState<PhotoMilestoneItem[]>(() => {
    let savedList: PhotoMilestoneItem[] | null = null;
    try {
      const savedV5 = localStorage.getItem(STORAGE_KEY_V5);
      if (savedV5) {
        const parsed = JSON.parse(savedV5);
        if (Array.isArray(parsed) && parsed.length > 0) savedList = parsed;
      } else {
        const savedV4 = localStorage.getItem(STORAGE_KEY_V4);
        if (savedV4) {
          const parsed = JSON.parse(savedV4);
          if (Array.isArray(parsed) && parsed.length > 0) savedList = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load gallery photos:', e);
    }

    const targetMaxAge = Math.max(4, currentAgeYears || 4);
    if (!savedList || savedList.length === 0) {
      const initial: PhotoMilestoneItem[] = [];
      for (let i = 1; i <= targetMaxAge; i++) {
        initial.push(createAgePhotoItem(i));
      }
      return initial;
    }

    // Merge saved photos with targetMaxAge if child is older
    const existingAges = new Set(savedList.map((p) => p.age));
    const merged = [...savedList];
    for (let i = 1; i <= targetMaxAge; i++) {
      if (!existingAges.has(i)) {
        merged.push(createAgePhotoItem(i));
      }
    }
    merged.sort((a, b) => a.age - b.age);
    return merged;
  });

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMilestoneItem | null>(null);
  const [isEditingBlessing, setIsEditingBlessing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBlessing, setEditBlessing] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetUploadIdRef = useRef<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_V5, JSON.stringify(photos));
    } catch (e) {
      console.warn('Failed to save gallery photos to localStorage:', e);
    }
  }, [photos]);

  // Listen for storage updates (e.g. from cloud sync load)
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_V5);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPhotos(parsed);
          }
        }
      } catch {}
    };

    window.addEventListener('timeflies_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('timeflies_storage_updated', handleStorageUpdate);
  }, []);

  const handlePhotoClick = (photo: PhotoMilestoneItem) => {
    frozenAudio.playBell(1400, 0.2);
    setSelectedPhoto(photo);
    setIsEditingBlessing(false);
    setEditTitle(photo.title);
    setEditBlessing(photo.blessing);
  };

  const handleTriggerUpload = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const action = () => {
      targetUploadIdRef.current = photoId;
      fileInputRef.current?.click();
    };
    if (onRequireAuth) {
      onRequireAuth('上传或替换相册照片', action);
    } else {
      action();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const photoId = targetUploadIdRef.current;
    if (file && photoId) {
      await processAndSetPhoto(photoId, file);
    }
    e.target.value = '';
    targetUploadIdRef.current = null;
  };

  const processAndSetPhoto = async (photoId: string, file: File) => {
    try {
      setUploadingId(photoId);
      const dataUrl = await processGalleryImage(file);
      frozenAudio.playMagicSpell();

      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, url: dataUrl } : p))
      );

      setSelectedPhoto((prev) =>
        prev && prev.id === photoId ? { ...prev, url: dataUrl } : prev
      );
    } catch (err) {
      console.error('Failed to upload gallery image:', err);
      alert(err instanceof Error ? err.message : '上传图片失败，请重试');
    } finally {
      setUploadingId(null);
    }
  };

  const handleResetPhoto = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const action = () => {
      const current = photos.find((p) => p.id === photoId);
      if (!current) return;
      const defaultItem = createAgePhotoItem(current.age);
      frozenAudio.playBell(900, 0.15);
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, url: defaultItem.url } : p))
      );
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto((prev) => (prev ? { ...prev, url: defaultItem.url } : prev));
      }
    };
    if (onRequireAuth) {
      onRequireAuth('恢复相册默认照片', action);
    } else {
      action();
    }
  };

  // Add next age milestone card
  const handleAddNextAge = () => {
    const nextAge = (photos.length > 0 ? Math.max(...photos.map((p) => p.age)) : 0) + 1;
    const action = () => {
      const newItem = createAgePhotoItem(nextAge);
      frozenAudio.playMagicSpell();
      setPhotos((prev) => [...prev, newItem]);
    };

    if (onRequireAuth) {
      onRequireAuth(`添加【${nextAge}周岁】成长相册`, action);
    } else {
      action();
    }
  };

  // Delete age card
  const handleDeletePhoto = (photoId: string, age: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const action = () => {
      if (window.confirm(`确定要移除【${age}周岁】相册卡片吗？`)) {
        frozenAudio.playBell(700, 0.15);
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto(null);
        }
      }
    };

    if (onRequireAuth) {
      onRequireAuth(`删除【${age}周岁】相册卡片`, action);
    } else {
      action();
    }
  };

  // Save edited blessing/title
  const handleSaveEdit = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? { ...p, title: editTitle.trim() || p.title, blessing: editBlessing.trim() || p.blessing }
          : p
      )
    );
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto((prev) =>
        prev
          ? {
              ...prev,
              title: editTitle.trim() || prev.title,
              blessing: editBlessing.trim() || prev.blessing,
            }
          : prev
      );
    }
    setIsEditingBlessing(false);
    frozenAudio.playBell(1200, 0.2);
  };

  // Drag and drop support per card
  const handleDragOver = (photoId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(photoId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(null);
  };

  const handleDrop = (photoId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (onRequireAuth) {
        onRequireAuth('上传或替换相册照片', () => processAndSetPhoto(photoId, file));
      } else {
        processAndSetPhoto(photoId, file);
      }
    }
  };

  const minAge = photos.length > 0 ? Math.min(...photos.map((p) => p.age)) : 1;
  const maxAge = photos.length > 0 ? Math.max(...photos.map((p) => p.age)) : 4;
  const nextAgeToAdd = maxAge + 1;

  const currentPhotoIndex = selectedPhoto
    ? photos.findIndex((p) => p.id === selectedPhoto.id)
    : -1;

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentPhotoIndex > 0) {
      const prev = photos[currentPhotoIndex - 1];
      setSelectedPhoto(prev);
      setIsEditingBlessing(false);
      setEditTitle(prev.title);
      setEditBlessing(prev.blessing);
      frozenAudio.playBell(1100, 0.15);
    }
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentPhotoIndex >= 0 && currentPhotoIndex < photos.length - 1) {
      const next = photos[currentPhotoIndex + 1];
      setSelectedPhoto(next);
      setIsEditingBlessing(false);
      setEditTitle(next.title);
      setEditBlessing(next.blessing);
      frozenAudio.playBell(1300, 0.15);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, currentPhotoIndex, photos]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 my-10 relative">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full glass-frost-card text-[11px] text-cyan-200 border border-cyan-400/30 mb-2">
          <Camera className="w-3.5 h-3.5 text-cyan-300" />
          <span>Disney Frozen {minAge}-{maxAge} Years Photo Album</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-heading-elsa tracking-wide flex items-center justify-center gap-2">
          <span>👑</span>
          <span>{name} 的 {minAge === maxAge ? `${minAge} 周岁` : `${minAge}-${maxAge} 周岁`}成长魔法相册</span>
          <span>👑</span>
        </h2>
        <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">
          记录从初生萌芽到 {maxAge} 周岁的闪耀足迹 · 点击任意卡片查看高清大图与寄语
        </p>
      </div>

      {/* Compact Multi-Column Grid: 2 cols on mobile, 3 on sm, 4 on md, 5 on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4.5">
        {photos.map((photo) => {
          const isDragTarget = dragOverId === photo.id;
          const isCurrentUploading = uploadingId === photo.id;

          return (
            <div
              key={photo.id}
              onClick={() => handlePhotoClick(photo)}
              onDragOver={(e) => handleDragOver(photo.id, e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(photo.id, e)}
              className={`glass-frost-card p-2 sm:p-2.5 rounded-2xl cursor-pointer group hover:scale-[1.03] transition-all duration-300 border flex flex-col justify-between relative overflow-hidden ${
                isDragTarget
                  ? 'border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(112,228,255,0.6)] bg-cyan-950/60'
                  : 'border-cyan-300/30 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(112,228,255,0.3)]'
              }`}
            >
              {/* Photo Frame - Square aspect ratio for neat, uniform album grid */}
              <div className="w-full aspect-square rounded-xl overflow-hidden relative bg-slate-950 shadow-md">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Age Badge */}
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-950/85 text-[10px] sm:text-xs font-black text-cyan-200 border border-cyan-400/40 backdrop-blur-md shadow">
                  {photo.age} 周岁
                </div>

                {/* Delete Button for extra added cards */}
                {photo.age > 4 && (
                  <button
                    type="button"
                    onClick={(e) => handleDeletePhoto(photo.id, photo.age, e)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 text-rose-300 hover:text-white hover:bg-rose-600/80 border border-rose-400/30 backdrop-blur-md transition-all shadow"
                    title="移除此卡片"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Uploading Overlay */}
                {isCurrentUploading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-300 gap-1">
                    <Sparkles className="w-5 h-5 animate-spin text-cyan-300" />
                    <span className="text-[10px] font-bold">导入中...</span>
                  </div>
                )}

                {/* Drag Target Notice */}
                {isDragTarget && (
                  <div className="absolute inset-0 bg-cyan-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-200 border-2 border-dashed border-cyan-300">
                    <Upload className="w-6 h-6 text-cyan-300 animate-bounce mb-1" />
                    <span className="text-[10px] font-black text-white">松开更换</span>
                  </div>
                )}

                {/* Hover / Tap Hint Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg border border-cyan-300/80">
                    <Eye className="w-3 h-3" />
                    <span>看大图</span>
                  </span>
                </div>
              </div>

              {/* Compact Caption */}
              <div className="mt-1.5 px-0.5 text-center">
                <div className="text-[11px] sm:text-xs font-bold text-white group-hover:text-cyan-200 truncate">
                  {photo.title.split('·')[1]?.trim() || photo.title}
                </div>
                <div className="text-[9px] sm:text-[10px] text-cyan-300/60 flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  <span>点击看大图与寄语</span>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* Centered Add Button Below Photo Grid */}
      <div className="mt-5 sm:mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleAddNextAge}
          className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full glass-frost-card border border-cyan-400/35 hover:border-cyan-300 text-cyan-200 hover:text-white bg-slate-900/60 hover:bg-cyan-950/60 shadow-[0_0_20px_rgba(112,228,255,0.15)] hover:shadow-[0_0_25px_rgba(112,228,255,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide">
            添加【{nextAgeToAdd} 周岁】成长相册
          </span>
          <span className="text-[10px] text-cyan-300/70 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
            ✨ 解锁新一年
          </span>
        </button>
      </div>

      {/* Photo Lightbox & Blessing Modal */}
      {selectedPhoto && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPhoto(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn"
        >
          <div className="glass-frost-card bg-slate-950/95 p-5 sm:p-7 rounded-3xl max-w-2xl w-full border-cyan-300/60 shadow-2xl relative text-center max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Top Navigation & Close Bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs text-cyan-200 font-bold">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40">
                  {selectedPhoto.age} 周岁
                </span>
                <span className="text-[11px] text-cyan-300/60">
                  ({currentPhotoIndex + 1} / {photos.length})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Prev / Next in Header */}
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  disabled={currentPhotoIndex <= 0}
                  className="p-1.5 rounded-full glass-frost-card text-cyan-300 hover:text-white disabled:opacity-30 disabled:hover:text-cyan-300 transition-colors"
                  title="查看上一周岁 (或按键盘 ←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  disabled={currentPhotoIndex >= photos.length - 1}
                  className="p-1.5 rounded-full glass-frost-card text-cyan-300 hover:text-white disabled:opacity-30 disabled:hover:text-cyan-300 transition-colors"
                  title="查看下一周岁 (或按键盘 →)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="关闭"
                  className="p-1.5 rounded-full glass-frost-card text-cyan-300 hover:text-white ml-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Image Frame with Quick Next/Prev floating arrows */}
            <div className="w-full max-h-[50vh] rounded-2xl overflow-hidden border border-cyan-300/40 my-3 shadow-2xl bg-slate-950 flex items-center justify-center relative group">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full max-h-[50vh] object-contain"
              />

              {/* Side Floating Arrow Buttons */}
              {currentPhotoIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-cyan-200 hover:text-white hover:bg-slate-950 border border-cyan-400/30 backdrop-blur-md opacity-80 group-hover:opacity-100 transition-all"
                  title="上一岁"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {currentPhotoIndex < photos.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-cyan-200 hover:text-white hover:bg-slate-950 border border-cyan-400/30 backdrop-blur-md opacity-80 group-hover:opacity-100 transition-all"
                  title="下一岁"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Details & Tailored Birthday Blessing */}
            <div className="space-y-3 mt-3 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {isEditingBlessing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-400/50 text-white text-sm focus:outline-none"
                    placeholder="输入周岁标题..."
                  />
                ) : (
                  <h3 className="text-base sm:text-lg font-black text-heading-elsa">
                    {selectedPhoto.title}
                  </h3>
                )}
                <span className="text-xs px-2.5 py-0.5 rounded-full glass-frost-card text-cyan-300 font-bold border border-cyan-400/40 self-start sm:self-auto">
                  {selectedPhoto.date}
                </span>
              </div>

              {/* Warm Blessing Box with Inline Editing Support */}
              <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-cyan-400/30 shadow-inner relative">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                    <Heart className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{selectedPhoto.age} 周岁专属成长祝福语</span>
                  </div>

                  {!isEditingBlessing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingBlessing(true)}
                      className="text-[11px] text-cyan-300 hover:text-white flex items-center gap-1 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>编辑寄语</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(selectedPhoto.id)}
                        className="text-[11px] text-emerald-300 hover:text-emerald-100 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30"
                      >
                        <Check className="w-3 h-3" />
                        <span>保存</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingBlessing(false)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>

                {isEditingBlessing ? (
                  <textarea
                    value={editBlessing}
                    onChange={(e) => setEditBlessing(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-400/50 text-cyan-100 text-xs sm:text-sm focus:outline-none"
                    placeholder="输入给宝贝本周岁的专属寄语..."
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-cyan-100 font-light leading-relaxed italic">
                    {selectedPhoto.blessing}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="mt-4 pt-3 border-t border-cyan-400/20 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={(e) => handleTriggerUpload(selectedPhoto.id, e)}
                  className="glass-frost-btn text-xs py-2 px-3.5 bg-cyan-600/40 border-cyan-300 text-white flex-1 sm:flex-initial justify-center"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-300" />
                  <span>更换此周岁照片 📸</span>
                </button>

                {(selectedPhoto.url.startsWith('data:') || selectedPhoto.url.startsWith('blob:')) && (
                  <button
                    type="button"
                    onClick={(e) => handleResetPhoto(selectedPhoto.id, e)}
                    className="glass-frost-btn text-xs py-2 px-3 text-rose-300 hover:text-white border-rose-500/40"
                    title="恢复默认插画"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>重置</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="glass-frost-btn text-xs py-2 px-5 w-full sm:w-auto justify-center"
              >
                收纳回忆 ❄️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
