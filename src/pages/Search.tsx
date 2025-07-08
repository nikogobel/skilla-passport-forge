import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, Calendar, User } from "lucide-react";

export default function SearchPage() {
  const searchResults = [
    {
      id: 1,
      title: "JavaScript Grundlagen",
      type: "Kurs",
      rating: 4.8,
      duration: "6 Wochen",
      level: "Anfänger",
      description: "Lernen Sie die Grundlagen von JavaScript von Grund auf"
    },
    {
      id: 2,
      title: "React Development Workshop",
      type: "Workshop",
      rating: 4.9,
      duration: "2 Tage",
      level: "Fortgeschritten",
      description: "Intensive React-Entwicklung mit praktischen Projekten"
    },
    {
      id: 3,
      title: "TypeScript Masterclass",
      type: "Kurs",
      rating: 4.7,
      duration: "4 Wochen",
      level: "Intermediate",
      description: "Vertiefen Sie Ihr TypeScript-Wissen"
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Suche</h1>
        <p className="text-muted-foreground mb-8">
          Finden Sie Kurse, Workshops und Ressourcen
        </p>

        {/* Search Bar */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen Sie nach Kursen, Skills oder Themen..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Search Results */}
        <div className="grid gap-6">
          {searchResults.map((result) => (
            <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{result.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">{result.type}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{result.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{result.duration}</span>
                      </div>
                      <Badge variant="outline">{result.level}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
