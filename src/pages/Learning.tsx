import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Trophy } from "lucide-react";

export default function Learning() {
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Learning Center</h1>
        <p className="text-muted-foreground mt-2">
          Explore courses, track progress, and enhance your skills
        </p>
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

      {/* Recommendations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recommended for You</h2>
        <div className="grid gap-3 md:grid-cols-2">
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

      {/* Achievements */}
      <Card className="dashboard-tile">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Completed "JavaScript Fundamentals"</span>
              <Badge variant="secondary">2 days ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Earned "Fast Learner" badge</span>
              <Badge variant="secondary">1 week ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Reached 50-day learning streak</span>
              <Badge variant="secondary">2 weeks ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}