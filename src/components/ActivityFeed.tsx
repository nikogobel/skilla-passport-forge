import { BookOpen, Award, TrendingUp, User } from "lucide-react";
import { DashboardTile } from "./DashboardTile";

const activities = [
  {
    icon: Award,
    title: "Completed React Assessment",
    time: "2 hours ago",
    type: "achievement"
  },
  {
    icon: BookOpen,
    title: "Started TypeScript Course",
    time: "1 day ago",
    type: "learning"
  },
  {
    icon: TrendingUp,
    title: "Skill Level Increased",
    time: "2 days ago",
    type: "progress"
  },
  {
    icon: User,
    title: "Profile Updated",
    time: "3 days ago",
    type: "profile"
  }
];

export function ActivityFeed() {
  return (
    <DashboardTile title="Recent Activity" subtitle="Your latest achievements">
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:scale-[1.01]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'achievement' ? 'bg-warning/20 text-warning' :
                activity.type === 'learning' ? 'bg-primary/20 text-primary' :
                activity.type === 'progress' ? 'bg-success/20 text-success' :
                'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardTile>
  );
}