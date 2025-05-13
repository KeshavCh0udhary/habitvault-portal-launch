import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, isWithinInterval, subDays, addDays, parseISO } from 'date-fns';
import { CalendarDays, Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Habit } from '@/types/habit';
import { AnimatePresence, motion } from 'framer-motion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface CheckIn {
  id: string;
  habit_id: string;
  date: string;
  status: 'completed' | 'missed' | 'skipped';
  created_at: string;
}

interface HabitHistoryCalendarProps {
  habits: Habit[];
  checkIns: CheckIn[];
  view?: 'month' | 'week';
  onViewChange?: (view: 'month' | 'week') => void;
}

const HabitHistoryCalendar: React.FC<HabitHistoryCalendarProps> = ({ 
  habits, 
  checkIns, 
  view = 'month',
  onViewChange
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<'month' | 'week'>(view);

  // Keep the internal state in sync with the prop
  useEffect(() => {
    setSelectedView(view);
  }, [view]);
  
  const handleViewChange = (newView: 'month' | 'week') => {
    setSelectedView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };
  
  // Create a map of dates to check-in statuses
  const checkInMap: Record<string, Record<string, string>> = {};
  
  // Process check-ins to create the map
  checkIns.forEach(checkIn => {
    const date = format(new Date(checkIn.date), 'yyyy-MM-dd');
    if (!checkInMap[date]) {
      checkInMap[date] = {};
    }
    checkInMap[date][checkIn.habit_id] = checkIn.status;
  });
  
  // Compute overall status for each day (completed, partial, missed)
  const getDayStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayCheckIns = checkInMap[dateStr];
    
    if (!dayCheckIns || Object.keys(dayCheckIns).length === 0) {
      return 'none';
    }
    
    const statuses = Object.values(dayCheckIns);
    const totalCheckIns = statuses.length;
    const completedCheckIns = statuses.filter(status => status === 'completed').length;
    
    if (completedCheckIns === totalCheckIns) {
      return 'completed';
    } else if (completedCheckIns > 0) {
      return 'partial';
    } else {
      return 'missed';
    }
  };
  
  // Custom day renderer for the calendar
  const dayModifiers = (date: Date) => {
    const status = getDayStatus(date);
    
    return {
      className: cn(
        status === 'completed' && 'bg-green-500/20 hover:bg-green-500/30 text-green-500',
        status === 'partial' && 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500',
        status === 'missed' && 'bg-red-500/20 hover:bg-red-500/30 text-red-500',
      )
    };
  };
  
  // Return details for the selected date
  const getSelectedDateDetails = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayCheckIns = checkInMap[dateStr] || {};
    
    const habitsWithStatus = habits.map(habit => {
      const status = dayCheckIns[habit.id] || 'none';
      return {
        ...habit,
        status
      };
    });
    
    return {
      habitsWithStatus,
      date: selectedDate
    };
  };
  
  // Date range for week view
  const getWeekRange = () => {
    const startOfWeek = subDays(selectedDate, 3); // 3 days before
    const endOfWeek = addDays(selectedDate, 3); // 3 days after
    return { from: startOfWeek, to: endOfWeek };
  };
  
  const selectedDateDetails = getSelectedDateDetails();
  const weekRange = getWeekRange();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Habit History</h3>
        <ToggleGroup type="single" value={selectedView} onValueChange={(value) => {
          if (value) handleViewChange(value as 'month' | 'week');
        }}>
          <ToggleGroupItem value="week" aria-label="Week view">Week</ToggleGroupItem>
          <ToggleGroupItem value="month" aria-label="Month view">Month</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card>
            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedView}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    modifiers={{
                      completed: (date) => getDayStatus(date) === 'completed',
                      partial: (date) => getDayStatus(date) === 'partial',
                      missed: (date) => getDayStatus(date) === 'missed',
                    }}
                    modifiersClassNames={{
                      completed: 'bg-green-500/20 hover:bg-green-500/30 text-green-500 font-bold',
                      partial: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500',
                      missed: 'bg-red-500/20 hover:bg-red-500/30 text-red-500',
                    }}
                    {... (selectedView === 'week' ? { 
                      defaultMonth: selectedDate,
                      month: selectedDate,
                      fromDate: weekRange.from,
                      toDate: weekRange.to
                    } : {})}
                  />
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-96">
          <Card className="h-full">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </h3>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={format(selectedDate, 'yyyy-MM-dd')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {selectedDateDetails.habitsWithStatus.length > 0 ? (
                    selectedDateDetails.habitsWithStatus.map((habit, index) => (
                      <motion.div 
                        key={habit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={cn(
                          "p-3 rounded-md border",
                          habit.status === 'completed' && "border-green-500/30 bg-green-500/10",
                          habit.status === 'missed' && "border-red-500/30 bg-red-500/10",
                          habit.status === 'none' && "border-border bg-muted/30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{habit.name}</h4>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            habit.status === 'completed' && "bg-green-500/20 text-green-500",
                            habit.status === 'missed' && "bg-red-500/20 text-red-500",
                            habit.status === 'none' && "bg-muted text-muted-foreground"
                          )}>
                            {habit.status === 'completed' && 'Completed'}
                            {habit.status === 'missed' && 'Missed'}
                            {habit.status === 'none' && 'No Check-in'}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-center p-8 text-muted-foreground"
                    >
                      <CalendarDays className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>No habits to display for this date.</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HabitHistoryCalendar;
