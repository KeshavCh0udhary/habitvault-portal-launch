
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/navbar';

const DashboardLayout = () => {
  const location = useLocation();

  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar scrolled={true} />
      <main className="flex-grow container pt-24 pb-12 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
