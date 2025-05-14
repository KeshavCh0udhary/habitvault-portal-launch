import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, TooltipProps 
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval, 
  differenceInDays, addDays, isSameDay, startOfWeek, endOfWeek, subMonths } from 'date-fns';
import { habitService } from '@/services/habit-service';
import { Habit, CheckIn } from '@/types/habit';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CalendarDays, TrendingUp, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import HabitHistoryCalendar from '@/components/habits/habit-history-calendar';
import { getMissingCheckIns } from '@/utils/habit-utils';
import { useAuth } from '@/hooks/use-auth';

// Chart colors
const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

// Time range options
const timeRanges = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
];

// Get the date range based on the selected time period
const getDateRange = (timeRange: string) => {
  const today = new Date();
  
  switch (timeRange) {
    case "7days":
      return { start: addDays(today, -7), end: today };
    case "30days":
      return { start: addDays(today, -30), end: today };
    case "90days":
      return { start: addDays(today, -90), end: today };
    case "thisMonth":
      return { 
        start: startOfMonth(today), 
        end: today
      };
    case "lastMonth":
      const lastMonth = subMonths(today, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    default:
      return { start: addDays(today, -30), end: today };
  }
};

interface DailyCheckIn {
  date: string;
  completed: number;
  missed: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// Custom tooltip for the bar chart
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const completed = payload.find((p: any) => p.name === "Completed")?.value || 0;
  const missed = payload.find((p: any) => p.name === "Missed")?.value || 0;
  const total = completed + missed;

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3">
      <p className="font-medium mb-1">{label}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Completed: {completed}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Missed: {missed}</span>
        </div>
        <div className="pt-1 border-t mt-1">
          <span className="font-medium">Total: {total}</span>
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [selectedTimeRange, setSelectedTimeRange] = useState(() => {
    return localStorage.getItem('habitvault-analytics-range') || "30days";
  });
  const [selectedView, setSelectedView] = useState(() => {
    return localStorage.getItem('habitvault-calendar-view') || "month";
  });
  const [selectedTab, setSelectedTab] = useState(() => {
    return localStorage.getItem('habitvault-analytics-tab') || "charts";
  });
  const [selectedHabit, setSelectedHabit] = useState<string>("all");
  
  // Save preferred time range to localStorage
  useEffect(() => {
    localStorage.setItem('habitvault-analytics-range', selectedTimeRange);
  }, [selectedTimeRange]);
  
  // Save preferred calendar view to localStorage
  useEffect(() => {
    localStorage.setItem('habitvault-calendar-view', selectedView);
  }, [selectedView]);

  // Save preferred tab to localStorage
  useEffect(() => {
    localStorage.setItem('habitvault-analytics-tab', selectedTab);
  }, [selectedTab]);

  // Function to refresh data
  const refreshData = React.useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const habitsData = await habitService.getUserHabits();
      const checkInsData = await habitService.getAllCheckIns();
      
      // Generate missing check-ins for past dates
      const missingCheckIns = getMissingCheckIns(habitsData, checkInsData);
      
      setHabits(habitsData);
      setCheckIns([...checkInsData, ...missingCheckIns]);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load analytics data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Set up polling for updates
  useEffect(() => {
    if (!user) return;
    
    // Poll every 5 seconds for updates
    const interval = setInterval(refreshData, 5000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [refreshData, user]);
  
  // Calculate date range
  const dateRange = React.useMemo(() => getDateRange(selectedTimeRange), [selectedTimeRange]);

  // Get check-in data by date for bar chart
  const dailyCheckIns = React.useMemo<DailyCheckIn[]>(() => {
    // Filter check-ins by date range
    const filteredCheckIns = checkIns.filter(checkIn => {
      const checkInDate = parseISO(checkIn.date);
      return isWithinInterval(checkInDate, { 
        start: dateRange.start, 
        end: dateRange.end 
      });
    });

    // Filter habits for selected period
    const filteredHabits = habits.filter(habit => {
      const habitStartDate = parseISO(habit.start_date);
      // Include habit if its start date is before or within the selected period
      return habitStartDate <= dateRange.end;
    });

    // Filter by selected habit if specific one is chosen
    const habitFilteredCheckIns = selectedHabit === "all" 
      ? filteredCheckIns 
      : filteredCheckIns.filter(checkIn => checkIn.habit_id === selectedHabit);

    const daysInRange = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    
    // If showing too many days would make the chart unreadable, we'll group by week
    const shouldGroupByWeek = daysInRange.length > 31;
    
    // Create a map of all check-ins including missing ones
    const checkInsByDate: Record<string, { completed: number; missed: number }> = {};
    
    // Initialize all dates in range with potential check-ins for each habit
    daysInRange.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      checkInsByDate[dateStr] = { completed: 0, missed: 0 };
      
      // Skip future dates
      if (day > new Date()) {
        return;
      }
      
      // For each habit that existed on this day, we should have a check-in
      filteredHabits.forEach(habit => {
        const habitStartDate = parseISO(habit.start_date);
        // Only count habits that had already started by this day
        if (habitStartDate <= day) {
          // If we're filtering by a specific habit, only count that one
          if (selectedHabit === "all" || selectedHabit === habit.id) {
            // Initially mark as missed - we'll update to completed if we find a completion
            checkInsByDate[dateStr].missed++;
          }
        }
      });
    });

    // Process all check-ins to update the status
    habitFilteredCheckIns.forEach(checkIn => {
      const checkInDate = format(parseISO(checkIn.date), 'yyyy-MM-dd');
      if (checkInsByDate[checkInDate]) {
        if (checkIn.status === 'completed') {
          checkInsByDate[checkInDate].completed++;
          // Reduce missed count since we found a completion
          checkInsByDate[checkInDate].missed--;
        }
        // We don't need to do anything for missed since we initialized them as missed
      }
    });
    
    if (shouldGroupByWeek) {
      // Group by week
      const weekData: Record<string, { completed: number; missed: number; date: string }> = {};
      
      daysInRange.forEach(day => {
        // Skip future dates
        if (day > new Date()) {
          return;
        }
        
        const weekStart = format(startOfWeek(day), 'MMM d');
        
        if (!weekData[weekStart]) {
          weekData[weekStart] = { completed: 0, missed: 0, date: weekStart };
        }
        
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayData = checkInsByDate[dateStr];
        weekData[weekStart].completed += dayData.completed;
        weekData[weekStart].missed += dayData.missed;
      });
      
      return Object.values(weekData);
    } else {
      // Use daily data
      return daysInRange
        .filter(day => day <= new Date()) // Only include days up to today
        .map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayDisplay = format(day, 'MMM d');
          
          return {
            date: dayDisplay,
            completed: checkInsByDate[dateStr].completed,
            missed: checkInsByDate[dateStr].missed
          };
        });
    }
  }, [checkIns, habits, dateRange.start, dateRange.end, selectedHabit]);

  const renderBarChart = () => {
    if (loading) {
      return (
        <div className="h-[300px] flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      );
    }

    if (!user) {
      return (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Please log in to view your analytics.</p>
          </div>
        </div>
      );
    }

    if (!dailyCheckIns || dailyCheckIns.length === 0) {
      return (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <CalendarDays className="mx-auto h-10 w-10 opacity-30" />
            <p className="mt-2">No check-in data available for the selected period</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailyCheckIns}
            margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value: number) => Math.abs(Math.round(value)).toString()}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar 
              name="Completed" 
              dataKey="completed" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Bar 
              name="Missed" 
              dataKey="missed" 
              fill="#f43f5e" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Calculate completion rate for the filtered period
  const calculatedStats = React.useMemo(() => {
    if (dailyCheckIns.length === 0) {
      return { 
        completionRate: 0, 
        completedCount: 0, 
        totalDueHabits: 0,
        missedCount: 0,
        skippedCount: 0,
        totalHabits: habits.length
      };
    }
    
    const today = new Date();
    // Ensure we don't count beyond today
    const endDate = dateRange.end > today ? today : dateRange.end;
    
    const totalDaysInRange = differenceInDays(endDate, dateRange.start) + 1;
    
    // Create a map of potential check-ins for each day and habit
    let potentialCheckIns = 0;
    let habitStatsByDay: Record<string, string[]> = {};
    
    // Prepare a day-by-day record of habits that were due
    const daysInRange = eachDayOfInterval({ start: dateRange.start, end: endDate });
    
    // Prepare all habit stats
    daysInRange.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      habitStatsByDay[dateStr] = [];
      
      // Count habits that should be checked for this day
      habits.forEach(habit => {
        const habitStartDate = parseISO(habit.start_date);
        
        // Only count habits that had already started by this day
        if (habitStartDate <= day) {
          // We'll assume all habits were due every day in this simple calculation 
          // You may want to replace this with more precise logic based on habit.target_days
          habitStatsByDay[dateStr].push(habit.id);
          potentialCheckIns++;
        }
      });
    });
    
    // Filter check-ins to only include those up to today
    const relevantCheckIns = dailyCheckIns.filter(day => {
      const checkInDate = parseISO(format(new Date(day.date), 'yyyy-MM-dd'));
      return checkInDate <= today;
    });
    
    const completedCheckIns = relevantCheckIns.filter(c => c.completed > 0).length;
    const missedCheckIns = relevantCheckIns.filter(c => c.missed > 0).length;
    const skippedCheckIns = relevantCheckIns.filter(c => c.completed === 0 && c.missed === 0).length;
    
    // If we have no potential check-ins, return 0 to avoid division by zero
    if (potentialCheckIns === 0) {
      return { 
        completionRate: 0, 
        completedCount: completedCheckIns, 
        totalDueHabits: 0,
        missedCount: missedCheckIns,
        skippedCount: skippedCheckIns,
        totalHabits: habits.length
      };
    }
    
    return {
      completionRate: (completedCheckIns / potentialCheckIns) * 100,
      completedCount: completedCheckIns,
      totalDueHabits: potentialCheckIns,
      missedCount: missedCheckIns,
      skippedCount: skippedCheckIns,
      totalHabits: habits.length
    };
  }, [dailyCheckIns, habits, dateRange.start, dateRange.end, lastUpdate]);
  
  // Calculate check-in distribution
  const statusDistribution = React.useMemo(() => {
    // If there are no habits, return empty array
    if (habits.length === 0) {
      return [];
    }

    const today = new Date();
    // Ensure we don't count beyond today
    const endDate = dateRange.end > today ? today : dateRange.end;

    // Only count check-ins within the selected date range
    const filteredCheckIns = checkIns.filter(checkIn => {
      const checkInDate = parseISO(checkIn.date);
      return isWithinInterval(checkInDate, { 
        start: dateRange.start, 
        end: endDate 
      });
    });

    // Filter habits for selected period
    const activeHabits = habits.filter(habit => {
      const habitStartDate = parseISO(habit.start_date);
      // Include habit if its start date is before or within the selected period
      return habitStartDate <= endDate;
    });

    // If no active habits in the selected period, return empty array
    if (activeHabits.length === 0) {
      return [];
    }

    // Filter check-ins by selected habit if specific one is chosen
    const relevantCheckIns = selectedHabit === "all" 
      ? filteredCheckIns 
      : filteredCheckIns.filter(checkIn => checkIn.habit_id === selectedHabit);

    // Only count actual check-ins (not missing ones)
    const actualCheckIns = relevantCheckIns.filter(checkIn => 
      checkIn.status === 'completed' || checkIn.status === 'missed'
    );

    if (actualCheckIns.length === 0) {
      return [];
    }

    const completed = actualCheckIns.filter(c => c.status === 'completed').length;
    const missed = actualCheckIns.filter(c => c.status === 'missed').length;
    
    // Calculate percentages based on actual check-ins only
    const total = completed + missed;
    const data = [];
    
    if (completed > 0) {
      data.push({ 
        name: 'Completed', 
        value: completed,
        percentage: Math.round((completed / total) * 100)
      });
    }
    if (missed > 0) {
      data.push({ 
        name: 'Missed', 
        value: missed,
        percentage: Math.round((missed / total) * 100)
      });
    }
    
    return data;
  }, [checkIns, habits, dateRange.start, dateRange.end, selectedHabit, lastUpdate]);
  
  // Calculate habit consistency stats
  const consistencyStats = React.useMemo(() => {
    if (habits.length === 0) {
      return {
        totalCheckIns: 0,
        longestStreak: 0,
        habitWithLongestStreak: null
      };
    }

    // Find habit with longest streak
    const habitWithLongestStreak = habits.reduce((longest, current) => {
      return (current.longest_streak || 0) > (longest?.longest_streak || 0) ? current : longest;
    }, habits[0]);

    // Count total check-ins in the selected period
    const totalCheckIns = checkIns.filter(checkIn => {
      const checkInDate = parseISO(checkIn.date);
      return isWithinInterval(checkInDate, { 
        start: dateRange.start, 
        end: dateRange.end 
      }) && checkIn.status === 'completed';
    }).length;

    return {
      totalCheckIns,
      longestStreak: habitWithLongestStreak?.longest_streak || 0,
      habitWithLongestStreak
    };
  }, [habits, checkIns, dateRange.start, dateRange.end]);

  // Get data for habit completion by name
  const habitCompletionData = React.useMemo(() => {
    if (habits.length === 0) return [];
    
    return habits.map(habit => {
      const habitCheckIns = checkIns.filter(c => c.habit_id === habit.id && c.status === 'completed');
      const totalCompletions = habitCheckIns.length;
      
      return {
        name: habit.name,
        completions: totalCompletions,
        id: habit.id
      };
    })
    .sort((a, b) => b.completions - a.completions); // Sort by highest completions first
  }, [dailyCheckIns, habits, lastUpdate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication required</AlertTitle>
          <AlertDescription>
            Please log in to view your analytics data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        
        <div className="flex-shrink-0">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Habits</CardTitle>
            <CardDescription>
              Total number of habits created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {habits.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Completion Rate</CardTitle>
            <CardDescription>
              Habits completed vs. total due
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline mt-1">
              <div className="text-3xl font-bold">
                {calculatedStats.completionRate.toFixed(1)}%
              </div>
              <div className="ml-2 text-sm text-muted-foreground">
                ({calculatedStats.completedCount}/{calculatedStats.totalDueHabits})
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Habit Consistency</CardTitle>
            <CardDescription>
              Streak and check-in stats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 mt-1">
              <div className="text-2xl font-bold">
                {consistencyStats.longestStreak} days
              </div>
              <div className="text-sm text-muted-foreground">
                Longest streak: {consistencyStats.habitWithLongestStreak?.name || 'No streaks yet'}
              </div>
              <div className="text-sm text-muted-foreground">
                Total check-ins: {consistencyStats.totalCheckIns}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Best Performing</CardTitle>
            <CardDescription>
              Habit with most completions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {habitCompletionData && habitCompletionData.length > 0 ? (
              <div className="flex flex-col mt-1">
                <div className="text-xl font-bold truncate">
                  {habitCompletionData[0].name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {habitCompletionData[0].completions} completions
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mt-2">
                No completions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Main analytics tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          {/* Habit selector */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <Select value={selectedHabit} onValueChange={setSelectedHabit}>
              <SelectTrigger>
                <SelectValue placeholder="Select habit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Habits</SelectItem>
                {habits.map(habit => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-lg font-medium">
              {selectedHabit === "all" ? "All Habits" : 
                habits.find(h => h.id === selectedHabit)?.name}
            </div>
          </div>
          
          {/* Check-in status distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Check-in Distribution</CardTitle>
              <CardDescription>
                Distribution of completed vs missed check-ins
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
              {statusDistribution.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        label={({name, percentage}) => `${name}: ${percentage}%`}
                        labelLine={false}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.name === 'Completed' ? '#10b981' : '#f43f5e'
                          } />
                        ))}
                      </Pie>
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <CalendarDays className="mx-auto h-10 w-10 opacity-30" />
                    <p className="mt-2">No check-in data available for the selected period</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Daily check-ins */}
          <Card>
            <CardHeader>
              <CardTitle>Check-ins Over Time</CardTitle>
              <CardDescription>
                Your habit activity during the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBarChart()}
            </CardContent>
          </Card>
          
          {/* Top habits */}
          <Card>
            <CardHeader>
              <CardTitle>Habit Performance</CardTitle>
              <CardDescription>
                Your most consistent habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {habitCompletionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={habitCompletionData.slice(0, 10)}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <RechartsTooltip />
                      <Bar dataKey="completions" fill="#8b5cf6">
                        {habitCompletionData.slice(0, 10).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p>No habit data available</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Habit History</CardTitle>
              <CardDescription>
                Calendar view of your habit check-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl mx-auto">
                <HabitHistoryCalendar 
                  checkIns={checkIns} 
                  habits={habits} 
                  view={selectedView as "week" | "month"}
                  onViewChange={(view) => setSelectedView(view)}
                  onUpdate={refreshData}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
