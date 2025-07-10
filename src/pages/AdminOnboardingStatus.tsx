import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/contexts/SidebarContext";

interface UserStatus {
  user_id: string;
  full_name: string;
  business_unit: string;
  completion_percentage: number;
  last_updated: string;
  total_questions: number;
  answered_questions: number;
}

export default function AdminOnboardingStatus() {
  const { user } = useAuth();
  const { isSidebarOpen } = useSidebar();

  // Check if user is admin
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id,
  });

  // Fetch onboarding status for all users
  const { data: userStatuses = [], isLoading } = useQuery({
    queryKey: ['admin-onboarding-status'],
    queryFn: async () => {
      // Get total number of questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('onboarding_questions')
        .select('id');
      
      if (questionsError) throw questionsError;
      const totalQuestions = questionsData.length;

      // Get all profiles with their response counts
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          full_name,
          business_unit,
          updated_at,
          onboarding_responses:onboarding_responses(count)
        `);
      
      if (error) throw error;

      return data.map((profile: any) => {
        const answeredQuestions = profile.onboarding_responses[0]?.count || 0;
        const completionPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

        return {
          user_id: profile.user_id,
          full_name: profile.full_name || 'Unknown User',
          business_unit: profile.business_unit || 'Not specified',
          completion_percentage: Math.round(completionPercentage),
          last_updated: profile.updated_at,
          total_questions: totalQuestions,
          answered_questions: answeredQuestions,
        } as UserStatus;
      });
    },
    enabled: !!isAdmin,
  });

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Access Denied
              </CardTitle>
              <CardDescription>
                You don't have permission to view this page. Admin access required.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const getCompletionBadge = (percentage: number) => {
    if (percentage === 100) return <Badge className="bg-success text-success-foreground">Complete</Badge>;
    if (percentage >= 50) return <Badge variant="warning">In Progress</Badge>;
    if (percentage > 0) return <Badge variant="secondary">Started</Badge>;
    return <Badge variant="outline">Not Started</Badge>;
  };

  const totalUsers = userStatuses.length;
  const completedUsers = userStatuses.filter(u => u.completion_percentage === 100).length;
  const inProgressUsers = userStatuses.filter(u => u.completion_percentage > 0 && u.completion_percentage < 100).length;
  const notStartedUsers = userStatuses.filter(u => u.completion_percentage === 0).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={!isSidebarOpen ? "ml-16" : ""}>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Onboarding Status Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor user progress through the skill assessment onboarding process
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{completedUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{inProgressUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{notStartedUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* User Status Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Onboarding Status</CardTitle>
            <CardDescription>
              Detailed view of each user's progress through the onboarding process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Business Unit</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStatuses.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.business_unit}</TableCell>
                    <TableCell>
                      {getCompletionBadge(user.completion_percentage)}
                    </TableCell>
                    <TableCell className="w-48">
                      <div className="space-y-1">
                        <Progress value={user.completion_percentage} className="w-full" />
                        <div className="text-xs text-muted-foreground">
                          {user.answered_questions} of {user.total_questions} questions
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.last_updated).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}