export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
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
