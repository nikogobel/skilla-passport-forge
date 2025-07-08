import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Users, Heart, Share2, BookOpen, Lightbulb } from "lucide-react";

export default function Community() {
  const discussions = [
    {
      id: 1,
      title: "Best practices for React state management in 2024",
      author: "Sarah Johnson",
      avatar: "SJ",
      replies: 23,
      likes: 45,
      category: "React",
      timeAgo: "2 hours ago",
      isHot: true
    },
    {
      id: 2,
      title: "How to optimize PostgreSQL queries for better performance",
      author: "Mike Chen",
      avatar: "MC",
      replies: 12,
      likes: 28,
      category: "Database",
      timeAgo: "4 hours ago",
      isHot: false
    },
    {
      id: 3,
      title: "TypeScript vs JavaScript: When to make the switch?",
      author: "Alex Rivera",
      avatar: "AR",
      replies: 67,
      likes: 89,
      category: "JavaScript",
      timeAgo: "1 day ago",
      isHot: true
    },
    {
      id: 4,
      title: "Building accessible web components - tips and tricks",
      author: "Emma Davis",
      avatar: "ED",
      replies: 15,
      likes: 32,
      category: "Accessibility",
      timeAgo: "2 days ago",
      isHot: false
    }
  ];

  const studyGroups = [
    {
      name: "React Advanced Patterns",
      members: 24,
      nextSession: "Tomorrow 2 PM",
      topic: "Custom Hooks",
      level: "Advanced"
    },
    {
      name: "JavaScript Fundamentals",
      members: 67,
      nextSession: "Friday 10 AM",
      topic: "Async/Await",
      level: "Intermediate"
    },
    {
      name: "Database Design Workshop",
      members: 18,
      nextSession: "Monday 3 PM",
      topic: "Normalization",
      level: "Beginner"
    }
  ];

  const mentors = [
    { name: "David Kim", expertise: "Full Stack Development", rating: 4.9, sessions: 127 },
    { name: "Lisa Wang", expertise: "Frontend Architecture", rating: 4.8, sessions: 89 },
    { name: "Carlos Rodriguez", expertise: "DevOps & Cloud", rating: 4.9, sessions: 156 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground mt-2">
            Connect, learn, and share knowledge with fellow learners
          </p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Start Discussion
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Discussions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Discussions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{discussion.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium hover:text-primary transition-colors">
                          {discussion.title}
                        </h3>
                        {discussion.isHot && (
                          <Badge variant="destructive" className="text-xs ml-2">Hot</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>by {discussion.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                        <span>{discussion.timeAgo}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {discussion.replies} replies
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {discussion.likes} likes
                        </div>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Study Groups */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyGroups.map((group, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{group.name}</h3>
                        <Badge variant={group.level === "Beginner" ? "secondary" : group.level === "Intermediate" ? "default" : "destructive"}>
                          {group.level}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{group.members} members</p>
                        <p>Next: {group.nextSession} - {group.topic}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Join Group
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Mentors */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Top Mentors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentors.map((mentor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{mentor.name}</p>
                    <p className="text-xs text-muted-foreground">{mentor.expertise}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>★ {mentor.rating}</span>
                      <span>•</span>
                      <span>{mentor.sessions} sessions</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Share a Resource
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask a Question
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Find Study Buddy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lightbulb className="h-4 w-4 mr-2" />
                Book Mentoring
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}