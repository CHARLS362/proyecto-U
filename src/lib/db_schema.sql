-- Borrar la base de datos si existe para empezar de cero
DROP DATABASE IF EXISTS `db_abb6c5_gestion`;

-- Crear la base de datos
CREATE DATABASE `db_abb6c5_gestion` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la nueva base de datos
USE `db_abb6c5_gestion`;

-- Tabla para USUARIOS (Central de autenticación)
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `contrasena` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'docente', 'estudiante') NOT NULL,
  `identificador` VARCHAR(40) NOT NULL UNIQUE,
  `tema` ENUM('claro','oscuro') NOT NULL DEFAULT 'claro'
);

-- Tabla para CLASES
CREATE TABLE `clases` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL, -- ej: "3er Grado", "5to de Secundaria"
  `seccion` VARCHAR(10) NOT NULL -- ej: "A", "B"
);

-- Tabla para DOCENTES
CREATE TABLE `docentes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL UNIQUE,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `fecha_nacimiento` DATE,
  `genero` ENUM('masculino', 'femenino', 'otro'),
  `direccion` VARCHAR(255),
  `telefono` VARCHAR(20),
  `contacto_referencia` VARCHAR(20) NULL,
  `relacion_referencia` VARCHAR(50) NULL,
  `url_avatar` VARCHAR(255) DEFAULT 'https://placehold.co/100x100.png',
  `estado` ENUM('activo', 'inactivo') DEFAULT 'activo',
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);

-- Tabla para ESTUDIANTES
CREATE TABLE `estudiantes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL UNIQUE,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `fecha_nacimiento` DATE,
  `genero` ENUM('masculino', 'femenino', 'otro'),
  `direccion` VARCHAR(255),
  `telefono` VARCHAR(20),
  `url_avatar` VARCHAR(255) DEFAULT 'https://placehold.co/100x100.png',
  `id_clase` INT,
  `nombre_tutor` VARCHAR(100),
  `contacto_tutor` VARCHAR(20),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_clase`) REFERENCES `clases`(`id`) ON DELETE SET NULL
);


-- Tabla para ASIGNATURAS
CREATE TABLE `asignaturas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT
);

-- Tabla para CURSOS (Instancia de una asignatura para una clase y profesor)
CREATE TABLE `cursos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(20) NOT NULL UNIQUE,
  `id_asignatura` INT NOT NULL,
  `id_clase` INT NOT NULL,
  `id_docente` INT NOT NULL,
  `horario` VARCHAR(100), -- ej: "Lun 10:00-11:30, Mie 10:00-11:30"
  `capacidad` INT,
  FOREIGN KEY (`id_asignatura`) REFERENCES `asignaturas`(`id`),
  FOREIGN KEY (`id_clase`) REFERENCES `clases`(`id`),
  FOREIGN KEY (`id_docente`) REFERENCES `docentes`(`id`)
);

-- Tabla para INSCRIPCIONES (Tabla de unión para Estudiantes y Cursos)
CREATE TABLE `inscripciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_estudiante` INT NOT NULL,
  `id_curso` INT NOT NULL,
  `fecha_inscripcion` DATE NOT NULL,
  `progreso` INT DEFAULT 0, -- Progreso en porcentaje
  UNIQUE(`id_estudiante`, `id_curso`),
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_curso`) REFERENCES `cursos`(`id`) ON DELETE CASCADE
);

-- Tabla para TAREAS
CREATE TABLE `tareas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_curso` INT NOT NULL,
  `titulo` VARCHAR(100) NOT NULL,
  `descripcion` TEXT,
  `fecha_publicacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` DATETIME NOT NULL,
  FOREIGN KEY (`id_curso`) REFERENCES `cursos`(`id`) ON DELETE CASCADE
);

-- Tabla para ENTREGAS
CREATE TABLE `entregas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_tarea` INT NOT NULL,
  `id_estudiante` INT NOT NULL,
  `fecha_entrega` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `archivo_url` VARCHAR(255),
  `estado` ENUM('entregado', 'calificado', 'retrasado') NOT NULL,
  `nota` DECIMAL(5, 2), -- Nota sobre 20.00
  `retroalimentacion` TEXT,
  UNIQUE(`id_tarea`, `id_estudiante`),
  FOREIGN KEY (`id_tarea`) REFERENCES `tareas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes`(`id`) ON DELETE CASCADE
);


-- Tabla para ASISTENCIA
CREATE TABLE `asistencia` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_estudiante` INT NOT NULL,
  `id_curso` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `estado` ENUM('presente', 'ausente', 'tarde', 'justificado') NOT NULL,
  UNIQUE(`id_estudiante`, `id_curso`, `fecha`),
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_curso`) REFERENCES `cursos`(`id`) ON DELETE CASCADE
);

-- Tabla para EVENTOS_CALENDARIO
CREATE TABLE `eventos_calendario` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(100) NOT NULL,
  `descripcion` TEXT,
  `fecha_inicio` DATETIME NOT NULL,
  `fecha_fin` DATETIME,
  `tipo` ENUM('feriado', 'examen', 'reunion', 'actividad', 'entrega') NOT NULL,
  `color` VARCHAR(20) -- ej: '#FF5733'
);

