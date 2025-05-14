import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import HabitForm from './habit-form';
import { toast } from 'sonner';

interface NewHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function NewHabitDialog({ open, onOpenChange, onSuccess }: NewHabitDialogProps) {
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  const handleError = (error: Error) => {
    if (error.message.includes('logged in')) {
      toast.error('Please log in to create habits');
    } else {
      toast.error('Failed to create habit. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <HabitForm 
          onSuccess={handleSuccess} 
          onError={handleError}
        />
      </DialogContent>
    </Dialog>
  );
}
