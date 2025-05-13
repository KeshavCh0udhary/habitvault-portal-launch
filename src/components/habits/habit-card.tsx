
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2, Flame } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Habit } from '@/types/habit';
import { formatTargetDays, formatStreak } from '@/utils/habit-utils';
import { habitService } from '@/services/habit-service';
import HabitForm from './habit-form';
import HabitCheckInToggle from './habit-check-in-toggle';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
  showCheckIn?: boolean;
  date?: Date;
}

export default function HabitCard({ habit, onUpdate, showCheckIn = true, date = new Date() }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await habitService.deleteHabit(habit.id);
      toast.success('Habit deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-bold line-clamp-2">{habit.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Open menu</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {habit.description && (
            <p className="text-muted-foreground text-sm mb-3">{habit.description}</p>
          )}
          
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatTargetDays(habit.target_days)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Flame className={`h-4 w-4 ${habit.current_streak > 0 ? 'text-habit-purple' : 'text-muted-foreground'}`} />
              <span>{formatStreak(habit.current_streak)}</span>
            </div>
          </div>
          
          {showCheckIn && (
            <div className="mt-4">
              <HabitCheckInToggle habit={habit} date={date} onUpdate={onUpdate} />
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
            <span>Started: {format(new Date(habit.start_date), 'MMM d, yyyy')}</span>
            {habit.longest_streak > 0 && (
              <span className="flex items-center">
                <Flame className="h-3 w-3 mr-1 text-habit-teal" />
                Best: {formatStreak(habit.longest_streak)}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <HabitForm 
            initialData={habit}
            onSuccess={() => {
              setIsEditing(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
