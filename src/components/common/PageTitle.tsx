
import type { LucideIcon } from 'lucide-react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children?: React.ReactNode; // For actions like buttons
}

export function PageTitle({ title, subtitle, icon: Icon, children }: PageTitleProps) {
  return (
    <div className="mb-6 md:mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {children && <div className="flex items-center gap-2 mt-2 sm:mt-0">{children}</div>}
      </div>
    </div>
  );
}
