import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              El Futuro Está Aquí.
              <br />
              <span className="text-primary">Empieza A Explorar Ahora.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
              Optimizamos procesos, gestionamos recursos, rastreamos datos de estudiantes, facilitamos la comunicación y mejoramos las tareas administrativas de manera efectiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/dashboard">
                  Empezar <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="#about">
                  Saber Más
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-[400px] lg:h-[500px] rounded-xl shadow-2xl overflow-hidden group">
            <Image
              src="https://placehold.co/800x600.png"
              alt="Ilustración de gestión escolar moderna"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-105"
              data-ai-hint="education technology"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
          </div>
        </section>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} Academia Nova. Todos los derechos reservados.
      </footer>
    </div>
  );
}
