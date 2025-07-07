import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SkillCardProps {
  skillName: string;
  proficiency: number; // 0-5
  daysUntilDecay?: number;
}

export function SkillCard({ skillName, proficiency, daysUntilDecay }: SkillCardProps) {
  const proficiencyPercentage = (proficiency / 5) * 100;
  
  const getDecayBadgeColor = (days?: number) => {
    if (!days) return "secondary";
    if (days <= 30) return "destructive";
    if (days <= 90) return "warning";
    return "success";
  };

  const getProficiencyColor = (level: number) => {
    if (level >= 4) return "hsl(var(--success))";
    if (level >= 3) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{skillName}</span>
          {daysUntilDecay && (
            <Badge variant={getDecayBadgeColor(daysUntilDecay)}>
              {daysUntilDecay}d
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Proficiency</span>
            <span>{proficiency}/5</span>
          </div>
          <Progress 
            value={proficiencyPercentage} 
            className="w-full"
            style={{
              "--progress-background": getProficiencyColor(proficiency)
            } as React.CSSProperties}
          />
        </div>
      </CardContent>
    </Card>
  );
}