
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  shimmer?: boolean;
}

function Skeleton({
  className,
  animated = false,
  shimmer = false,
  ...props
}: SkeletonProps) {
  if (shimmer) {
    return (
      <div
        className={cn("animate-pulse rounded-md bg-muted overflow-hidden relative", className)}
        {...props}
      >
        <div className="shimmer-effect absolute inset-0" />
      </div>
    );
  }
  
  if (animated) {
    return (
      <motion.div
        className={cn("rounded-md bg-muted", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
