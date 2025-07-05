

export interface Student {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  courses: Array<{ id: string; name: string; progress: number }>;
  enrollmentDate: string;
  address: string;
  gradeLevel: string; // e.g. "3º de Secundaria"
  guardianName?: string;
  guardianContact?: string;
  
  // Fields to match the form
  dob?: string; // "YYYY-MM-DD"
  gender?: 'masculino' | 'femenino' | 'otro';
  classId?: string; // "3-sec"
  section?: string; // "A"
  department?: string;
  city?: string;
  guardianEmail?: string;
  guardianAddress?: string;
  guardianDob?: string;
}

export interface Course {
  id:string;
  code: string;
  name: string;
  description: string;
  schedule: string;
  instructor: string;
  instructorId?: string;
  instructorAvatar?: string;
  enrolledStudentsCount: number;
  capacity: number;
  department: string;
  syllabusUrl?: string;
  classId?: string;
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
  body?: string;
  file?: { name: string, size: string, type: string };
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

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: 'Pendiente' | 'Entregado' | 'Calificado';
  grade?: number;
  submittedFile?: string;
  feedback?: string;
}

export interface CourseAnnouncement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
}

export interface GradeEntry {
  courseName: string;
  courseCode: string;
  finalGrade: number;
};

export interface BimesterGrades {
  bimester: number;
  grades: GradeEntry[];
  average: number;
};

export interface StudentLeaveRequest {
    id: number;
    type: string;
    requestDate: string;
    status: 'aprobado' | 'rechazado' | 'pendiente';
    description: string;
    dateRange: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  status: 'Activo' | 'Inactivo';
  class?: string;
  section?: string;
  relatedSubject?: string;
  gender?: string;
  dob?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  refContact?: string;
  refRelationship?: string;
}

export interface GradeScore {
    studentId: string;
    studentName: string;
    scores: (number | null)[];
}

export interface GradesReport {
    className: string;
    subjects: string[];
    grades: GradeScore[];
}

export const mockStudents: Student[] = [
  {
    id: "S001",
    name: "Ana Pérez",
    firstName: "Ana",
    lastName: "Pérez",
    avatarUrl: "https://placehold.co/100x100.png",
    email: "ana.perez@example.com",
    phone: "987654321",
    courses: [
      { id: "C001", name: "Álgebra y Geometría", progress: 75 },
      { id: "C002", name: "Historia del Perú", progress: 60 },
      { id: "C003", name: "Computación Básica", progress: 88 },
      { id: "C004", name: "Química General", progress: 55 },
    ],
    enrollmentDate: "2023-03-01",
    address: "Calle Falsa 123, Miraflores",
    gradeLevel: "3º de Secundaria",
    guardianName: "Carlos Pérez",
    guardianContact: "912345678",
    dob: "2008-04-10",
    gender: "femenino",
    classId: "3-sec",
    section: "A",
    department: "Lima",
    city: "Lima",
    guardianEmail: "carlos.perez@example.com",
    guardianAddress: "Calle Falsa 123, Miraflores",
    guardianDob: "1980-05-15",
  },
  {
    id: "S002",
    name: "Luis García",
    firstName: "Luis",
    lastName: "García",
    avatarUrl: "https://placehold.co/100x100.png",
    email: "luis.garcia@example.com",
    phone: "987654322",
    courses: [
      { id: "C001", name: "Álgebra y Geometría", progress: 85 },
      { id: "C003", name: "Computación Básica", progress: 90 },
    ],
    enrollmentDate: "2023-03-01",
    address: "Avenida Siempreviva 742, San Isidro",
    gradeLevel: "4º de Secundaria",
    guardianName: "María García",
    guardianContact: "912345677",
    dob: "2007-08-22",
    gender: "masculino",
    classId: "4-sec",
    section: "B",
    department: "Lima",
    city: "Lima",
    guardianEmail: "maria.garcia@example.com",
    guardianAddress: "Avenida Siempreviva 742, San Isidro",
    guardianDob: "1982-10-20",
  },
  {
    id: "S003",
    name: "Sofía Rodríguez",
    firstName: "Sofía",
    lastName: "Rodríguez",
    avatarUrl: "https://placehold.co/100x100.png",
    email: "sofia.rodriguez@example.com",
    phone: "987654323",
    courses: [
      { id: "C002", name: "Historia del Perú", progress: 70 },
      { id: "C004", name: "Química General", progress: 50 },
    ],
    enrollmentDate: "2022-03-01",
    address: "Boulevard de los Sueños Rotos 45, Barranco",
    gradeLevel: "5º de Secundaria",
    guardianName: "Elena Rodríguez",
    guardianContact: "912345676",
    dob: "2006-11-05",
    gender: "femenino",
    classId: "5-sec",
    section: "A",
    department: "Lima",
    city: "Lima",
    guardianEmail: "elena.rodriguez@example.com",
    guardianAddress: "Boulevard de los Sueños Rotos 45, Barranco",
    guardianDob: "1985-01-30",
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: "T1749005331",
    firstName: "Eduardo",
    lastName: "López",
    avatarUrl: "https://placehold.co/40x40.png",
    email: "eduardo.lopez@example.com",
    phoneNumber: "987654321",
    address: "Calle Falsa 123, Ciudad",
    dob: "1985-05-20",
    gender: "masculino",
    class: "5-sec",
    section: "A",
    relatedSubject: "Matemáticas",
    refContact: "912345678",
    refRelationship: "Esposa",
    status: 'Activo',
  },
  {
    id: "T1749005332",
    firstName: "Isabel",
    lastName: "Vargas",
    avatarUrl: "https://placehold.co/40x40.png",
    email: "isabel.vargas@example.com",
    phoneNumber: "987654322",
    address: "Avenida Siempreviva 742, Ciudad",
    dob: "1990-11-15",
    gender: "femenino",
    class: "4-sec",
    section: "B",
    relatedSubject: "Humanidades",
    refContact: "912345677",
    refRelationship: "Hermano",
    status: 'Activo',
  },
  {
    id: "T1749005333",
    firstName: "Ricardo",
    lastName: "Montes",
    avatarUrl: "https://placehold.co/40x40.png",
    email: "ricardo.montes@example.com",
    phoneNumber: "987654323",
    address: "Boulevard de los Sueños Rotos 45, Ciudad",
    dob: "1982-03-30",
    gender: "masculino",
    class: "3-sec",
    section: "C",
    relatedSubject: "Ciencias de la Computación",
    refContact: "912345676",
    refRelationship: "Padre",
    status: 'Inactivo',
  },
];

