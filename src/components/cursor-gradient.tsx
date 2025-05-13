
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CursorGradientProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: 'purple' | 'teal' | 'mixed';
}

const CursorGradient = ({
  children,
  className = '',
  intensity = 'medium',
  color = 'mixed'
}: CursorGradientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Define color based on prop
  const gradientColor = color === 'purple' ? 'rgba(108, 93, 211, VAR)' : 
                        color === 'teal' ? 'rgba(65, 208, 199, VAR)' : 
                        'rgba(108, 93, 211, VAR), rgba(65, 208, 199, VAR)';
  
  // Define intensity values
  const intensityValues = {
    low: { size: '400px', opacity: '0.07' },
    medium: { size: '600px', opacity: '0.12' },
    high: { size: '800px', opacity: '0.2' }
  };
  
  const { size, opacity } = intensityValues[intensity];
  
  // Create gradient template
  let gradientTemplate;
  if (color === 'mixed') {
    gradientTemplate = useMotionTemplate`radial-gradient(${size} circle at ${mouseX}px ${mouseY}px, rgba(108, 93, 211, ${isHovering ? opacity : '0.05'}), rgba(65, 208, 199, ${isHovering ? opacity : '0.05'}), transparent 80%)`;
  } else {
    const colorValue = color === 'purple' ? 'rgba(108, 93, 211, VAR)' : 'rgba(65, 208, 199, VAR)';
    gradientTemplate = useMotionTemplate`radial-gradient(${size} circle at ${mouseX}px ${mouseY}px, ${colorValue.replace('VAR', isHovering ? opacity : '0.05')}, transparent 80%)`;
  }

  useEffect(() => {
    const container = containerRef.current;
    
    if (!container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  // Create subtle moving dots animation
  const particles = Array.from({ length: 12 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full bg-habit-purple/10 dark:bg-habit-purple/20"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 50 + 10}px`,
        height: `${Math.random() * 50 + 10}px`,
      }}
      animate={{
        x: [
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          Math.random() * 20 - 10
        ],
        y: [
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          Math.random() * 20 - 10
        ]
      }}
      transition={{
        duration: Math.random() * 5 + 10,
        repeat: Infinity,
        repeatType: 'reverse'
      }}
    />
  ));

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: gradientTemplate
        }}
      />
      {particles}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CursorGradient;
