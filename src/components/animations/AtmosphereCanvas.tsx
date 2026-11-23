import React, { useEffect, useRef } from 'react';
import { ThemeId } from '../../core/types';

interface Props {
  theme: ThemeId;
  enabled: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rot: number;
  vRot: number;
  hue?: string;
}

const PARTICLE_COLORS: Record<ThemeId, string> = {
  'classic-paper': 'rgba(192, 90, 63, 0.24)',
  'evening-noir': 'rgba(227, 179, 104, 0.30)',
  'goth-velvet': 'rgba(220, 38, 38, 0.38)',
  halloween: 'rgba(255, 107, 26, 0.42)',
  'comic-hero': 'rgba(225, 29, 72, 0.25)',
  'nature-botanical': 'rgba(45, 106, 79, 0.30)',
  'sakura-rose': 'rgba(214, 69, 122, 0.38)',
  'cozy-autumn': 'rgba(184, 67, 24, 0.32)',
  'midnight-starlight': 'rgba(253, 224, 71, 0.65)',
};

export const AtmosphereCanvas: React.FC<Props> = ({ theme, enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();

    const count = theme === 'midnight-starlight' ? 28 : 18;
    const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: theme === 'sakura-rose' ? 0.3 + Math.random() * 0.2 : (Math.random() - 0.5) * 0.26,
      vy:
        theme === 'midnight-starlight'
          ? (Math.random() - 0.5) * 0.08
          : theme === 'halloween' || theme === 'goth-velvet' || theme === 'evening-noir'
            ? -0.35 - Math.random() * 0.25
            : 0.25 + Math.random() * 0.28,
      size: theme === 'midnight-starlight' ? 1.2 + Math.random() * 2.4 : 2.5 + Math.random() * 3.8,
      alpha: 0.25 + Math.random() * 0.55,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.025,
      hue: i % 3 === 0 ? '#38BDF8' : i % 3 === 1 ? '#FDE047' : '#C084FC',
    }));

    let tick = 0;
    let shooter = { active: false, x: 0, y: 0, vx: 6.5, vy: 3.2, life: 0 };

    let raf = 0;
    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Space, Galaxy & Moon special backdrop: glowing crescent moon, ringed planet & shooting stars
      if (theme === 'midnight-starlight') {
        const mx = canvas.width - 68;
        const my = 104;

        // Nebula soft aura
        const aura = ctx.createRadialGradient(mx, my, 4, mx, my, 64);
        aura.addColorStop(0, 'rgba(253, 224, 71, 0.22)');
        aura.addColorStop(0.5, 'rgba(109, 40, 217, 0.14)');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mx, my, 64, 0, Math.PI * 2);
        ctx.fill();

        // Crescent Moon
        ctx.save();
        ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
        ctx.beginPath();
        ctx.arc(mx, my, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(mx + 7, my - 5, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Ringed Galaxy Planet bottom-left
        ctx.save();
        ctx.translate(48, canvas.height - 148);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.24)';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate(-0.35);
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.42)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Occasional shooting star
        if (!shooter.active && tick % 240 === 40) {
          shooter = {
            active: true,
            x: Math.random() * canvas.width * 0.55,
            y: 55 + Math.random() * 120,
            vx: 6.2,
            vy: 2.6,
            life: 24,
          };
        }
        if (shooter.active) {
          ctx.save();
          const grad = ctx.createLinearGradient(
            shooter.x,
            shooter.y,
            shooter.x - shooter.vx * 8,
            shooter.y - shooter.vy * 8
          );
          grad.addColorStop(0, 'rgba(255,255,255,0.95)');
          grad.addColorStop(1, 'rgba(56,189,248,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(shooter.x, shooter.y);
          ctx.lineTo(shooter.x - shooter.vx * 8, shooter.y - shooter.vy * 8);
          ctx.stroke();
          ctx.restore();
          shooter.x += shooter.vx;
          shooter.y += shooter.vy;
          shooter.life -= 1;
          if (shooter.life <= 0) shooter.active = false;
        }
      }

      // Comic Hero corner spiderweb filaments
      if (theme === 'comic-hero') {
        ctx.save();
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
        ctx.lineWidth = 1.2;
        const ox = canvas.width;
        const oy = 46;
        [0, 0.25, 0.5, 0.75, 1].forEach((frac) => {
          const angle = Math.PI * 0.5 + frac * (Math.PI * 0.5);
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ox + Math.cos(angle) * 110, oy + Math.sin(angle) * 110);
          ctx.stroke();
        });
        [36, 66, 96].forEach((r) => {
          ctx.beginPath();
          ctx.arc(ox, oy, r, Math.PI * 0.5, Math.PI);
          ctx.stroke();
        });
        ctx.restore();
      }

      const color = PARTICLE_COLORS[theme] || PARTICLE_COLORS['classic-paper'];

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        if (p.y > canvas.height + 12) p.y = -12;
        if (p.y < -12) p.y = canvas.height + 12;
        if (p.x > canvas.width + 12) p.x = -12;
        if (p.x < -12) p.x = canvas.width + 12;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (theme === 'midnight-starlight') {
          const pulse = 0.5 + 0.5 * Math.sin(tick * 0.05 + p.x);
          ctx.globalAlpha = 0.35 + pulse * 0.65;
          ctx.fillStyle = p.hue || '#FDE047';
          // 4-point star glint
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.quadraticCurveTo(0, 0, p.size * 1.5, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.size * 1.5);
          ctx.quadraticCurveTo(0, 0, -p.size * 1.5, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.size * 1.5);
          ctx.fill();
        } else if (theme === 'sakura-rose') {
          ctx.fillStyle = color;
          for (let pet = 0; pet < 5; pet++) {
            ctx.rotate((Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(p.size, 0, p.size * 0.9, p.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (theme === 'nature-botanical' || theme === 'cozy-autumn') {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.45, p.size * 0.72, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (theme === 'comic-hero') {
          ctx.fillStyle = p.x % 2 > 1 ? 'rgba(29, 78, 216, 0.22)' : color;
          ctx.fillRect(-p.size, -p.size, p.size * 1.8, p.size * 1.8);
        } else if (theme === 'halloween') {
          ctx.fillStyle = p.size > 4.5 ? 'rgba(192, 132, 252, 0.35)' : color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [theme, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-95"
    />
  );
};
