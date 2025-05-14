import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Calendar, CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxItem,
} from '@/components/ui/checkbox';
import { NewHabit, TargetDay, Habit } from '@/types/habit';
import { getTargetDayOptions } from '@/utils/habit-utils';
import { habitService } from '@/services/habit-service';

// Schema for habit form validation
const habitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  start_date: z.date().optional(),
  target_days: z.array(z.string()).min(1, 'Select at least one day'),
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface HabitFormProps {
  onSuccess: () => void;
  onError?: (error: Error) => void;
  initialData?: Habit;
}

export default function HabitForm({ onSuccess, onError, initialData }: HabitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;
  
  // Initialize form with default values or existing habit data
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      start_date: initialData ? new Date(initialData.start_date) : new Date(),
      target_days: initialData?.target_days || ['daily'],
    },
  });

  async function onSubmit(values: HabitFormValues) {
    setIsSubmitting(true);
    try {
      const habitData: NewHabit = {
        name: values.name,
        description: values.description,
        start_date: values.start_date ? format(values.start_date, 'yyyy-MM-dd') : undefined,
        target_days: values.target_days as TargetDay[],
      };

      if (isEditing && initialData) {
        await habitService.updateHabit(initialData.id, habitData);
        toast.success('Habit updated successfully!');
      } else {
        await habitService.createHabit(habitData);
        toast.success('Habit created successfully!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting habit:', error);
      if (onError && error instanceof Error) {
        onError(error);
      } else {
        toast.error('Failed to save habit. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const targetDayOptions = getTargetDayOptions();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Morning Meditation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your habit..." 
                  className="resize-none" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal flex justify-between"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency (When to perform this habit)</FormLabel>
              <FormControl>
                <CheckboxGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 gap-2"
                >
                  {targetDayOptions.map((option) => (
                    <CheckboxItem
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </CheckboxGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Habit' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
