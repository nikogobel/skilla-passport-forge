import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Calendar() {
  const { isSidebarOpen } = useSidebar();
  
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className={!isSidebarOpen ? "ml-16" : ""}>
          <h1 className="text-3xl font-bold mb-6">Kalender</h1>
          <p className="text-muted-foreground mb-8">
            Verwalten Sie Ihre Termine und Zeitpläne
          </p>
        </div>
        <WeeklyCalendar />
      </div>
    </div>
  );
}
