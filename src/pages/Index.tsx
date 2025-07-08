import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, LogOut, BookOpen, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardTile } from "@/components/DashboardTile";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { ProgressTracker } from "@/components/ProgressTracker";
import { ActivityFeed } from "@/components/ActivityFeed";
const Index = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();

  // Check if user has completed onboarding
  const {
    data: onboardingStatus
  } = useQuery({
    queryKey: ['onboarding-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data: passport
      } = await supabase.from('skill_passports').select('user_id').eq('user_id', user.id).maybeSingle();
      const {
        data: responses
      } = await supabase.from('onboarding_responses').select('id').eq('user_id', user.id);
      return {
        hasPassport: !!passport,
        responseCount: responses?.length || 0
      };
    },
    enabled: !!user?.id
  });

  // Check if user is admin
  const {
    data: isAdmin
  } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const {
        data
      } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
      return !!data;
    },
    enabled: !!user?.id
  });

  // Get user profile for personalized greeting
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id
  });

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen">
      {/* Main Dashboard Content */}
      <div className="min-h-screen">
        {/* Top Section with Centered Title and Logout */}
        <div className="relative px-6 py-8">
          {/* Logout Button - Top Right */}
          <div className="absolute top-6 right-6">
            <Button variant="ghost" size="icon" onClick={signOut} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Centered Title and Subtitle */}
          <div className="text-center pt-8 pb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-muted-foreground text-lg">
              Hope you have a beautiful and skillfull day ahead.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <main className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Progress Tracker - spans 1 column */}
            <div className="lg:col-span-1">
              <ProgressTracker />
            </div>
            
            {/* Weekly Calendar - spans 2 columns */}
            <div className="lg:col-span-2">
              <WeeklyCalendar />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Activity Feed */}
            <ActivityFeed />
            
            {/* Recent Messages */}
            <DashboardTile title="Recent Messages" subtitle="Latest messages from your peers">
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    user: "Sarah Johnson",
                    message: "Great work on the React project! The component structure is really clean.",
                    time: "5 min ago",
                    avatar: "SJ",
                    type: "feedback"
                  },
                  {
                    id: 2,
                    user: "Mike Chen",
                    message: "Anyone up for a TypeScript study session this afternoon?",
                    time: "12 min ago",
                    avatar: "MC",
                    type: "question"
                  },
                  {
                    id: 3,
                    user: "Emma Wilson",
                    message: "Just completed the Database Design workshop. Highly recommend!",
                    time: "1 hour ago",
                    avatar: "EW",
                    type: "achievement"
                  },
                  {
                    id: 4,
                    user: "Alex Rivera",
                    message: "Check out this cool JavaScript trick I learned today...",
                    time: "2 hours ago",
                    avatar: "AR",
                    type: "tip"
                  }
                ].map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                      {message.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm text-foreground truncate">{message.user}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          message.type === 'feedback' ? 'bg-green-100 text-green-800' :
                          message.type === 'question' ? 'bg-blue-100 text-blue-800' :
                          message.type === 'achievement' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {message.type === 'feedback' ? '💬 Feedback' :
                           message.type === 'question' ? '❓ Question' :
                           message.type === 'achievement' ? '🏆 Achievement' :
                           '💡 Tip'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/messages')}
                  >
                    View all messages →
                  </Button>
                </div>
              </div>
            </DashboardTile>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Quick Actions */}
            <DashboardTile title="Quick Actions" subtitle="Access your key features">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200" 
                  onClick={() => navigate('/onboarding')}
                >
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Assessment</span>
                  {onboardingStatus?.responseCount > 0 && !onboardingStatus?.hasPassport && (
                    <Badge variant="warning" className="text-xs">In Progress</Badge>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200" 
                  onClick={() => navigate('/passport')} 
                  disabled={!onboardingStatus?.hasPassport}
                >
                  <Award className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Passport</span>
                  {onboardingStatus?.hasPassport && (
                    <Badge className="text-xs bg-success text-success-foreground">Ready</Badge>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200" 
                  onClick={() => navigate('/passport')} 
                  disabled={!onboardingStatus?.hasPassport}
                >
                  <User className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Profile</span>
                </Button>
                
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200" 
                    onClick={() => navigate('/admin/onboarding-status')}
                  >
                    <Settings className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Admin</span>
                    <Badge variant="secondary" className="text-xs">Admin</Badge>
                  </Button>
                )}
              </div>
            </DashboardTile>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Index;