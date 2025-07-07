import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, User, Building } from "lucide-react";
import { SkillCard } from "@/components/SkillCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface SkillPassport {
  passport_json: {
    skills?: Array<{
      name: string;
      proficiency: number;
      daysUntilDecay?: number;
    }>;
    profile?: {
      name: string;
      businessUnit: string;
      completedAt: string;
    };
  };
}

export default function Passport() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch skill passport
  const { data: passport, isLoading } = useQuery({
    queryKey: ['skill-passport', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('skill_passports')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as SkillPassport | null;
    },
    enabled: !!user?.id,
  });

  const handleDownloadJSON = () => {
    if (!passport?.passport_json) {
      toast({
        title: "No data to download",
        description: "Complete your onboarding first.",
        variant: "destructive",
      });
      return;
    }

    const dataStr = JSON.stringify(passport.passport_json, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `skill-passport-${profile?.full_name?.replace(/\s+/g, '-') || 'user'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your skill passport JSON has been downloaded.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>No Skill Passport Found</CardTitle>
              <CardDescription>
                Complete your onboarding to generate your skill passport.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/onboarding'}>
                Start Onboarding
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const skills = passport.passport_json.skills || [];
  const profileData = passport.passport_json.profile;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Your Skill Passport</h1>
            <p className="text-muted-foreground mt-2">
              A comprehensive overview of your professional skills and expertise
            </p>
          </div>
          <Button onClick={handleDownloadJSON} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download JSON
          </Button>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name</p>
                <p className="text-muted-foreground">
                  {profileData?.name || profile?.full_name || "Not specified"}
                </p>
              </div>
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Business Unit
                </p>
                <p className="text-muted-foreground">
                  {profileData?.businessUnit || profile?.business_unit || "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Skills & Competencies</h2>
          {skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <SkillCard
                  key={index}
                  skillName={skill.name}
                  proficiency={skill.proficiency}
                  daysUntilDecay={skill.daysUntilDecay}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No skills data available. Your skill passport will be generated after completing the onboarding process.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completion Status */}
        {profileData?.completedAt && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                Assessment completed on {new Date(profileData.completedAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}