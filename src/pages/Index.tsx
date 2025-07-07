import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, Award, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Check if user has completed onboarding
  const { data: onboardingStatus } = useQuery({
    queryKey: ['onboarding-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: passport } = await supabase
        .from('skill_passports')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const { data: responses } = await supabase
        .from('onboarding_responses')
        .select('id')
        .eq('user_id', user.id);
      
      return {
        hasPassport: !!passport,
        responseCount: responses?.length || 0,
      };
    },
    enabled: !!user?.id,
  });

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
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Award className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Skilla</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Your Professional Skill Passport</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build, track, and showcase your professional skills with our comprehensive assessment platform.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Onboarding Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Skill Assessment
              </CardTitle>
              <CardDescription>
                Complete your skills evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingStatus?.hasPassport ? (
                  <Badge className="bg-success text-success-foreground">Complete</Badge>
                ) : onboardingStatus?.responseCount > 0 ? (
                  <Badge variant="warning">In Progress</Badge>
                ) : (
                  <Badge variant="outline">Not Started</Badge>
                )}
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/onboarding')}
                  variant={onboardingStatus?.hasPassport ? "outline" : "default"}
                >
                  {onboardingStatus?.hasPassport ? "Review Assessment" : "Start Assessment"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Passport Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skill Passport
              </CardTitle>
              <CardDescription>
                View your professional skills dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingStatus?.hasPassport ? (
                  <Badge className="bg-success text-success-foreground">Available</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/passport')}
                  disabled={!onboardingStatus?.hasPassport}
                >
                  View Passport
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Card */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription>
                  Monitor team onboarding progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge variant="secondary">Admin Access</Badge>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate('/admin/onboarding-status')}
                  >
                    View Team Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and helpful resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/onboarding')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Assessment</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/passport')}
                disabled={!onboardingStatus?.hasPassport}
              >
                <Award className="h-6 w-6" />
                <span>Passport</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/passport')}
                disabled={!onboardingStatus?.hasPassport}
              >
                <User className="h-6 w-6" />
                <span>Profile</span>
              </Button>
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => navigate('/admin/onboarding-status')}
                >
                  <Settings className="h-6 w-6" />
                  <span>Admin</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
