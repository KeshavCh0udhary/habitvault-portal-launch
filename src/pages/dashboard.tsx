
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle2, BarChart2, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}</h1>
        <p className="text-muted-foreground">
          Track your habits and build meaningful streaks.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatsCard 
          icon={<Calendar className="size-5" />}
          title="Active Habits"
          value="5"
          trend="+2 this week"
          trendUp={true}
        />
        <StatsCard 
          icon={<CheckCircle2 className="size-5" />}
          title="Completion Rate"
          value="86%"
          trend="↑ 12% from last week"
          trendUp={true}
        />
        <StatsCard 
          icon={<BarChart2 className="size-5" />}
          title="Longest Streak"
          value="16 days"
          trend="Meditation"
          trendUp={false}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Habits</h2>
          <Button variant="outline" className="gap-2">
            <Plus className="size-4" />
            Add Habit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HabitCard 
            title="Morning Meditation"
            description="10 minutes every day"
            streak={16}
            completion={90}
            color="purple"
          />
          <HabitCard 
            title="Exercise"
            description="30 minutes, 4 days a week"
            streak={8}
            completion={75}
            color="teal"
          />
          <HabitCard 
            title="Reading"
            description="15 pages a day"
            streak={21}
            completion={95}
            color="purple"
          />
          <EmptyHabitCard />
        </div>
      </motion.div>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

const StatsCard = ({ icon, title, value, trend, trendUp }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-muted-foreground">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendUp ? 'text-green-500' : 'text-foreground/70'}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};

interface HabitCardProps {
  title: string;
  description: string;
  streak: number;
  completion: number;
  color: 'purple' | 'teal';
}

const HabitCard = ({ title, description, streak, completion, color }: HabitCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${color === 'purple' ? 'bg-habit-purple' : 'bg-habit-teal'}`} />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion</span>
            <span className="font-medium">{completion}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className={`h-full ${color === 'purple' ? 'bg-habit-purple' : 'bg-habit-teal'}`}
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        <div className="flex justify-between w-full items-center">
          <div className="text-sm">
            <span className="text-muted-foreground">Current streak:</span>{' '}
            <span className="font-semibold">{streak} days</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const EmptyHabitCard = () => {
  return (
    <Card className="border-dashed bg-transparent flex flex-col items-center justify-center h-[218px] border-border/50 hover:border-border transition-colors">
      <div className="p-6 text-center">
        <div className="size-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="size-6 text-foreground/60" />
        </div>
        <h3 className="font-medium mb-1">Add a new habit</h3>
        <p className="text-sm text-muted-foreground">Start tracking a new daily or weekly habit</p>
      </div>
    </Card>
  );
};

export default DashboardPage;
