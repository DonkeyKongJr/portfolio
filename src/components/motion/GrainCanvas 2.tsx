'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './GrainCanvas.module.css';

const PARTICLES = 4000;
/** Nur jeder dritte Frame wird gezeichnet - das reicht optisch voellig. */
const FRAME_SKIP = 3;
/** Ab dieser Scrolltiefe (Anteil der Viewport-Hoehe) ist der Grain weg. */
const FADE_OVER = 0.65;

/**
 * Filmkorn ueber dem Hero.
 *
 * Die Performance-Disziplin ist hier der eigentliche Punkt: gedrosselte
 * Framerate, Pause bei verstecktem Tab, Abbruch sobald unsichtbar, und bei
 * reduzierter Bewegung laeuft gar nichts. Ohne das kostet ein Vollbild-Canvas
 * dauerhaft CPU.
 */
export function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Canvas kann keine CSS-Variablen aufloesen - Wert einmalig auslesen.
    const grainRgb =
      getComputedStyle(document.documentElement).getPropertyValue('--grain-rgb').trim() ||
      '150, 125, 105';

    let width = 0;
    let height = 0;
    let frame = 0;
    let tick = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      if (!running) return;
      frame = requestAnimationFrame(draw);

      if (document.hidden) return;

      const opacity = 1 - window.scrollY / (FADE_OVER * window.innerHeight);
      if (opacity <= 0.01) {
        canvas.style.opacity = '0';
        // Unter der Schwelle lohnt sich das Zeichnen nicht mehr.
        return;
      }
      canvas.style.opacity = String(Math.min(1, opacity));

      if (++tick % FRAME_SKIP !== 0) return;

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < PARTICLES; i += 1) {
        ctx.fillStyle = `rgba(${grainRgb}, ${Math.random() * 0.08})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
      }
    };

    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
