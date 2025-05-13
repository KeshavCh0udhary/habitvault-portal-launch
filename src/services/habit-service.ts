
import { supabase } from '@/integrations/supabase/client';
import { Habit, NewHabit, HabitCheckIn, HabitCheckInUpdate } from '@/types/habit';
import { format } from 'date-fns';

export const habitService = {
  // Habit CRUD operations
  async createHabit(habit: NewHabit): Promise<Habit | null> {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        name: habit.name,
        description: habit.description || null,
        start_date: habit.start_date || format(new Date(), 'yyyy-MM-dd'),
        target_days: habit.target_days
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating habit:', error);
      throw error;
    }

    return data;
  },

  async getUserHabits(): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching habits:', error);
      throw error;
    }

    return data || [];
  },

  async getHabit(id: string): Promise<Habit | null> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching habit:', error);
      throw error;
    }

    return data;
  },

  async updateHabit(id: string, habit: Partial<Habit>): Promise<Habit | null> {
    const { data, error } = await supabase
      .from('habits')
      .update({
        ...habit,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating habit:', error);
      throw error;
    }

    return data;
  },

  async deleteHabit(id: string): Promise<void> {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  },

  // Check-in operations
  async getHabitCheckins(habitId: string): Promise<HabitCheckIn[]> {
    const { data, error } = await supabase
      .from('habit_checkins')
      .select('*')
      .eq('habit_id', habitId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching habit check-ins:', error);
      throw error;
    }

    return data || [];
  },

  async getCheckInsForDate(date: Date): Promise<HabitCheckIn[]> {
    const dateString = format(date, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('habit_checkins')
      .select('*')
      .eq('date', dateString);

    if (error) {
      console.error('Error fetching check-ins for date:', error);
      throw error;
    }

    return data || [];
  },

  async checkInHabit(checkIn: HabitCheckInUpdate): Promise<HabitCheckIn | null> {
    // Check if check-in already exists for this habit and date
    const { data: existingCheckIn } = await supabase
      .from('habit_checkins')
      .select('*')
      .eq('habit_id', checkIn.habit_id)
      .eq('date', checkIn.date)
      .maybeSingle();

    if (existingCheckIn) {
      // Update existing check-in
      const { data, error } = await supabase
        .from('habit_checkins')
        .update({ status: checkIn.status, updated_at: new Date().toISOString() })
        .eq('id', existingCheckIn.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating habit check-in:', error);
        throw error;
      }

      await this.updateStreakCount(checkIn.habit_id);
      return data;
    } else {
      // Create new check-in
      const { data, error } = await supabase
        .from('habit_checkins')
        .insert({
          habit_id: checkIn.habit_id,
          date: checkIn.date,
          status: checkIn.status
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating habit check-in:', error);
        throw error;
      }

      await this.updateStreakCount(checkIn.habit_id);
      return data;
    }
  },

  // Helper function to calculate and update streak counts
  async updateStreakCount(habitId: string): Promise<void> {
    // Fetch the habit
    const { data: habit } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .single();

    if (!habit) return;

    // Fetch all check-ins for this habit
    const { data: checkIns } = await supabase
      .from('habit_checkins')
      .select('*')
      .eq('habit_id', habitId)
      .order('date', { ascending: false });

    if (!checkIns || checkIns.length === 0) return;

    // Calculate current streak
    let currentStreak = 0;
    let previousDate: Date | null = null;
    
    for (const checkIn of checkIns) {
      const checkInDate = new Date(checkIn.date);
      
      // Break streak if status is missed
      if (checkIn.status === 'missed') {
        break;
      }
      
      // If this is the first iteration
      if (previousDate === null) {
        currentStreak = 1;
        previousDate = checkInDate;
        continue;
      }
      
      // Check if dates are consecutive
      const diffTime = Math.abs(previousDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak += 1;
        previousDate = checkInDate;
      } else {
        break; // Break the streak if days are not consecutive
      }
    }
    
    // Calculate longest streak
    let longestStreak = habit.longest_streak;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    
    // Update the habit with new streak values
    await supabase
      .from('habits')
      .update({
        current_streak: currentStreak,
        longest_streak: longestStreak,
        updated_at: new Date().toISOString()
      })
      .eq('id', habitId);
  }
};
