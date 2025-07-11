create table actividades_recientes
(
    id           varchar(50)                                                                                  not null
        primary key,
    icono        enum ('UsuarioNuevo', 'EditarPortapapeles', 'AgregarCalendario', 'Megafono', 'ArchivoTexto') not null,
    descripcion  text                                                                                         not null,
    marca_tiempo varchar(50)                                                                                  not null
);

create table comunicados
(
    id             varchar(50)                                              not null
        primary key,
    titulo         varchar(100)                                             not null,
    fecha          date                                                     not null,
    remitente      varchar(100)                                             not null,
    estado         enum ('urgente', 'informativo', 'normal', 'advertencia') not null,
    contenido      text                                                     null,
    nombre_archivo varchar(100)                                             null,
    tamano_archivo varchar(50)                                              null,
    tipo_archivo   varchar(50)                                              null
);

create table estadisticas_asistencia
(
    id            int auto_increment
        primary key,
    estado        enum ('presente', 'ausente', 'tarde', 'justificado') not null,
    estudiantes   int                                                  not null,
    color_relleno varchar(50)                                          null
);

create table estudiantes
(
    id                     varchar(50)                            not null
        primary key,
    nombre                 varchar(100)                           not null,
    primer_nombre          varchar(50)                            not null,
    apellido               varchar(50)                            not null,
    url_avatar             varchar(255)                           null,
    correo                 varchar(100)                           not null,
    telefono               varchar(20)                            null,
    fecha_matricula        date                                   not null,
    direccion              varchar(255)                           null,
    nivel_grado            varchar(50)                            null,
    nombre_tutor           varchar(100)                           null,
    contacto_tutor         varchar(20)                            null,
    fecha_nacimiento       date                                   null,
    genero                 enum ('masculino', 'femenino', 'otro') null,
    id_clase               varchar(50)                            null,
    seccion                varchar(10)                            null,
    departamento           varchar(50)                            null,
    ciudad                 varchar(50)                            null,
    correo_tutor           varchar(100)                           null,
    direccion_tutor        varchar(255)                           null,
    fecha_nacimiento_tutor date                                   null,
    constraint correo
        unique (correo)
);

create table eventos_escolares
(
    id          varchar(50)                                                   not null
        primary key,
    titulo      varchar(100)                                                  not null,
    fecha       date                                                          not null,
    tipo        enum ('Feriado', 'Examen', 'Reunión', 'Actividad', 'Entrega') not null,
    descripcion text                                                          null,
    ubicacion   varchar(100)                                                  null,
    color       varchar(50)                                                   null
);

create table notas_bimestre
(
    id            int auto_increment
        primary key,
    id_estudiante varchar(50)   null,
    bimestre      int           not null,
    promedio      decimal(5, 2) null,
    constraint notas_bimestre_ibfk_1
        foreign key (id_estudiante) references estudiantes (id)
);

create table entradas_notas
(
    id               int auto_increment
        primary key,
    id_nota_bimestre int          null,
    nombre_curso     varchar(100) not null,
    codigo_curso     varchar(50)  not null,
    nota_final       int          not null,
    constraint entradas_notas_ibfk_1
        foreign key (id_nota_bimestre) references notas_bimestre (id)
);

create index id_nota_bimestre
    on entradas_notas (id_nota_bimestre);

create index id_estudiante
    on notas_bimestre (id_estudiante);

create table profesores
(
    id                  varchar(50)                 not null
        primary key,
    primer_nombre       varchar(50)                 not null,
    apellido            varchar(50)                 not null,
    url_avatar          varchar(255)                null,
    correo              varchar(100)                not null,
    numero_telefono     varchar(20)                 null,
    direccion           varchar(255)                null,
    fecha_nacimiento    date                        null,
    genero              varchar(20)                 null,
    clase               varchar(50)                 null,
    seccion             varchar(10)                 null,
    materia_relacionada varchar(100)                null,
    contacto_referencia varchar(20)                 null,
    relacion_referencia varchar(50)                 null,
    estado              enum ('Activo', 'Inactivo') not null,
    constraint correo
        unique (correo)
);

create table cursos
(
    id                                varchar(50)  not null
        primary key,
    codigo                            varchar(50)  not null,
    nombre                            varchar(100) not null,
    descripcion                       text         null,
    horario                           varchar(100) null,
    instructor                        varchar(100) null,
    id_instructor                     varchar(50)  null,
    avatar_instructor                 varchar(255) null,
    cantidad_estudiantes_matriculados int          not null,
    capacidad                         int          not null,
    departamento                      varchar(50)  null,
    url_plan_estudios                 varchar(255) null,
    id_clase                          varchar(50)  null,
    constraint cursos_ibfk_1
        foreign key (id_instructor) references profesores (id)
);

