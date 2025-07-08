import { TrendingUp, Trophy, Target } from "lucide-react";
import { DashboardTile } from "./DashboardTile";

export function ProgressTracker() {
  const progressData = {
    skillsCompleted: 12,
    totalSkills: 20,
    weeklyGoal: 85,
    streak: 7
  };

  const completionPercentage = (progressData.skillsCompleted / progressData.totalSkills) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = (completionPercentage / 100) * circumference;

  return (
    <DashboardTile title="Learning Progress" subtitle="Your skill development journey">
      <div className="flex items-center justify-between">
        <div className="relative">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - strokeDasharray}
              className="progress-ring"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{Math.round(completionPercentage)}%</span>
          </div>
        </div>
        
        <div className="flex-1 ml-6 space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Skills:</span>
            <span className="text-sm font-medium">{progressData.skillsCompleted}/{progressData.totalSkills}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">Weekly Goal:</span>
            <span className="text-sm font-medium">{progressData.weeklyGoal}%</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-sm text-muted-foreground">Streak:</span>
            <span className="text-sm font-medium">{progressData.streak} days</span>
          </div>
        </div>
      </div>
    </DashboardTile>
  );
}