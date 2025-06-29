
'use client';

import { useState } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Newspaper, FileText, Filter, Check } from 'lucide-react';

export default function NewsPage() {
  const [importance, setImportance] = useState('normal');
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('Ningún archivo seleccionado');
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Tablón de anuncios" icon={Newspaper} />
      
      <Tabs defaultValue="crear-aviso" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
          <TabsTrigger value="crear-aviso">Crear aviso</TabsTrigger>
          <TabsTrigger value="tablon-de-anuncios">Tablón de anuncios</TabsTrigger>
        </TabsList>

        <TabsContent value="crear-aviso" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Crear aviso</CardTitle>
              </div>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </CardHeader>
            <Separator />
            <form>
              <CardContent className="pt-6 space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="aviso-titulo">Título del aviso</Label>
                  <Input id="aviso-titulo" placeholder="título del aviso" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="aviso-cuerpo">Cuerpo del aviso</Label>
                  <Textarea id="aviso-cuerpo" placeholder="Escriba el cuerpo del aviso aquí..." />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="aviso-archivo">Cualquier archivo</Label>
                  <div className="flex items-center gap-2">
                    <Input id="aviso-archivo" type="file" className="hidden" onChange={handleFileChange} />
                    <Button asChild variant="outline" className="shrink-0">
                      <Label htmlFor="aviso-archivo" className="cursor-pointer">Seleccionar archivo</Label>
                    </Button>
                    <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Importancia</Label>
                  <RadioGroup value={importance} onValueChange={setImportance} className="flex items-center gap-4">
                    <Label htmlFor="importance-green" className="cursor-pointer">
                      <RadioGroupItem value="normal" id="importance-green" className="peer sr-only" />
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-transparent peer-data-[state=checked]:ring-primary">
                        {importance === 'normal' && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </Label>
                    <Label htmlFor="importance-yellow" className="cursor-pointer">
                      <RadioGroupItem value="media" id="importance-yellow" className="peer sr-only" />
                      <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center ring-2 ring-transparent peer-data-[state=checked]:ring-primary">
                        {importance === 'media' && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </Label>
                    <Label htmlFor="importance-red" className="cursor-pointer">
                      <RadioGroupItem value="alta" id="importance-red" className="peer sr-only" />
                      <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center ring-2 ring-transparent peer-data-[state=checked]:ring-primary">
                        {importance === 'alta' && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" type="reset">Reiniciar</Button>
                <Button type="submit">Correo</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="tablon-de-anuncios" className="mt-6">
           <Card className="shadow-lg">
             <CardHeader>
               <CardTitle>Anuncios Publicados</CardTitle>
               <CardDescription>Aquí se mostrarán todos los avisos publicados.</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground text-center py-10">No hay anuncios para mostrar.</p>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
