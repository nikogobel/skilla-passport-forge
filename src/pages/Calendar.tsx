import { WeeklyCalendar } from "@/components/WeeklyCalendar";

export default function Calendar() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Kalender</h1>
        <p className="text-muted-foreground mb-8">
          Verwalten Sie Ihre Termine und Zeitpläne
        </p>
        <WeeklyCalendar />
      </div>
    </div>
  );
}
