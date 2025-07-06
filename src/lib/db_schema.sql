-- Base de Datos para Sofía Educa - Sistema de Gestión Escolar
-- Diseñada para ser robusta, escalable y alineada con el frontend.
-- Versión 2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `sofia_educa_db`
--
CREATE DATABASE IF NOT EXISTS `sofia_educa_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sofia_educa_db`;

-- --------------------------------------------------------

--
-- Tabla `usuarios`
-- Almacena la información básica para la autenticación y el rol de cada persona en el sistema.
--
CREATE TABLE `usuarios` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `correo` VARCHAR(255) NOT NULL UNIQUE,
  `contrasena_hash` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'docente', 'estudiante') NOT NULL,
  `nombre_completo` VARCHAR(255) NOT NULL,
  `url_avatar` VARCHAR(255) DEFAULT 'https://placehold.co/100x100.png',
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `clases`
-- Define los grados y secciones disponibles en la institución.
--
CREATE TABLE `clases` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `grado` VARCHAR(50) NOT NULL COMMENT 'Ej: 3ro de Secundaria',
  `seccion` VARCHAR(10) NOT NULL COMMENT 'Ej: A, B, C',
  `aula` VARCHAR(50) DEFAULT NULL COMMENT 'Ej: Aula 101',
  UNIQUE KEY `grado_seccion_unique` (`grado`, `seccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `docentes`
-- Almacena información detallada y específica de los docentes.
--
CREATE TABLE `docentes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT UNSIGNED NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE DEFAULT NULL,
  `genero` ENUM('Masculino', 'Femenino', 'Otro') DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `contacto_referencia` VARCHAR(20) DEFAULT NULL,
  `relacion_referencia` VARCHAR(50) DEFAULT NULL,
  CONSTRAINT `fk_docente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `estudiantes`
-- Almacena información detallada de los estudiantes, incluyendo datos del apoderado.
--
CREATE TABLE `estudiantes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT UNSIGNED NOT NULL,
  `id_clase` INT UNSIGNED DEFAULT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE DEFAULT NULL,
  `genero` ENUM('Masculino', 'Femenino', 'Otro') DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `ciudad` VARCHAR(100) DEFAULT NULL,
  `departamento` VARCHAR(100) DEFAULT NULL,
  `fecha_matricula` DATE NOT NULL,
  `nombre_apoderado` VARCHAR(200) DEFAULT NULL,
  `contacto_apoderado` VARCHAR(20) DEFAULT NULL,
  `correo_apoderado` VARCHAR(255) DEFAULT NULL,
  `direccion_apoderado` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_estudiante_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_estudiante_clase` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `asignaturas`
-- Catálogo de todas las materias que se pueden impartir.
--
CREATE TABLE `asignaturas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `departamento` VARCHAR(100) DEFAULT NULL COMMENT 'Ej: Ciencias, Humanidades'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `cursos`
-- Instancia de una asignatura impartida por un docente en una clase específica durante un año académico.
--
CREATE TABLE `cursos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_asignatura` INT UNSIGNED NOT NULL,
  `id_clase` INT UNSIGNED NOT NULL,
  `id_docente` INT UNSIGNED NOT NULL,
  `codigo_curso` VARCHAR(20) NOT NULL UNIQUE,
  `horario` VARCHAR(255) DEFAULT NULL COMMENT 'Ej: Lu, Mi 10:00-11:30',
  `capacidad` INT UNSIGNED DEFAULT 30,
  `ano_academico` YEAR NOT NULL,
  `url_syllabus` VARCHAR(255) DEFAULT NULL,
  `descripcion` TEXT,
  CONSTRAINT `fk_curso_asignatura` FOREIGN KEY (`id_asignatura`) REFERENCES `asignaturas` (`id`),
  CONSTRAINT `fk_curso_clase` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`),
  CONSTRAINT `fk_curso_docente` FOREIGN KEY (`id_docente`) REFERENCES `docentes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `inscripciones` (Matrículas)
-- Tabla de unión que registra qué estudiante está inscrito en qué curso.
--
CREATE TABLE `inscripciones` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_estudiante` INT UNSIGNED NOT NULL,
  `id_curso` INT UNSIGNED NOT NULL,
  `fecha_inscripcion` DATE NOT NULL,
  `progreso_curso` TINYINT UNSIGNED DEFAULT 0,
  UNIQUE KEY `estudiante_curso_unique` (`id_estudiante`, `id_curso`),
  CONSTRAINT `fk_inscripcion_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inscripcion_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `asistencia`
-- Registra la asistencia diaria de un estudiante a un curso.
--
CREATE TABLE `asistencia` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_inscripcion` INT UNSIGNED NOT NULL,
  `fecha` DATE NOT NULL,
  `estado` ENUM('Presente', 'Ausente', 'Tarde', 'Justificado') NOT NULL,
  UNIQUE KEY `asistencia_unica` (`id_inscripcion`, `fecha`),
  CONSTRAINT `fk_asistencia_inscripcion` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `tareas`
-- Tareas asignadas por un docente para un curso.
--
CREATE TABLE `tareas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_curso` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `fecha_publicacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` DATETIME NOT NULL,
  CONSTRAINT `fk_tarea_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `entregas`
-- Entregas de tareas realizadas por los estudiantes.
--
CREATE TABLE `entregas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_tarea` INT UNSIGNED NOT NULL,
  `id_estudiante` INT UNSIGNED NOT NULL,
  `fecha_entrega` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url_archivo` VARCHAR(255) DEFAULT NULL,
  `estado` ENUM('Entregado', 'Calificado') NOT NULL DEFAULT 'Entregado',
  `nota` DECIMAL(5, 2) DEFAULT NULL,
  `retroalimentacion` TEXT,
  UNIQUE KEY `entrega_unica` (`id_tarea`, `id_estudiante`),
  CONSTRAINT `fk_entrega_tarea` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_entrega_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `comunicados`
-- Noticias y anuncios para la comunidad escolar.
--
CREATE TABLE `comunicados` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_usuario_emisor` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `contenido` TEXT NOT NULL,
  `importancia` ENUM('normal', 'informativo', 'advertencia', 'urgente') NOT NULL DEFAULT 'normal',
  `rol_destino` ENUM('todos', 'admin', 'docente', 'estudiante') DEFAULT 'todos',
  `id_clase_destino` INT UNSIGNED DEFAULT NULL,
  `fecha_publicacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_comunicado_usuario` FOREIGN KEY (`id_usuario_emisor`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_comunicado_clase` FOREIGN KEY (`id_clase_destino`) REFERENCES `clases` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `solicitudes_permiso`
-- Solicitudes de licencia/permiso de docentes y estudiantes.
--
CREATE TABLE `solicitudes_permiso` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_usuario_solicitante` INT UNSIGNED NOT NULL,
  `tipo_permiso` VARCHAR(100) NOT NULL,
  `motivo` TEXT NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` ENUM('Pendiente', 'Aprobado', 'Rechazado') NOT NULL DEFAULT 'Pendiente',
  `fecha_solicitud` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_permiso_usuario` FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `eventos_calendario`
-- Eventos generales de la escuela (feriados, reuniones, etc.).
--
CREATE TABLE `eventos_calendario` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `fecha_inicio` DATETIME NOT NULL,
  `fecha_fin` DATETIME DEFAULT NULL,
  `tipo_evento` VARCHAR(50) NOT NULL COMMENT 'Ej: Feriado, Examen, Actividad',
  `color` VARCHAR(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabla `codigos_otp`
-- Almacena los códigos para la recuperación de contraseñas.
--
CREATE TABLE `codigos_otp` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `correo` VARCHAR(255) NOT NULL,
  `codigo` VARCHAR(10) NOT NULL,
  `fecha_expiracion` TIMESTAMP NOT NULL,
  KEY `idx_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------
-- INSERCIÓN DE DATOS DE EJEMPLO
-- --------------------------------------------------------

-- Insertar Clases
INSERT INTO `clases` (`id`, `grado`, `seccion`, `aula`) VALUES
(1, '3er Grado de Secundaria', 'A', '101'),
(2, '4to Grado de Secundaria', 'A', '201'),
(3, '5to Grado de Secundaria', 'B', '302');

-- Insertar Usuarios (con contraseñas hasheadas para 'password')
-- La contraseña para todos es 'password'. El hash se genera con: const hashed = await bcrypt.hash('password', 10);
INSERT INTO `usuarios` (`id`, `correo`, `contrasena_hash`, `rol`, `nombre_completo`, `url_avatar`) VALUES
(1, 'admin@sofiaeduca.com', '$2b$10$t/vX2YgE3z.yv.u3nO4wE.m4zL8y.wF5nU2YqI4zE/qN6q.m5rS.G', 'admin', 'Admin General', 'https://placehold.co/100x100/7F00FF/FFFFFF.png'),
(2, 'juan.docente@sofiaeduca.com', '$2b$10$t/vX2YgE3z.yv.u3nO4wE.m4zL8y.wF5nU2YqI4zE/qN6q.m5rS.G', 'docente', 'Juan Pérez Docente', 'https://placehold.co/100x100/007FFF/FFFFFF.png'),
(3, 'maria.docente@sofiaeduca.com', '$2b$10$t/vX2YgE3z.yv.u3nO4wE.m4zL8y.wF5nU2YqI4zE/qN6q.m5rS.G', 'docente', 'María García Docente', 'https://placehold.co/100x100/FF7F00/FFFFFF.png'),
(4, 'ana.perez@example.com', '$2b$10$t/vX2YgE3z.yv.u3nO4wE.m4zL8y.wF5nU2YqI4zE/qN6q.m5rS.G', 'estudiante', 'Ana Pérez', 'https://placehold.co/100x100/00FF7F/FFFFFF.png'),
(5, 'luis.garcia@example.com', '$2b$10$t/vX2YgE3z.yv.u3nO4wE.m4zL8y.wF5nU2YqI4zE/qN6q.m5rS.G', 'estudiante', 'Luis García', 'https://placehold.co/100x100/FF007F/FFFFFF.png');

-- Insertar Docentes
INSERT INTO `docentes` (`id`, `id_usuario`, `nombres`, `apellidos`, `telefono`, `contacto_referencia`, `relacion_referencia`) VALUES
(1, 2, 'Juan', 'Pérez', '987654321', '911223344', 'Esposa'),
(2, 3, 'María', 'García', '987654322', '922334455', 'Hermano');

-- Insertar Estudiantes
INSERT INTO `estudiantes` (`id`, `id_usuario`, `id_clase`, `nombres`, `apellidos`, `fecha_matricula`, `nombre_apoderado`, `contacto_apoderado`) VALUES
(1, 4, 2, 'Ana', 'Pérez', '2024-03-01', 'Carlos Pérez', '912345678'),
(2, 5, 3, 'Luis', 'García', '2024-03-01', 'Marta García', '923456789');

-- Insertar Asignaturas
INSERT INTO `asignaturas` (`id`, `nombre`, `departamento`) VALUES
(1, 'Matemáticas', 'Ciencias'),
(2, 'Historia del Perú', 'Humanidades'),
(3, 'Química', 'Ciencias'),
(4, 'Arte y Cultura', 'Artes');

-- Insertar Cursos (Asignaturas impartidas en una clase por un docente)
INSERT INTO `cursos` (`id`, `id_asignatura`, `id_clase`, `id_docente`, `codigo_curso`, `horario`, `ano_academico`) VALUES
(1, 1, 2, 1, 'MAT-4A-2024', 'Lu 08:00-09:30, Mi 08:00-09:30', 2024),
(2, 2, 2, 2, 'HIS-4A-2024', 'Ma 10:00-11:30, Ju 10:00-11:30', 2024),
(3, 1, 3, 1, 'MAT-5B-2024', 'Lu 10:00-11:30, Vi 10:00-11:30', 2024);

-- Insertar Inscripciones (Matrículas de estudiantes a cursos)
INSERT INTO `inscripciones` (`id_estudiante`, `id_curso`, `fecha_inscripcion`, `progreso_curso`) VALUES
(1, 1, '2024-03-01', 75),
(1, 2, '2024-03-01', 60),
(2, 3, '2024-03-01', 88);

-- Insertar Comunicados
INSERT INTO `comunicados` (`id_usuario_emisor`, `titulo`, `contenido`, `importancia`) VALUES
(1, 'Inicio del Año Escolar 2024', 'Bienvenidos al nuevo año escolar. Las clases inician el 1 de marzo.', 'informativo'),
(1, 'Simulacro de Sismo', 'El próximo viernes se realizará un simulacro de sismo a las 10:00 AM.', 'advertencia');

-- Insertar Eventos
INSERT INTO `eventos_calendario` (`titulo`, `descripcion`, `fecha_inicio`, `fecha_fin`, `tipo_evento`, `color`) VALUES
('Día del Trabajo', 'Feriado nacional', '2024-05-01 00:00:00', '2024-05-01 23:59:59', 'Feriado', '#808080'),
('Exámenes Bimestrales', 'Semana de exámenes del primer bimestre', '2024-05-13 08:00:00', '2024-05-17 14:00:00', 'Examen', '#FF4136');


COMMIT;
