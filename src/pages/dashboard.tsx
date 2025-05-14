import { useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Habit } from '@/types/habit';
import { habitService } from '@/services/habit-service';
import { getHabitsDueToday } from '@/utils/habit-utils';
import HabitList from '@/components/habits/habit-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, ListChecks, Eye, EyeOff, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import DailyQuote from '@/components/daily-quote';
import MotivationalGreeting from '@/components/motivational-greeting';
import NewHabitDialog from '@/components/habits/new-habit-dialog';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboard-tab') || 'today';
  });
  const [completedTodayIds, setCompletedTodayIds] = useState<string[]>([]);
  const [showQuote, setShowQuote] = useState(() => {
    return localStorage.getItem('habitvault-show-quote') !== 'false';
  });
  const [isNewHabitDialogOpen, setIsNewHabitDialogOpen] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  // Save quote visibility preference
  useEffect(() => {
    localStorage.setItem('habitvault-show-quote', showQuote.toString());
  }, [showQuote]);

  // Fetch all habits
  const { data: habits, error, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getUserHabits,
    enabled: !!user,
  });

  // Fetch today's check-ins to determine completed habits
  const { data: todayCheckIns } = useQuery({
    queryKey: ['checkIns', today],
    queryFn: () => habitService.getCheckInsForDate(new Date()),
    enabled: !!user,
  });

  // Update completedTodayIds when check-ins data changes
  useEffect(() => {
    if (todayCheckIns) {
      const completedIds = todayCheckIns
        .filter(checkIn => checkIn.status === 'completed')
        .map(checkIn => checkIn.habit_id);
      setCompletedTodayIds(completedIds);
    }
  }, [todayCheckIns]);

  // Refresh habits when coming back to page
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['habits'] });
  }, [queryClient]);

  // Handle refresh after check-ins, creating or updating habits
  const handleHabitsUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['habits'] });
    queryClient.invalidateQueries({ queryKey: ['checkIns', today] });
  };

  // Toggle quote visibility
  const toggleQuote = () => {
    setShowQuote(prev => !prev);
  };

  // Filter habits due today, excluding those already completed
  const habitsDueToday = habits ? getHabitsDueToday(habits, completedTodayIds) : [];
  
  // Calculate completed habits for motivational message
  const completedToday = completedTodayIds.length;
  const totalDueToday = habitsDueToday.length + completedToday;

  const handleNewHabitClick = () => {
    if (!user) {
      toast.error('Please log in to create habits');
      return;
    }
    setIsNewHabitDialogOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-medium">Error loading habits</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Define empty state messages as ReactNode elements
  const todayEmptyMessage: ReactNode = habits?.length ? (
    "You don't have any habits due today."
  ) : (
    <div className="text-center py-8">
      <p className="text-lg mb-4">Nothing here yet. Let's build your first habit!</p>
      <Button 
        onClick={handleNewHabitClick}
        className="bg-habit-purple hover:bg-habit-purple/90"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Habit
      </Button>
    </div>
  );

  const allHabitsEmptyMessage: ReactNode = (
    <div className="text-center py-8">
      <p className="text-lg mb-4">Nothing here yet. Let's build your first habit!</p>
      <Button 
        onClick={handleNewHabitClick}
        className="bg-habit-purple hover:bg-habit-purple/90"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Habit
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-2 lg:px-3 flex items-center gap-1 text-muted-foreground"
            onClick={toggleQuote}
          >
            {showQuote ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="hidden md:inline">Hide Quote</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden md:inline">Show Quote</span>
              </>
            )}
          </Button>
          <p className="text-muted-foreground">
            Track your progress and build lasting habits
          </p>
        </div>
      </div>

      {/* Motivational Greeting */}
      <MotivationalGreeting 
        completedHabits={completedToday}
        totalHabits={totalDueToday}
      />

      {/* Motivational Quote Section */}
      {showQuote && <DailyQuote onToggle={toggleQuote} />}

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habits?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habitsDueToday.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Habits Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="today" className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4" />
            <span>Today</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <ListChecks className="h-4 w-4" />
            <span>All Habits</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="animate-fade-in">
          <HabitList
            habits={habitsDueToday}
            onUpdate={handleHabitsUpdate}
            filterDueToday={true}
            emptyMessage={todayEmptyMessage}
          />
        </TabsContent>
        <TabsContent value="all" className="animate-fade-in">
          <HabitList
            habits={habits || []}
            onUpdate={handleHabitsUpdate}
            emptyMessage={allHabitsEmptyMessage}
          />
        </TabsContent>
      </Tabs>

      <NewHabitDialog 
        open={isNewHabitDialogOpen} 
        onOpenChange={setIsNewHabitDialogOpen}
        onSuccess={() => {
          setIsNewHabitDialogOpen(false);
          handleHabitsUpdate();
        }}
      />
    </div>
  );
}
