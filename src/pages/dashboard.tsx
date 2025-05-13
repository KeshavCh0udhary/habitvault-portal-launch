
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { Habit } from '@/types/habit';
import { habitService } from '@/services/habit-service';
import { getHabitsDueToday } from '@/utils/habit-utils';
import HabitList from '@/components/habits/habit-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, ListChecks } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('today');

  // Fetch all habits
  const { data: habits, error, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getUserHabits,
    enabled: !!user,
  });

  // Refresh habits when coming back to page
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['habits'] });
  }, [queryClient]);

  // Handle refresh after check-ins, creating or updating habits
  const handleHabitsUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['habits'] });
  };

  const habitsDueToday = habits ? getHabitsDueToday(habits) : [];

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress and build lasting habits
        </p>
      </div>

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
        <TabsContent value="today">
          <HabitList
            habits={habitsDueToday}
            onUpdate={handleHabitsUpdate}
            filterDueToday={true}
            emptyMessage={
              habits?.length
                ? "You don't have any habits due today."
                : "You don't have any habits yet."
            }
          />
        </TabsContent>
        <TabsContent value="all">
          <HabitList
            habits={habits || []}
            onUpdate={handleHabitsUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
