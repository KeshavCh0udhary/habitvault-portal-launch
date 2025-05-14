import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useState } from 'react';

interface LogoProps {
  variant?: 'default' | 'large';
  className?: string;
  linkClassName?: string;
  showText?: boolean;
  animated?: boolean;
}

export const Logo = ({ 
  variant = 'default', 
  className,
  linkClassName,
  showText = true,
  animated = true
}: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  const logoSize = variant === 'large' ? 'size-16' : 'size-8';
  const textSize = variant === 'large' ? 'text-2xl' : 'text-lg';
  
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center space-x-3 shrink-0",
        linkClassName
      )}
      aria-label="HabitVault"
    >
      <motion.div
        className={cn(
          logoSize, 
          "relative rounded-xl overflow-hidden bg-gradient-to-tr from-habit-purple to-habit-teal shadow-sm",
          className
        )}
        whileHover={animated ? { 
          rotate: 10,
          scale: 1.05,
        } : {}}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
      >
        <AspectRatio ratio={1} className="w-full h-full">
          {!imageError ? (
            <img 
              src="/lovable-uploads/2f53c1ca-c496-45d8-a6f2-9bb510030d61.png" 
              alt="HabitVault Logo" 
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              <span className={cn(
                variant === 'large' ? 'text-xl' : 'text-sm'
              )}>HV</span>
            </div>
          )}
        </AspectRatio>
      </motion.div>
      
      {showText && (
        <motion.span 
          className={cn("font-bold tracking-tight", textSize)}
          initial={animated ? { opacity: 0, x: -5 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          HabitVault
        </motion.span>
      )}
    </Link>
  );
};

export default Logo;
