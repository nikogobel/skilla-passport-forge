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
  const passportData = passport?.passport_json as any || {};
  const skillsData = passportData.skills || {};
  const allSkills = [
    ...(Array.isArray(skillsData.tools) ? skillsData.tools : []),
    ...(Array.isArray(skillsData.business) ? skillsData.business : []),
    ...(Array.isArray(skillsData.technical) ? skillsData.technical : []),
    ...(Array.isArray(skillsData.consulting) ? skillsData.consulting : [])
  ];
  const certifications = Array.isArray(passportData.certifications) ? passportData.certifications : [];
  const languages = Array.isArray(passportData.languages) ? passportData.languages : [];
  const education = Array.isArray(passportData.education) ? passportData.education : [];
  const experience = Array.isArray(passportData.experience) ? passportData.experience : [];
  const achievements = Array.isArray(passportData.achievements) ? passportData.achievements : [];
  const interests = Array.isArray(passportData.interests) ? passportData.interests : [];
  const personalInfo = passportData.personalInfo || {};
  const skillsOverview = passportData.skillsOverview || {};

  // Extract categories from skills - moved before conditional returns
  const categories = useMemo(() => {
    if (!Array.isArray(allSkills) || allSkills.length === 0) return ["all"];
    const cats = [...new Set(allSkills.map(skill => skill.category).filter(Boolean))];
    return ["all", ...cats];
  }, [allSkills]);

  // Filter skills based on search and category - moved before conditional returns
  const filteredSkills = useMemo(() => {
    if (!Array.isArray(allSkills)) return [];
    return allSkills.filter(skill => {
      const matchesSearch = skill.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
      const matchesFilter = skillFilter === "all" || 
        (skillFilter === "verified" && skill.verified) ||
        (skillFilter === "high" && skill.level >= 7) ||
        (skillFilter === "recent" && skill.experience);
      
      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [allSkills, searchTerm, selectedCategory, skillFilter]);

  // Calculate statistics - moved before conditional returns
  const stats = useMemo(() => {
    if (!Array.isArray(allSkills)) {
      return { totalSkills: 0, verifiedSkills: 0, avgProficiency: "0", highProficiencySkills: 0 };
    }
    const totalSkills = allSkills.length;
    const verifiedSkills = allSkills.filter(s => s.verified).length;
    const avgProficiency = allSkills.length > 0 ? 
      (allSkills.reduce((acc, s) => acc + (s.level || 0), 0) / allSkills.length).toFixed(1) : "0";
    const highProficiencySkills = allSkills.filter(s => s.level >= 7).length;
    
    return { totalSkills, verifiedSkills, avgProficiency, highProficiencySkills };
  }, [allSkills]);

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
                  {personalInfo?.name || profile?.full_name || "Not specified"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Location
                </p>
                <p className="text-lg font-semibold">
                  {personalInfo?.location || profile?.business_unit || "Not specified"}
                </p>
              </div>
              {personalInfo?.title && (
                <div className="space-y-2">
                  <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Title
                  </p>
                  <p className="text-lg font-semibold">
                    {personalInfo.title}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl">
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="languages" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Languages
            </TabsTrigger>
            <TabsTrigger value="more" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              More
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
                     <Card className="h-full">
                       <CardContent className="p-4">
                         <div className="flex justify-between items-start mb-2">
                           <h3 className="font-semibold text-sm">{skill.name}</h3>
                           <Badge variant="outline" className="text-xs">
                             {skill.level}/10
                           </Badge>
                         </div>
                         
                         <div className="space-y-2">
                           <div className="w-full bg-muted rounded-full h-2">
                             <div 
                               className="bg-primary h-2 rounded-full transition-all duration-300"
                               style={{ width: `${(skill.level / 10) * 100}%` }}
                             />
                           </div>
                           
                           <div className="flex flex-wrap gap-1">
                             {skill.category && (
                               <Badge variant="secondary" className="text-xs">
                                 {skill.category}
                               </Badge>
                             )}
                             {skill.verified && (
                               <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                                 Verified
                               </Badge>
                             )}
                           </div>
                           
                           {skill.experience && (
                             <p className="text-xs text-muted-foreground">
                               Experience: {skill.experience}
                             </p>
                           )}
                           
                           {skill.certifications && skill.certifications.length > 0 && (
                             <div className="space-y-1">
                               <p className="text-xs text-muted-foreground font-medium">Certifications:</p>
                               {skill.certifications.map((cert, certIndex) => (
                                 <Badge key={certIndex} variant="outline" className="text-xs mr-1">
                                   {cert}
                                 </Badge>
                               ))}
                             </div>
                           )}
                         </div>
                       </CardContent>
                     </Card>
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

          <TabsContent value="experience">
            {experience.length > 0 ? (
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{exp.position}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                        </div>
                        <Badge variant="outline">{exp.duration}</Badge>
                      </CardTitle>
                      <CardDescription>{exp.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No experience information available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="education">
            {education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{edu.degree}</h3>
                          <p className="text-primary font-medium">{edu.institution}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{edu.year}</Badge>
                          {edu.gpa && <p className="text-sm text-muted-foreground mt-1">GPA: {edu.gpa}</p>}
                        </div>
                      </CardTitle>
                      {edu.specialization && (
                        <CardDescription>Specialization: {edu.specialization}</CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No education information available</p>
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
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">{lang.language}</p>
                        <Badge variant="outline">{lang.level}</Badge>
                      </div>
                      {lang.verified && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                          Verified
                        </Badge>
                      )}
                      {lang.certifications && lang.certifications.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Certifications:</p>
                          {lang.certifications.map((cert, certIndex) => (
                            <Badge key={certIndex} variant="secondary" className="text-xs mr-1 mt-1">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      )}
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

          <TabsContent value="more" className="space-y-6">
            {/* Interests */}
            {interests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills Overview */}
            {skillsOverview && Object.keys(skillsOverview).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{skillsOverview.totalSkills || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Skills</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">{skillsOverview.verifiedSkills || 0}</p>
                      <p className="text-sm text-muted-foreground">Verified</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">{skillsOverview.averageLevel || 0}</p>
                      <p className="text-sm text-muted-foreground">Avg Level</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-500">{skillsOverview.experienceYears || 0}</p>
                      <p className="text-sm text-muted-foreground">Years Exp.</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-500">{skillsOverview.certificationsCount || 0}</p>
                      <p className="text-sm text-muted-foreground">Certifications</p>
                    </div>
                    {skillsOverview.topCategories && (
                      <div className="col-span-full">
                        <p className="text-sm font-medium mb-2">Top Categories:</p>
                        <div className="flex flex-wrap gap-1">
                          {skillsOverview.topCategories.map((category, index) => (
                            <Badge key={index} variant="outline">{category}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}