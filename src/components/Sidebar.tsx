import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Award, 
  Settings, 
  User, 
  Calendar,
  BarChart3,
  MessageSquare,
  Search,
  Bell,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "@/contexts/SidebarContext";

const navigationItems = [
  { icon: Home, path: "/", label: "Home" },
  { icon: BookOpen, path: "/learning-progress", label: "Learning Progress" },
  { icon: BarChart3, path: "/onboarding", label: "Assessment" },
  { icon: Award, path: "/passport", label: "Passport" },
  { icon: Calendar, path: "/calendar", label: "Calendar" },
  { icon: MessageSquare, path: "/messages", label: "Messages" },
  { icon: Search, path: "/search", label: "Search" },
  { icon: Bell, path: "/notifications", label: "Notifications" },
  { icon: User, path: "/profile", label: "Profile" },
  { icon: Settings, path: "/settings", label: "Settings" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      return !!data;
    },
    enabled: !!user?.id
  });

  const handleNavigation = (path: string) => {
    // Navigate to all available routes
    navigate(path);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-40 ${
        isSidebarOpen 
          ? 'translate-x-0 w-20 bg-sidebar-background border-r border-sidebar-border' 
          : '-translate-x-full w-0 opacity-0'
      } flex flex-col items-center overflow-hidden`}
    >
      {/* Close Button integrated in sidebar */}
      <div className="h-16 flex items-center justify-center">
        <div
          className="sidebar-item"
          onClick={toggleSidebar}
          title="Close sidebar"
        >
          <X className="w-5 h-5" />
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="flex flex-col space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <div
              key={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </div>
          );
        })}

        {/* Admin Link */}
        {isAdmin && (
          <div
            className={`sidebar-item ${location.pathname === "/admin/onboarding-status" ? 'active' : ''}`}
            onClick={() => handleNavigation("/admin/onboarding-status")}
            title="Admin Dashboard"
          >
            <Settings className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}