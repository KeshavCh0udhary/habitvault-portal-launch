import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Loader } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader size={40} className="animate-spin text-habit-purple" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Store the attempted URL to redirect back after login
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
