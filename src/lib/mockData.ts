
export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  phone: string;
  courses: Array<{ id: string; name: string; progress: number }>;
  enrollmentDate: string;
  address: string;
  gradeLevel: string;
  guardianName?: string;
  guardianContact?: string;
}

export interface Course {
  id:string;
  code: string;
  name: string;
  description: string;
  schedule: string;
  instructor: string;
  instructorAvatar?: string;
  enrolledStudentsCount: number;
  capacity: number;
  credits: number;
  department: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  status: "Presente" | "Ausente" | "Tarde" | "Justificado";
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: Date;
  type: "Feriado" | "Examen" | "Reunión" | "Actividad" | "Entrega";
  description?: string;
  location?: string;
  color?: string; // For calendar event styling
}

export interface Notice {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD or ISO string
  sender: string;
  status: "urgente" | "informativo" | "normal" | "warning"; // For status indicator color
}

export interface Reminder {
  id: string;
  text: string;
  color?: string; // For the left accent bar
}

export interface AttendanceStat {
  status: "presente" | "ausente" | "tarde" | "justificado";
  students: number;
  fill: string; // For chart color, corresponds to chartConfig
}

export interface RecentActivity {
  id: string;
  icon: "UserPlus" | "ClipboardEdit" | "CalendarPlus" | "Megaphone" | "FileText"; // Lucide icon names
  description: string;
  timestamp: string; // e.g., "Hace 5 minutos", "Hace 2 horas"
}


export const mockStudents: Student[] = [
  {
    id: "S001",
    name: "Ana Pérez",
    avatarUrl: "https://placehold.co/100x100.png",
    email: "ana.perez@example.com",
    phone: "555-0101",
    courses: [
      { id: "C001", name: "Matemáticas Avanzadas", progress: 75 },
      { id: "C002", name: "Historia del Arte", progress: 60 },
    ],
    enrollmentDate: "2023-09-01",
    address: "Calle Falsa 123, Ciudad",
    gradeLevel: "10º Grado",
    guardianName: "Carlos Pérez",
    guardianContact: "555-0102",
  },
  {
    id: "S002",
    name: "Luis García",
    avatarUrl: "https://placehold.co/100x100.png",
    email: "luis.garcia@example.com",
    phone: "555-0103",
    courses: [
      { id: "C001", name: "Matemáticas Avanzadas", progress: 85 },
      { id: "C003", name: "Programación Básica", progress: 90 },
    ],
    enrollmentDate: "2023-09-01",
    address: "Avenida Siempreviva 742, Ciudad",
    gradeLevel: "11º Grado",
  },
  {
    id: "S003",
    name: "Sofía Rodríguez",
    avatarUrl: "https://placehold.co/100x100.png",
    email: "sofia.rodriguez@example.com",
    phone: "555-0104",
    courses: [
      { id: "C002", name: "Historia del Arte", progress: 70 },
      { id: "C004", name: "Química Orgánica", progress: 50 },
    ],
    enrollmentDate: "2022-09-01",
    address: "Boulevard de los Sueños Rotos 45, Ciudad",
    gradeLevel: "12º Grado",
    guardianName: "Elena Rodríguez",
    guardianContact: "555-0105",
  },
];

export const mockCourses: Course[] = [
  {
    id: "C001",
    code: "MAT301",
    name: "Matemáticas Avanzadas",
    description: "Curso avanzado sobre cálculo y álgebra lineal.",
    schedule: "Lun, Mié, Vie 10:00-11:30",
    instructor: "Dr. Eduardo López",
    instructorAvatar: "https://placehold.co/40x40.png",
    enrolledStudentsCount: 25,
    capacity: 30,
    credits: 4,
    department: "Matemáticas"
  },
  {
    id: "C002",
    code: "ART101",
    name: "Historia del Arte",
    description: "Exploración de los movimientos artísticos a través de la historia.",
    schedule: "Mar, Jue 08:00-09:30",
    instructor: "Prof. Isabel Vargas",
    instructorAvatar: "https://placehold.co/40x40.png",
    enrolledStudentsCount: 18,
    capacity: 25,
    credits: 3,
    department: "Humanidades"
  },
  {
    id: "C003",
    code: "CS101",
    name: "Programación Básica",
    description: "Introducción a los conceptos fundamentales de la programación.",
    schedule: "Lun, Vie 14:00-15:30",
    instructor: "Ing. Ricardo Montes",
    instructorAvatar: "https://placehold.co/40x40.png",
    enrolledStudentsCount: 30,
    capacity: 30,
    credits: 4,
    department: "Ciencias de la Computación"
  },
  {
    id: "C004",
    code: "QUM202",
    name: "Química Orgánica",
    description: "Estudio de la estructura, propiedades, composición, reacciones y preparación de compuestos que contienen carbono.",
    schedule: "Mar, Jue 11:00-12:30",
    instructor: "Dra. Laura Fuentes",
    instructorAvatar: "https://placehold.co/40x40.png",
    enrolledStudentsCount: 22,
    capacity: 25,
    credits: 4,
    department: "Ciencias Naturales"
  },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: "A001", studentId: "S001", studentName: "Ana Pérez", courseId: "C001", courseName: "Matemáticas Avanzadas", date: "2024-05-01", status: "Presente" },
  { id: "A002", studentId: "S002", studentName: "Luis García", courseId: "C001", courseName: "Matemáticas Avanzadas", date: "2024-05-01", status: "Presente" },
  { id: "A003", studentId: "S001", studentName: "Ana Pérez", courseId: "C001", courseName: "Matemáticas Avanzadas", date: "2024-05-03", status: "Ausente" },
  { id: "A004", studentId: "S003", studentName: "Sofía Rodríguez", courseId: "C002", courseName: "Historia del Arte", date: "2024-05-02", status: "Tarde" },
  { id: "A005", studentId: "S002", studentName: "Luis García", courseId: "C003", courseName: "Programación Básica", date: "2024-05-03", status: "Presente" },
];

