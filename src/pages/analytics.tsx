
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, BarChart3, LineChart, Activity, PieChart, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { habitService } from '@/services/habit-service';
import { format, subDays, subWeeks, subMonths, parseISO, isAfter } from 'date-fns';
import { Tooltip as ReactTooltip } from '@/components/ui/tooltip';
import HabitHistoryCalendar from '@/components/habits/habit-history-calendar';
import DailyQuote from '@/components/daily-quote';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Helper function to filter data by time range
const filterDataByTimeRange = (data, timeRange) => {
  const today = new Date();
  let filterDate = today;
  
  switch(timeRange) {
    case 'today':
      filterDate = today;
      break;
    case 'thisWeek':
      filterDate = subDays(today, 7);
      break;
    case 'thisMonth':
      filterDate = subDays(today, 30);
      break;
    case 'last3Months':
      filterDate = subMonths(today, 3);
      break;
    case 'thisYear':
      filterDate = subMonths(today, 12);
      break;
    default:
      filterDate = subDays(today, 365 * 10); // All time (10 years)
  }
  
  return data.filter(item => {
    const itemDate = typeof item.date === 'string' 
      ? parseISO(item.date) 
      : item.date;
    return isAfter(itemDate, filterDate);
  });
};

// COLORS
const COLORS = ['#7c3aed', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4'];

const AnalyticsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState(() => {
    // Get stored preference or default to 'thisWeek'
    return localStorage.getItem('habitvault-timerange') || 'thisWeek';
  });
  const [showQuotes, setShowQuotes] = useState(() => {
    // Get stored preference or default to true
    return localStorage.getItem('habitvault-show-quotes') !== 'false';
  });

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('habitvault-timerange', timeRange);
  }, [timeRange]);

  useEffect(() => {
    localStorage.setItem('habitvault-show-quotes', showQuotes.toString());
  }, [showQuotes]);

  // Fetch all habits
  const { data: habits, isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getUserHabits,
    enabled: !!user,
  });

  // Fetch all check-ins
  const { data: checkIns, isLoading: checkInsLoading } = useQuery({
    queryKey: ['allCheckIns'],
    queryFn: habitService.getAllCheckIns,
    enabled: !!user,
  });

  const isLoading = habitsLoading || checkInsLoading;

  // Calculate completion rate data
  const calculateCompletionRateData = () => {
    if (!habits || !checkIns) return [];

    const dateMap = {};
    const today = new Date();
    const startDate = subDays(today, 30); // Last 30 days

    // Initialize dates with 0 completions
    let currentDate = startDate;
    while (currentDate <= today) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      dateMap[dateStr] = {
        date: dateStr,
        completionRate: 0,
        completed: 0,
        total: 0
      };
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    // Count completed check-ins per day
    checkIns.forEach(checkIn => {
      const checkInDate = format(new Date(checkIn.date), 'yyyy-MM-dd');
      if (dateMap[checkInDate]) {
        if (checkIn.status === 'completed') {
          dateMap[checkInDate].completed++;
        }
        dateMap[checkInDate].total++;
        
        // Calculate completion rate as a percentage
        const completed = dateMap[checkInDate].completed;
        const total = dateMap[checkInDate].total;
        dateMap[checkInDate].completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      }
    });

    return Object.values(dateMap);
  };

  // Get habit distribution data
  const getHabitDistributionData = () => {
    if (!habits) return [];

    const categories = {};
    habits.forEach(habit => {
      const category = habit.category || 'Uncategorized';
      if (categories[category]) {
        categories[category]++;
      } else {
        categories[category] = 1;
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Get habit performance data
  const getHabitPerformanceData = () => {
    if (!habits || !checkIns) return [];

    const habitCompletionRates = {};
    
    // Initialize with all habits
    habits.forEach(habit => {
      habitCompletionRates[habit.id] = {
        id: habit.id,
        name: habit.name,
        completed: 0,
        total: 0,
        rate: 0
      };
    });

    // Count completions
    checkIns.forEach(checkIn => {
      if (habitCompletionRates[checkIn.habit_id]) {
        habitCompletionRates[checkIn.habit_id].total++;
        if (checkIn.status === 'completed') {
          habitCompletionRates[checkIn.habit_id].completed++;
        }
      }
    });

    // Calculate rates and sort by completion rate
    return Object.values(habitCompletionRates)
      .map(habit => {
        const { completed, total } = habit;
        return {
          ...habit,
          rate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      })
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 10); // Top 10 habits
  };

  // Calculate stats
  const completionRateData = calculateCompletionRateData();
  const habitDistributionData = getHabitDistributionData();
  const habitPerformanceData = getHabitPerformanceData();
  
  // Calculate overall stats
  const calculateOverallStats = () => {
    if (!habits || !checkIns) {
      return {
        totalHabits: 0,
        completionRate: 0,
        streakAverage: 0,
        mostConsistent: { name: 'None', rate: 0 }
      };
    }

    // Total habits
    const totalHabits = habits.length;

    // Overall completion rate
    let completed = 0;
    let total = 0;
    checkIns.forEach(checkIn => {
      total++;
      if (checkIn.status === 'completed') {
        completed++;
      }
    });
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Streak average
    // This is simplified - in a real app you'd have a more complex streak calculation
    const streakSum = habits.reduce((sum, habit) => sum + (habit.current_streak || 0), 0);
    const streakAverage = totalHabits > 0 ? Math.round(streakSum / totalHabits) : 0;

    // Most consistent habit
    const mostConsistent = habitPerformanceData.length > 0 
      ? habitPerformanceData[0] 
      : { name: 'None', rate: 0 };

    return {
      totalHabits,
      completionRate,
      streakAverage,
      mostConsistent
    };
  };

  const stats = calculateOverallStats();

  const toggleQuotes = () => {
    setShowQuotes(prev => !prev);
  };

  // Filter data based on selected time range
  const filteredCompletionData = filterDataByTimeRange(completionRateData, timeRange);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Habit Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and identify patterns in your habits.
          </p>
        </div>
        
        <Select 
          value={timeRange} 
          onValueChange={(value) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <SelectValue placeholder="Select Time Range" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="last3Months">Last 3 Months</SelectItem>
            <SelectItem value="thisYear">This Year</SelectItem>
            <SelectItem value="allTime">All Time</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      
      {/* Motivational Quote Section */}
      {showQuotes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DailyQuote />
        </motion.div>
      )}
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleQuotes}
          className="text-xs flex items-center gap-1"
        >
          {showQuotes ? 'Hide Quotes' : 'Show Quotes'}
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Habits</CardDescription>
            <CardTitle className="text-2xl">{stats.totalHabits}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-500">
              {stats.totalHabits > 0 ? '↑ Active habits' : 'Create your first habit!'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-2xl">{stats.completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-500">
              {stats.completionRate > 70 ? '↑ Great progress!' : 'Keep going!'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Streak Average</CardDescription>
            <CardTitle className="text-2xl">{stats.streakAverage} days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-500">
              {stats.streakAverage > 7 ? '↑ Building consistency' : 'Keep the momentum!'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Most Consistent</CardDescription>
            <CardTitle className="text-2xl">{stats.mostConsistent.name || 'None'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs">
              {stats.mostConsistent.rate > 0 ? `${stats.mostConsistent.rate}% completion rate` : 'Start tracking habits'}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Completion Over Time</CardTitle>
              <CardDescription>Daily habit completion rate</CardDescription>
            </div>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            ) : filteredCompletionData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={filteredCompletionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Completion Rate']}
                      labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                    />
                    <Line
                      type="monotone"
                      dataKey="completionRate"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <div className="text-center">
                  <p className="text-muted-foreground">No data available for this time range</p>
                  <p className="text-sm text-muted-foreground mt-2">Start tracking your habits to see analytics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Habit Distribution</CardTitle>
              <CardDescription>Types of habits you're tracking</CardDescription>
            </div>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            ) : habitDistributionData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={habitDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {habitDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} habits`, 'Count']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <div className="text-center">
                  <p className="text-muted-foreground">No habits created yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Create habits to see distribution</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Habit Performance</CardTitle>
              <CardDescription>Compare completion rates across habits</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            ) : habitPerformanceData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={habitPerformanceData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Completion Rate']}
                    />
                    <Bar 
                      dataKey="rate" 
                      fill="#7c3aed"
                      radius={[0, 4, 4, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <div className="text-center">
                  <p className="text-muted-foreground">No habit performance data available yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Track habits for a few days to see performance</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Habit History Calendar</CardTitle>
              <CardDescription>Calendar view of your habit check-ins</CardDescription>
            </div>
            <div className="flex items-center">
              <Info className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-xs text-muted-foreground">Green: Completed, Red: Missed</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Loading calendar data...</p>
              </div>
            ) : (
              <HabitHistoryCalendar habits={habits || []} checkIns={checkIns || []} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
