import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Brain,
  Layers,
  Target,
  Shield,
  Zap
} from "lucide-react";

interface WorkforceSkill {
  skillName: string;
  averageLevel: number;
  userCount: number;
  department: string;
  category: string;
  verified: boolean;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

// Mock future skills data - in real app this would come from AI analysis
const futureSkillsData = [
  { skill: "AI Prompt Engineering", currentGap: 85, priority: "Critical", category: "AI/ML" },
  { skill: "AI Agent Orchestration", currentGap: 90, priority: "Critical", category: "AI/ML" },
  { skill: "Task Decomposition", currentGap: 75, priority: "High", category: "Management" },
  { skill: "Human-AI Collaboration", currentGap: 70, priority: "High", category: "Communication" },
  { skill: "AI Ethics & Governance", currentGap: 80, priority: "High", category: "Strategy" },
  { skill: "Automated Testing", currentGap: 65, priority: "Medium", category: "Technical" },
  { skill: "No-Code/Low-Code Platforms", currentGap: 60, priority: "Medium", category: "Technical" },
  { skill: "Digital Process Design", currentGap: 55, priority: "Medium", category: "Operations" }
];

const departmentData = [
  { name: "Engineering", currentSkills: 85, futureReady: 65, employees: 45 },
  { name: "Marketing", currentSkills: 78, futureReady: 45, employees: 23 },
  { name: "Sales", currentSkills: 82, futureReady: 55, employees: 34 },
  { name: "Operations", currentSkills: 75, futureReady: 60, employees: 28 },
  { name: "Finance", currentSkills: 88, futureReady: 70, employees: 18 },
  { name: "HR", currentSkills: 72, futureReady: 50, employees: 12 }
];

export default function WorkforceAnalytics() {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Check if user is admin (for access control)
  const { data: isAdmin } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      return !!data;
    },
    enabled: !!user?.id
  });

  // Fetch workforce skills data
  const { data: workforceSkills, isLoading } = useQuery({
    queryKey: ['workforce-skills'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, business_unit');
      
      const { data: passports } = await supabase
        .from('skill_passports')
        .select('user_id, passport_json');

      // Process and aggregate skills data
      const skillsMap = new Map<string, WorkforceSkill>();
      
      passports?.forEach((passport) => {
        const profile = profiles?.find(p => p.user_id === passport.user_id);
        const passportData = passport.passport_json as any;
        const skills = passportData?.skills || {};
        
        Object.values(skills).forEach((categorySkills: any) => {
          if (Array.isArray(categorySkills)) {
            categorySkills.forEach((skill) => {
              const key = `${skill.name}-${profile?.business_unit || 'Unknown'}`;
              if (skillsMap.has(key)) {
                const existing = skillsMap.get(key)!;
                existing.averageLevel = (existing.averageLevel * existing.userCount + skill.level) / (existing.userCount + 1);
                existing.userCount += 1;
              } else {
                skillsMap.set(key, {
                  skillName: skill.name,
                  averageLevel: skill.level,
                  userCount: 1,
                  department: profile?.business_unit || 'Unknown',
                  category: skill.category || 'Other',
                  verified: skill.verified || false
                });
              }
            });
          }
        });
      });

      return Array.from(skillsMap.values());
    },
    enabled: !!user?.id && isAdmin
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page is only accessible to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Users className="h-8 w-8 mx-auto mb-4" />
          </div>
          <p>Loading workforce analytics...</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workforce Analytics</h1>
          <p className="text-muted-foreground">
            Analyze current skills and identify future capability gaps
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI-Powered Insights
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departmentData.reduce((sum, dept) => sum + dept.employees, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Avg Skill Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departmentData.reduce((sum, dept) => sum + dept.currentSkills, 0) / departmentData.length}/100
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Future Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(departmentData.reduce((sum, dept) => sum + dept.futureReady, 0) / departmentData.length)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {futureSkillsData.filter(skill => skill.priority === 'Critical').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Current Skills
          </TabsTrigger>
          <TabsTrigger value="future" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Future Needs
          </TabsTrigger>
          <TabsTrigger value="ai-impact" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Skill Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="currentSkills" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="employees"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Skills by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workforceSkills?.slice(0, 9).map((skill, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{skill.skillName}</h4>
                      {skill.verified && <Badge variant="secondary">Verified</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{skill.department}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Level: {skill.averageLevel.toFixed(1)}/10</span>
                      <span>{skill.userCount} users</span>
                    </div>
                    <Progress value={(skill.averageLevel / 10) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="future" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Future Skills Gap Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Skills that will be critical for future business success
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {futureSkillsData.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <Badge variant={getPriorityColor(skill.priority)}>
                          {skill.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{skill.category}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Gap:</span>
                        <Progress value={skill.currentGap} className="flex-1" />
                        <span className="text-sm font-medium">{skill.currentGap}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current vs Future Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="currentSkills" fill="#8884d8" name="Current Skills" />
                    <Bar dataKey="futureReady" fill="#82ca9d" name="Future Ready" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Skills Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Critical', value: futureSkillsData.filter(s => s.priority === 'Critical').length },
                        { name: 'High', value: futureSkillsData.filter(s => s.priority === 'High').length },
                        { name: 'Medium', value: futureSkillsData.filter(s => s.priority === 'Medium').length }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      <Cell fill="#ff7c7c" />
                      <Cell fill="#ffc658" />
                      <Cell fill="#82ca9d" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-impact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Disruption Impact Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                How AI will transform work and the skills needed to collaborate with AI systems
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">High-Impact AI Skills</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">AI Prompt Engineering</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Ability to craft effective instructions for AI systems
                      </p>
                      <Badge variant="destructive">Critical Gap: 85%</Badge>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Task Decomposition</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Breaking complex work into AI-manageable subtasks
                      </p>
                      <Badge variant="default">High Gap: 75%</Badge>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">AI Agent Orchestration</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Managing teams of specialized AI agents
                      </p>
                      <Badge variant="destructive">Critical Gap: 90%</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Transformation by Role</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Managers</h4>
                      <p className="text-sm text-muted-foreground">
                        Need to learn delegation to AI agents, similar to human team management
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Analysts</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus shifts to AI supervision and insight synthesis
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Operations</h4>
                      <p className="text-sm text-muted-foreground">
                        Process automation and AI workflow design become key
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Readiness Score by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept, index) => {
                  const aiReadiness = Math.max(20, dept.futureReady - 15);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={aiReadiness} className="w-24" />
                        <span className="text-sm font-medium">{aiReadiness}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}