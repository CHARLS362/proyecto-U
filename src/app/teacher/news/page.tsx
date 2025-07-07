
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
import { 
  Newspaper, 
  FileText, 
  Filter, 
  Check,
  ClipboardList,
  Plus,
  Eye,
  Download,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TeacherNewsPage() {
  const { toast } = useToast();
  const [importance, setImportance] = useState('normal');
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('Ningún archivo seleccionado');
    }
  };

  const handleReset = () => {
    setTitle('');
    setBody('');
    setImportance('normal');
    setFileName('Ningún archivo seleccionado');
    const form = document.getElementById('create-notice-form') as HTMLFormElement;
    if (form) form.reset();
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Aviso enviado",
        description: "El nuevo aviso ha sido publicado.",
        variant: "success",
      });
      handleReset();
    } catch (error) {
       toast({
        title: "Error al enviar",
        description: "No se pudo enviar el aviso. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const notices = [
    {
      id: 1,
      title: 'Aviso de vacaciones',
      date: '19 de junio de 2024',
      body: 'Disfruta tus vacaciones',
      file: { size: '91 KB', type: 'png' },
      importance: 'normal',
    },
    {
      id: 2,
      title: 'Título 2',
      date: '19 de junio de 2024',
      body: 'Cuerpo 2',
      file: { size: '7 KB', type: 'png' },
      importance: 'alta',
    },
    {
      id: 3,
      title: 'Título del aviso',
      date: '19 de junio de 2024',
      body: 'Cuerpo',
      file: { size: '474 KB', type: 'png' },
      importance: 'media',
    },
  ];

  const importanceColors: { [key: string]: string } = {
    normal: 'bg-green-500',
    media: 'bg-yellow-500',
    alta: 'bg-red-500',
  };


  return (
    <div className="space-y-6">
      <PageTitle title="Tablón de anuncios" icon={Newspaper} />
      
      <Tabs defaultValue="tablon-de-anuncios" className="w-full animate-fade-in">
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
            <form id="create-notice-form" onSubmit={handleSubmit}>
              <CardContent className="pt-6 space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="aviso-titulo">Título del aviso</Label>
                  <Input id="aviso-titulo" placeholder="título del aviso" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isSubmitting} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="aviso-cuerpo">Cuerpo del aviso</Label>
                  <Textarea id="aviso-cuerpo" placeholder="Escriba el cuerpo del aviso aquí..." value={body} onChange={(e) => setBody(e.target.value)} required disabled={isSubmitting}/>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="aviso-archivo">Cualquier archivo</Label>
                  <div className="flex items-center gap-2">
                    <Input id="aviso-archivo" type="file" className="hidden" onChange={handleFileChange} disabled={isSubmitting} />
                    <Button asChild variant="outline" className="shrink-0" disabled={isSubmitting}>
                      <Label htmlFor="aviso-archivo" className="cursor-pointer">Seleccionar archivo</Label>
                    </Button>
                    <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Importancia</Label>
                  <RadioGroup value={importance} onValueChange={setImportance} className="flex items-center gap-4" disabled={isSubmitting}>
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
                <Button variant="outline" type="button" onClick={handleReset} disabled={isSubmitting}>Reiniciar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? 'Enviando...' : 'Correo'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="tablon-de-anuncios" className="mt-6">
           <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Tablón de anuncios</CardTitle>
              </div>
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices.map((notice) => (
                  <Card key={notice.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow bg-muted/20 rounded-lg">
                    <CardHeader className="p-4 flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium text-foreground">{notice.title}</CardTitle>
                        <CardDescription className="text-xs">{notice.date}</CardDescription>
                      </div>
                      <span className={`mt-1 h-3.5 w-3.5 rounded-full ${importanceColors[notice.importance]}`}></span>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 flex-grow">
                      <p className="text-sm text-foreground font-medium">{notice.body}</p>
                    </CardContent>
                    <Separator />
                    <CardFooter className="p-2 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4"/></Button>
                        <span>{`${notice.file.size} (${notice.file.type})`}</span>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700"><Edit className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center gap-2 pt-4 border-t">
                <Button variant="outline" size="sm">anterior</Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">próximo</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
