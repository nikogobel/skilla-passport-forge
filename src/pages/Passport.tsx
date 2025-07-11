import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, User, Building, Search, Filter, Trophy, Clock, Star, BarChart3, Target, Award } from "lucide-react";
import { SkillCard } from "@/components/SkillCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/contexts/SidebarContext";

interface Skill {
  name: string;
  proficiency: number;
  daysUntilDecay?: number;
  category?: string;
  verified?: boolean;
  lastUsed?: string;
  experience?: number;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  status: string;
}

interface Language {
  name: string;
  proficiency: string;
}

interface SkillPassport {
  passport_json: {
    skills?: Skill[];
    certifications?: Certification[];
    languages?: Language[];
    totalSkills?: number;
    verifiedSkills?: number;
    categories?: string[];
    profile?: {
      name: string;
      businessUnit: string;
      completedAt: string;
    };
  };
}

export default function Passport() {
  const { user } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");

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

  // Extract data safely with defensive checks
  const skills = Array.isArray(passport?.passport_json?.skills) ? passport.passport_json.skills : [];
  const certifications = Array.isArray(passport?.passport_json?.certifications) ? passport.passport_json.certifications : [];
  const languages = Array.isArray(passport?.passport_json?.languages) ? passport.passport_json.languages : [];
  const profileData = passport?.passport_json?.profile;

  // Extract categories from skills - moved before conditional returns
  const categories = useMemo(() => {
    if (!Array.isArray(skills) || skills.length === 0) return ["all"];
    const cats = [...new Set(skills.map(skill => skill.category).filter(Boolean))];
    return ["all", ...cats];
  }, [skills]);

  // Filter skills based on search and category - moved before conditional returns
  const filteredSkills = useMemo(() => {
    if (!Array.isArray(skills)) return [];
    return skills.filter(skill => {
      const matchesSearch = skill.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
      const matchesFilter = skillFilter === "all" || 
        (skillFilter === "verified" && skill.verified) ||
        (skillFilter === "high" && skill.proficiency >= 4) ||
        (skillFilter === "recent" && skill.daysUntilDecay && skill.daysUntilDecay > 180);
      
      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [skills, searchTerm, selectedCategory, skillFilter]);

  // Calculate statistics - moved before conditional returns
  const stats = useMemo(() => {
    if (!Array.isArray(skills)) {
      return { totalSkills: 0, verifiedSkills: 0, avgProficiency: "0", highProficiencySkills: 0 };
    }
    const totalSkills = skills.length;
    const verifiedSkills = skills.filter(s => s.verified).length;
    const avgProficiency = skills.length > 0 ? 
      (skills.reduce((acc, s) => acc + (s.proficiency || 0), 0) / skills.length).toFixed(1) : "0";
    const highProficiencySkills = skills.filter(s => s.proficiency >= 4).length;
    
    return { totalSkills, verifiedSkills, avgProficiency, highProficiencySkills };
  }, [skills]);

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


  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start gap-4 ${!isSidebarOpen ? "ml-16" : ""}`}>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Skill Passport
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              A comprehensive overview of your professional skills and expertise
            </p>
          </div>
          <Button onClick={handleDownloadJSON} className="flex items-center gap-2 px-6">
            <Download className="h-4 w-4" />
            Download JSON
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                  <p className="text-2xl font-bold">{stats.totalSkills}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified Skills</p>
                  <p className="text-2xl font-bold">{stats.verifiedSkills}</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Proficiency</p>
                  <p className="text-2xl font-bold">{stats.avgProficiency}/5</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expert Level</p>
                  <p className="text-2xl font-bold">{stats.highProficiencySkills}</p>
                </div>
                <Trophy className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Name</p>
                <p className="text-lg font-semibold">
                  {profileData?.name || profile?.full_name || "Not specified"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Business Unit
                </p>
                <p className="text-lg font-semibold">
                  {profileData?.businessUnit || profile?.business_unit || "Not specified"}
                </p>
              </div>
              {profileData?.completedAt && (
                <div className="space-y-2">
                  <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Assessment Date
                  </p>
                  <p className="text-lg font-semibold">
                    {new Date(profileData.completedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="languages" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Languages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                    >
                      All Categories
                    </Button>
                    {categories.slice(1).map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={skillFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSkillFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={skillFilter === "verified" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSkillFilter("verified")}
                    >
                      Verified
                    </Button>
                    <Button
                      variant={skillFilter === "high" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSkillFilter("high")}
                    >
                      Expert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Grid */}
            {filteredSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSkills.map((skill, index) => (
                  <div key={index} className="relative group">
                    <SkillCard
                      skillName={skill.name}
                      proficiency={skill.proficiency}
                      daysUntilDecay={skill.daysUntilDecay}
                    />
                    {skill.verified && (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600">
                        Verified
                      </Badge>
                    )}
                    {skill.category && (
                      <Badge variant="outline" className="absolute -bottom-2 left-2 text-xs">
                        {skill.category}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No skills found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="certifications">
            {certifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.map((cert, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        {cert.name}
                      </CardTitle>
                      <CardDescription>{cert.issuer}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">{cert.date}</p>
                        <Badge variant={cert.status === "Active" ? "default" : "secondary"}>
                          {cert.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No certifications available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="languages">
            {languages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((lang, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{lang.name}</p>
                        <Badge variant="outline">{lang.proficiency}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No language information available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}