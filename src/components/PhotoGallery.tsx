import { useState } from 'react';
import { Camera, Sparkles, X } from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';

export interface PhotoItem {
  id: string;
  title: string;
  date: string;
  url: string;
  caption: string;
}

const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'p1',
    title: '第一张百日冰晶全家福 📸',
    date: '百天纪念',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    caption: '第一次穿上小雪花公主裙，睡在小摇篮里的软萌模样。',
  },
  {
    id: 'p2',
    title: '学会独立跨出第一步 👣',
    date: '一周岁摇摇晃晃',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    caption: '像爱莎小公主一样勇敢地向前迈进，爸爸妈妈在对面张开双臂！',
  },
  {
    id: 'p3',
    title: '冰雪奇缘主题生日会 🎂',
    date: '两周岁派对',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    caption: '戴上最闪亮的水晶皇冠，许下关于快乐与长大的愿望。',
  },
];

interface PhotoGalleryProps {
  name: string;
}

export const PhotoGallery = ({ name }: PhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const handlePhotoClick = (photo: PhotoItem) => {
    frozenAudio.playBell(1400, 0.2);
    setSelectedPhoto(photo);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-12 z-10 relative">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-frost-card text-xs text-cyan-200 border border-cyan-400/30 mb-2">
          <Camera className="w-3.5 h-3.5 text-cyan-300" />
          <span>Disney Frozen Photo Album</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-heading-elsa tracking-wide flex items-center justify-center gap-2">
          <span>🖼️</span>
          <span>{name} 的冰晶拍立得画廊</span>
          <span>🖼️</span>
        </h2>
        <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">
          定格每一个眼眸闪光、灿烂微笑的魔法瞬间
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {DEFAULT_PHOTOS.map((photo) => (
          <div
            key={photo.id}
            onClick={() => handlePhotoClick(photo)}
            className="glass-frost-card p-3 rounded-2xl cursor-pointer group hover:scale-[1.03] transition-all border-cyan-300/40 relative overflow-hidden"
          >
            {/* Polaroid Frame */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 relative bg-slate-950">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/70 text-[10px] text-cyan-200 font-semibold border border-cyan-400/30 backdrop-blur-md">
                {photo.date}
              </div>
            </div>

            <div className="px-1 pb-1">
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors truncate">
                {photo.title}
              </h3>
              <p className="text-[11px] text-cyan-200/70 line-clamp-1 mt-0.5 font-light">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="glass-frost-card p-6 sm:p-8 rounded-3xl max-w-xl w-full border-cyan-300/60 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full glass-frost-card text-cyan-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full max-h-[60vh] rounded-2xl overflow-hidden border border-cyan-300/40 my-3 shadow-xl">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain bg-slate-950"
              />
            </div>

            <div className="space-y-2 mt-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-heading-elsa">{selectedPhoto.title}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full glass-frost-card text-cyan-300 font-semibold border border-cyan-400/30">
                  {selectedPhoto.date}
                </span>
              </div>
              <p className="text-sm text-cyan-100/90 bg-slate-950/60 p-3.5 rounded-xl border border-cyan-500/20">
                {selectedPhoto.caption}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-cyan-400/20 flex items-center justify-between text-xs text-cyan-300/70">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Disney Frozen Photo Memory Box
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="glass-frost-btn text-xs py-1.5 px-4"
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
