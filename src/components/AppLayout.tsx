import { useSidebar } from "@/contexts/SidebarContext";
import { BurgerMenu } from "@/components/BurgerMenu";
import { Sidebar } from "@/components/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isSidebarOpen } = useSidebar();
  
  return (
    <div className="min-h-screen w-full">
      <BurgerMenu />
      <Sidebar />
      <main className={`min-h-screen transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'ml-20' : 'ml-0'
      }`}>
        {children}
      </main>
    </div>
  );
}
