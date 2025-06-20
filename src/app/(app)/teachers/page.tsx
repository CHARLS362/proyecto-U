
import { Users, Filter, UserPlus, ListOrdered, Search as SearchIcon, Edit, Trash2, UsersRound, Hourglass, FileText as NoLeavesIcon, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SimpleMetricCard } from "@/components/dashboard/SimpleMetricCard";

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

      <Tabs defaultValue="agregar" className="w-full animate-fade-in" style={{animationDelay: '100ms'}}>
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
                  className="h-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border hover:border-purple-500/50"
                >
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-5 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 transition-colors">
                    <UserCog className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-lg font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                    Gestionar Estado
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
              <CardDescription>Gestión de licencias y hojas de los profesores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SimpleMetricCard
                  title="Total de profesores"
                  value="1"
                  icon={UsersRound}
                  iconBgClass="bg-blue-100 dark:bg-blue-500/30"
                  iconColorClass="text-blue-500 dark:text-blue-300"
                />
                <SimpleMetricCard
                  title="Licencias Aprobadas"
                  value="0"
                  icon={Hourglass}
                  iconBgClass="bg-green-100 dark:bg-green-500/30"
                  iconColorClass="text-green-500 dark:text-green-300"
                />
                <SimpleMetricCard
                  title="Hojas pendientes"
                  value="0"
                  icon={Hourglass}
                  iconBgClass="bg-yellow-100 dark:bg-yellow-500/30"
                  iconColorClass="text-yellow-500 dark:text-yellow-300"
                />
                <SimpleMetricCard
                  title="Hojas rechazadas"
                  value="0"
                  icon={Hourglass}
                  iconBgClass="bg-red-100 dark:bg-red-500/30"
                  iconColorClass="text-red-500 dark:text-red-300"
                />
              </section>

              <Tabs defaultValue="pendientes" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:max-w-md bg-background p-1 rounded-md">
                  <TabsTrigger 
                    value="pendientes" 
                    className="rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    Hojas pendientes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="aprobadas"
                    className="rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    Licencias Aprobadas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rechazadas"
                    className="rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    Hojas rechazadas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pendientes" className="mt-6">
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 pb-2 border-b font-medium text-sm text-muted-foreground items-center">
                      <div className="md:col-span-1">NOMBRE DEL PERSONAL</div>
                      <div className="md:col-span-1">TIPO DE LICENCIA</div>
                      <div className="md:col-span-1">FECHA DE SOLICITUD</div>
                      <div className="md:col-span-1">RANGO DE FECHAS</div>
                      <div className="md:col-span-1 text-right">ACCIÓN</div>
                    </div>
                    <div className="text-center py-12">
                      <NoLeavesIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                      <p className="mt-4 text-lg font-medium text-muted-foreground">Sin hojas</p>
                      <p className="text-sm text-muted-foreground">No hay hojas pendientes para mostrar.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="aprobadas" className="mt-6">
                   <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 pb-2 border-b font-medium text-sm text-muted-foreground items-center">
                      <div className="md:col-span-1">NOMBRE DEL PERSONAL</div>
                      <div className="md:col-span-1">TIPO DE LICENCIA</div>
                      <div className="md:col-span-1">FECHA DE SOLICITUD</div>
                      <div className="md:col-span-1">RANGO DE FECHAS</div>
                      <div className="md:col-span-1 text-right">ACCIÓN</div>
                    </div>
                    <div className="text-center py-12">
                      <NoLeavesIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                      <p className="mt-4 text-lg font-medium text-muted-foreground">Sin hojas</p>
                      <p className="text-sm text-muted-foreground">No hay licencias aprobadas para mostrar.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="rechazadas" className="mt-6">
                   <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 pb-2 border-b font-medium text-sm text-muted-foreground items-center">
                      <div className="md:col-span-1">NOMBRE DEL PERSONAL</div>
                      <div className="md:col-span-1">TIPO DE LICENCIA</div>
                      <div className="md:col-span-1">FECHA DE SOLICITUD</div>
                      <div className="md:col-span-1">RANGO DE FECHAS</div>
                      <div className="md:col-span-1 text-right">ACCIÓN</div>
                    </div>
                    <div className="text-center py-12">
                      <NoLeavesIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                      <p className="mt-4 text-lg font-medium text-muted-foreground">Sin hojas</p>
                      <p className="text-sm text-muted-foreground">No hay hojas rechazadas para mostrar.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
