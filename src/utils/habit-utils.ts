
import { format, isToday, isBefore, parseISO, startOfDay } from 'date-fns';
import { Habit, TargetDay } from '@/types/habit';

// Check if a habit is due on a specific date
export function isHabitDueOnDate(habit: Habit, date: Date): boolean {
  const habitStartDate = parseISO(habit.start_date);
  
  // Habit not yet started
  if (isBefore(date, habitStartDate)) {
    return false;
  }
  
  const dayOfWeek = format(date, 'EEEE').toLowerCase() as TargetDay;
  
  // Check if daily
  if (habit.target_days.includes('daily')) {
    return true;
  }
  
  // Check if weekdays
  if (habit.target_days.includes('weekdays')) {
    const isWeekday = !['saturday', 'sunday'].includes(dayOfWeek);
    return isWeekday;
  }
  
  // Check if specific day
  return habit.target_days.includes(dayOfWeek);
}

// Get habits due today
export function getHabitsDueToday(habits: Habit[], completedHabitIds: string[] = []): Habit[] {
  // First filter by target days matching today
  const habitsDueByDay = habits.filter(habit => isHabitDueOnDate(habit, new Date()));
  
  // Then filter out habits that are already completed today
  if (completedHabitIds.length > 0) {
    return habitsDueByDay.filter(habit => !completedHabitIds.includes(habit.id));
  }
  
  return habitsDueByDay;
}

// Get all possible target day options
export function getTargetDayOptions(): { label: string; value: TargetDay }[] {
  return [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekdays', value: 'weekdays' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' }
  ];
}

// Format target days for display
export function formatTargetDays(targetDays: TargetDay[]): string {
  if (targetDays.includes('daily')) {
    return 'Every day';
  }
  
  if (targetDays.includes('weekdays')) {
    return 'Weekdays';
  }
  
  return targetDays
    .map(day => day.charAt(0).toUpperCase() + day.slice(1))
    .join(', ');
}

// Format streak for display
export function formatStreak(streak: number): string {
  return streak === 1 ? '1 day' : `${streak} days`;
}

// Check if a habit can be checked in (not a future habit)
export function canCheckInHabit(habit: Habit, date: Date = new Date()): boolean {
  const today = startOfDay(date);
  const startDate = startOfDay(parseISO(habit.start_date));
  
  // Return false if today is before the habit start date
  return !isBefore(today, startDate);
}
