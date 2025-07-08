import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Check, X } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "Neuer Kurs verfügbar",
      message: "JavaScript Advanced Patterns ist jetzt verfügbar",
      time: "vor 2 Min.",
      type: "course",
      read: false
    },
    {
      id: 2,
      title: "Skill-Bewertung abgeschlossen",
      message: "Ihre React-Bewertung wurde erfolgreich abgeschlossen",
      time: "vor 1 Std.",
      type: "achievement",
      read: false
    },
    {
      id: 3,
      title: "Erinnerung: Lernziel",
      message: "Sie haben heute noch 30 Minuten bis zu Ihrem Tagesziel",
      time: "vor 3 Std.",
      type: "reminder",
      read: true
    },
    {
      id: 4,
      title: "Neue Nachricht",
      message: "Sarah Johnson hat Ihnen eine Nachricht gesendet",
      time: "vor 5 Std.",
      type: "message",
      read: true
    },
    {
      id: 5,
      title: "Zertifikat erhalten",
      message: "Glückwunsch! Sie haben das TypeScript Grundlagen-Zertifikat erhalten",
      time: "gestern",
      type: "certificate",
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "course":
        return "📚";
      case "achievement":
        return "🏆";
      case "reminder":
        return "⏰";
      case "message":
        return "💬";
      case "certificate":
        return "🎓";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-blue-100 text-blue-800";
      case "achievement":
        return "bg-yellow-100 text-yellow-800";
      case "reminder":
        return "bg-orange-100 text-orange-800";
      case "message":
        return "bg-green-100 text-green-800";
      case "certificate":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Benachrichtigungen</h1>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Einstellungen
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Button variant="outline" size="sm">
            Alle als gelesen markieren
          </Button>
          <Button variant="outline" size="sm">
            Ungelesene anzeigen
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${!notification.read ? 'font-bold' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                        <Badge className={getNotificationColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine Benachrichtigungen</h3>
              <p className="text-muted-foreground">
                Sie haben alle Benachrichtigungen gelesen
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
