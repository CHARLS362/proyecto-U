SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_sofia_educa`
--
DROP DATABASE IF EXISTS `db_sofia_educa`;
CREATE DATABASE IF NOT EXISTS `db_sofia_educa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_sofia_educa`;

-- =================================================================
-- ESTRUCTURA DE TABLAS (CREACIÓN EN ORDEN DE DEPENDENCIAS)
-- =================================================================

-- --------------------------------------------------------
-- Tabla `usuarios` (Padre de muchos)
--
CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `correo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(700) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','docente','estudiante') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `codigos_otp`
--
CREATE TABLE `codigos_otp` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `correo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_expiracion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `asignaturas` (Materias)
--
CREATE TABLE `asignaturas` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `clases` (Aulas: Nivel, Grado, Sección)
--
CREATE TABLE `clases` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nivel` enum('Primaria','Secundaria') COLLATE utf8mb4_unicode_ci NOT NULL,
  `grado` tinyint(3) UNSIGNED NOT NULL,
  `seccion` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_clase_unica` (`nivel`,`grado`,`seccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `eventos_calendario`
--
CREATE TABLE `eventos_calendario` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `fecha` date NOT NULL,
  `tipo` enum('Feriado','Examen','Reunión','Actividad','Entrega') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ubicacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `administradores`
--
CREATE TABLE `administradores` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `url_avatar` varchar(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `docentes`
--
CREATE TABLE `docentes` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('Masculino','Femenino','Otro') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto_referencia` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relacion_referencia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `estudiantes`
--
CREATE TABLE `estudiantes` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_clase` int(10) UNSIGNED NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_matricula` date NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_apoderado` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto_apoderado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('Masculino','Femenino','Otro') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departamento` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ciudad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo_apoderado` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_apoderado` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento_apoderado` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `cursos`
--
CREATE TABLE `cursos` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_asignatura` int(10) UNSIGNED NOT NULL,
  `id_docente` int(10) UNSIGNED NOT NULL,
  `id_clase` int(10) UNSIGNED NOT NULL,
  `horario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacidad` int(10) UNSIGNED DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_asignatura`) REFERENCES `asignaturas` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_docente`) REFERENCES `docentes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `inscripciones` (Matrículas)
--
CREATE TABLE `inscripciones` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `id_curso` int(10) UNSIGNED NOT NULL,
  `fecha_inscripcion` date NOT NULL,
  `progreso` int(10) UNSIGNED DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_estudiante_curso` (`id_estudiante`,`id_curso`),
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `asistencia`
--
CREATE TABLE `asistencia` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_inscripcion` int(10) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('Presente','Ausente','Tarde','Justificado') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_inscripcion_fecha` (`id_inscripcion`,`fecha`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `tareas`
--
CREATE TABLE `tareas` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_curso` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `fecha_publicacion` datetime NOT NULL,
  `fecha_entrega` datetime NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `entregas`
--
CREATE TABLE `entregas` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_tarea` int(10) UNSIGNED NOT NULL,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `fecha_entrega` datetime NOT NULL,
  `archivo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comentario_estudiante` text COLLATE utf8mb4_unicode_ci,
  `calificacion` decimal(5,2) DEFAULT NULL,
  `comentario_docente` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('Entregado','Calificado') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_tarea_estudiante` (`id_tarea`,`id_estudiante`),
  FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `solicitudes_permiso`
--
CREATE TABLE `solicitudes_permiso` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `tipo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `fecha_solicitud` datetime NOT NULL,
  `estado` enum('Pendiente','Aprobado','Rechazado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Tabla `comunicados`
--
CREATE TABLE `comunicados` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contenido` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_publicacion` datetime NOT NULL,
  `id_autor` int(10) UNSIGNED NOT NULL,
  `importancia` enum('Normal','Media','Alta') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Normal',
  `archivo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_autor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =================================================================
-- VOLCADO DE DATOS (SAMPLE DATA)
-- =================================================================

--
-- Volcado de datos para la tabla `usuarios`
--
INSERT INTO `usuarios` (`id`, `correo`, `contrasena`, `rol`) VALUES
(1, 'admin@sofiaeduca.com', '$2b$10$C.XAZH650r393pZdfU9eXug3j3bA7JpTjT6YpZ7.Hw4mR.zYx2d7K', 'admin'), -- pass: adminpass
(2, 'juan.docente@sofiaeduca.com', '$2b$10$wI/WkQ2K9uXF3.r0y2d9L.yV1k4x5Hw4mR.zYx2d7K/2fG.hJ', 'docente'), -- pass: teacherpass
(3, 'pedro.docente@sofiaeduca.com', '$2b$10$qO/P.uN8vXzE2.t1u3d8M.yV1k4x5Hw4mR.zYx2d7K/2fG.hJ', 'docente'), -- pass: teacherpass
(4, 'ana.perez@example.com', '$2b$10$aB/C.dE1fG2h3i4j5K6l7.yV1k4x5Hw4mR.zYx2d7K/2fG.hJ', 'estudiante'), -- pass: studentpass
(5, 'luis.garcia@example.com', '$2b$10$zX/Y.cW0vU9t8r7q6p5o4.yV1k4x5Hw4mR.zYx2d7K/2fG.hJ', 'estudiante');