-- Tabla para COMUNICADOS (Noticias/Anuncios)
CREATE TABLE `comunicados` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(100) NOT NULL,
  `contenido` TEXT,
  `id_emisor` INT NOT NULL,
  `fecha_publicacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `importancia` ENUM('normal', 'media', 'alta') DEFAULT 'normal',
  `destinatario_rol` ENUM('todos', 'docentes', 'estudiantes'),
  `destinatario_clase` INT, -- Opcional, para filtrar por clase
  FOREIGN KEY (`id_emisor`) REFERENCES `usuarios`(`id`),
  FOREIGN KEY (`destinatario_clase`) REFERENCES `clases`(`id`) ON DELETE SET NULL
);

-- Tabla para SOLICITUDES_PERMISO
CREATE TABLE `solicitudes_permiso` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `tipo_permiso` VARCHAR(50) NOT NULL,
  `motivo` TEXT NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `fecha_solicitud` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
);

-- Tabla para CÓDIGOS OTP
CREATE TABLE `codigos_otp` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `correo` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(6) NOT NULL,
  `fecha_expiracion` DATETIME NOT NULL,
  `utilizado` BOOLEAN DEFAULT FALSE
);

-- --- INSERCIÓN DE DATOS DE EJEMPLO ---

-- Usuarios
INSERT INTO `usuarios` (`id`, `correo`, `contrasena`, `rol`, `identificador`) VALUES
(1, 'admin@sofiaeduca.com', '$2b$10$f9vN8L4qj3J/iP/kP3zYpeo2wX6zS5Z.O5eE6zR4j3J/iP/kP3zYp', 'admin', 'ADM001'),
(2, 'juan.perez@sofiaeduca.com', '$2b$10$f9vN8L4qj3J/iP/kP3zYpeo2wX6zS5Z.O5eE6zR4j3J/iP/kP3zYp', 'docente', 'DOC001'),
(3, 'ana.gomez@sofiaeduca.com', '$2b$10$f9vN8L4qj3J/iP/kP3zYpeo2wX6zS5Z.O5eE6zR4j3J/iP/kP3zYp', 'estudiante', 'EST001'),
(4, 'luis.rodriguez@sofiaeduca.com', '$2b$10$f9vN8L4qj3J/iP/kP3zYpeo2wX6zS5Z.O5eE6zR4j3J/iP/kP3zYp', 'estudiante', 'EST002'),
(5, 'maria.garcia@sofiaeduca.com', '$2b$10$f9vN8L4qj3J/iP/kP3zYpeo2wX6zS5Z.O5eE6zR4j3J/iP/kP3zYp', 'docente', 'DOC002');

-- Clases
INSERT INTO `clases` (`id`, `nombre`, `seccion`) VALUES
(1, '5to de Secundaria', 'A'),
(2, '5to de Secundaria', 'B'),
(3, '4to de Secundaria', 'A');

-- Docentes
INSERT INTO `docentes` (`id`, `id_usuario`, `nombre`, `apellido`, `fecha_nacimiento`, `genero`, `direccion`, `telefono`, `contacto_referencia`, `relacion_referencia`) VALUES
(1, 2, 'Juan', 'Pérez', '1985-05-20', 'masculino', 'Av. del Saber 123', '987654321', '912345678', 'Esposa'),
(2, 5, 'María', 'García', '1990-11-15', 'femenino', 'Calle de la Enseñanza 456', '987654322', '912345677', 'Hermano');

-- Estudiantes
INSERT INTO `estudiantes` (`id`, `id_usuario`, `nombre`, `apellido`, `fecha_nacimiento`, `genero`, `direccion`, `telefono`, `id_clase`, `nombre_tutor`, `contacto_tutor`) VALUES
(1, 3, 'Ana', 'Gómez', '2008-04-10', 'femenino', 'Jr. Los Lirios 789', '912345678', 1, 'Marta Gómez', '912345679'),
(2, 4, 'Luis', 'Rodríguez', '2008-08-22', 'masculino', 'Calle Las Begonias 101', '923456789', 1, 'Jorge Rodríguez', '923456780');

-- Asignaturas
INSERT INTO `asignaturas` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Matemáticas V', 'Cálculo diferencial e integral.'),
(2, 'Historia del Perú', 'Desde la época prehispánica hasta la actualidad.'),
(3, 'Química Orgánica', 'Estudio de los compuestos de carbono.');

-- Cursos
INSERT INTO `cursos` (`id`, `codigo`, `id_asignatura`, `id_clase`, `id_docente`, `horario`, `capacidad`) VALUES
(1, 'MAT501A', 1, 1, 1, 'Lun 08:00-10:00, Mie 08:00-10:00', 30),
(2, 'HIS501A', 2, 1, 2, 'Mar 10:00-12:00, Jue 10:00-12:00', 30);

-- Inscripciones
INSERT INTO `inscripciones` (`id`, `id_estudiante`, `id_curso`, `fecha_inscripcion`, `progreso`) VALUES
(1, 1, 1, '2024-03-01', 75),
(2, 1, 2, '2024-03-01', 60),
(3, 2, 1, '2024-03-01', 85);

-- Eventos Calendario
INSERT INTO `eventos_calendario` (`id`, `titulo`, `descripcion`, `fecha_inicio`, `tipo`, `color`) VALUES
(1, 'Examen Parcial de Matemáticas', 'Evaluación de la primera mitad del curso.', '2024-08-15 10:00:00', 'examen', '#dc2626'),
(2, 'Día de la Independencia', 'Feriado nacional.', '2024-07-28 00:00:00', 'feriado', '#6b7280');
