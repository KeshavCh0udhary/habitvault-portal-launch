
import { useState } from 'react';
import { Habit } from '@/types/habit';
import HabitCard from './habit-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewHabitDialog from './new-habit-dialog';

interface HabitListProps {
  habits: Habit[];
  onUpdate: () => void;
  filterDueToday?: boolean;
  emptyMessage?: string;
  date?: Date;
}

export default function HabitList({
  habits,
  onUpdate,
  filterDueToday = false,
  emptyMessage = "You don't have any habits yet.",
  date = new Date(),
}: HabitListProps) {
  const [isNewHabitDialogOpen, setIsNewHabitDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {filterDueToday ? "Today's Habits" : 'All Habits'}
        </h2>
        <Button 
          onClick={() => setIsNewHabitDialogOpen(true)}
          className="bg-habit-purple hover:bg-habit-purple/90"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center p-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground mb-4">{emptyMessage}</p>
          <Button 
            onClick={() => setIsNewHabitDialogOpen(true)}
            className="bg-habit-purple hover:bg-habit-purple/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Your First Habit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={onUpdate}
              date={date}
            />
          ))}
        </div>
      )}

      <NewHabitDialog 
        open={isNewHabitDialogOpen} 
        onOpenChange={setIsNewHabitDialogOpen}
        onSuccess={() => {
          setIsNewHabitDialogOpen(false);
          onUpdate();
        }}
      />
    </div>
  );
}
