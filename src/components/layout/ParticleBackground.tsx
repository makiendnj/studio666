
"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
}

const PARTICLE_DENSITY_FACTOR = 15000; // Lower for more particles, higher for less. Adjusted for subtlety.
const MIN_PARTICLES = 25;
const MAX_PARTICLES = 100; 

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesArrayRef = useRef<Particle[]>([]);
  const particleColorsRef = useRef<string[]>([]); // To store HSL strings with alpha

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (particleColorsRef.current.length === 0 && typeof window !== 'undefined') {
        const style = getComputedStyle(document.documentElement);
        const fgValue = style.getPropertyValue('--foreground').trim(); // e.g., "181 100% 90%"
        const primaryValue = style.getPropertyValue('--primary').trim();
        const accentValue = style.getPropertyValue('--accent').trim();
        
        const colors = [];
        if (fgValue) colors.push(`hsla(${fgValue}, 0.3)`);
        if (primaryValue) colors.push(`hsla(${primaryValue}, 0.3)`);
        if (accentValue) colors.push(`hsla(${accentValue}, 0.2)`); // Accent slightly more transparent

        if (colors.length === 0) { // Fallback if CSS vars are somehow not there
            colors.push('hsla(0, 0%, 100%, 0.3)');
        }
        particleColorsRef.current = colors;
    }
    
    const numParticles = Math.min(
      MAX_PARTICLES, 
      Math.max(MIN_PARTICLES, Math.floor((canvas.width * canvas.height) / PARTICLE_DENSITY_FACTOR))
    );

    particlesArrayRef.current = [];
    for (let i = 0; i < numParticles; i++) {
      const radius = Math.random() * 1.5 + 0.5; // Particle radius: 0.5px to 2px
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.5) * 0.4; // Particle horizontal velocity
      const vy = (Math.random() - 0.5) * 0.4; // Particle vertical velocity
      const color = particleColorsRef.current[Math.floor(Math.random() * particleColorsRef.current.length)];
      particlesArrayRef.current.push({ x, y, radius, vx, vy, color });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    initParticles(); 

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArrayRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap particles around screen edges
        if (particle.x - particle.radius > canvas.width) particle.x = 0 - particle.radius;
        if (particle.x + particle.radius < 0) particle.x = canvas.width + particle.radius;
        if (particle.y - particle.radius > canvas.height) particle.y = 0 - particle.radius;
        if (particle.y + particle.radius < 0) particle.y = canvas.height + particle.radius;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      // Debounce or throttle resize if performance issues arise, for now simple re-init
      initParticles(); 
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      )}
      aria-hidden="true"
    />
  );
}