const today = new Date();
const getRelativeDate = (daysOffset: number): Date => {
  const date = new Date(today);
  date.setDate(today.getDate() + daysOffset);
  return date;
}

export const mockEvents: SchoolEvent[] = [
  { id: "E001", title: "Examen Final de Matemáticas", date: getRelativeDate(7), type: "Examen", description: "Aula 101", color: "hsl(var(--destructive))" },
  { id: "E002", title: "Entrega Proyecto de Arte", date: getRelativeDate(10), type: "Entrega", location: "Online", color: "hsl(var(--primary))" },
  { id: "E003", title: "Reunión de Padres", date: getRelativeDate(15), type: "Reunión", location: "Auditorio", color: "hsl(var(--accent))"},
  { id: "E004", title: "Feriado: Día del Trabajo", date: new Date(today.getFullYear(), 4, 1), type: "Feriado", color: "hsl(var(--muted-foreground))"}, // May 1st
  { id: "E005", title: "Actividad Deportiva", date: getRelativeDate(5), type: "Actividad", location: "Cancha Principal", color: "hsl(120, 70%, 50%)"},
];

export const mockNotices: Notice[] = [
  { id: "N001", title: "AVISO DE VACACIONES", date: "2025-06-10", sender: "TÚ", status: "urgente" },
  { id: "N002", title: "SUSPENCIÓN DE CLASES", date: "2025-05-31", sender: "REMOTO", status: "informativo" },
  { id: "N003", title: "EXAMEN DE PRIMERA UNIDAD", date: "2025-05-31", sender: "REMOTO", status: "informativo" },
  { id: "N004", title: "Aviso de vacaciones", date: "2024-06-19", sender: "TÚ", status: "warning" },
  { id: "N005", title: "Título 2", date: "2024-06-19", sender: "TÚ", status: "normal" },
];

export const mockReminders: Reminder[] = [
  { id: "R001", text: "Reunión con padres de familia hoy a las 3 de la tarde", color: "hsl(var(--accent))" },
  { id: "R002", text: "Preparar material para la clase de mañana.", color: "hsl(var(--primary))" },
  { id: "R003", text: "Calificar exámenes pendientes de Química.", color: "hsl(var(--destructive))" },
];

export const mockAttendanceStats: AttendanceStat[] = [
  { status: "presente", students: 180, fill: "hsl(var(--chart-1))" },
  { status: "ausente", students: 15, fill: "hsl(var(--chart-2))" },
  { status: "tarde", students: 5, fill: "hsl(var(--chart-3))" },
  { status: "justificado", students: 2, fill: "hsl(var(--chart-4))" },
];

export const mockRecentActivities: RecentActivity[] = [
  { id: "RA001", icon: "UserPlus", description: "Nuevo estudiante 'Carlos Luna' registrado.", timestamp: "Hace 5 minutos" },
  { id: "RA002", icon: "ClipboardEdit", description: "Notas actualizadas para 'Matemáticas Avanzadas'.", timestamp: "Hace 30 minutos" },
  { id: "RA003", icon: "CalendarPlus", description: "Nuevo evento 'Feria de Ciencias' añadido al calendario.", timestamp: "Hace 1 hora" },
  { id: "RA004", icon: "Megaphone", description: "Publicado nuevo aviso: 'Reunión General de Docentes'.", timestamp: "Hace 2 horas" },
  { id: "RA005", icon: "FileText", description: "Se subió el reporte de 'Asistencia Mensual'.", timestamp: "Hace 4 horas" },
];
