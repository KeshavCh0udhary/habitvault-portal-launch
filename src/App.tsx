
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { PageTransition } from "@/components/page-transition";

// Layouts
import MainLayout from "@/layouts/main-layout";
import DashboardLayout from "@/layouts/dashboard-layout";

// Public Pages
import HomePage from "@/pages/Index";
import AboutPage from "@/pages/about";
import BlogsPage from "@/pages/blogs";
import BlogPostPage from "@/pages/blog-post";
import ContactPage from "@/pages/contact";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ResetPasswordPage from "@/pages/reset-password";
import NotFoundPage from "@/pages/NotFound";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import HelpPage from "@/pages/help";

// Protected Pages
import DashboardPage from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import AnalyticsPage from "@/pages/analytics";

import ProtectedRoute from "@/components/protected-route";
import PublicRoute from "@/components/public-route";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="habit-vault-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTransition>
              <Routes>
                {/* Public routes wrapped in MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/blogs/:id" element={<BlogPostPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  
                  {/* Auth routes accessible only when not logged in */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                  </Route>
                </Route>
                
                {/* Protected routes wrapped in DashboardLayout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                  </Route>
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageTransition>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
