import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, User, Clock } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Messages() {
  const { isSidebarOpen } = useSidebar();
  
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "Danke für den Tipp zum React Hook!",
      time: "vor 5 Min.",
      unread: 2,
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Entwicklerteam",
      lastMessage: "Neues Update für TypeScript verfügbar",
      time: "vor 1 Std.",
      unread: 0,
      avatar: "ET"
    },
    {
      id: 3,
      name: "Mike Chen",
      lastMessage: "Können wir uns morgen über das Projekt unterhalten?",
      time: "vor 3 Std.",
      unread: 1,
      avatar: "MC"
    }
  ];

  const selectedConversation = conversations[0];

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi! Ich habe eine Frage zu React Hooks.",
      time: "14:30",
      isOwn: false
    },
    {
      id: 2,
      sender: "Du",
      content: "Gerne! Was möchtest du wissen?",
      time: "14:32",
      isOwn: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "Wie verwende ich useEffect richtig für API-Aufrufe?",
      time: "14:35",
      isOwn: false
    },
    {
      id: 4,
      sender: "Du",
      content: "Du solltest useEffect mit einem leeren Dependency-Array verwenden: useEffect(() => { fetchData(); }, [])",
      time: "14:36",
      isOwn: true
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      content: "Danke für den Tipp zum React Hook!",
      time: "14:40",
      isOwn: false
    }
  ];

  return (
    <div className="p-6 h-screen">
      <div className="max-w-6xl mx-auto h-full">
        <div className={!isSidebarOpen ? "ml-16" : ""}>
          <h1 className="text-3xl font-bold mb-6">Nachrichten</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-5/6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Unterhaltungen
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      conversation.id === selectedConversation.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium truncate">{conversation.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                            {conversation.unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  {selectedConversation.avatar}
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nachricht schreiben..."
                    className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm"
                  />
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