--
-- Volcado de datos para la tabla `administradores`
--
INSERT INTO `administradores` (`id`, `id_usuario`, `nombres`, `apellidos`, `url_avatar`) VALUES
(1, 1, 'Admin', 'Principal', 'https://placehold.co/100x100.png');


--
-- Volcado de datos para la tabla `clases`
--
INSERT INTO `clases` (`id`, `nivel`, `grado`, `seccion`) VALUES
(1, 'Primaria', 6, 'A'),
(2, 'Secundaria', 1, 'A'),
(3, 'Secundaria', 1, 'B'),
(4, 'Secundaria', 2, 'A');


--
-- Volcado de datos para la tabla `asignaturas`
--
INSERT INTO `asignaturas` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Matemática', 'Curso de matemática básica y avanzada.'),
(2, 'Comunicación', 'Curso de lenguaje, literatura y redacción.'),
(3, 'Ciencia y Tecnología', 'Curso de ciencias naturales, física y química.'),
(4, 'Ciencias Sociales', 'Curso de historia, geografía y economía.'),
(5, 'Arte y Cultura', 'Curso de apreciación artística y cultural.');


--
-- Volcado de datos para la tabla `docentes`
--
INSERT INTO `docentes` (`id`, `id_usuario`, `nombres`, `apellidos`, `url_avatar`, `telefono`, `direccion`, `fecha_nacimiento`, `genero`, `contacto_referencia`, `relacion_referencia`, `estado`) VALUES
(1, 2, 'Juan', 'Paredes', 'https://placehold.co/100x100.png', '987654321', 'Av. Los Maestros 123', '1985-05-20', 'Masculino', '912345678', 'Esposa', 'Activo'),
(2, 3, 'Maria', 'Gonzales', 'https://placehold.co/100x100.png', '987654322', 'Jr. Las Pizarras 456', '1990-11-15', 'Femenino', '912345677', 'Hermano', 'Activo');


--
-- Volcado de datos para la tabla `estudiantes`
--
INSERT INTO `estudiantes` (`id`, `id_usuario`, `id_clase`, `nombres`, `apellidos`, `url_avatar`, `telefono`, `fecha_matricula`, `direccion`, `nombre_apoderado`, `contacto_apoderado`, `fecha_nacimiento`, `genero`, `departamento`, `ciudad`, `correo_apoderado`, `direccion_apoderado`, `fecha_nacimiento_apoderado`) VALUES
(1, 4, 2, 'Ana', 'Pérez', 'https://placehold.co/100x100.png', '987654321', '2023-03-01', 'Calle Falsa 123, Miraflores', 'Carlos Pérez', '912345678', '2008-04-10', 'Femenino', 'Lima', 'Lima', 'carlos.perez@example.com', 'Calle Falsa 123, Miraflores', '1980-05-15'),
(2, 5, 4, 'Luis', 'García', 'https://placehold.co/100x100.png', '987654322', '2023-03-01', 'Avenida Siempreviva 742, San Isidro', 'María García', '912345677', '2007-08-22', 'Masculino', 'Lima', 'Lima', 'maria.garcia@example.com', 'Avenida Siempreviva 742, San Isidro', '1982-10-20');


--
-- Volcado de datos para la tabla `cursos`
--
INSERT INTO `cursos` (`id`, `id_asignatura`, `id_docente`, `id_clase`, `horario`, `capacidad`, `descripcion`) VALUES
(1, 1, 1, 2, 'Lun, Mié, Vie 10:00-11:30', 30, 'Matemática para 1º de Secundaria - A'),
(2, 4, 2, 2, 'Mar, Jue 08:00-09:30', 25, 'Ciencias Sociales para 1º de Secundaria - A'),
(3, 2, 1, 4, 'Lun, Vie 14:00-15:30', 30, 'Comunicación para 2º de Secundaria - A'),
(4, 3, 2, 4, 'Mar, Jue 11:00-12:30', 25, 'Ciencia y Tecnología para 2º de Secundaria - A');


--
-- Volcado de datos para la tabla `inscripciones`
--
INSERT INTO `inscripciones` (`id`, `id_estudiante`, `id_curso`, `fecha_inscripcion`, `progreso`) VALUES
(1, 1, 1, '2024-03-01', 60),
(2, 1, 2, '2024-03-01', 55),
(3, 2, 3, '2024-03-01', 90),
(4, 2, 4, '2024-03-01', 75);


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
