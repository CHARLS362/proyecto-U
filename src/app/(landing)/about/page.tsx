
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20 space-y-12">
      <section className="text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Acerca de <span className="text-primary">Nuestra Institución</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Somos Sofía Educa, una institución comprometida con la excelencia educativa y el desarrollo integral de nuestros estudiantes. Creemos en el poder de la educación para transformar vidas y construir un futuro mejor.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">Nuestra Misión</h2>
          <p className="text-muted-foreground mb-6 text-pretty">
            Nuestra misión es proporcionar un entorno de aprendizaje estimulante y de apoyo donde cada estudiante pueda alcanzar su máximo potencial académico, personal y social. Fomentamos la curiosidad intelectual, el pensamiento crítico y la creatividad, preparando a nuestros alumnos para ser ciudadanos responsables y líderes en un mundo en constante cambio.
          </p>
          <h2 className="text-3xl font-semibold text-foreground mb-4">Nuestra Visión</h2>
          <p className="text-muted-foreground text-pretty">
            Aspiramos a ser reconocidos como una institución educativa líder, innovadora y centrada en el estudiante, que inspira una pasión por el aprendizaje permanente y contribuye significativamente al progreso de nuestra comunidad y la sociedad en general.
          </p>
        </div>
        <div className="relative h-80 md:h-96 rounded-xl shadow-xl overflow-hidden group">
          <Image
            src="https://placehold.co/800x600.png"
            alt="Instalaciones de Sofía Educa"
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="school campus modern"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent"></div>
        </div>
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            En Qué <span className="text-primary">Nos Enfocamos</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Nuestros pilares fundamentales para una educación de calidad.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
            <CardHeader className="items-center text-center">
              <BookOpen className="h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-xl">Excelencia Académica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Programas rigurosos y actualizados para desafiar e inspirar a los estudiantes.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
            <CardHeader className="items-center text-center">
              <Users className="h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-xl">Desarrollo Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Fomentamos habilidades blandas, valores y el bienestar integral de cada alumno.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
            <CardHeader className="items-center text-center">
              <Target className="h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-xl">Preparación Futura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Equipamos a los estudiantes con las herramientas para enfrentar los desafíos del mañana.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
