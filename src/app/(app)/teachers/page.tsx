
import { Users, Filter, UserPlus, UserMinus, ListOrdered, Search as SearchIcon, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for teachers, placed here for simplicity
const mockTeachers = [
  {
    id: "T1749005331",
    name: "Arnold apd",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: "T1749005332",
    name: "Beatriz Castillo",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: "T1749005333",
    name: "Carlos Dávila",
    avatarUrl: "https://placehold.co/40x40.png",
  },
];

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight animate-fade-in">
        Maestro
      </h1>

      <Tabs defaultValue="mostrar" className="w-full animate-fade-in" style={{animationDelay: '100ms'}}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 sm:max-w-lg">
          <TabsTrigger value="agregar">Agregar profesor</TabsTrigger>
          <TabsTrigger value="mostrar">Mostrar profesores</TabsTrigger>
          <TabsTrigger value="historial">Los profesores se van</TabsTrigger>
        </TabsList>

        <TabsContent value="agregar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl">Profesores</CardTitle>
              </div>
              <Button variant="ghost" size="icon" aria-label="Filtrar profesores">
                <Filter className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border hover:border-primary/50"
                  // onClick={() => console.log("Agregar Maestro")}
                >
                  <div className="bg-green-100 dark:bg-green-500/20 p-5 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-500/30 transition-colors">
                    <UserPlus className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    Agregar Maestro
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border hover:border-destructive/50"
                  // onClick={() => console.log("Eliminar Maestro")}
                >
                  <div className="bg-red-100 dark:bg-red-500/20 p-5 rounded-xl group-hover:bg-red-200 dark:group-hover:bg-red-500/30 transition-colors">
                    <UserMinus className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-lg font-semibold text-foreground group-hover:text-destructive transition-colors">
                    Eliminar Maestro
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mostrar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ListOrdered className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">Lista de profesores</CardTitle>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input placeholder="Buscar" className="bg-card w-full sm:w-auto" />
                <Button variant="outline" size="icon" className="bg-green-600 hover:bg-green-700 text-white">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Identificación del profesor</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTeachers.map((teacher, index) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>{teacher.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={teacher.avatarUrl} alt={teacher.name} data-ai-hint="teacher avatar" />
                            <AvatarFallback>{teacher.name.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                          {teacher.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600">
                          <Edit className="mr-1 h-3 w-3" /> Editar
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-1 h-3 w-3" /> Borrar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {mockTeachers.length === 0 && (
                <p className="p-6 text-center text-muted-foreground">
                  No hay profesores para mostrar.
                </p>
              )}
            </CardContent>
            {mockTeachers.length > 0 && (
                <CardFooter className="flex justify-end items-center gap-2 pt-4">
                    <Button variant="outline" size="sm">anterior</Button>
                    <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary">1</Button>
                    <Button variant="outline" size="sm">próximo</Button>
                </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Los Profesores Que Se Van</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí se mostrará el historial o la gestión de los profesores que han dejado la institución. (Contenido pendiente)
              </p>
              {/* TODO: Implement history or management for departing teachers */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
