
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, Clock, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Habit, CheckIn } from '@/types/habit';
import { habitService } from '@/services/habit-service';
import { canCheckInHabit } from '@/utils/habit-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import HabitCheckInDialog from './habit-check-in-dialog';

interface HabitCheckInToggleProps {
  habit: Habit;
  date: Date;
  onUpdate: () => void;
}

export default function HabitCheckInToggle({ habit, date, onUpdate }: HabitCheckInToggleProps) {
  const [checkInStatus, setCheckInStatus] = useState<'completed' | 'missed' | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPastCheckInDialog, setShowPastCheckInDialog] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  
  const dateString = format(date, 'yyyy-MM-dd');
  const isFutureHabit = !canCheckInHabit(habit, date);
  const startDateFormatted = format(parseISO(habit.start_date), 'MMM d, yyyy');
  
  // Fetch initial check-in status
  useEffect(() => {
    async function fetchCheckInStatus() {
      try {
        setLoading(true);
        const checkIns = await habitService.getHabitCheckins(habit.id);
        const todayCheckIn = checkIns.find(checkIn => checkIn.date === dateString);
        
        if (todayCheckIn) {
          setCheckInStatus(todayCheckIn.status as 'completed' | 'missed');
        } else {
          setCheckInStatus(null);
        }
      } catch (error) {
        console.error('Error fetching check-in status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCheckInStatus();
  }, [habit.id, dateString]);
  
  // Handle check-in or miss
  const handleCheckIn = async (status: 'completed' | 'missed') => {
    if (isFutureHabit) {
      toast.error(`This habit starts on ${startDateFormatted}. You can't check in yet.`);
      return;
    }
    
    // Prevent duplicate check-ins with the same status
    if (checkInStatus === status) {
      toast.info(`This habit is already marked as ${status} for today.`);
      return;
    }
    
    try {
      setUpdating(true);
      await habitService.checkInHabit({
        habit_id: habit.id,
        date: dateString,
        status
      });
      
      setCheckInStatus(status);
      
      // Show celebration animation and toast for completed habits
      if (status === 'completed') {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 2000);
        toast.success('Habit completed! Keep up the great work! 🎉');
      } else {
        toast.info(`Habit marked as ${status}`);
      }
      
      onUpdate();
    } catch (error) {
      console.error('Error updating check-in:', error);
      toast.error('Failed to update habit status');
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }
  
  if (isFutureHabit) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-2 opacity-70">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={true}
              >
                <Clock className="mr-2 h-4 w-4" />
                Starts {startDateFormatted}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This habit starts on {startDateFormatted}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-2 w-full relative">
        <AnimatePresence>
          {showSparkles && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <Sparkles className="text-yellow-400 h-12 w-12 absolute" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant={checkInStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            className={`w-full ${checkInStatus === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            onClick={() => handleCheckIn('completed')}
            disabled={updating}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete
          </Button>
        </motion.div>
        
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant={checkInStatus === 'missed' ? 'default' : 'outline'}
            size="sm"
            className={`w-full ${checkInStatus === 'missed' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            onClick={() => handleCheckIn('missed')}
            disabled={updating}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </motion.div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full text-xs"
        onClick={() => setShowPastCheckInDialog(true)}
      >
        <Calendar className="h-3 w-3 mr-1" />
        Check-in for past days
      </Button>
      
      <HabitCheckInDialog 
        habit={habit}
        open={showPastCheckInDialog}
        onOpenChange={setShowPastCheckInDialog}
        onUpdate={onUpdate}
      />
    </div>
  );
}
