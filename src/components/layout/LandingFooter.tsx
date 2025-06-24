
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { School, Facebook, Twitter, Instagram } from 'lucide-react';

export function LandingFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-muted/20 py-8 text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-2 group">
              <School className="h-7 w-7 text-primary group-hover:animate-pulse" />
              <span className="text-lg font-semibold text-foreground">
                Sofía Educa
              </span>
            </Link>
            <p className="text-xs">
              {currentYear !== null ?
                `© ${currentYear} Sofía Educa. Todos los derechos reservados.` :
                `© Cargando año... Sofía Educa. Todos los derechos reservados.`
              }
            </p>
          </div>

          <div className="text-center text-xs">
            <p>Perú</p>
            <p>Zona Horaria: PET (GMT-5)</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary hover:scale-125 transform transition-all duration-300 ease-in-out">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary hover:scale-125 transform transition-all duration-300 ease-in-out">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary hover:scale-125 transform transition-all duration-300 ease-in-out">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
