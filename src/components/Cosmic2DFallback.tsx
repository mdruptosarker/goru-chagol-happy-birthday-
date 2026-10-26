import React, { useEffect, useRef } from 'react';
import { SceneId } from '../types';

interface Cosmic2DFallbackProps {
  currentScene: SceneId;
  candlesBlownOut: boolean;
  wishTriggeredCount: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const Cosmic2DFallback: React.FC<Cosmic2DFallbackProps> = ({
  currentScene,
  candlesBlownOut,
  wishTriggeredCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ currentScene, candlesBlownOut, wishTriggeredCount });

  useEffect(() => {
    stateRef.current = { currentScene, candlesBlownOut, wishTriggeredCount };
  }, [currentScene, candlesBlownOut, wishTriggeredCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High performance: 120 stars (optimal for smooth 60fps on all devices)
    const starCount = 130;
    const stars: Star[] = [];
    const colors = ['#FFF9FF', '#A78BFA', '#F5D58A', '#FFB6D9'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[i % colors.length],
      });
    }

    // Dynamic celebration/wish particles
    let particles: Particle[] = [];
    let lastWishCount = stateRef.current.wishTriggeredCount;

    const triggerBurst = (originX: number, originY: number) => {
      const burstCount = 60;
      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: Math.random() * 40 + 25,
          color: colors[i % colors.length],
          size: Math.random() * 2.5 + 1.2,
        });
      }
    };

    // Dramatic Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
    }
    const shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = performance.now() + 1000;

    let animationId = 0;
    let t = 0;
    let lastFrameTime = performance.now();

    const render = (now: number) => {
      // Throttle to max 60fps to prevent CPU burn
      const elapsed = now - lastFrameTime;
      if (elapsed < 14) {
        animationId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = now;
      t += 0.025;

      const { currentScene: scene, candlesBlownOut: blown, wishTriggeredCount: wishCount } = stateRef.current;

      // Check if user triggered wish
      if (wishCount !== lastWishCount) {
        lastWishCount = wishCount;
        triggerBurst(width / 2, height * (scene === 'birthday' ? 0.48 : 0.4));
      }

      // Fast solid fill with subtle gradient overlay
      ctx.fillStyle = '#10091F';
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric center glow (calculated quickly)
      const grad = ctx.createRadialGradient(width / 2, height * 0.45, 10, width / 2, height * 0.45, width * 0.65);
      grad.addColorStop(0, 'rgba(26, 18, 56, 0.85)');
      grad.addColorStop(1, 'rgba(16, 9, 31, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // High-performance star rendering: ZERO shadowBlur! (100x faster)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.speed;
        if (star.alpha > 0.95 || star.alpha < 0.2) {
          star.speed = -star.speed;
        }

        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Dramatic Shooting Stars
      if (now > nextShootingStarTime) {
        shootingStars.push({
          x: Math.random() * width * 0.85,
          y: Math.random() * height * 0.35,
          length: Math.random() * 90 + 70,
          speed: Math.random() * 14 + 11,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
          alpha: 1.0,
        });
        nextShootingStarTime = now + Math.random() * 3200 + 2200;
      }

      for (let s = shootingStars.length - 1; s >= 0; s--) {
        const ss = shootingStars[s];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.024;

        if (ss.alpha > 0) {
          const tailX = ss.x - Math.cos(ss.angle) * ss.length;
          const tailY = ss.y - Math.sin(ss.angle) * ss.length;

          const sGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
          sGrad.addColorStop(0, 'rgba(245, 213, 138, 0)');
          sGrad.addColorStop(0.7, `rgba(167, 139, 250, ${ss.alpha * 0.6})`);
          sGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

          ctx.strokeStyle = sGrad;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(ss.x, ss.y);
          ctx.stroke();
        } else {
          shootingStars.splice(s, 1);
        }
      }

      // Central Visual Motifs based on active scene
      const cx = width / 2;
      const cy = height * 0.48;

      if (scene === 'opening' || scene === 'letter') {
        // Luminous Envelope Motif
        ctx.save();
        ctx.translate(cx, cy + Math.sin(t * 1.5) * 8);

        // Orbiting stardust ring
        ctx.beginPath();
        ctx.ellipse(0, 0, 130, 45, Math.PI / 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 213, 138, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Orbiting stardust dot
        const ringAngle = t * 1.4;
        const rx = Math.cos(ringAngle) * 130;
        const ry = Math.sin(ringAngle) * 45;
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#F5D58A';
        ctx.fill();

        // Envelope Body
        ctx.fillStyle = '#1E1538';
        ctx.strokeStyle = '#A78BFA';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-75, -45, 150, 90, 8);
        ctx.fill();
        ctx.stroke();

        // Flap
        ctx.beginPath();
        ctx.moveTo(-75, -45);
        ctx.lineTo(0, scene === 'letter' ? -75 : 5);
        ctx.lineTo(75, -45);
        ctx.strokeStyle = '#F5D58A';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Wax Seal
        ctx.beginPath();
        ctx.arc(0, 5, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#F5D58A';
        ctx.fill();

        ctx.restore();

      } else if (scene === 'birthday') {
        // Birthday Cake Motif
        ctx.save();
        ctx.translate(cx, cy + Math.sin(t) * 5);

        // Pedestal Plate
        ctx.beginPath();
        ctx.ellipse(0, 70, 110, 22, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#241846';
        ctx.strokeStyle = '#A78BFA';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Cake Tier 1
        ctx.beginPath();
        ctx.roundRect(-85, 0, 170, 65, 8);
        ctx.fillStyle = '#342261';
        ctx.fill();
        ctx.strokeStyle = '#F5D58A';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cake Tier 2
        ctx.beginPath();
        ctx.roundRect(-55, -45, 110, 50, 6);
        ctx.fillStyle = '#3C2870';
        ctx.fill();
        ctx.strokeStyle = '#FFB6D9';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 15 Candles
        const cCount = 15;
        for (let i = 0; i < cCount; i++) {
          const candleX = -45 + (i / (cCount - 1)) * 90;
          const candleY = -48;

          // Candle stick
          ctx.beginPath();
          ctx.rect(candleX - 1.5, candleY - 18, 3, 18);
          ctx.fillStyle = '#FFF9FF';
          ctx.fill();

          // Candle flame
          if (!blown) {
            const flicker = Math.sin(t * 10 + i) * 1.5;
            ctx.beginPath();
            ctx.ellipse(candleX, candleY - 24 + flicker, 3.5, 7, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#FFA23A';
            ctx.fill();
          }
        }

        ctx.restore();

      } else if (scene === 'promise' || scene === 'celebration') {
        // Glowing Glass Heart Motif
        ctx.save();
        ctx.translate(cx, cy + Math.sin(t * 1.5) * 8);

        // Orbiting rings
        ctx.beginPath();
        ctx.ellipse(0, 0, 100, 36, -Math.PI / 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 182, 217, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Heart Path
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.bezierCurveTo(-55, -30, -65, -65, 0, -95);
        ctx.bezierCurveTo(65, -65, 55, -30, 0, 15);
        ctx.closePath();

        ctx.fillStyle = 'rgba(255, 182, 217, 0.6)';
        ctx.fill();
        ctx.strokeStyle = '#F5D58A';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }

      // Stylized Two Friendship Figures
      ctx.save();
      const figY = height * 0.78 + Math.sin(t * 2) * 2;
      const figDist = 30;

      // Platform / Bench
      ctx.beginPath();
      ctx.roundRect(cx - 65, figY + 32, 130, 8, 4);
      ctx.fillStyle = 'rgba(37, 25, 71, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
      ctx.stroke();

      // Best Friend (Left, Indigo)
      ctx.save();
      ctx.translate(cx - figDist, figY);
      // Coat
      ctx.beginPath();
      ctx.moveTo(-9, 32);
      ctx.lineTo(9, 32);
      ctx.lineTo(5, 10);
      ctx.lineTo(-5, 10);
      ctx.closePath();
      ctx.fillStyle = '#312E81';
      ctx.fill();
      // Scarf
      ctx.beginPath();
      ctx.arc(0, 10, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#F5D58A';
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(0, -2, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE8D6';
      ctx.fill();
      ctx.restore();

      // Bushra (Right, Lavender & Pink)
      ctx.save();
      ctx.translate(cx + figDist, figY);
      // Coat
      ctx.beginPath();
      ctx.moveTo(-9, 32);
      ctx.lineTo(9, 32);
      ctx.lineTo(5, 10);
      ctx.lineTo(-5, 10);
      ctx.closePath();
      ctx.fillStyle = '#6B46C1';
      ctx.fill();
      // Scarf
      ctx.beginPath();
      ctx.arc(0, 10, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#FFB6D9';
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(0, -2, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE8D6';
      ctx.fill();
      // Delicate birthday circlet
      ctx.beginPath();
      ctx.arc(0, -8, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F5D58A';
      ctx.fill();
      ctx.restore();

      // Shared glowing friendship star
      ctx.beginPath();
      ctx.arc(cx, figY + 10 + Math.sin(t * 3) * 3, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F5D58A';
      ctx.fill();

      ctx.restore();

      // Active particles update and render (lightweight)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life++;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#10091F]/20 to-[#10091F]/70 pointer-events-none" />
    </div>
  );
};
