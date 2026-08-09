import confetti from 'canvas-confetti';

// Play magical ice chime using Web Audio API
export function playIceMagicChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Frequencies for a sparkling magical ice arpeggio (C6, E6, G6, B6, C7)
    const freqs = [1046.5, 1318.5, 1567.98, 1975.5, 2093.0];

    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0.2, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.65);
    });
  } catch (err) {
    console.warn('Audio Context not allowed or initialized yet', err);
  }
}

// Cast full-screen Frozen Ice Magic Celebration Confetti
export function triggerFrozenMagicEffect() {
  playIceMagicChime();

  const colors = ['#70e4ff', '#a6f0ff', '#e0f8ff', '#c084fc', '#ffffff'];

  // Left burst
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 70,
    origin: { x: 0, y: 0.7 },
    colors: colors,
    shapes: ['square', 'circle'],
    scalar: 1.2,
  });

  // Right burst
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 70,
    origin: { x: 1, y: 0.7 },
    colors: colors,
    shapes: ['square', 'circle'],
    scalar: 1.2,
  });

  // Center sparkling snowflake explosion
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: colors,
      scalar: 1.5,
    });
  }, 250);
}
