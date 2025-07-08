import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SidebarProvider as CustomSidebarProvider } from "@/contexts/SidebarContext";
import { BurgerMenu } from "@/components/BurgerMenu";
import { Sidebar } from "@/components/Sidebar";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Passport from "./pages/Passport";
import AdminOnboardingStatus from "./pages/AdminOnboardingStatus";
import NotFound from "./pages/NotFound";
import Learning from "./pages/Learning";
import Schedule from "./pages/Schedule";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import SearchPage from "./pages/Search";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <CustomSidebarProvider>
                  <SidebarProvider>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/passport" element={<Passport />} />
                        <Route path="/learning" element={<Learning />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/admin/onboarding-status" element={<AdminOnboardingStatus />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </SidebarProvider>
                </CustomSidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
