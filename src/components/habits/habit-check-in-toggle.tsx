
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Habit, HabitCheckIn } from '@/types/habit';
import { habitService } from '@/services/habit-service';
import { canCheckInHabit } from '@/utils/habit-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HabitCheckInToggleProps {
  habit: Habit;
  date: Date;
  onUpdate: () => void;
}

export default function HabitCheckInToggle({ habit, date, onUpdate }: HabitCheckInToggleProps) {
  const [checkInStatus, setCheckInStatus] = useState<'completed' | 'missed' | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
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
          setCheckInStatus(todayCheckIn.status);
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
    
    try {
      setUpdating(true);
      await habitService.checkInHabit({
        habit_id: habit.id,
        date: dateString,
        status
      });
      
      setCheckInStatus(status);
      toast.success(`Habit marked as ${status}`);
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
    <div className="flex items-center justify-center gap-2">
      <Button
        variant={checkInStatus === 'completed' ? 'default' : 'outline'}
        size="sm"
        className={`flex-1 ${checkInStatus === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        onClick={() => handleCheckIn('completed')}
        disabled={updating}
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Complete
      </Button>
      
      <Button
        variant={checkInStatus === 'missed' ? 'default' : 'outline'}
        size="sm"
        className={`flex-1 ${checkInStatus === 'missed' ? 'bg-red-600 hover:bg-red-700' : ''}`}
        onClick={() => handleCheckIn('missed')}
        disabled={updating}
      >
        <XCircle className="mr-2 h-4 w-4" />
        Skip
      </Button>
    </div>
  );
}
