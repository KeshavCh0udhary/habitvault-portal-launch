
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedCursorGradientProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  particleCount?: number;
}

export const EnhancedCursorGradient = ({
  children,
  className,
  intensity = 'medium',
  particleCount = 25
}: EnhancedCursorGradientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  const intensityValues = {
    low: { size: 300, opacity: 0.1 },
    medium: { size: 600, opacity: 0.15 },
    high: { size: 900, opacity: 0.2 }
  };
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    let particles: HTMLDivElement[] = [];
    
    // Create particles
    if (particlesRef.current) {
      particlesRef.current.innerHTML = '';
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full opacity-0 pointer-events-none';
        particle.style.background = `radial-gradient(circle, rgba(108, 93, 211, 0.8) 0%, rgba(65, 208, 199, 0.4) 70%)`;
        particle.style.width = `${Math.random() * 20 + 10}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.transform = `scale(${Math.random() * 0.3 + 0.7})`;
        
        particlesRef.current.appendChild(particle);
        particles.push(particle);
        
        // Random animations
        gsapAnimate(particle);
      }
    }
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
      
      // Animate closest particle
      if (particles.length > 0) {
        const randomParticle = particles[Math.floor(Math.random() * particles.length)];
        randomParticle.style.left = `${x}px`;
        randomParticle.style.top = `${y}px`;
        randomParticle.style.opacity = '0.7';
        randomParticle.style.transform = 'scale(1.5)';
        randomParticle.style.transition = 'opacity 0.3s ease, transform 0.5s ease';
        
        setTimeout(() => {
          randomParticle.style.opacity = '0';
          randomParticle.style.transform = 'scale(0.8)';
          
          setTimeout(() => {
            randomParticle.style.left = `${Math.random() * 100}%`;
            randomParticle.style.top = `${Math.random() * 100}%`;
            randomParticle.style.transition = 'none';
          }, 300);
        }, 300);
      }
    };
    
    function gsapAnimate(element: HTMLDivElement) {
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      
      setTimeout(() => {
        element.style.opacity = `${Math.random() * 0.3 + 0.1}`;
        element.style.transition = `transform ${duration}s linear, opacity 1s ease`;
        element.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${Math.random() * 0.5 + 0.5})`;
        
        setTimeout(() => gsapAnimate(element), duration * 1000);
      }, delay * 1000);
    }
    
    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particleCount]);
  
  const { size, opacity } = intensityValues[intensity];
  
  return (
    <div 
      ref={containerRef} 
      className={cn("relative overflow-hidden", className)}
      style={{
        '--mouse-x': 'center',
        '--mouse-y': 'center'
      } as React.CSSProperties}
    >
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(${size}px circle at var(--mouse-x) var(--mouse-y), rgba(108, 93, 211, ${opacity}), transparent 40%)`
        }}
        animate={{
          opacity: [opacity, opacity * 0.8, opacity],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div 
        ref={particlesRef} 
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default EnhancedCursorGradient;
