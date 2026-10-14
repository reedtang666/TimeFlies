import { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, X, Upload, RotateCcw, Eye, Heart } from 'lucide-react';
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

const DEFAULT_AGE_PHOTOS: PhotoMilestoneItem[] = [
  {
    id: 'age-1',
    age: 1,
    title: '一周岁 · 蹒跚学步的小精灵 👣',
    date: '1 周岁纪念',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    blessing: '“第一步摇摇晃晃，却勇敢地迈向了无垠的奇妙世界。愿你永远被爱与温柔环绕，无忧无虑，健康快乐成长！”',
  },
  {
    id: 'age-2',
    age: 2,
    title: '两周岁 · 牙牙学语的小太阳 ☀️',
    date: '2 周岁纪念',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    blessing: '“清脆的笑声与软糯的声音，是世间最动听的魔法咒语。愿你的小世界里永远充满阳光、欢歌与数不尽的惊喜！”',
  },
  {
    id: 'age-3',
    age: 3,
    title: '三周岁 · 戴上皇冠的小公主 👑',
    date: '3 周岁纪念',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    blessing: '“穿上艾莎最亮眼的冰晶长裙，眼里闪耀着对梦想的憧憬。做自己可爱纯真又勇敢骄傲的小公主，尽情奔跑在星光之下！”',
  },
  {
    id: 'age-4',
    age: 4,
    title: '四周岁 · 闪耀绽放的冰雪小女王 ✨',
    date: '4 周岁纪念',
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    blessing: '“四周岁的你像晶莹璀璨的冰晶，聪明懂事、自信闪亮。愿你如艾莎女王般勇敢坚定，乘风破浪，绽放独一无二的光芒！”',
  },
];

const STORAGE_KEY = 'timeflies_gallery_photos_v4';

interface PhotoGalleryProps {
  name: string;
  onRequireAuth?: (actionHint: string, onSuccess: () => void) => void;
}

