import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Trophy, TrendingUp, Award, Target } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function LearningProgress() {
  const { isSidebarOpen } = useSidebar();
  
  const courses = [
    {
      id: 1,
      title: "Advanced JavaScript Concepts",
      description: "Master async/await, closures, and advanced patterns",
      progress: 75,
      duration: "4 weeks",
      participants: 142,
      level: "Intermediate"
    },
    {
      id: 2,
      title: "React Performance Optimization",
      description: "Learn to build fast, efficient React applications",
      progress: 30,
      duration: "3 weeks",
      participants: 89,
      level: "Advanced"
    },
    {
      id: 3,
      title: "Database Design Fundamentals",
      description: "Understanding relational and NoSQL databases",
      progress: 0,
      duration: "6 weeks",
      participants: 203,
      level: "Beginner"
    }
  ];

  const recommendations = [
    "TypeScript for JavaScript Developers",
    "Cloud Architecture Patterns",
    "API Design Best Practices",
    "Machine Learning Basics"
  ];

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
        <h1 className="text-3xl font-bold text-foreground">Learning Progress</h1>
        <p className="text-muted-foreground mt-2">
          Track your courses, skill development, and learning achievements
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

      {/* Current Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="dashboard-tile">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <Badge variant={course.level === "Beginner" ? "secondary" : course.level === "Intermediate" ? "default" : "destructive"}>
                    {course.level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.participants}
                  </div>
                </div>

                <Button className="w-full" variant={course.progress > 0 ? "default" : "outline"}>
                  {course.progress > 0 ? "Continue" : "Start Course"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
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
        {/* Recommendations */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recommended for You</h2>
          <div className="grid gap-3">
            {recommendations.map((recommendation, index) => (
              <Card key={index} className="dashboard-tile p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium">{recommendation}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <Card className="dashboard-tile">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
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
      </div>

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
  );
}