export const mockCourses: Course[] = [
  {
    id: "C001",
    code: "MAT501",
    name: "Álgebra y Geometría",
    description: "Curso avanzado sobre cálculo y álgebra lineal para el último año.",
    schedule: "Lun, Mié, Vie 10:00-11:30",
    instructor: "Dr. Eduardo López",
    instructorId: "T1749005331", 
    instructorAvatar: "https://placehold.co/40x40.png",
    enrolledStudentsCount: 25,
    capacity: 30,
    department: "Matemáticas",
    syllabusUrl: "/syllabi/MAT501.pdf",
    classId: "5-sec",
  },
  {
    id: "C002",
    code: "HIS301",
    name: "Historia del Perú",
    description: "Exploración de los hitos históricos de la nación peruana.",
    schedule: "Mar, Jue 08:00-09:30",
    instructor: "Prof. Isabel Vargas",
    instructorId: "T1749005332",
    instructorAvatar: "https://placehold.co/40x40.png",
    enrolledStudentsCount: 18,
    capacity: 25,
    department: "Humanidades",
    syllabusUrl: "/syllabi/HIS301.pdf",
    classId: "3-sec",
  },
  {
    id: "C003",
    code: "CS401",
    name: "Computación Básica",
    description: "Introducción a los conceptos fundamentales de la computación y ofimática.",
    schedule: "Lun, Vie 14:00-15:30",
    instructor: "Ing. Ricardo Montes",
    instructorId: "T1749005333",
    instructorAvatar: "https://placehold.co/40x40.png",
    enrolledStudentsCount: 30,
    capacity: 30,
    department: "Tecnología",
    syllabusUrl: "/syllabi/CS401.pdf",
    classId: "4-sec",
  },
  {
    id: "C004",
    code: "QUM401",
    name: "Química General",
    description: "Estudio de la materia, sus propiedades y transformaciones.",
    schedule: "Mar, Jue 11:00-12:30",
    instructor: "Dra. Isabel Vargas",
    instructorId: "T1749005332",
    instructorAvatar: "https://placehold.co/40x40.png",
    enrolledStudentsCount: 22,
    capacity: 25,
    department: "Ciencias Naturales",
    syllabusUrl: "/syllabi/QUM401.pdf",
    classId: "4-sec",
  },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: "A001", studentId: "S001", studentName: "Ana Pérez", courseId: "C001", courseName: "Álgebra y Geometría", date: "2024-05-01", status: "Presente" },
  { id: "A002", studentId: "S002", studentName: "Luis García", courseId: "C001", courseName: "Álgebra y Geometría", date: "2024-05-01", status: "Presente" },
  { id: "A003", studentId: "S001", studentName: "Ana Pérez", courseId: "C001", courseName: "Álgebra y Geometría", date: "2024-05-03", status: "Ausente" },
  { id: "A004", studentId: "S003", studentName: "Sofía Rodríguez", courseId: "C002", courseName: "Historia del Perú", date: "2024-05-02", status: "Tarde" },
  { id: "A005", studentId: "S002", studentName: "Luis García", courseId: "C003", courseName: "Computación Básica", date: "2024-05-03", status: "Presente" },
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
    { id: "N001", title: "AVISO DE VACACIONES", date: "2025-06-10", sender: "Administración", status: "urgente", body: "Las vacaciones de medio año comenzarán el 15 de julio. Disfruten su descanso.", file: { name: "calendario_vacaciones.pdf", size: "120 KB", type: "pdf"} },
    { id: "N002", title: "SUSPENCIÓN DE CLASES", date: "2025-05-31", sender: "Administración", status: "informativo", body: "Debido a fumigación, las clases se suspenderán el día 5 de junio." },
    { id: "N003", title: "EXAMEN DE PRIMERA UNIDAD", date: "2025-05-31", sender: "Dr. Eduardo López", status: "normal", body: "El examen de la primera unidad de Matemáticas Avanzadas será el 12 de junio. ¡A estudiar!", file: { name: "temario.docx", size: "45 KB", type: "docx" } },
    { id: "N004", title: "Aviso de Simulacro", date: "2024-06-19", sender: "Administración", status: "warning", body: "Habrá un simulacro de sismo el día 25 de junio a las 10:00 AM." },
    { id: "N005", title: "Campaña de reciclaje", date: "2024-06-19", sender: "Prof. Isabel Vargas", status: "normal", body: "Participen en la campaña de reciclaje de esta semana. Habrá contenedores en el patio." },
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