export const PhotoGallery = ({ name, onRequireAuth }: PhotoGalleryProps) => {
  const [photos, setPhotos] = useState<PhotoMilestoneItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load gallery photos:', e);
    }
    return DEFAULT_AGE_PHOTOS;
  });

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMilestoneItem | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetUploadIdRef = useRef<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.warn('Failed to save gallery photos to localStorage:', e);
    }
  }, [photos]);

  const handlePhotoClick = (photo: PhotoMilestoneItem) => {
    frozenAudio.playBell(1400, 0.2);
    setSelectedPhoto(photo);
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

      // Update currently open lightbox photo if matching
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
      const defaultPhoto = DEFAULT_AGE_PHOTOS.find((p) => p.id === photoId);
      if (defaultPhoto) {
        frozenAudio.playBell(900, 0.15);
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, url: defaultPhoto.url } : p))
        );
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto((prev) => (prev ? { ...prev, url: defaultPhoto.url } : prev));
        }
      }
    };
    if (onRequireAuth) {
      onRequireAuth('恢复相册默认照片', action);
    } else {
      action();
    }
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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-12 relative">
      {/* Hidden File Input for direct photo upload without cropping */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-frost-card text-xs text-cyan-200 border border-cyan-400/30 mb-2">
          <Camera className="w-3.5 h-3.5 text-cyan-300" />
          <span>Disney Frozen 1-4 Years Photo Album</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-heading-elsa tracking-wide flex items-center justify-center gap-2">
          <span>👑</span>
          <span>{name} 的 1-4 周岁成长魔法相册</span>
          <span>👑</span>
        </h2>
        <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">
          记录从初生萌芽到四周岁女王的每一步闪耀成长 · 支持直接上传本地珍藏照片
        </p>
      </div>

      {/* 4-Card Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {photos.map((photo) => {
          const isDragTarget = dragOverId === photo.id;
          const isCurrentUploading = uploadingId === photo.id;
          const isCustomPhoto = !DEFAULT_AGE_PHOTOS.some(
            (dp) => dp.id === photo.id && dp.url === photo.url
          );

          return (
            <div
              key={photo.id}
              onClick={() => handlePhotoClick(photo)}
              onDragOver={(e) => handleDragOver(photo.id, e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(photo.id, e)}
              className={`glass-frost-card p-3.5 rounded-2xl cursor-pointer group hover:scale-[1.03] transition-all duration-300 border flex flex-col justify-between relative overflow-hidden ${
                isDragTarget
                  ? 'border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(112,228,255,0.6)] bg-cyan-950/60'
                  : 'border-cyan-300/40 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(112,228,255,0.3)]'
              }`}
            >
              <div>
                {/* Photo Frame */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 relative bg-slate-950 shadow-md">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Age Badge */}
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-[11px] font-black text-cyan-200 border border-cyan-400/40 backdrop-blur-md shadow">
                    {photo.date}
                  </div>

                  {/* Uploading Overlay */}
                  {isCurrentUploading && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-300 gap-1.5">
                      <Sparkles className="w-6 h-6 animate-spin text-cyan-300" />
                      <span className="text-xs font-bold">正在导入照片...</span>
                    </div>
                  )}

                  {/* Drag Target Notice */}
                  {isDragTarget && (
                    <div className="absolute inset-0 bg-cyan-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-200 border-2 border-dashed border-cyan-300">
                      <Upload className="w-7 h-7 text-cyan-300 animate-bounce mb-1" />
                      <span className="text-xs font-black text-white">松开立即更换照片</span>
                    </div>
                  )}

                  {/* Hover Quick Action Toolbar on Photo */}
                  <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={(e) => handleTriggerUpload(photo.id, e)}
                      className="px-3 py-1.5 rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg border border-cyan-300/80 transition-all hover:scale-105"
                      title="上传电脑中的真实照片"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>更换照片</span>
                    </button>

                    <span className="p-1.5 rounded-full bg-slate-900/80 text-cyan-200 border border-cyan-400/40">
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Title & Blessing Content */}
                <div className="px-1 space-y-1.5 text-left">
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-200 transition-colors">
                    {photo.title}
                  </h3>

                  <p className="text-[11px] text-cyan-100/80 leading-relaxed font-light line-clamp-3 bg-slate-950/40 p-2 rounded-xl border border-cyan-500/20 italic">
                    {photo.blessing}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-3 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={(e) => handleTriggerUpload(photo.id, e)}
                  className="text-cyan-300 hover:text-white flex items-center gap-1 text-[11px] font-medium"
                >
                  <Upload className="w-3 h-3" />
                  <span>{isCustomPhoto ? '重新选图' : '上传照片'}</span>
                </button>

                {isCustomPhoto && (
                  <button
                    type="button"
                    onClick={(e) => handleResetPhoto(photo.id, e)}
                    className="text-rose-300/80 hover:text-rose-200 flex items-center gap-1 text-[10px]"
                    title="恢复默认插画"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>重置</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Lightbox & Blessing Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="glass-frost-card bg-slate-950/95 p-6 sm:p-8 rounded-3xl max-w-2xl w-full border-cyan-300/60 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full glass-frost-card text-cyan-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Lightbox Image Frame */}
            <div className="w-full max-h-[55vh] rounded-2xl overflow-hidden border border-cyan-300/40 my-3 shadow-2xl bg-slate-950 flex items-center justify-center relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full max-h-[55vh] object-contain"
              />
            </div>

            {/* Details & Tailored Birthday Blessing */}
            <div className="space-y-3 mt-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-black text-heading-elsa">
                  {selectedPhoto.title}
                </h3>
                <span className="text-xs px-3 py-1 rounded-full glass-frost-card text-cyan-300 font-bold border border-cyan-400/40 self-start sm:self-auto">
                  {selectedPhoto.date}
                </span>
              </div>

              {/* Warm Blessing Box */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-cyan-400/30 shadow-inner">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1.5">
                  <Heart className="w-3.5 h-3.5 fill-amber-300" />
                  <span>{selectedPhoto.age} 周岁专属成长祝福语</span>
                </div>
                <p className="text-xs sm:text-sm text-cyan-100 font-light leading-relaxed italic">
                  {selectedPhoto.blessing}
                </p>
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="mt-5 pt-3 border-t border-cyan-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={(e) => handleTriggerUpload(selectedPhoto.id, e)}
                className="glass-frost-btn text-xs py-2 px-4 bg-cyan-600/40 border-cyan-300 text-white w-full sm:w-auto justify-center"
              >
                <Camera className="w-4 h-4 text-cyan-300" />
                <span>更换此周岁的本地照片 📸</span>
              </button>

              <button
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
