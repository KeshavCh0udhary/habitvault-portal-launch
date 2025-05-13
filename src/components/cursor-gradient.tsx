
import { useEffect, useRef } from 'react';

interface CursorGradientProps {
  children: React.ReactNode;
  className?: string;
}

const CursorGradient = ({ children, className = '' }: CursorGradientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    
    if (!container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 animate-cursor-gradient pointer-events-none" />
      {children}
    </div>
  );
};

export default CursorGradient;