export const mockStudentAttendanceStats: AttendanceStat[] = [
  { status: "presente", students: 150, fill: "hsl(var(--chart-1))" },
  { status: "ausente", students: 8, fill: "hsl(var(--chart-2))" },
  { status: "tarde", students: 4, fill: "hsl(var(--chart-3))" },
  { status: "justificado", students: 2, fill: "hsl(var(--chart-4))" },
];

export const mockRecentActivities: RecentActivity[] = [
  { id: "RA001", icon: "UserPlus", description: "Nuevo estudiante 'Carlos Luna' registrado.", timestamp: "Hace 5 minutos" },
  { id: "RA002", icon: "ClipboardEdit", description: "Notas actualizadas para 'Álgebra y Geometría'.", timestamp: "Hace 30 minutos" },
  { id: "RA003", icon: "CalendarPlus", description: "Nuevo evento 'Feria de Ciencias' añadido al calendario.", timestamp: "Hace 1 hora" },
  { id: "RA004", icon: "Megaphone", description: "Publicado nuevo aviso: 'Reunión General de Docentes'.", timestamp: "Hace 2 horas" },
  { id: "RA005", icon: "FileText", description: "Se subió el reporte de 'Asistencia Mensual'.", timestamp: "Hace 4 horas" },
];

export const mockAssignments: Assignment[] = [
  { 
    id: "AS001", 
    courseId: "C001", 
    title: "Ensayo sobre el Teorema Fundamental del Cálculo", 
    description: "Escribir un ensayo de 5 páginas sobre la importancia y aplicaciones del Teorema Fundamental del Cálculo.",
    dueDate: "2024-08-15",
    status: "Pendiente"
  },
  { 
    id: "AS002", 
    courseId: "C001", 
    title: "Resolución de Problemas de Integrales",
    description: "Resolver la lista de problemas adjunta.",
    dueDate: "2024-07-30",
    status: "Calificado",
    grade: 18,
    submittedFile: "integrales_resueltas.pdf",
    feedback: "Excelente trabajo. Presta más atención al problema 7."
  },
  { 
    id: "AS003", 
    courseId: "C002", 
    title: "Análisis del Arte Barroco",
    description: "Analizar 3 obras del periodo barroco y comparar sus características.",
    dueDate: "2024-08-10",
    status: "Entregado",
    submittedFile: "analisis_barroco.docx"
  },
];

