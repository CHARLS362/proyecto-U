
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Eye,
  Download,
  Edit,
  Trash2,
  Users,
  BookOpenText,
  User,
  GraduationCap,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockCourses, mockTeachers, mockNotices, type Notice } from '@/lib/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const primaryGrades = [
  { value: '1-pri', label: '1º de Primaria' }, { value: '2-pri', label: '2º de Primaria' },
  { value: '3-pri', label: '3º de Primaria' }, { value: '4-pri', label: '4º de Primaria' },
  { value: '5-pri', label: '5º de Primaria' }, { value: '6-pri', label: '6º de Primaria' },
];

const secondaryGrades = [
  { value: '1-sec', label: '1º de Secundaria' }, { value: '2-sec', label: '2º de Secundaria' },
  { value: '3-sec', label: '3º de Secundaria' }, { value: '4-sec', label: '4º de Secundaria' },
  { value: '5-sec', label: '5º de Secundaria' },
];

export default function NewsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [importance, setImportance] = useState('normal');
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');
  const [sendTo, setSendTo] = useState('all');
  
  // State for conditional filters
  const [targetLevel, setTargetLevel] = useState('');
  const [targetGrade, setTargetGrade] = useState('');
  const [targetCourse, setTargetCourse] = useState('');
  const [targetTeacher, setTargetTeacher] = useState('');
  
  const defaultTab = searchParams.get('tab') === 'crear-aviso' ? 'crear-aviso' : 'tablon-de-anuncios';

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
    setSendTo('all');
    setTargetLevel('');
    setTargetGrade('');
    setTargetCourse('');
    setTargetTeacher('');
    const form = document.getElementById('create-notice-form') as HTMLFormElement;
    if (form) form.reset();
  }

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newNotice: Notice = {
      id: `N${Date.now()}`,
      title,
      body,
      date: new Date().toISOString(),
      sender: 'Administración',
      status: importance as any,
      file: fileName !== 'Ningún archivo seleccionado' ? { name: fileName, size: 'N/A', type: 'N/A'} : undefined,
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNotices(prev => [newNotice, ...prev]);
      toast({
        title: "Aviso enviado",
        description: "El nuevo aviso ha sido publicado y notificado.",
        variant: "success",
      });
      handleReset();
    } catch(error) {
       toast({
        title: "Error al enviar",
        description: "No se pudo enviar el aviso. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setBody(notice.body || '');
    setImportance(notice.status);
    setFileName(notice.file?.name || 'Ningún archivo seleccionado');
    // For simplicity, targeting options are reset on edit.
    // A real app would need logic to pre-fill these.
    setSendTo('all');
    setTargetLevel('');
    setTargetGrade('');
    setTargetCourse('');
    setTargetTeacher('');
    setIsEditModalOpen(true);
  };
  
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingNotice) return;
    setIsSubmitting(true);

    const updatedNoticeData: Notice = {
      ...editingNotice,
      title,
      body,
      status: importance as any,
      file: fileName !== 'Ningún archivo seleccionado' ? { name: fileName, size: editingNotice.file?.size || 'N/A', type: editingNotice.file?.type || 'N/A' } : undefined,
    };

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setNotices(prev => prev.map(n => n.id === editingNotice.id ? updatedNoticeData : n));
        toast({
            title: "Aviso Actualizado",
            description: `El aviso "${title}" se ha actualizado.`,
            variant: "success",
        });
        setIsEditModalOpen(false);
        setEditingNotice(null);
    } catch(error) {
        toast({
            title: "Error al Actualizar",
            description: "No se pudo guardar los cambios.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleActionClick = (action: string, noticeTitle: string) => {
    if (action === "Eliminar") {
        setNotices(prev => prev.filter(n => n.title !== noticeTitle));
        toast({
            title: `Acción: ${action}`,
            description: `Se ha ejecutado "${action}" en el aviso "${noticeTitle}".`,
            variant: "success",
        });
        return;
    }
    toast({
      title: `Acción: ${action}`,
      description: `Se ha ejecutado "${action}" en el aviso "${noticeTitle}".`,
      variant: "info",
    });
  };

  const importanceColors: { [key: string]: string } = {
    normal: 'bg-green-500',
    media: 'bg-yellow-500',
    alta: 'bg-red-500',
    urgente: 'bg-red-500',
    informativo: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const availableCourses = useMemo(() => {
    if (!targetGrade) return [];
    return mockCourses.filter(c => c.classId === targetGrade);
  }, [targetGrade]);

  useEffect(() => {
    setTargetGrade('');
    setTargetCourse('');
  }, [targetLevel]);

  return (
    <div className="space-y-6">
      <PageTitle title="Tablón de anuncios" icon={Newspaper} />
      
      <Tabs defaultValue={defaultTab} className="w-full animate-fade-in">
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
            <form id="create-notice-form" onSubmit={handleCreateSubmit}>
              <CardContent className="pt-6 space-y-6">
                
                <div className="grid gap-3 p-4 border rounded-lg bg-muted/30">
                  <Label className="font-semibold text-foreground">Enviar a:</Label>
                  <RadioGroup value={sendTo} onValueChange={setSendTo} className="flex flex-wrap items-center gap-x-6 gap-y-4" disabled={isSubmitting}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="send-to-all" /><Label htmlFor="send-to-all" className="flex items-center gap-2"><Users className="h-4 w-4" /> Todos</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="level" id="send-to-level" /><Label htmlFor="send-to-level" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Nivel específico</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="course" id="send-to-course" /><Label htmlFor="send-to-course" className="flex items-center gap-2"><BookOpenText className="h-4 w-4" /> Curso específico</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="teacher" id="send-to-teacher" /><Label htmlFor="send-to-teacher" className="flex items-center gap-2"><User className="h-4 w-4" /> Docente específico</Label></div>
                  </RadioGroup>

                  {sendTo === 'level' && (
                    <div className="grid grid-cols-1 pt-2 animate-fade-in">
                      <Select value={targetLevel} onValueChange={setTargetLevel} disabled={isSubmitting}>
                        <SelectTrigger><SelectValue placeholder="-- Seleccionar Nivel --" /></SelectTrigger>
                        <SelectContent><SelectItem value="Primaria">Primaria</SelectItem><SelectItem value="Secundaria">Secundaria</SelectItem></SelectContent>
                      </Select>
                    </div>
                  )}

                  {sendTo === 'course' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 animate-fade-in">
                       <Select value={targetLevel} onValueChange={setTargetLevel} disabled={isSubmitting}>
                         <SelectTrigger><SelectValue placeholder="-- Nivel --" /></SelectTrigger>
                         <SelectContent><SelectItem value="Primaria">Primaria</SelectItem><SelectItem value="Secundaria">Secundaria</SelectItem></SelectContent>
                       </Select>
                       <Select value={targetGrade} onValueChange={setTargetGrade} disabled={!targetLevel || isSubmitting}>
                         <SelectTrigger><SelectValue placeholder="-- Grado --" /></SelectTrigger>
                         <SelectContent>
                           {targetLevel === 'Primaria' && primaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                           {targetLevel === 'Secundaria' && secondaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                         </SelectContent>
                       </Select>
                       <Select value={targetCourse} onValueChange={setTargetCourse} disabled={!targetGrade || isSubmitting}>
                         <SelectTrigger><SelectValue placeholder="-- Curso --" /></SelectTrigger>
                         <SelectContent>
                           {availableCourses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                         </SelectContent>
                       </Select>
                    </div>
                  )}
                  
                  {sendTo === 'teacher' && (
                     <div className="grid grid-cols-1 pt-2 animate-fade-in">
                        <Select value={targetTeacher} onValueChange={setTargetTeacher} disabled={isSubmitting}>
                           <SelectTrigger><SelectValue placeholder="-- Seleccionar Docente --" /></SelectTrigger>
                           <SelectContent>
                             {mockTeachers.map(t => <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>)}
                           </SelectContent>
                        </Select>
                    </div>
                  )}
                </div>


                <div className="grid gap-2">
                  <Label htmlFor="aviso-titulo">Título del aviso</Label>
                  <Input id="aviso-titulo" placeholder="título del aviso" required value={title} onChange={e => setTitle(e.target.value)} disabled={isSubmitting} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="aviso-cuerpo">Cuerpo del aviso</Label>
                  <Textarea id="aviso-cuerpo" placeholder="Escriba el cuerpo del aviso aquí..." required value={body} onChange={e => setBody(e.target.value)} disabled={isSubmitting} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="aviso-archivo">Cualquier archivo</Label>
                  <div className="flex items-center gap-2">
                    <Input id="aviso-archivo" type="file" className="hidden" onChange={handleFileChange} disabled={isSubmitting} />
                    <Button asChild variant="outline" className="shrink-0" disabled={isSubmitting}>
                      <Label htmlFor="aviso-archivo" className="cursor-pointer font-normal">Seleccionar archivo</Label>
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
                      <RadioGroupItem value="warning" id="importance-yellow" className="peer sr-only" />
                      <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center ring-2 ring-transparent peer-data-[state=checked]:ring-primary">
                        {importance === 'warning' && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </Label>
                    <Label htmlFor="importance-red" className="cursor-pointer">
                      <RadioGroupItem value="urgente" id="importance-red" className="peer sr-only" />
                      <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center ring-2 ring-transparent peer-data-[state=checked]:ring-primary">
                        {importance === 'urgente' && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" type="button" onClick={handleReset} disabled={isSubmitting}>Reiniciar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? 'Enviando...' : 'Enviar Aviso'}
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
            </CardHeader>
            <CardContent>
              {notices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notices.map((notice) => (
                    <Dialog key={notice.id}>
                      <Card className="flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow bg-card rounded-lg overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-sm font-bold uppercase tracking-wider">{notice.title}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {new Date(notice.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </CardDescription>
                            </div>
                            <span className={`h-3 w-3 rounded-full flex-shrink-0 ${importanceColors[notice.status]}`}></span>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 flex-grow">
                          <p className="text-sm text-muted-foreground">{notice.body}</p>
                        </CardContent>
                        <CardFooter className="p-2 bg-muted/50 border-t flex justify-between items-center">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                             {notice.file && (
                                <>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleActionClick('Descargar', notice.title)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <span>{notice.file.size || 'N/A'}</span>
                                </>
                             )}
                          </div>
                          <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:text-blue-700" onClick={() => handleOpenEditModal(notice)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleActionClick('Eliminar', notice.title)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                      <DialogContent className="p-0 sm:max-w-2xl bg-card border-none overflow-hidden rounded-lg">
                        <div className="relative p-8">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-xl tracking-wider flex items-center gap-1">
                                    <span style={{ color: '#00A1B4' }}>PRO</span>
                                    <span style={{ color: '#E30613' }}>NA</span>
                                    <span style={{ color: '#FFD200' }}>BEC</span>
                                </div>
                                <ArrowUpRight className="h-10 w-10 text-blue-600 -rotate-45 absolute top-4 right-4 opacity-50" />
                            </div>
                            <div className="mt-8 text-center space-y-4">
                                <h2 className="text-3xl font-bold mb-4" style={{ color: '#EC008C'}}>¡{notice.title}!</h2>
                                <p className="text-muted-foreground text-lg text-left">
                                    {notice.body}
                                </p>
                                <p className="text-muted-foreground text-lg mt-4 text-left">
                                  La información que nos brindes nos permitirá estar en contacto contigo en cualquier momento, como becario o becaria de Sofía Educa.
                                </p>
                            </div>
                        </div>
                        <div className="h-2.5 w-full flex">
                            <div className="w-1/5" style={{ backgroundColor: '#00A1B4' }}></div>
                            <div className="w-1/5" style={{ backgroundColor: '#8DC63F' }}></div>
                            <div className="w-1/5" style={{ backgroundColor: '#FFD200' }}></div>
                            <div className="w-1/5" style={{ backgroundColor: '#F7941E' }}></div>
                            <div className="w-1/5" style={{ backgroundColor: '#E30613' }}></div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No hay avisos publicados.</p>
                </div>
              )}
            </CardContent>
            {notices.length > 0 && (
              <CardFooter className="flex justify-end items-center gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => toast({description: "Ya estás en la primera página."})}>anterior</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm" onClick={() => toast({description: "No hay más páginas."})}>próximo</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Editar Aviso</DialogTitle>
                <DialogDescription>Modifique los detalles del aviso y guarde los cambios.</DialogDescription>
            </DialogHeader>
            <form id="edit-notice-form" onSubmit={handleUpdateSubmit} className="max-h-[70vh] overflow-y-auto px-1">
              <div className="pt-6 space-y-6">
                <div className="grid gap-3 p-4 border rounded-lg bg-muted/30">
                  <Label className="font-semibold text-foreground">Enviar a:</Label>
                  <RadioGroup value={sendTo} onValueChange={setSendTo} className="flex flex-wrap items-center gap-x-6 gap-y-4" disabled={isSubmitting}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="edit-send-to-all" /><Label htmlFor="edit-send-to-all" className="flex items-center gap-2"><Users className="h-4 w-4" /> Todos</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="level" id="edit-send-to-level" /><Label htmlFor="edit-send-to-level" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Nivel específico</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="course" id="edit-send-to-course" /><Label htmlFor="edit-send-to-course" className="flex items-center gap-2"><BookOpenText className="h-4 w-4" /> Curso específico</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="teacher" id="edit-send-to-teacher" /><Label htmlFor="edit-send-to-teacher" className="flex items-center gap-2"><User className="h-4 w-4" /> Docente específico</Label></div>
                  </RadioGroup>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-aviso-titulo">Título del aviso</Label>
                  <Input id="edit-aviso-titulo" required value={title} onChange={e => setTitle(e.target.value)} disabled={isSubmitting} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-aviso-cuerpo">Cuerpo del aviso</Label>
                  <Textarea id="edit-aviso-cuerpo" required value={body} onChange={e => setBody(e.target.value)} disabled={isSubmitting} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-aviso-archivo">Cualquier archivo</Label>
                  <div className="flex items-center gap-2">
                    <Input id="edit-aviso-archivo" type="file" className="hidden" onChange={handleFileChange} disabled={isSubmitting} />
                    <Button asChild variant="outline" className="shrink-0" disabled={isSubmitting}>
                      <Label htmlFor="edit-aviso-archivo" className="cursor-pointer font-normal">Seleccionar archivo</Label>
                    </Button>
                    <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Importancia</Label>
                  <RadioGroup value={importance} onValueChange={setImportance} className="flex items-center gap-4" disabled={isSubmitting}>
                     <Label htmlFor="edit-importance-green" className="cursor-pointer">
                      <RadioGroupItem value="normal" id="edit-importance-green" className="peer sr-only" />
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-transparent peer-data-[state=checked]:ring-primary">
                        {importance === 'normal' && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </Label>
                    <Label htmlFor="edit-importance-yellow" className="cursor-pointer">
                      <RadioGroupItem value="warning" id="edit-importance-yellow" className="peer sr-only" />
                      <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center ring-2 ring-transparent peer-data-[state=checked]:ring-primary">
                        {importance === 'warning' && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </Label>
                    <Label htmlFor="edit-importance-red" className="cursor-pointer">
                      <RadioGroupItem value="urgente" id="edit-importance-red" className="peer sr-only" />
                      <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center ring-2 ring-transparent peer-data-[state=checked]:ring-primary">
                        {importance === 'urgente' && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
              </div>
               <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Cambios
                  </Button>
              </CardFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
