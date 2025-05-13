
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  // Determine if this is a dashboard route
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/profile') ||
                     location.pathname.startsWith('/analytics');

  // Use different animations based on route type
  const transitionVariants = isDashboard ? {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 }
  } : {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={transitionVariants.initial}
        animate={transitionVariants.animate}
        exit={transitionVariants.exit}
        transition={{ 
          duration: 0.3, 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