create table anuncios_cursos
(
    id        varchar(50)  not null
        primary key,
    id_curso  varchar(50)  null,
    titulo    varchar(100) not null,
    contenido text         not null,
    fecha     date         not null,
    constraint anuncios_cursos_ibfk_1
        foreign key (id_curso) references cursos (id)
);

create index id_curso
    on anuncios_cursos (id_curso);

create index id_instructor
    on cursos (id_instructor);

create table estudiantes_cursos
(
    id_estudiante varchar(50) not null,
    id_curso      varchar(50) not null,
    progreso      int         null,
    primary key (id_estudiante, id_curso),
    constraint estudiantes_cursos_ibfk_1
        foreign key (id_estudiante) references estudiantes (id),
    constraint estudiantes_cursos_ibfk_2
        foreign key (id_curso) references cursos (id)
);

create index id_curso
    on estudiantes_cursos (id_curso);

create table recordatorios
(
    id    varchar(50) not null
        primary key,
    texto text        not null,
    color varchar(50) null
);

create table registros_asistencia
(
    id                varchar(50)                                          not null
        primary key,
    id_estudiante     varchar(50)                                          null,
    nombre_estudiante varchar(100)                                         null,
    id_curso          varchar(50)                                          null,
    nombre_curso      varchar(100)                                         null,
    fecha             date                                                 not null,
    estado            enum ('Presente', 'Ausente', 'Tarde', 'Justificado') not null,
    constraint registros_asistencia_ibfk_1
        foreign key (id_estudiante) references estudiantes (id),
    constraint registros_asistencia_ibfk_2
        foreign key (id_curso) references cursos (id)
);

create index id_curso
    on registros_asistencia (id_curso);

create index id_estudiante
    on registros_asistencia (id_estudiante);

create table reportes_notas
(
    id           int auto_increment
        primary key,
    nombre_clase varchar(50) not null
);

create table materias_reportes_notas
(
    id               int auto_increment
        primary key,
    id_reporte_notas int          null,
    materia          varchar(100) not null,
    constraint materias_reportes_notas_ibfk_1
        foreign key (id_reporte_notas) references reportes_notas (id)
);

create index id_reporte_notas
    on materias_reportes_notas (id_reporte_notas);

create table puntuaciones_notas
(
    id                int auto_increment
        primary key,
    id_reporte_notas  int          null,
    id_estudiante     varchar(50)  null,
    nombre_estudiante varchar(100) null,
    constraint puntuaciones_notas_ibfk_1
        foreign key (id_reporte_notas) references reportes_notas (id),
    constraint puntuaciones_notas_ibfk_2
        foreign key (id_estudiante) references estudiantes (id)
);

create index id_estudiante
    on puntuaciones_notas (id_estudiante);

create index id_reporte_notas
    on puntuaciones_notas (id_reporte_notas);

create table solicitudes_licencia_estudiantes
(
    id              int                                         not null
        primary key,
    tipo            varchar(100)                                not null,
    fecha_solicitud varchar(50)                                 not null,
    estado          enum ('aprobado', 'rechazado', 'pendiente') not null,
    descripcion     text                                        not null,
    rango_fechas    varchar(100)                                not null
);

create table tareas
(
    id                varchar(50)                                   not null
        primary key,
    id_curso          varchar(50)                                   null,
    titulo            varchar(100)                                  not null,
    descripcion       text                                          null,
    fecha_entrega     date                                          not null,
    estado            enum ('Pendiente', 'Entregado', 'Calificado') not null,
    nota              int                                           null,
    archivo_entregado varchar(255)                                  null,
    retroalimentacion text                                          null,
    constraint tareas_ibfk_1
        foreign key (id_curso) references cursos (id)
);

create index id_curso
    on tareas (id_curso);

create table usuarios
(
    id            int unsigned                                            not null,
    identificador varchar(40)                                             not null,
    correo        varchar(256)                                            not null,
    contrasena    varchar(700)                                            not null,
    rol           enum ('admin', 'profesor', 'estudiante', 'propietario') not null,
    tema          enum ('claro', 'oscuro') default 'claro'                not null
)
    collate = utf8mb4_unicode_ci;

create table valores_puntuaciones_notas
(
    id                 int auto_increment
        primary key,
    id_puntuacion_nota int null,
    id_materia         int null,
    puntuacion         int null,
    constraint valores_puntuaciones_notas_ibfk_1
        foreign key (id_puntuacion_nota) references puntuaciones_notas (id),
    constraint valores_puntuaciones_notas_ibfk_2
        foreign key (id_materia) references materias_reportes_notas (id)
);

create index id_materia
    on valores_puntuaciones_notas (id_materia);

create index id_puntuacion_nota
    on valores_puntuaciones_notas (id_puntuacion_nota);

