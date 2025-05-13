
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, supabase } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    newPassword: '',
    confirmPassword: '',
  });

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update user metadata (name)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: formData.fullName },
      });

      if (updateError) throw updateError;

      // If password fields are filled, update password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (formData.newPassword.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword,
        });

        if (passwordError) throw passwordError;

        // Clear password fields after update
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: '',
        }));
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      toast.error('Please confirm deletion by checking the box');
      return;
    }
    
    try {
      setIsDeleting(true);
      
      // First, try to delete all user data
      try {
        // Delete habits
        const { error: habitsError } = await supabase
          .from('habits')
          .delete()
          .eq('user_id', user?.id);
          
        if (habitsError) console.error('Error deleting habits:', habitsError);
        
        // Delete check-ins
        const { error: checkInsError } = await supabase
          .from('habit_checkins')
          .delete()
          .eq('user_id', user?.id);
          
        if (checkInsError) console.error('Error deleting check-ins:', checkInsError);
      } catch (dataError) {
        console.error('Error deleting user data:', dataError);
        // Continue with account deletion even if data deletion fails
      }
      
      // Now delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user?.id as string);
      
      if (error) throw error;
      
      // Sign out the user
      await supabase.auth.signOut();
      
      toast.success('Account deleted successfully');
      setDeleteDialogOpen(false);
      
      // Redirect to home page
      navigate('/');
      
    } catch (error: any) {
      console.error('Delete account error:', error);
      
      if (error.message.includes('admin')) {
        // If admin error occurs, try the fallback method
        try {
          // Fallback: Sign out and let the user know
          await supabase.auth.signOut();
          toast.success('You have been signed out. Please contact support to complete account deletion.');
          navigate('/');
          return;
        } catch (signOutError) {
          console.error('Sign out error:', signOutError);
        }
      }
      
      toast.error(error.message || 'Error deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card p-6 rounded-xl border border-border/40 mb-8"
      >
        <div className="flex items-center space-x-6 mb-6">
          <Avatar className="size-20">
            <AvatarImage
              src={user?.user_metadata?.avatar_url || ''}
              alt={user?.email || 'User'}
            />
            <AvatarFallback className="bg-habit-purple text-white text-3xl">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-xl">{formData.fullName || user?.email?.split('@')[0] || 'User'}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={updateProfile} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-habit-purple hover:bg-habit-purple/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card p-6 rounded-xl border border-border/40"
      >
        <h3 className="font-medium text-destructive mb-4">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete Account
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  className="rounded border-gray-300 text-habit-purple focus:ring-habit-purple"
                />
                <Label htmlFor="confirm" className="text-sm">
                  I understand that this action is permanent and cannot be undone
                </Label>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !confirmDelete}
                className="gap-2"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
