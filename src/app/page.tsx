
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ListChecks, Star, Target, TrendingUp, UserCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LandingShell } from "@/components/layout/LandingShell";

const features = [
  {
    icon: ListChecks,
    title: "Características",
    description: "Una trayectoria académica sólida suele ser esencial para asegurar la estabilidad financiera, con pocas excepciones. La escuela brinda oportunidades para forjar nuevas amistades, y algunos compañeros se convierten en compañeros para toda la vida.",
    borderColorClass: "bg-primary",
  },
  {
    icon: Star,
    title: "Logro",
    description: "En los premios escolares, recibí reconocimiento por la excelencia académica, la tutoría entre pares, el liderazgo ambiental, la destreza en el debate y el talento musical.",
    borderColorClass: "bg-primary",
  },
  {
    icon: Target,
    title: "Objetivos",
    description: "Crear un entorno donde prosperen la curiosidad, la colaboración y la innovación, fomentando la formación de los líderes resilientes del mañana. Fomentar la sed de conocimiento.",
    borderColorClass: "bg-primary",
  },
  {
    icon: TrendingUp,
    title: "Excelencia",
    description: "La excelencia es la culminación de la dedicación, la perseverancia y el compromiso inquebrantable con la mejora continua, estableciendo el estándar de grandeza en todos los esfuerzos.",
    borderColorClass: "bg-accent",
  },
  {
    icon: UserCheck,
    title: "Empoderamiento",
    description: "El empoderamiento es la clave que libera el potencial ilimitado de las personas, permitiéndoles aprovechar sus fortalezas y superar los desafíos con confianza.",
    borderColorClass: "bg-accent",
  },
  {
    icon: Sparkles,
    title: "Creatividad",
    description: "La creatividad es la fuerza vibrante que da vida a las ideas, iluminando nuevos caminos y dando forma al mundo con innovación e imaginación ilimitadas.",
    borderColorClass: "bg-accent",
  },
];

const carouselImages = [
  { src: "https://placehold.co/400x500.png", alt: "Vista del campus escolar", hint: "campus building" },
  { src: "https://placehold.co/400x500.png", alt: "Estudiantes colaborando en un proyecto", hint: "students collaborating" },
  { src: "https://placehold.co/400x500.png", alt: "Aula moderna con tecnología", hint: "modern classroom" },
  { src: "https://placehold.co/400x500.png", alt: "Evento deportivo escolar", hint: "school sports" },
];

export default function RootPage() {
  return (
    <LandingShell>
      <section id="home" className="py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            El Futuro Está Aquí.
            <br />
            <span className="text-primary">Empieza A Explorar Ahora.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
            Optimizamos procesos, gestionamos recursos, rastreamos datos de estudiantes, facilitamos la comunicación y mejoramos las tareas administrativas de manera efectiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out">
              <Link href="/dashboard">
                Empezar <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out">
              <Link href="/about">
                Saber Más
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative h-64 md:h-[400px] lg:h-[500px] rounded-xl shadow-2xl overflow-hidden group animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Image
            src="https://placehold.co/800x600.png"
            alt="Ilustración de gestión escolar moderna"
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="education students"
            priority
          />
           <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
        </div>
      </section>

      <section id="about-features" className="py-12 md:py-20">
        <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Descubre lo que <span className="text-primary">Nos Hace Únicos</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Nuestros principios y características fundamentales que guían nuestra misión educativa.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group animate-fade-in flex flex-col"
              style={{ animationDelay: `${index * 100 + 300}ms` }}
            >
              <div className={`h-1.5 rounded-t-lg ${feature.borderColorClass}`}></div>
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className={`h-7 w-7 ${feature.borderColorClass === 'bg-primary' ? 'text-primary' : 'text-accent'} group-hover:scale-125 group-hover:rotate-[-10deg] transition-all duration-300 ease-in-out`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="gallery" className="py-12 md:py-20">
        <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Nuestra Institución en <span className="text-primary">Imágenes</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Un vistazo a nuestras instalaciones y la vida estudiantil.
          </p>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-full">
                  <Card className="overflow-hidden shadow-xl">
                    <CardContent className="p-0">
                      <div className="relative h-[500px] overflow-hidden group">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint={image.hint}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14 sm:ml-10" />
            <CarouselNext className="mr-14 sm:mr-10" />
          </Carousel>
        </div>
      </section>
    </LandingShell>
  );
}
