-- Base de datos para Sofía Educa
-- Diseñado para ser eficiente, escalable y alineado con el frontend.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- 1. TABLAS DE AUTENTICACIÓN Y USUARIOS
--

-- Tabla central de usuarios para manejar el acceso
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `correo` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('admin','docente','estudiante') NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo_unico` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla para la recuperación de contraseñas con OTP
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `correo` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- 2. TABLAS DE ENTIDADES PRINCIPALES (ROLES)
--

-- Tabla para los datos del Administrador
DROP TABLE IF EXISTS `administradores`;
CREATE TABLE `administradores` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `url_avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_admin_usuario` (`id_usuario`),
  CONSTRAINT `fk_admin_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla para los datos del Docente
DROP TABLE IF EXISTS `docentes`;
CREATE TABLE `docentes` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `url_avatar` varchar(255) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`id`),
  KEY `fk_docente_usuario` (`id_usuario`),
  CONSTRAINT `fk_docente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla para Grados y Secciones
DROP TABLE IF EXISTS `clases`;
CREATE TABLE `clases` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL COMMENT 'Ej: 3º de Secundaria',
  `seccion` varchar(10) NOT NULL COMMENT 'Ej: A, B, C',
  PRIMARY KEY (`id`),
  UNIQUE KEY `clase_seccion_unica` (`nombre`,`seccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla para los datos del Estudiante
DROP TABLE IF EXISTS `estudiantes`;
CREATE TABLE `estudiantes` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `id_clase` int UNSIGNED NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `url_avatar` varchar(255) DEFAULT NULL,
  `nombre_tutor` varchar(200) DEFAULT NULL,
  `contacto_tutor` varchar(20) DEFAULT NULL,
  `fecha_matricula` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_estudiante_usuario` (`id_usuario`),
  KEY `fk_estudiante_clase` (`id_clase`),
  CONSTRAINT `fk_estudiante_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_estudiante_clase` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- 3. TABLAS DE ESTRUCTURA ACADÉMICA
--

-- Tabla de Cursos o Materias
DROP TABLE IF EXISTS `cursos`;
CREATE TABLE `cursos` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `id_docente` int UNSIGNED NOT NULL,
  `id_clase` int UNSIGNED NOT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `capacidad` int UNSIGNED DEFAULT 30,
  `horario_texto` varchar(255) DEFAULT NULL COMMENT 'Ej: Lu, Mi 10-11:30',
  `url_plan_estudios` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_unico` (`codigo`),
  KEY `fk_curso_docente` (`id_docente`),
  KEY `fk_curso_clase` (`id_clase`),
  CONSTRAINT `fk_curso_docente` FOREIGN KEY (`id_docente`) REFERENCES `docentes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_curso_clase` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de unión para la matrícula de estudiantes en cursos
