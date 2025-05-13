
import { useState, ReactNode } from 'react';
import { Habit } from '@/types/habit';
import HabitCard from './habit-card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import NewHabitDialog from './new-habit-dialog';
import { motion } from 'framer-motion';

interface HabitListProps {
  habits: Habit[];
  onUpdate: () => void;
  filterDueToday?: boolean;
  emptyMessage?: ReactNode;
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
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-muted/30 rounded-lg border border-border/40"
        >
          {typeof emptyMessage === 'string' ? (
            <>
              <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-habit-purple" />
              </div>
              <h3 className="text-xl font-medium mb-2">Nothing here yet!</h3>
              <p className="text-muted-foreground mb-6">{emptyMessage}</p>
              <Button 
                onClick={() => setIsNewHabitDialogOpen(true)}
                className="bg-habit-purple hover:bg-habit-purple/90"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Your First Habit
              </Button>
            </>
          ) : (
            emptyMessage
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <HabitCard
                habit={habit}
                onUpdate={onUpdate}
                date={date}
              />
            </motion.div>
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
