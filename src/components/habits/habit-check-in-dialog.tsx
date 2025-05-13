
import { useState } from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Habit, CheckIn } from '@/types/habit';
import { habitService } from '@/services/habit-service';
import { CheckCircle, XCircle } from 'lucide-react';

interface HabitCheckInDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function HabitCheckInDialog({
  habit,
  open,
  onOpenChange,
  onUpdate,
}: HabitCheckInDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCheckIn, setExistingCheckIn] = useState<CheckIn | null>(null);
  
  const habitStartDate = parseISO(habit.start_date);
  const today = new Date();
  
  // Function to check if a date already has a check-in
  const checkExistingCheckIn = async (date: Date) => {
    if (!date) return;
    
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const checkIns = await habitService.getHabitCheckins(habit.id);
      const existing = checkIns.find(checkIn => checkIn.date === dateStr);
      
      setExistingCheckIn(existing || null);
    } catch (error) {
      console.error('Error checking existing check-in:', error);
      setExistingCheckIn(null);
    }
  };
  
  // When date changes, check for existing check-in
  const handleDateChange = async (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      await checkExistingCheckIn(date);
    } else {
      setExistingCheckIn(null);
    }
  };
  
  // Handle check-in or miss
  const handleCheckIn = async (status: 'completed' | 'missed') => {
    if (!selectedDate) return;
    
    // Prevent check-ins for future dates
    if (isAfter(selectedDate, today)) {
      toast.error("You can't check in for future dates");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      await habitService.checkInHabit({
        habit_id: habit.id,
        date: dateString,
        status
      });
      
      toast.success(`Habit marked as ${status} for ${format(selectedDate, 'MMM d, yyyy')}`);
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating check-in:', error);
      toast.error('Failed to update habit status');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check-in: {habit.name}</DialogTitle>
          <DialogDescription>
            Select a date to mark this habit as completed or missed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            disabled={(date) => isAfter(date, today) || date < habitStartDate}
            initialFocus
          />
        </div>
        
        {existingCheckIn && (
          <div className="text-center p-2 bg-muted rounded-md mb-4">
            <p className="text-sm">
              This habit is already marked as <span className="font-medium">{existingCheckIn.status}</span> for this date.
              Submitting will override the existing record.
            </p>
          </div>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="sm:w-1/2" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <div className="flex gap-2 sm:w-1/2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleCheckIn('completed')}
              disabled={isSubmitting}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete
            </Button>
            
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleCheckIn('missed')}
              disabled={isSubmitting}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Skip
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
