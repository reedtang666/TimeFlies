// Web Audio API Synthesizer for Ambient Frozen Magic Music & Sound FX
class FrozenAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingAmbient = false;
  private ambientTimer: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
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
      // Audio autoplay policy fallback
    }
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

  // Toggle soft ambient crystal music loop
  public toggleAmbientMusic(enable: boolean) {
    this.initCtx();
    if (!enable) {
      this.isPlayingAmbient = false;
      if (this.ambientTimer) {
        clearInterval(this.ambientTimer);
        this.ambientTimer = null;
      }
      return;
    }

    if (this.isPlayingAmbient) return;
    this.isPlayingAmbient = true;

    // Ambient chords (Cmaj7 / Am9 scale)
    const chords = [
      [523.25, 659.25, 783.99, 987.77], // Cmaj7
      [440.0, 523.25, 659.25, 880.0],   // Am9
      [349.23, 523.25, 698.46, 880.0],   // Fmaj7
      [392.0, 493.88, 587.33, 783.99],   // G7
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.isPlayingAmbient || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.2);

        gain.gain.setValueAtTime(0.03, now + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.2 + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.2);
        osc.stop(now + i * 0.2 + 2.6);
      });
    };

    playChord();
    this.ambientTimer = window.setInterval(playChord, 3200);
  }
}

export const frozenAudio = new FrozenAudioEngine();
