
export type TargetDay = 'daily' | 'weekdays' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  target_days: TargetDay[];
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface HabitCheckIn {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  status: 'completed' | 'missed';
  created_at: string;
  updated_at: string;
}

export interface NewHabit {
  name: string;
  description?: string;
  start_date?: string;
  target_days: TargetDay[];
}

export interface HabitCheckInUpdate {
  habit_id: string;
  date: string;
  status: 'completed' | 'missed';
}
