
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out",
        isScrolled
          ? "border-b border-border bg-background/95 backdrop-blur-md shadow-lg"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <School className="h-7 w-7 text-primary group-hover:scale-110 group-hover:text-primary transition-all duration-300 ease-in-out" />
          <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            Sofía Educa
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            Inicio
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            Acerca de
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild className="hover:scale-105 transform transition-transform duration-300 ease-in-out">
            <Link href="/login">Acceso</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
