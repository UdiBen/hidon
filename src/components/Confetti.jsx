import { useEffect, useRef } from 'react';

const COLORS = ['#6d5efc', '#ffb020', '#10b981', '#f43f5e', '#38bdf8', '#a855f7'];

// Canvas confetti burst - self-contained, stops itself once every piece falls
// past the bottom edge. Skipped entirely when the user prefers reduced motion.
export default function Confetti({ pieces = 90 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame;

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.clientWidth;
    const confetti = Array.from({ length: pieces }, (_, i) => ({
      x: w() / 2 + (Math.random() - 0.5) * w() * 0.5,
      y: -20 - Math.random() * 120,
      vx: (Math.random() - 0.5) * 3.4,
      vy: 2 + Math.random() * 3.2,
      size: 6 + Math.random() * 7,
      spin: (Math.random() - 0.5) * 0.24,
      angle: Math.random() * Math.PI,
      color: COLORS[i % COLORS.length],
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w(), canvas.clientHeight);
      let alive = 0;

      for (const p of confetti) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.angle += p.spin;
        if (p.y < canvas.clientHeight + 40) alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (alive > 0) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [pieces]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 size-full"
    />
  );
}
