import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { Edit, Mail, Calendar, MapPin, Award, BookOpen, Users, Clock } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const profileStats = {
    coursesCompleted: 12,
    totalLearningHours: 186,
    certificationsEarned: 4,
    mentoringSessions: 8,
    communityContributions: 23,
    learningStreak: 45
  };

  const skills = [
    { name: "JavaScript", level: 85, category: "Programming" },
    { name: "React", level: 78, category: "Frontend" },
    { name: "Node.js", level: 72, category: "Backend" },
    { name: "TypeScript", level: 65, category: "Programming" },
    { name: "Database Design", level: 58, category: "Data" },
    { name: "DevOps", level: 45, category: "Operations" }
  ];

  const achievements = [
    { title: "JavaScript Expert", description: "Mastered advanced JavaScript concepts", date: "Dec 2024", icon: "🏆" },
    { title: "Fast Learner", description: "Completed 5 courses in one month", date: "Nov 2024", icon: "⚡" },
    { title: "Community Helper", description: "Answered 50+ community questions", date: "Oct 2024", icon: "🤝" },
    { title: "Streak Master", description: "Maintained 30-day learning streak", date: "Sep 2024", icon: "🔥" }
  ];

  const recentActivity = [
    { action: "Completed", item: "React Performance Optimization", time: "2 hours ago" },
    { action: "Started", item: "TypeScript Advanced Patterns", time: "1 day ago" },
    { action: "Earned", item: "JavaScript Expert Badge", time: "3 days ago" },
    { action: "Joined", item: "Database Design Study Group", time: "1 week ago" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your learning profile and track your progress
          </p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="dashboard-tile">
            <CardContent className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user?.email}</h2>
              <p className="text-muted-foreground">Full Stack Developer</p>
              
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined December 2024
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  San Francisco, CA
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-primary">{profileStats.learningStreak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-accent">{profileStats.coursesCompleted}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Learning Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold">{profileStats.totalLearningHours}</p>
                  <p className="text-xs text-muted-foreground">Hours Learned</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{profileStats.certificationsEarned}</p>
                  <p className="text-xs text-muted-foreground">Certifications</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{profileStats.mentoringSessions}</p>
                  <p className="text-xs text-muted-foreground">Mentoring</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{profileStats.communityContributions}</p>
                  <p className="text-xs text-muted-foreground">Contributions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Skills Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="outline" className="text-xs">{skill.category}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{activity.action}</Badge>
                    <span className="text-sm">{activity.item}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}