export const mockCourseAnnouncements: CourseAnnouncement[] = [
  {
    id: "CA001",
    courseId: "C001",
    title: "Cambio de fecha para el Examen Parcial",
    content: "Hola a todos, la fecha del examen parcial se ha movido del 15 de Agosto al 22 de Agosto. Por favor, tomen nota.",
    date: "2024-07-20"
  },
   {
    id: "CA002",
    courseId: "C001",
    title: "Clase de repaso adicional",
    content: "Tendremos una sesión de repaso opcional este viernes a las 4 PM en el aula 305.",
    date: "2024-07-18"
  },
  {
    id: "CA003",
    courseId: "C002",
    title: "Visita al Museo de Arte",
    content: "Recuerden que nuestra visita al museo es este sábado. Punto de encuentro en la entrada principal a las 10 AM.",
    date: "2024-07-22"
  },
];

export const mockStudentGrades: BimesterGrades[] = [
    {
        bimester: 1,
        grades: [
            { courseName: "Álgebra y Geometría", courseCode: "MAT501", finalGrade: 15 },
            { courseName: "Historia del Perú", courseCode: "HIS301", finalGrade: 18 },
            { courseName: "Computación Básica", courseCode: "CS401", finalGrade: 16 },
        ],
        average: 16.33,
    },
    {
        bimester: 2,
        grades: [
            { courseName: "Álgebra y Geometría", courseCode: "MAT501", finalGrade: 14 },
            { courseName: "Historia del Perú", courseCode: "HIS301", finalGrade: 16 },
            { courseName: "Computación Básica", courseCode: "CS401", finalGrade: 13 },
            { courseName: "Química General", courseCode: "QUM401", finalGrade: 10 },
        ],
        average: 13.25,
    }
];

export const mockStudentLeaveRequests: StudentLeaveRequest[] = [
    {
        id: 1,
        type: 'Licencia por enfermedad',
        requestDate: '20 de Julio, 2024',
        status: 'aprobado',
        description: 'Cita médica para chequeo general.',
        dateRange: '25 de Julio, 2024 - 25 de Julio, 2024'
    },
    {
        id: 2,
        type: 'Licencia por viaje familiar',
        requestDate: '15 de Julio, 2024',
        status: 'pendiente',
        description: 'Viaje familiar programado con antelación.',
        dateRange: '1 de Agosto, 2024 - 7 de Agosto, 2024'
    },
    {
        id: 3,
        type: 'Licencia por enfermedad',
        requestDate: '10 de Junio, 2024',
        status: 'rechazado',
        description: 'Reposo por gripe.',
        dateRange: '11 de Junio, 2024 - 12 de Junio, 2024'
    }
];

export const mockGradesReport: { [key: string]: GradesReport } = {
  "3-sec": {
    className: "3º de Secundaria",
    subjects: ["H. del Perú", "Música", "Dibujo"],
    grades: [
      { studentId: "S001", studentName: "Ana Pérez", scores: [18, 15, 17] },
      { studentId: "S004", studentName: "David Jiménez", scores: [16, 17, 16] },
    ]
  },
  "4-sec": {
    className: "4º de Secundaria",
    subjects: ["Computación", "Química", "Física"],
    grades: [
      { studentId: "S002", studentName: "Luis García", scores: [17, 14, 16] },
      { studentId: "S005", studentName: "Laura Martínez", scores: [19, 18, 17] },
    ]
  },
  "5-sec": {
    className: "5º de Secundaria",
    subjects: ["Álgebra", "Contabilidad", "Economía"],
    grades: [
      { studentId: "S003", studentName: "Sofía Rodríguez", scores: [15, 12, 14] },
      { studentId: "S006", studentName: "Javier Gómez", scores: [13, 11, 10] },
    ]
  }
};
