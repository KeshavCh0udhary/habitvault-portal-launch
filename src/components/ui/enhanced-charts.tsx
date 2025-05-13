
import React from 'react';
import { motion } from 'framer-motion';
import { chartAnimation } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface EnhancedChartContainerProps {
  className?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  height?: number | string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export const EnhancedChartContainer = ({
  className,
  title,
  description,
  children,
  height = 300,
  loading = false,
  error = false,
  errorMessage = "Error loading chart data"
}: EnhancedChartContainerProps) => {
  return (
    <motion.div
      className={cn("border rounded-xl overflow-hidden", className)}
      variants={chartAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {title && (
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div 
        className="p-4 flex items-center justify-center" 
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <motion.div 
              className="size-8 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            <p>{errorMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
};

export const AnimatedBar = ({ 
  fill, 
  width, 
  height, 
  x = 0, 
  y = 0,
  rx = 0,
  delay = 0 
}) => {
  return (
    <motion.rect
      x={x}
      y={y}
      rx={rx}
      width={width}
      height={height}
      fill={fill}
      initial={{ height: 0, y: y + height }}
      animate={{ height, y }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
    />
  );
};

export const AnimatedArea = ({ 
  points, 
  fill, 
  stroke, 
  strokeWidth = 2,
  delay = 0 
}) => {
  return (
    <motion.path
      d={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, delay, ease: "easeInOut" }}
    />
  );
};

export const AnimatedPie = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  delay = 0
}) => {
  return (
    <motion.path
      d={`M ${cx + outerRadius * Math.cos(startAngle)} ${cy + outerRadius * Math.sin(startAngle)}
          A ${outerRadius} ${outerRadius} 0 ${endAngle - startAngle > Math.PI ? 1 : 0} 1 
            ${cx + outerRadius * Math.cos(endAngle)} ${cy + outerRadius * Math.sin(endAngle)}
          L ${cx + innerRadius * Math.cos(endAngle)} ${cy + innerRadius * Math.sin(endAngle)}
          A ${innerRadius} ${innerRadius} 0 ${endAngle - startAngle > Math.PI ? 1 : 0} 0
            ${cx + innerRadius * Math.cos(startAngle)} ${cy + innerRadius * Math.sin(startAngle)}
          Z`}
      fill={fill}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
    />
  );
};

export default EnhancedChartContainer;
