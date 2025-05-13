
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, ChevronDownIcon, BarChart3, LineChart, Activity, PieChart } from 'lucide-react';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('thisWeek');

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
        
        <Select value={timeRange} onValueChange={setTimeRange}>
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Habits</CardDescription>
            <CardTitle className="text-2xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-500">↑ 2 since last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-2xl">78%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-500">↑ 5% since last week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Streak Average</CardDescription>
            <CardTitle className="text-2xl">14 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-500">↑ 3 days improvement</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Most Consistent</CardDescription>
            <CardTitle className="text-2xl">Reading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs">98% completion rate</div>
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
            <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Chart data will appear here</p>
            </div>
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
            <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Chart data will appear here</p>
            </div>
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
            <div className="h-80 flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Chart data will appear here</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
