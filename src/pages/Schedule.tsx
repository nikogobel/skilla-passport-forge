import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin, Plus } from "lucide-react";

export default function Schedule() {
  const upcomingEvents = [
    {
      id: 1,
      title: "React Workshop: State Management",
      date: "Today",
      time: "2:00 PM - 4:00 PM",
      type: "Workshop",
      location: "Virtual",
      attendees: 25,
      isLearning: true
    },
    {
      id: 2,
      title: "Team Standup",
      date: "Tomorrow",
      time: "9:00 AM - 9:30 AM",
      type: "Meeting",
      location: "Conference Room A",
      attendees: 8,
      isLearning: false
    },
    {
      id: 3,
      title: "TypeScript Masterclass",
      date: "Dec 12",
      time: "10:00 AM - 12:00 PM",
      type: "Course",
      location: "Virtual",
      attendees: 45,
      isLearning: true
    },
    {
      id: 4,
      title: "Code Review Session",
      date: "Dec 13",
      time: "3:00 PM - 4:00 PM",
      type: "Review",
      location: "Virtual",
      attendees: 6,
      isLearning: true
    },
    {
      id: 5,
      title: "Project Planning",
      date: "Dec 14",
      time: "1:00 PM - 2:30 PM",
      type: "Planning",
      location: "Conference Room B",
      attendees: 12,
      isLearning: false
    }
  ];

  const learningHours = {
    thisWeek: 8,
    target: 10,
    streak: 12
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground mt-2">
            Manage your learning sessions and meetings
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Learning Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="dashboard-tile">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-primary">{learningHours.thisWeek}h</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-tile">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Target</p>
                <p className="text-2xl font-bold text-accent">{learningHours.target}h</p>
              </div>
              <Calendar className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-tile">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Streak</p>
                <p className="text-2xl font-bold text-secondary">{learningHours.streak} days</p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">🔥</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="dashboard-tile">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className={`p-4 rounded-lg border transition-colors ${
                event.isLearning 
                  ? 'border-primary/20 bg-primary/5' 
                  : 'border-muted bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${event.isLearning ? 'text-primary' : 'text-foreground'}`}>
                      {event.title}
                    </h3>
                    <Badge 
                      variant={event.isLearning ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      {event.location === "Virtual" ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {event.location}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {event.attendees} attendees
                  </p>
                </div>
                
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}