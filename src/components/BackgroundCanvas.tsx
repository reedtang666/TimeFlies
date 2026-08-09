import { useEffect, useRef, memo } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  type: 'snowflake' | 'crystal';
}

interface TouchParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const BackgroundCanvas = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Optimized particle count for 60FPS on all devices
    const snowflakes: Particle[] = [];
    const maxSnowflakes = Math.min(Math.floor(width / 35), 40);

    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        size: Math.random() * 10 + 5,
        type: Math.random() > 0.4 ? 'snowflake' : 'crystal',
      });
    }

    // Throttled touch particles
    const touchParticles: TouchParticle[] = [];
    let lastMoveTime = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      if (now - lastMoveTime < 50) return; // Throttle to 20fps emission
      lastMoveTime = now;

      let px = 0;
      let py = 0;
      if (e instanceof MouseEvent) {
        px = e.clientX;
        py = e.clientY;
      } else if (e.touches && e.touches[0]) {
        px = e.touches[0].clientX;
        py = e.touches[0].clientY;
      }

      if (touchParticles.length > 25) touchParticles.shift(); // Cap array size

      const colors = ['#70e4ff', '#a6f0ff', '#c084fc', '#ffffff'];
      touchParticles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.3,
        life: 1,
        maxLife: 20,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let auroraTime = 0;

    const render = () => {
      // 1. Dark Background Fill
      ctx.fillStyle = '#070b19';
      ctx.fillRect(0, 0, width, height);

      // 2. Aurora Waves
      auroraTime += 0.003;
      const waveY1 = Math.sin(auroraTime) * 40 + height * 0.25;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, waveY1);
      ctx.bezierCurveTo(
        width * 0.4,
        waveY1 - 50,
        width * 0.7,
        waveY1 + 50,
        width,
        waveY1 - 20
      );
      ctx.lineTo(width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();

      const auroraGrad = ctx.createLinearGradient(0, 0, width, height * 0.5);
      auroraGrad.addColorStop(0, 'rgba(112, 228, 255, 0.08)');
      auroraGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.06)');
      auroraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auroraGrad;
      ctx.fill();
      ctx.restore();

      // 3. Render Snowflakes
      ctx.strokeStyle = 'rgba(224, 248, 255, 0.6)';
      ctx.lineWidth = 1;

      for (let i = 0; i < snowflakes.length; i++) {
        const p = snowflakes[i];
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.3 + p.speedX;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        if (p.type === 'snowflake') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.beginPath();
          ctx.moveTo(-p.radius * 2, 0);
          ctx.lineTo(p.radius * 2, 0);
          ctx.moveTo(0, -p.radius * 2);
          ctx.lineTo(0, p.radius * 2);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(166, 240, 255, ${p.opacity})`;
          ctx.fillRect(p.x, p.y, p.radius * 1.5, p.radius * 1.5);
        }
      }

      // 4. Render Touch Magic Particles
      for (let i = touchParticles.length - 1; i >= 0; i--) {
        const tp = touchParticles[i];
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.life++;

        const currentOpacity = 1 - tp.life / tp.maxLife;
        ctx.fillStyle = tp.color;
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (tp.life >= tp.maxLife) {
          touchParticles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
});

BackgroundCanvas.displayName = 'BackgroundCanvas';
