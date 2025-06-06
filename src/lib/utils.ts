
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Animation variants for reusable animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, type: "spring", stiffness: 100 }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5, type: "spring", stiffness: 100 }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.5, type: "spring", stiffness: 100 }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.5, type: "spring", stiffness: 100 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.4, type: "spring", stiffness: 100 }
}

export const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

export const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

// New animations for the landing page and dashboard
export const slideInRight = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, type: "spring", stiffness: 100 }
}

export const slideInLeft = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, type: "spring", stiffness: 100 }
}

export const rotateIn = {
  initial: { opacity: 0, rotate: -5, scale: 0.9 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  transition: { duration: 0.5, type: "spring", stiffness: 200 }
}

export const bounceIn = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring", stiffness: 300, damping: 15 }
}

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } }
}

export const staggerFast = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } }
}

export const staggerSlow = {
  initial: {},
  animate: { transition: { staggerChildren: 0.2 } }
}

// Function to create a staggered container animation with custom parameters
export const createStaggerContainer = (stagger = 0.1, delay = 0.3) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay
    }
  }
})

// Enhanced 3D hover effect for cards
export const card3DHover = {
  rest: { 
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: { 
    scale: 1.02,
    rotateX: 5,
    rotateY: 5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

// Shimmer effect for elements
export const shimmer = {
  hidden: { 
    backgroundPosition: "200% 0",
    opacity: 0.9
  },
  visible: {
    backgroundPosition: "-200% 0",
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 3
    }
  }
}

// Reveal animation for text
export const textReveal = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
}

// Pulse animation
export const pulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      times: [0, 0.5, 1],
      repeat: Infinity
    }
  }
}

// New animated variants for dashboard
export const dashboardCardAnimate = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

export const chartAnimate = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

// For counters and statistics
export const countUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
}

// Blog elements animations
export const blogPostAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
}

export const blogHeaderAnimation = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, type: "spring" }
}

export const blogImageAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

// Enhanced child stagger effect
export const parentStagger = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const childStagger = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Background gradient movement
export const gradientMovement = {
  initial: { backgroundPosition: "0% 50%" },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 15, ease: "linear", repeat: Infinity }
  }
}
