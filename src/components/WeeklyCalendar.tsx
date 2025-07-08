import { Calendar, Clock } from "lucide-react";
import { DashboardTile } from "./DashboardTile";

const mockEvents = [
  { time: "09:00", title: "React Advanced Patterns", type: "learning", day: "Mon" },
  { time: "10:30", title: "Team Standup", type: "meeting", day: "Mon" },
  { time: "14:00", title: "TypeScript Deep Dive", type: "learning", day: "Tue" },
  { time: "15:30", title: "Code Review", type: "meeting", day: "Tue" },
  { time: "11:00", title: "Database Design Workshop", type: "learning", day: "Wed" },
  { time: "16:00", title: "Client Call", type: "meeting", day: "Wed" },
  { time: "09:30", title: "AI & Machine Learning", type: "learning", day: "Thu" },
  { time: "13:00", title: "Project Planning", type: "meeting", day: "Thu" },
  { time: "10:00", title: "Leadership Skills", type: "learning", day: "Fri" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function WeeklyCalendar() {
  return (
    <DashboardTile title="This Week" subtitle="Upcoming knowledge sessions">
      <div className="space-y-3">
        {days.map(day => {
          const dayEvents = mockEvents.filter(event => event.day === day);
          return (
            <div key={day} className="flex items-start space-x-3">
              <div className="w-10 text-xs font-medium text-muted-foreground flex-shrink-0">
                {day}
              </div>
              <div className="flex-1 space-y-1">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                        event.type === 'learning' 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/50 opacity-60'
                      }`}
                    >
                      <Clock className={`w-3 h-3 ${event.type === 'learning' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-xs ${event.type === 'learning' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {event.time}
                      </span>
                      <span className={`text-xs ${event.type === 'learning' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {event.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground py-2">No events</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardTile>
  );
}