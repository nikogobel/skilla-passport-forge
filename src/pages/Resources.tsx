import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ExternalLink, Download, Search, Filter, Star } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Resources() {
  const { isSidebarOpen } = useSidebar();
  
  const resourceCategories = [
    { name: "All", count: 247 },
    { name: "Documentation", count: 89 },
    { name: "Tutorials", count: 76 },
    { name: "Videos", count: 45 },
    { name: "Books", count: 23 },
    { name: "Tools", count: 14 }
  ];

  const featuredResources = [
    {
      id: 1,
      title: "The Complete Guide to Modern JavaScript",
      description: "Comprehensive guide covering ES6+, async programming, and modern JavaScript patterns",
      type: "Documentation",
      rating: 4.8,
      bookmarks: 156,
      category: "JavaScript",
      isExternal: true,
      isFree: true
    },
    {
      id: 2,
      title: "React Performance Optimization Techniques",
      description: "In-depth tutorial series on optimizing React applications for better performance",
      type: "Tutorial",
      rating: 4.9,
      bookmarks: 203,
      category: "React",
      isExternal: false,
      isFree: true
    },
    {
      id: 3,
      title: "Database Design Fundamentals",
      description: "Essential concepts for designing scalable and efficient database schemas",
      type: "Video",
      rating: 4.7,
      bookmarks: 89,
      category: "Database",
      isExternal: true,
      isFree: false
    },
    {
      id: 4,
      title: "TypeScript Best Practices Handbook",
      description: "Official handbook covering TypeScript best practices and advanced patterns",
      type: "Book",
      rating: 4.9,
      bookmarks: 267,
      category: "TypeScript",
      isExternal: true,
      isFree: true
    }
  ];

  const recentlyAdded = [
    { title: "Node.js Security Guidelines", type: "Documentation", date: "2 days ago" },
    { title: "CSS Grid Layout Masterclass", type: "Tutorial", date: "4 days ago" },
    { title: "API Design Best Practices", type: "Video", date: "1 week ago" },
    { title: "DevOps Automation Tools", type: "Tools", date: "1 week ago" }
  ];

  const popularTopics = [
    "JavaScript", "React", "TypeScript", "Node.js", "Python", 
    "Database Design", "API Development", "DevOps", "Testing", "Security"
  ];

  return (
    <div className="p-6 space-y-6">
      <div className={`flex justify-between items-center ${!isSidebarOpen ? "ml-16" : ""}`}>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground mt-2">
            Curated learning materials and tools for skill development
          </p>
        </div>
        <Button>
          <BookOpen className="h-4 w-4 mr-2" />
          Suggest Resource
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="dashboard-tile">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search resources..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex gap-2 mt-4 flex-wrap">
            {resourceCategories.map((category, index) => (
              <Badge 
                key={index} 
                variant={index === 0 ? "default" : "outline"} 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Resources */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle>Featured Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredResources.map((resource) => (
                <div key={resource.id} className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium hover:text-primary transition-colors cursor-pointer">
                            {resource.title}
                          </h3>
                          {resource.isExternal && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                          {resource.isFree && <Badge variant="secondary" className="text-xs">Free</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                        <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          {resource.rating}
                        </div>
                        <span>{resource.bookmarks} bookmarks</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View Resource
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recently Added */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle>Recently Added</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentlyAdded.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Popular Topics */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle>Popular Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((topic, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="dashboard-tile">
            <CardHeader>
              <CardTitle>Your Resource Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Bookmarked</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Downloaded</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shared</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Contributed</span>
                <span className="font-semibold">3</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}