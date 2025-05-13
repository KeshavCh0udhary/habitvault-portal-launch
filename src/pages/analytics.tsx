import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
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
      return { start: startOfMonth(today), end: endOfMonth(today) };
    case "lastMonth":
      const lastMonth = subMonths(today, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    default:
      return { start: addDays(today, -30), end: today };
  }
};

export default function AnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(() => {
    return localStorage.getItem('habitvault-analytics-range') || "30days";
  });
  const [selectedView, setSelectedView] = useState(() => {
    return localStorage.getItem('habitvault-calendar-view') || "week";
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

  // Fetch habits and check-ins
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const habitsData = await habitService.getUserHabits();
        const checkInsData = await habitService.getAllCheckIns();
        
        // Generate missing check-ins for past dates
        const missingCheckIns = getMissingCheckIns(habitsData, checkInsData);
        
        setHabits(habitsData);
        setCheckIns([...checkInsData, ...missingCheckIns]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate date range and filter data
  const dateRange = getDateRange(selectedTimeRange);
  
  // Filter check-ins by date range
  const filteredCheckIns = checkIns.filter(checkIn => {
    const checkInDate = parseISO(checkIn.date);
    return isWithinInterval(checkInDate, { 
      start: dateRange.start, 
      end: dateRange.end 
    });
  });
  
  // Filter habits for selected period (if they existed within that period)
  const filteredHabits = habits.filter(habit => {
    const habitStartDate = parseISO(habit.start_date);
    // Include habit if its start date is before or within the selected period
    return habitStartDate <= dateRange.end;
  });
  
  // Filter by selected habit if specific one is chosen
  const habitFilteredCheckIns = selectedHabit === "all" 
    ? filteredCheckIns 
    : filteredCheckIns.filter(checkIn => checkIn.habit_id === selectedHabit);
  
  // Calculate completion rate for the filtered period
  const calculatedStats = React.useMemo(() => {
    if (filteredCheckIns.length === 0) {
      return { 
        completionRate: 0, 
        completedCount: 0, 
        totalDueHabits: 0,
        missedCount: 0,
        skippedCount: 0,
        totalHabits: habits.length
      };
    }
    
    const totalDaysInRange = differenceInDays(dateRange.end, dateRange.start) + 1;
    
    // Create a map of potential check-ins for each day and habit
    let potentialCheckIns = 0;
    let habitStatsByDay: Record<string, string[]> = {};
    
    // Prepare a day-by-day record of habits that were due
    const daysInRange = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    
    // Prepare all habit stats
    daysInRange.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      habitStatsByDay[dateStr] = [];
      
      // Count habits that should be checked for this day
      filteredHabits.forEach(habit => {
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
    
    const completedCheckIns = filteredCheckIns.filter(c => c.status === 'completed').length;
    const missedCheckIns = filteredCheckIns.filter(c => c.status === 'missed').length;
    const skippedCheckIns = filteredCheckIns.filter(c => c.status === 'skipped').length;
    
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
  }, [filteredCheckIns, filteredHabits, dateRange.start, dateRange.end, habits.length]);
  
  // Calculate check-in distribution
  const statusDistribution = React.useMemo(() => {
    const completed = habitFilteredCheckIns.filter(c => c.status === 'completed').length;
    const missed = habitFilteredCheckIns.filter(c => c.status === 'missed').length;
    const skipped = habitFilteredCheckIns.filter(c => c.status === 'skipped').length;
    
    return [
      { name: 'Completed', value: completed },
      { name: 'Missed', value: missed },
      { name: 'Skipped', value: skipped },
    ].filter(item => item.value > 0); // Remove zero values
  }, [habitFilteredCheckIns]);
  
  // Get check-in data by date for bar chart
  const dailyCheckIns = React.useMemo(() => {
    const daysInRange = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    
    // If showing too many days would make the chart unreadable, we'll group by week
    const shouldGroupByWeek = daysInRange.length > 31;
    
    if (shouldGroupByWeek) {
      // Group by week
      const weekData: Record<string, { completed: number; missed: number; date: string }> = {};
      
      daysInRange.forEach(day => {
        const weekStart = format(startOfWeek(day), 'MMM d');
        
        if (!weekData[weekStart]) {
          weekData[weekStart] = { completed: 0, missed: 0, date: weekStart };
        }
        
        // Count check-ins for this day
        habitFilteredCheckIns.forEach(checkIn => {
          const checkInDate = parseISO(checkIn.date);
          if (isSameDay(checkInDate, day)) {
            if (checkIn.status === 'completed') {
              weekData[weekStart].completed++;
            } else if (checkIn.status === 'missed') {
              weekData[weekStart].missed++;
            }
          }
        });
      });
      
      return Object.values(weekData);
    } else {
      // Use daily data
      return daysInRange.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayDisplay = format(day, 'MMM d');
        
        const dayData = {
          date: dayDisplay,
          completed: 0,
          missed: 0
        };
        
        // Count check-ins for this day
        habitFilteredCheckIns.forEach(checkIn => {
          if (checkIn.date === dayStr) {
            if (checkIn.status === 'completed') {
              dayData.completed++;
            } else if (checkIn.status === 'missed') {
              dayData.missed++;
            }
          }
        });
        
        return dayData;
      });
    }
  }, [habitFilteredCheckIns, dateRange.start, dateRange.end]);
  
  // Get data for habit completion by name
  const habitCompletionData = React.useMemo(() => {
    if (filteredHabits.length === 0) return [];
    
    return filteredHabits.map(habit => {
      const habitCheckIns = filteredCheckIns.filter(c => c.habit_id === habit.id);
      const totalCompletions = habitCheckIns.filter(c => c.status === 'completed').length;
      
      return {
        name: habit.name,
        completions: totalCompletions,
        id: habit.id
      };
    })
    .sort((a, b) => b.completions - a.completions); // Sort by highest completions first
  }, [filteredHabits, filteredCheckIns]);

  // Get custom tooltip for recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Show loading state if data is still being fetched
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        
        <Skeleton className="h-96" />
      </div>
    );
  }
  
  // If no habits exist yet, show an info message
  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No habits found</AlertTitle>
          <AlertDescription>
            Create some habits and check them in to see your analytics data.
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
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Habits</CardTitle>
            <CardDescription>
              Total number of habits created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {calculatedStats.totalHabits}
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
              Your check-in distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mt-1">
              <div className="text-3xl font-bold">
                {habitFilteredCheckIns.length}
              </div>
              <div className="flex gap-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs">Missed</span>
                </div>
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
                Breakdown of your habit check-ins
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
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.name === 'Completed' ? '#10b981' : 
                            entry.name === 'Missed' ? '#f43f5e' : '#f59e0b'
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
              {dailyCheckIns.length > 0 && dailyCheckIns.some(day => day.completed > 0 || day.missed > 0) ? (
                <div className="h-[300px] max-w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyCheckIns}
                      margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar name="Completed" dataKey="completed" fill="#10b981" />
                      <Bar name="Missed" dataKey="missed" fill="#f43f5e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="mx-auto h-10 w-10 opacity-30" />
                    <p className="mt-2">No check-in data available for the selected period</p>
                  </div>
                </div>
              )}
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
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