DROP TABLE IF EXISTS `estudiantes_cursos`;
CREATE TABLE `estudiantes_cursos` (
  `id_estudiante` int UNSIGNED NOT NULL,
  `id_curso` int UNSIGNED NOT NULL,
  `progreso` int UNSIGNED DEFAULT '0',
  PRIMARY KEY (`id_estudiante`,`id_curso`),
  KEY `fk_matricula_curso` (`id_curso`),
  CONSTRAINT `fk_matricula_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_matricula_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla para el horario detallado de clases
DROP TABLE IF EXISTS `horarios`;
CREATE TABLE `horarios` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_clase` int UNSIGNED NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `id_curso` int UNSIGNED DEFAULT NULL,
  `nombre_evento` varchar(100) DEFAULT NULL COMMENT 'Para recesos, etc.',
  PRIMARY KEY (`id`),
  KEY `fk_horario_clase` (`id_clase`),
  KEY `fk_horario_curso` (`id_curso`),
  CONSTRAINT `fk_horario_clase` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_horario_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- 4. TABLAS OPERACIONALES
--

-- Tabla de Asistencia
DROP TABLE IF EXISTS `asistencia`;
CREATE TABLE `asistencia` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_estudiante` int UNSIGNED NOT NULL,
  `id_curso` int UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('Presente','Ausente','Tarde','Justificado') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_asistencia_estudiante` (`id_estudiante`),
  KEY `fk_asistencia_curso` (`id_curso`),
  CONSTRAINT `fk_asistencia_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_asistencia_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de Tareas
DROP TABLE IF EXISTS `tareas`;
CREATE TABLE `tareas` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_curso` int UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha_publicacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` datetime NOT NULL,
  `puntaje_total` int DEFAULT '20',
  PRIMARY KEY (`id`),
  KEY `fk_tarea_curso` (`id_curso`),
  CONSTRAINT `fk_tarea_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de Entregas de Tareas
DROP TABLE IF EXISTS `entregas_tareas`;
CREATE TABLE `entregas_tareas` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_tarea` int UNSIGNED NOT NULL,
  `id_estudiante` int UNSIGNED NOT NULL,
  `fecha_entrega` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url_archivo` varchar(255) DEFAULT NULL,
  `nota` decimal(5,2) DEFAULT NULL,
  `retroalimentacion` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `entrega_unica` (`id_tarea`,`id_estudiante`),
  KEY `fk_entrega_estudiante` (`id_estudiante`),
  CONSTRAINT `fk_entrega_tarea` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_entrega_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de Calificaciones (Boleta de Notas)
DROP TABLE IF EXISTS `calificaciones`;
CREATE TABLE `calificaciones` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_estudiante` int UNSIGNED NOT NULL,
  `id_curso` int UNSIGNED NOT NULL,
  `bimestre` int UNSIGNED NOT NULL,
  `nota_final` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `calificacion_unica` (`id_estudiante`,`id_curso`,`bimestre`),
  KEY `fk_calificacion_curso` (`id_curso`),
  CONSTRAINT `fk_calificacion_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_calificacion_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 5. TABLAS DE COMUNICACIONES
--

-- Tabla de Comunicados (Noticias)
DROP TABLE IF EXISTS `comunicados`;
CREATE TABLE `comunicados` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario_emisor` int UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `importancia` enum('normal','media','alta') NOT NULL DEFAULT 'normal',
  `url_archivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comunicado_usuario` (`id_usuario_emisor`),
  CONSTRAINT `fk_comunicado_usuario` FOREIGN KEY (`id_usuario_emisor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabla de Solicitudes de Permiso
DROP TABLE IF EXISTS `solicitudes_permiso`;
CREATE TABLE `solicitudes_permiso` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario_solicitante` int UNSIGNED NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `motivo` text,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('pendiente','aprobado','rechazado') NOT NULL DEFAULT 'pendiente',
  `fecha_solicitud` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_permiso_usuario` (`id_usuario_solicitante`),
  CONSTRAINT `fk_permiso_usuario` FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- INSERCIÓN DE DATOS DE EJEMPLO
--

-- Usuarios (contraseña para todos: 'password123' hasheada con bcrypt)
INSERT INTO `usuarios` (`correo`, `contrasena`, `rol`) VALUES
('admin@sofiaeduca.com', '$2b$10$w3/c.h/FFVjA8Pck0rI/mOzY7G0f.42CoYwZkwtJppk2bUj476pCa', 'admin'),
('juan.docente@sofiaeduca.com', '$2b$10$w3/c.h/FFVjA8Pck0rI/mOzY7G0f.42CoYwZkwtJppk2bUj476pCa', 'docente'),
('isabel.docente@sofiaeduca.com', '$2b$10$w3/c.h/FFVjA8Pck0rI/mOzY7G0f.42CoYwZkwtJppk2bUj476pCa', 'docente'),
('ana.perez@example.com', '$2b$10$w3/c.h/FFVjA8Pck0rI/mOzY7G0f.42CoYwZkwtJppk2bUj476pCa', 'estudiante'),
('luis.garcia@example.com', '$2b$10$w3/c.h/FFVjA8Pck0rI/mOzY7G0f.42CoYwZkwtJppk2bUj476pCa', 'estudiante');

-- Administradores
INSERT INTO `administradores` (`id_usuario`, `nombre`, `apellido`, `telefono`) VALUES
(1, 'Admin', 'Principal', '999888777');

-- Docentes
INSERT INTO `docentes` (`id_usuario`, `nombre`, `apellido`, `telefono`, `estado`) VALUES
(2, 'Juan', 'Docente', '987654321', 'Activo'),
(3, 'Isabel', 'Maestra', '987654322', 'Activo');

-- Clases
INSERT INTO `clases` (`nombre`, `seccion`) VALUES
('3º de Secundaria', 'A'),
('4º de Secundaria', 'A');

-- Estudiantes
INSERT INTO `estudiantes` (`id_usuario`, `nombre`, `apellido`, `id_clase`, `nombre_tutor`, `contacto_tutor`, `fecha_matricula`) VALUES
(4, 'Ana', 'Pérez', 1, 'Carlos Pérez', '911222333', '2024-03-01'),
(5, 'Luis', 'García', 2, 'María García', '922333444', '2024-03-01');

-- Cursos
INSERT INTO `cursos` (`codigo`, `nombre`, `descripcion`, `id_docente`, `id_clase`, `departamento`, `horario_texto`) VALUES
('MAT-301', 'Matemáticas III', 'Curso de matemáticas para tercer año.', 1, 1, 'Ciencias Exactas', 'Lun, Mié 08:00-09:30'),
('HIS-301', 'Historia del Perú', 'Historia peruana desde la época pre-inca.', 2, 1, 'Ciencias Sociales', 'Mar, Jue 08:00-09:30'),
('MAT-401', 'Matemáticas IV', 'Curso de matemáticas para cuarto año.', 1, 2, 'Ciencias Exactas', 'Lun, Mié 10:00-11:30');

-- Matrículas
INSERT INTO `estudiantes_cursos` (`id_estudiante`, `id_curso`, `progreso`) VALUES
(1, 1, 75),
(1, 2, 60),
(2, 3, 85);

-- Tareas
INSERT INTO `tareas` (`id_curso`, `titulo`, `descripcion`, `fecha_entrega`) VALUES
(1, 'Tarea de Álgebra', 'Resolver los ejercicios de la página 50.', '2024-08-15 23:59:59'),
(2, 'Ensayo de la Cultura Inca', 'Escribir un ensayo de 2 páginas sobre el imperio Inca.', '2024-08-20 23:59:59');

-- Entregas
INSERT INTO `entregas_tareas` (`id_tarea`, `id_estudiante`, `nota`, `retroalimentacion`) VALUES
(1, 1, 18.5, 'Excelente trabajo, sigue así.');

-- Calificaciones
INSERT INTO `calificaciones` (`id_estudiante`, `id_curso`, `bimestre`, `nota_final`) VALUES
(1, 1, 1, 17.5),
(1, 2, 1, 15.0),
(1, 1, 2, 18.0),
(2, 3, 1, 16.0);

-- Comunicados
INSERT INTO `comunicados` (`id_usuario_emisor`, `titulo`, `contenido`, `importancia`) VALUES
(1, 'Inicio de Clases Segundo Semestre', 'Les damos la bienvenida al segundo semestre. Las clases inician el 1 de Agosto.', 'alta'),
(2, 'Campaña de Salud', 'Habrá una campaña de vacunación el día 15 de Agosto en el patio principal.', 'normal');


COMMIT;
