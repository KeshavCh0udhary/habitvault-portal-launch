
export type TargetDay = 'daily' | 'weekdays' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency?: 'daily' | 'weekly' | 'monthly'; // Making optional but keeping for backward compatibility
  days_of_week?: string[];
  day_of_month?: number;
  time_of_day?: string;
  category?: string;
  start_date: string;
  end_date?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  current_streak?: number;
  longest_streak?: number;
  target_days: TargetDay[]; // Add this field which is used in the database
}

export interface NewHabit {
  name: string;
  description?: string;
  start_date?: string;
  target_days: TargetDay[];
  user_id?: string;
}

export interface CheckIn {
  id: string;
  habit_id: string;
  date: string;
  status: 'completed' | 'missed' | 'skipped';
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export interface HabitCheckIn extends CheckIn {}

export interface HabitCheckInUpdate {
  habit_id: string;
  date: string;
  status: 'completed' | 'missed' | 'skipped';
}
