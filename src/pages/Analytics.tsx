import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Award, Target, BookOpen } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Analytics() {
  const { isSidebarOpen } = useSidebar();
  
  const skillProgress = [
    { skill: "JavaScript", current: 85, target: 90, trend: "+5%" },
    { skill: "React", current: 78, target: 85, trend: "+12%" },
    { skill: "TypeScript", current: 65, target: 80, trend: "+8%" },
    { skill: "Node.js", current: 72, target: 80, trend: "+3%" },
    { skill: "Database Design", current: 45, target: 70, trend: "+15%" }
  ];

  const learningMetrics = {
    totalHours: 156,
    monthlyGoal: 40,
    completedCourses: 8,
    inProgress: 3,
    certificationsEarned: 2,
    learningStreak: 28
  };

  const recentAchievements = [
    { title: "JavaScript Expert", date: "2 days ago", type: "Skill Milestone" },
    { title: "Fast Learner", date: "1 week ago", type: "Learning Badge" },
    { title: "Team Contributor", date: "2 weeks ago", type: "Collaboration" },
    { title: "Knowledge Sharer", date: "3 weeks ago", type: "Community" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className={!isSidebarOpen ? "ml-16" : ""}>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your learning progress and skill development
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="dashboard-tile">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Hours</p>
                <p className="text-2xl font-bold text-primary">{learningMetrics.totalHours}</p>
                <p className="text-xs text-muted-foreground">Goal: {learningMetrics.monthlyGoal}h/month</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-tile">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
                <p className="text-2xl font-bold text-accent">{learningMetrics.completedCourses}</p>
                <p className="text-xs text-muted-foreground">{learningMetrics.inProgress} in progress</p>
              </div>
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-tile">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Streak</p>
                <p className="text-2xl font-bold text-secondary">{learningMetrics.learningStreak}</p>
                <p className="text-xs text-muted-foreground">days consecutive</p>
              </div>
              <Target className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress */}
      <Card className="dashboard-tile">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Skill Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {skillProgress.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{skill.skill}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {skill.trend}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {skill.current}% / {skill.target}%
                  </span>
                </div>
              </div>
              <Progress value={skill.current} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Achievements */}
        <Card className="dashboard-tile">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.type}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {achievement.date}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learning Insights */}
        <Card className="dashboard-tile">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <p className="font-medium text-primary">Peak Learning Time</p>
              <p className="text-sm text-muted-foreground">You learn best between 2-4 PM</p>
            </div>
            
            <div className="p-3 rounded-lg bg-accent/10">
              <p className="font-medium text-accent">Preferred Format</p>
              <p className="text-sm text-muted-foreground">Interactive tutorials (65% completion rate)</p>
            </div>
            
            <div className="p-3 rounded-lg bg-secondary/10">
              <p className="font-medium text-secondary">Next Recommendation</p>
              <p className="text-sm text-muted-foreground">Focus on Advanced React patterns</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}