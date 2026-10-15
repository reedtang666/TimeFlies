// Web Audio API Synthesizer & HTML5 MP3 Track Engine for "Let It Go"
export const DEFAULT_LOCAL_AUDIO_URL = '/let-it-go.mp3';

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  audioUrl: string;
}

type AudioListener = (state: AudioState) => void;

class FrozenAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingAmbient = false;
  private ambientTimer: number | null = null;
  private audioTrack: HTMLAudioElement | null = null;
  private listeners: Set<AudioListener> = new Set();

  private audioUrl: string =
    (typeof window !== 'undefined' && localStorage.getItem('timeflies_audio_url')) ||
    DEFAULT_LOCAL_AUDIO_URL;

  private savedProgress: number =
    (typeof window !== 'undefined' &&
      parseFloat(localStorage.getItem('timeflies_audio_progress') || '0')) ||
    0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initAudioElement() {
    if (this.audioTrack) return;

    this.audioTrack = new Audio(this.audioUrl);
    this.audioTrack.loop = true;
    this.audioTrack.volume = 0.7;

    // Restore saved playback timestamp
    this.audioTrack.addEventListener('loadedmetadata', () => {
      if (this.savedProgress > 0 && this.savedProgress < (this.audioTrack?.duration || 0)) {
        if (this.audioTrack) {
          this.audioTrack.currentTime = this.savedProgress;
        }
      }
      this.notifyListeners();
    });

    this.audioTrack.addEventListener('timeupdate', () => {
      if (this.audioTrack) {
        const cur = this.audioTrack.currentTime;
        // Save progress to localStorage periodically
        try {
          localStorage.setItem('timeflies_audio_progress', cur.toFixed(1));
        } catch {
          // Ignore
        }
      }
      this.notifyListeners();
    });

    this.audioTrack.addEventListener('play', () => {
      this.isPlayingAmbient = true;
      this.notifyListeners();
    });

    this.audioTrack.addEventListener('pause', () => {
      this.isPlayingAmbient = false;
      this.notifyListeners();
    });

    this.audioTrack.addEventListener('ended', () => {
      this.isPlayingAmbient = false;
      this.notifyListeners();
    });
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  public getState(): AudioState {
    return {
      isPlaying: this.isPlayingAmbient,
      currentTime: this.audioTrack ? this.audioTrack.currentTime : this.savedProgress,
      duration: this.audioTrack && !isNaN(this.audioTrack.duration) ? this.audioTrack.duration : 225, // default ~3:45
      volume: this.audioTrack ? this.audioTrack.volume : 0.7,
      isMuted: this.audioTrack ? this.audioTrack.muted : false,
      audioUrl: this.audioUrl,
    };
  }

  // Play soft crystalline bell sound on interaction
  public playBell(freq = 1200, duration = 0.5) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  // Play sparkling chime sound
  public playSparkle() {
    this.playMagicSpell();
  }

  // Play magical ice arpeggio spell
  public playMagicSpell() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [1046.5, 1318.5, 1567.98, 1975.5, 2093.0, 2637.0];
      const now = this.ctx.currentTime;

      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.07);

        gain.gain.setValueAtTime(0.12, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.55);
      });
    } catch {
      // Ignore
    }
  }

  public getAudioUrl(): string {
    return this.audioUrl;
  }

  public isUsingDefaultLocal(): boolean {
    return !this.audioUrl || this.audioUrl === DEFAULT_LOCAL_AUDIO_URL;
  }

  public setAudioUrl(url: string | null) {
    const trimmed = (url || '').trim();
    if (trimmed && trimmed !== DEFAULT_LOCAL_AUDIO_URL) {
      this.audioUrl = trimmed;
      if (typeof window !== 'undefined') {
        localStorage.setItem('timeflies_audio_url', trimmed);
      }
    } else {
      this.audioUrl = DEFAULT_LOCAL_AUDIO_URL;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('timeflies_audio_url');
      }
    }

    if (this.audioTrack) {
      const wasPlaying = !this.audioTrack.paused;
      this.audioTrack.src = this.audioUrl;
      if (wasPlaying && this.isPlayingAmbient) {
        this.audioTrack.play().catch(() => {});
      }
    }
    this.notifyListeners();
  }

  public seek(seconds: number) {
    this.initAudioElement();
    if (this.audioTrack) {
      const targetTime = Math.max(0, Math.min(seconds, this.audioTrack.duration || 9999));
      this.audioTrack.currentTime = targetTime;
      this.savedProgress = targetTime;
      try {
        localStorage.setItem('timeflies_audio_progress', targetTime.toFixed(1));
      } catch {
        // Ignore
      }
      this.notifyListeners();
    }
  }

  public setVolume(vol: number) {
    this.initAudioElement();
    if (this.audioTrack) {
      const clamped = Math.max(0, Math.min(vol, 1));
      this.audioTrack.volume = clamped;
      if (clamped === 0) {
        this.audioTrack.muted = true;
      } else {
        this.audioTrack.muted = false;
      }
      this.notifyListeners();
    }
  }

  public toggleMute() {
    this.initAudioElement();
    if (this.audioTrack) {
      this.audioTrack.muted = !this.audioTrack.muted;
      this.notifyListeners();
    }
  }

  public play() {
    this.initAudioElement();
    this.isPlayingAmbient = true;

    if (this.audioTrack) {
      if (this.savedProgress > 0 && Math.abs(this.audioTrack.currentTime - this.savedProgress) > 2) {
        this.audioTrack.currentTime = this.savedProgress;
      }
      this.audioTrack
        .play()
        .then(() => {
          this.notifyListeners();
        })
        .catch((e) => {
          console.warn('MP3 playback blocked, trying fallback synth:', e);
          this.playMusicBoxLetItGo();
        });
    }
  }

  public pause() {
    this.isPlayingAmbient = false;
    if (this.audioTrack) {
      this.audioTrack.pause();
    }
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
    this.notifyListeners();
  }

  public toggleAmbientMusic(enable?: boolean, customUrl?: string) {
    if (customUrl) {
      this.setAudioUrl(customUrl);
    }

    const shouldPlay = enable !== undefined ? enable : !this.isPlayingAmbient;
    if (shouldPlay) {
      this.play();
    } else {
      this.pause();
    }
  }

  private playMusicBoxLetItGo() {
    this.initCtx();
    const letItGoPhrases = [
      { note: 415.3, delay: 0 },
      { note: 523.25, delay: 0.35 },
      { note: 523.25, delay: 0.7 },
      { note: 466.16, delay: 1.1 },
      { note: 415.3, delay: 1.45 },
      { note: 415.3, delay: 2.0 },
      { note: 415.3, delay: 2.3 },
      { note: 392.0, delay: 2.6 },
      { note: 415.3, delay: 2.9 },
      { note: 392.0, delay: 3.2 },
      { note: 311.13, delay: 3.5 },
      { note: 415.3, delay: 4.2 },
      { note: 523.25, delay: 4.55 },
      { note: 523.25, delay: 4.9 },
      { note: 622.25, delay: 5.4 },
      { note: 622.25, delay: 5.7 },
      { note: 698.46, delay: 6.0 },
      { note: 622.25, delay: 6.3 },
      { note: 554.37, delay: 6.6 },
      { note: 523.25, delay: 6.9 },
      { note: 466.16, delay: 7.2 },
    ];

    const playMelody = () => {
      if (!this.isPlayingAmbient || !this.ctx) return;
      const now = this.ctx.currentTime;

      letItGoPhrases.forEach((p) => {
        if (!this.ctx || !this.isPlayingAmbient) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.note, now + p.delay);

        gain.gain.setValueAtTime(0.08, now + p.delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.delay + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + p.delay);
        osc.stop(now + p.delay + 0.85);
      });
    };

    playMelody();
    if (!this.ambientTimer) {
      this.ambientTimer = window.setInterval(playMelody, 8500);
    }
  }
}

export const frozenAudio = new FrozenAudioEngine();
