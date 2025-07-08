import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardTileProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function DashboardTile({ children, className, title, subtitle }: DashboardTileProps) {
  return (
    <div className={cn("dashboard-tile p-6", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}