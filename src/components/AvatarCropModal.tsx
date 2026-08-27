import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Sparkles,
  Move,
  Loader2,
} from 'lucide-react';
import { frozenAudio } from '../utils/audioSystem';

interface AvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirmCrop: (croppedDataUrl: string) => void;
}

const VIEWPORT_SIZE = 320; // Width & height of the crop area in px
const CROP_DIAMETER = 240; // Diameter of the circle crop in px
const OUTPUT_SIZE = 512; // Exported resolution in px

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onConfirmCrop,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  });
  const [baseScale, setBaseScale] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize image dimensions and calculate base scale
  useEffect(() => {
    if (!imageSrc || !isOpen) return;

    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setNaturalSize({ width: w, height: h });

      // Scale so the smaller dimension at least covers the crop diameter
      const scale = Math.max(CROP_DIAMETER / w, CROP_DIAMETER / h);
      setBaseScale(scale);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
      alert('加载图片数据失败，请确认图片格式是否有效');
    };

    img.src = imageSrc;
  }, [imageSrc, isOpen]);

  // Non-passive wheel event listener to avoid browser console warnings
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.5), 4));
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [isOpen]);

  // Handle Drag / Pan with mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Touch drag & pinch
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - touchStartRef.current.x,
        y: touch.clientY - touchStartRef.current.y,
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartRef.current.dist;
      setZoom((prev) => Math.min(Math.max(prev * ratio, 0.5), 4));
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = undefined;
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    frozenAudio.playBell(1200, 0.15);
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset to default
  const handleReset = () => {
    frozenAudio.playBell(900, 0.15);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Perform final crop export
  const handleConfirm = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const ratio = OUTPUT_SIZE / CROP_DIAMETER;
      const totalScale = baseScale * zoom * ratio;

      ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      // Save and apply circular clip path on the output canvas
      ctx.save();
      ctx.beginPath();
      ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Transform coordinate system
      ctx.translate(OUTPUT_SIZE / 2 + position.x * ratio, OUTPUT_SIZE / 2 + position.y * ratio);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(totalScale, totalScale);

      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      frozenAudio.playMagicSpell();
      onConfirmCrop(croppedDataUrl);
      onClose();
    };
    img.src = imageSrc;
  };

  if (!isOpen || !imageSrc) return null;

  const currentScale = baseScale * zoom;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="glass-frost-card bg-slate-950/95 p-6 sm:p-7 rounded-3xl max-w-md w-full border-cyan-300/50 shadow-2xl relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-frost-card text-cyan-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          <h2 className="text-lg sm:text-xl font-black font-heading text-white">
            定制圆形公主头像
          </h2>
        </div>

        <p className="text-xs text-cyan-200/80 mb-4 flex items-center justify-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-cyan-300" />
          <span>拖拽移动照片 · 滚轮或滑块缩放对齐</span>
        </p>

        {/* Interactive Cropper Viewport Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative mx-auto rounded-2xl overflow-hidden border border-cyan-400/40 bg-slate-950 shadow-inner cursor-grab active:cursor-grabbing select-none"
          style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-cyan-300">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs">正在解析冰雪画面...</span>
            </div>
          ) : (
            <>
              {/* Transforming Image */}
              <div
                className="absolute top-1/2 left-1/2 will-change-transform"
                style={{
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${rotation}deg) scale(${currentScale})`,
                  transformOrigin: 'center center',
                }}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="裁剪原图"
                  draggable={false}
                  className="max-w-none pointer-events-none"
                  style={{
                    width: naturalSize.width,
                    height: naturalSize.height,
                  }}
                />
              </div>

              {/* Mask: Dark Frost Overlay outside the circle */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Cutout Mask using SVG */}
                <svg
                  className="w-full h-full absolute inset-0"
                  viewBox={`0 0 ${VIEWPORT_SIZE} ${VIEWPORT_SIZE}`}
                >
                  <defs>
                    <mask id="circle-cutout-mask">
                      <rect width="100%" height="100%" fill="white" />
                      <circle
                        cx={VIEWPORT_SIZE / 2}
                        cy={VIEWPORT_SIZE / 2}
                        r={CROP_DIAMETER / 2}
                        fill="black"
                      />
                    </mask>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="rgba(10, 15, 30, 0.75)"
                    mask="url(#circle-cutout-mask)"
                  />
                </svg>

                {/* Glowing Circular Border Ring */}
                <div
                  className="rounded-full border-2 border-cyan-300 shadow-[0_0_25px_rgba(112,228,255,0.7)] relative pointer-events-none"
                  style={{
                    width: CROP_DIAMETER,
                    height: CROP_DIAMETER,
                  }}
                >
                  {/* Subtle alignment crosshair dots */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-300/80 rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-300/80 rounded-full"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-300/80 rounded-full"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-300/80 rounded-full"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="mt-5 space-y-3">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 px-2">
            <button
              onClick={() => setZoom((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.5))}
              className="p-1.5 rounded-lg glass-frost-card text-cyan-200 hover:text-white"
              title="缩小"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <button
              onClick={() => setZoom((z) => Math.min(Number((z + 0.15).toFixed(2)), 3.5))}
              className="p-1.5 rounded-lg glass-frost-card text-cyan-200 hover:text-white"
              title="放大"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Action Tools: Rotate & Reset */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleRotate}
              className="glass-frost-card px-3 py-1.5 rounded-xl text-xs text-cyan-200 hover:text-white flex items-center gap-1.5 border-cyan-400/30"
            >
              <RotateCw className="w-3.5 h-3.5 text-cyan-300" />
              <span>旋转 90°</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="glass-frost-card px-3 py-1.5 rounded-xl text-xs text-cyan-200 hover:text-white flex items-center gap-1.5 border-cyan-400/30"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-300" />
              <span>还原居中</span>
            </button>
          </div>
        </div>

        {/* Footer Confirmation Buttons */}
        <div className="mt-6 pt-4 border-t border-cyan-400/20 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="glass-frost-btn flex-1 justify-center text-xs py-2.5 border-cyan-400/30 text-cyan-200"
          >
            取消
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="glass-frost-btn flex-1 justify-center text-xs py-2.5 bg-cyan-500/40 hover:bg-cyan-500/60 border-cyan-300 text-white font-bold shadow-[0_0_15px_rgba(112,228,255,0.4)] disabled:opacity-50"
          >
            <Check className="w-4 h-4 text-cyan-200" />
            <span>应用并设为头像 ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};
