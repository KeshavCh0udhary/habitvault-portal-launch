
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface MotivationalGreetingProps {
  completedHabits: number;
  totalHabits: number;
}

export default function MotivationalGreeting({ completedHabits, totalHabits }: MotivationalGreetingProps) {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  
  useEffect(() => {
    const allCompleted = completedHabits === totalHabits && totalHabits > 0;
    const hasProgress = completedHabits > 0 && completedHabits < totalHabits;
    const noProgress = completedHabits === 0 && totalHabits > 0;
    const noHabits = totalHabits === 0;
    
    // Get the last visit date from localStorage
    const lastVisit = localStorage.getItem('habitvault-last-visit');
    const today = new Date().toDateString();
    
    // Returning user check
    const isReturningToday = lastVisit && lastVisit !== today;
    
    // Update last visit
    localStorage.setItem('habitvault-last-visit', today);
    
    // Select message based on context
    if (allCompleted) {
      setGreeting(`You did it! All habits completed. See you again tomorrow! 🚀`);
      setShouldAnimate(true);
    } else if (isReturningToday) {
      setGreeting(`Welcome back, ${name}! Let's keep your momentum going.`);
    } else if (hasProgress) {
      setGreeting(`You've done ${completedHabits} of ${totalHabits} habits. Finish strong today!`);
    } else if (noProgress && isReturningToday) {
      setGreeting(`It's okay to fall off. Let's bounce back today, ${name}!`);
    } else if (noProgress) {
      setGreeting(`Ready for a productive day, ${name}?`);
    } else if (noHabits) {
      setGreeting(`Welcome, ${name}! Let's create your first habit.`);
    } else {
      // Default greeting based on time of day
      const hour = new Date().getHours();
      if (hour < 12) setGreeting(`Good morning, ${name}!`);
      else if (hour < 18) setGreeting(`Good afternoon, ${name}!`);
      else setGreeting(`Good evening, ${name}!`);
    }
  }, [name, completedHabits, totalHabits]);
  
  return (
    <div className="relative">
      <AnimatePresence>
        <motion.div
          key={greeting}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-2 text-lg font-medium flex items-center"
        >
          {greeting}
          {shouldAnimate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex ml-2"
            >
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
