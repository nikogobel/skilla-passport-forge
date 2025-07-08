import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

export function BurgerMenu() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border hover:bg-accent transition-all duration-200"
      aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isSidebarOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );
}
