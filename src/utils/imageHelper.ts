/**
 * High-performance, robust client-side image processing:
 * - Supports Apple iPhone HEIC / HEIF format conversion to JPEG
 * - Supports modern createImageBitmap with hardware acceleration
 * - Fallbacks to URL.createObjectURL and FileReader
 * - Handles high-resolution and large photos smoothly
 * - Downscales to max dimension and compresses to lightweight Data URL
 */

async function ensureHeic2Any(): Promise<any> {
  if (typeof window !== 'undefined' && (window as any).heic2any) {
    return (window as any).heic2any;
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById('heic2any-script') as HTMLScriptElement;
    if (existing) {
      if ((window as any).heic2any) {
        resolve((window as any).heic2any);
        return;
      }
      existing.addEventListener('load', () => resolve((window as any).heic2any));
      existing.addEventListener('error', () => reject(new Error('加载 HEIC 图片解码器失败')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'heic2any-script';
    script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
    script.onload = () => resolve((window as any).heic2any);
    script.onerror = () => reject(new Error('加载 HEIC 苹果照片转换器失败，请检查网络后重试'));
    document.head.appendChild(script);
  });
}

export async function convertHeicToJpegBlob(file: File | Blob): Promise<Blob> {
  const heic2any = await ensureHeic2Any();
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.92,
  });
  return Array.isArray(converted) ? converted[0] : converted;
}

async function decodeWithImageBitmap(
  file: Blob,
  maxDim: number,
  quality: number
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    let w = bitmap.width;
    let h = bitmap.height;

    if (w > h) {
      if (w > maxDim) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      }
    } else {
      if (h > maxDim) {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    canvas.width = Math.max(1, w);
    canvas.height = Math.max(1, h);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法创建图片绘制上下文');

    ctx.drawImage(bitmap, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    bitmap.close?.();
  }
}

function decodeWithObjectUrl(
  file: Blob,
  maxDim: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;

        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = Math.max(1, w);
        canvas.height = Math.max(1, h);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建图片绘制上下文'));
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('图片加载失败'));
    };

    img.src = objectUrl;
  });
}

function decodeWithFileReader(
  file: File | Blob,
  maxDim: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('读取图片文件失败'));
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;

          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          canvas.width = Math.max(1, w);
          canvas.height = Math.max(1, h);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法创建图片绘制上下文'));
            return;
          }

          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('图片解码失败'));
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function processAvatarImage(
  rawFile: File,
  maxDim = 512,
  quality = 0.9
): Promise<string> {
  if (!rawFile) {
    throw new Error('未选择任何图片文件');
  }

  let file: File | Blob = rawFile;
  const isHeic =
    /\.(heic|heif)$/i.test(rawFile.name) ||
    (rawFile.type && (rawFile.type.includes('heic') || rawFile.type.includes('heif')));

  if (isHeic) {
    try {
      file = await convertHeicToJpegBlob(rawFile);
    } catch (e) {
      console.warn('HEIC conversion failed:', e);
    }
  }

  // Strategy 1: createImageBitmap (modern, asynchronous, hardware accelerated)
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      return await decodeWithImageBitmap(file, maxDim, quality);
    } catch (err) {
      console.warn('createImageBitmap failed, trying URL.createObjectURL:', err);
    }
  }

  // Strategy 2: URL.createObjectURL (high compatibility)
  if (typeof window !== 'undefined' && 'URL' in window && typeof URL.createObjectURL === 'function') {
    try {
      return await decodeWithObjectUrl(file, maxDim, quality);
    } catch (err) {
      console.warn('URL.createObjectURL failed, trying FileReader:', err);
    }
  }

  // Strategy 3: FileReader base64
  try {
    return await decodeWithFileReader(file, maxDim, quality);
  } catch (err) {
    console.error('All image decoders failed:', err);
    throw new Error('图片解析失败，建议选择标准 JPG 或 PNG 格式图片 📸');
  }
}

/**
 * Loads a File into an image src URL string (for cropper preview/processing)
 * Automatically converts HEIC to standard JPEG Blob if necessary.
 */
export async function loadImageSource(file: File): Promise<string> {
  if (!file) {
    throw new Error('未选择文件');
  }

  const isHeic =
    /\.(heic|heif)$/i.test(file.name) ||
    (file.type && (file.type.includes('heic') || file.type.includes('heif')));

  if (isHeic) {
    try {
      const jpegBlob = await convertHeicToJpegBlob(file);
      return URL.createObjectURL(jpegBlob);
    } catch (err) {
      console.error('HEIC conversion error:', err);
      throw new Error('苹果 HEIC 格式转换中遇到问题，请重试或导出为 JPG/PNG 后选择 📸');
    }
  }

  const isImageMime = file.type && file.type.startsWith('image/');
  const isImageExt = /\.(jpe?g|png|webp|gif|bmp|svg|avif)$/i.test(file.name);
  if (!isImageMime && !isImageExt) {
    throw new Error('请选择有效的图片文件（支持 JPG、PNG、WebP、HEIC 等格式）');
  }

  if (typeof window !== 'undefined' && 'URL' in window && typeof URL.createObjectURL === 'function') {
    return URL.createObjectURL(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}

/**
 * High-res image compressor for photo gallery items (without cropping)
 */
export async function processGalleryImage(file: File): Promise<string> {
  return processAvatarImage(file, 1280, 0.88);
}

