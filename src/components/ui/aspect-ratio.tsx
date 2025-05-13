
import * as React from "react"
import { motion } from "framer-motion"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"

interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  className?: string;
  animate?: boolean;
  animationVariant?: "fadeIn" | "scaleIn" | "slideUp";
  delay?: number;
}

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ className, animate = false, animationVariant = "fadeIn", delay = 0, ...props }, ref) => {
  if (!animate) {
    return <AspectRatioPrimitive.Root className={className} {...props} ref={ref} />
  }
  
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.5, delay } }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.5, delay } }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay } }
    }
  }

  return (
    <motion.div
      initial={variants[animationVariant].initial}
      whileInView={variants[animationVariant].animate}
      viewport={{ once: true, amount: 0.1 }}
      className={cn(className)}
    >
      <AspectRatioPrimitive.Root {...props} ref={ref} />
    </motion.div>
  );
});

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
