
import { format, isToday, isBefore, parseISO, startOfDay, differenceInDays, eachDayOfInterval } from 'date-fns';
import { Habit, TargetDay, CheckIn } from '@/types/habit';

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

// Get missing check-ins for habits with past start dates
export function getMissingCheckIns(habits: Habit[], existingCheckIns: CheckIn[]): CheckIn[] {
  const today = startOfDay(new Date());
  const missingCheckIns: CheckIn[] = [];
  
  // Create a map of existing check-ins for quick lookup
  const checkInMap: Record<string, Record<string, CheckIn>> = {};
  existingCheckIns.forEach(checkIn => {
    if (!checkInMap[checkIn.habit_id]) {
      checkInMap[checkIn.habit_id] = {};
    }
    checkInMap[checkIn.habit_id][checkIn.date] = checkIn;
  });
  
  // For each habit
  habits.forEach(habit => {
    const startDate = parseISO(habit.start_date);
    
    // Skip if habit starts today or in the future
    if (!isBefore(startDate, today)) {
      return;
    }
    
    // Get all dates from start date to yesterday
    const pastDays = eachDayOfInterval({
      start: startDate,
      end: today
    });
    
    // For each past day, check if the habit was due and if there's a check-in
    pastDays.forEach(date => {
      // Skip today
      if (isToday(date)) {
        return;
      }
      
      // Check if habit was due on this date
      if (isHabitDueOnDate(habit, date)) {
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // If no check-in exists for this date and habit, consider it missed
        if (!checkInMap[habit.id] || !checkInMap[habit.id][dateStr]) {
          missingCheckIns.push({
            id: `missing-${habit.id}-${dateStr}`,
            habit_id: habit.id,
            date: dateStr,
            status: 'missed',
            created_at: new Date().toISOString(),
            user_id: habit.user_id
          });
        }
      }
    });
  });
  
  return missingCheckIns;
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
