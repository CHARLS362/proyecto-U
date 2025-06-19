
import Link from "next/link";
import { School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <School className="h-7 w-7 text-primary group-hover:animate-pulse" />
          <span className="text-xl font-semibold text-foreground">
            Gestión Escolar
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Inicio
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            Acerca de
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild>
            <Link href="/login">Acceso</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
