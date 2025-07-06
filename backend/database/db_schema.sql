-- Sofía Educa - Database Schema
--
-- This script defines the complete database structure for the application.
-- It is optimized for performance and scalability, using integer-based foreign keys
-- and appropriate indexes.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

--
-- Table structure for table `usuarios`
-- Core table for authentication and roles. All users (admins, teachers, students) have an entry here.
--
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `correo` VARCHAR(255) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'profesor', 'estudiante') NOT NULL,
  `creado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_correo_unico` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `perfiles`
-- Stores common profile information for all users to reduce redundancy.
--
DROP TABLE IF EXISTS `perfiles`;
CREATE TABLE `perfiles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE DEFAULT NULL,
  `genero` ENUM('masculino', 'femenino', 'otro') DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `url_avatar` VARCHAR(255) DEFAULT 'https://placehold.co/100x100.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_usuario_id_unico` (`usuario_id`),
  CONSTRAINT `fk_perfiles_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `clases`
-- Represents a grade level and section, e.g., "3º de Secundaria - Sección A".
--
DROP TABLE IF EXISTS `clases`;
CREATE TABLE `clases` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL, -- e.g., "3º de Secundaria"
  `seccion` VARCHAR(10) NOT NULL, -- e.g., "A"
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_nombre_seccion_unico` (`nombre`, `seccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Table structure for table `estudiantes`
-- Student-specific information, linked to a user and a profile.
--
DROP TABLE IF EXISTS `estudiantes`;
CREATE TABLE `estudiantes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NOT NULL,
  `clase_id` INT UNSIGNED NOT NULL,
  `nombre_tutor` VARCHAR(200) DEFAULT NULL,
  `contacto_tutor` VARCHAR(20) DEFAULT NULL,
  `fecha_matricula` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_usuario_id_unico_estudiante` (`usuario_id`),
  KEY `idx_clase_id` (`clase_id`),
  CONSTRAINT `fk_estudiantes_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_estudiantes_clases` FOREIGN KEY (`clase_id`) REFERENCES `clases` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `profesores`
-- Teacher-specific information.
--
DROP TABLE IF EXISTS `profesores`;
CREATE TABLE `profesores` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NOT NULL,
  `departamento` VARCHAR(100) DEFAULT NULL,
  `especialidad` VARCHAR(100) DEFAULT NULL,
  `estado` ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_usuario_id_unico_profesor` (`usuario_id`),
  CONSTRAINT `fk_profesores_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `cursos`
-- Represents a specific course offering for an academic period.
--
DROP TABLE IF EXISTS `cursos`;
CREATE TABLE `cursos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(20) NOT NULL,
  `descripcion` TEXT,
  `profesor_id` INT UNSIGNED NOT NULL,
  `clase_id` INT UNSIGNED NOT NULL,
  `periodo_academico` VARCHAR(50) NOT NULL, -- e.g., "2024-2025"
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_codigo_periodo_unico` (`codigo`, `periodo_academico`),
  KEY `idx_profesor_id` (`profesor_id`),
  KEY `idx_clase_id_curso` (`clase_id`),
  CONSTRAINT `fk_cursos_profesores` FOREIGN KEY (`profesor_id`) REFERENCES `profesores` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_cursos_clases` FOREIGN KEY (`clase_id`) REFERENCES `clases` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `matriculas`
-- Many-to-many relationship between students and courses.
--
DROP TABLE IF EXISTS `matriculas`;
CREATE TABLE `matriculas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `estudiante_id` INT UNSIGNED NOT NULL,
  `curso_id` INT UNSIGNED NOT NULL,
  `progreso` INT UNSIGNED NOT NULL DEFAULT '0',
  `fecha_matricula` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_estudiante_curso_unico` (`estudiante_id`, `curso_id`),
  KEY `idx_curso_id_matricula` (`curso_id`),
  CONSTRAINT `fk_matriculas_estudiantes` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_matriculas_cursos` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Table structure for table `horarios`
--
DROP TABLE IF EXISTS `horarios`;
CREATE TABLE `horarios` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `curso_id` INT UNSIGNED NOT NULL,
    `dia_semana` ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado') NOT NULL,
    `hora_inicio` TIME NOT NULL,
    `hora_fin` TIME NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_curso_id_horario` (`curso_id`),
    CONSTRAINT `fk_horarios_cursos` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `asistencia`
--
DROP TABLE IF EXISTS `asistencia`;
CREATE TABLE `asistencia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `matricula_id` INT UNSIGNED NOT NULL,
  `fecha` DATE NOT NULL,
  `estado` ENUM('presente', 'ausente', 'tarde', 'justificado') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_matricula_fecha_unica` (`matricula_id`, `fecha`),
  CONSTRAINT `fk_asistencia_matriculas` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `evaluaciones` (Assignments/Exams)
--
DROP TABLE IF EXISTS `evaluaciones`;
CREATE TABLE `evaluaciones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `curso_id` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `fecha_entrega` DATETIME NOT NULL,
  `tipo` ENUM('tarea', 'examen', 'proyecto') NOT NULL,
  `puntaje_maximo` INT NOT NULL DEFAULT '20',
  PRIMARY KEY (`id`),
  KEY `idx_curso_id_evaluacion` (`curso_id`),
  CONSTRAINT `fk_evaluaciones_cursos` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `calificaciones` (Grades)
--
DROP TABLE IF EXISTS `calificaciones`;
CREATE TABLE `calificaciones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `evaluacion_id` INT UNSIGNED NOT NULL,
  `matricula_id` INT UNSIGNED NOT NULL,
  `nota` DECIMAL(5,2) DEFAULT NULL,
  `fecha_entrega_estudiante` DATETIME DEFAULT NULL,
  `archivo_entregado` VARCHAR(255) DEFAULT NULL,
  `retroalimentacion` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_evaluacion_matricula_unica` (`evaluacion_id`, `matricula_id`),
  KEY `idx_matricula_id_calificacion` (`matricula_id`),
  CONSTRAINT `fk_calificaciones_evaluaciones` FOREIGN KEY (`evaluacion_id`) REFERENCES `evaluaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_calificaciones_matriculas` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Table structure for table `avisos`
--
DROP TABLE IF EXISTS `avisos`;
CREATE TABLE `avisos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `contenido` TEXT NOT NULL,
  `autor_usuario_id` INT UNSIGNED NOT NULL,
  `fecha_publicacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `importancia` ENUM('normal', 'informativo', 'advertencia', 'urgente') NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`),
  KEY `idx_autor_id` (`autor_usuario_id`),
  CONSTRAINT `fk_avisos_usuarios` FOREIGN KEY (`autor_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `solicitudes_licencia`
--
DROP TABLE IF EXISTS `solicitudes_licencia`;
CREATE TABLE `solicitudes_licencia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NOT NULL,
  `tipo` VARCHAR(100) NOT NULL,
  `motivo` TEXT NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` ENUM('pendiente', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente',
  `fecha_solicitud` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario_id_licencia` (`usuario_id`),
  CONSTRAINT `fk_licencias_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Mock Data Insertion
--
SET FOREIGN_KEY_CHECKS = 1;

-- Usuarios (contraseña para todos es 'password')
INSERT INTO `usuarios` (`correo`, `contrasena`, `rol`) VALUES
('admin@sofiaeduca.com', '$2b$10$vGVL296M29/2qiS3vAsf.uG8.MLirFFEcg21O75WJ2ooL2U58oZ4a', 'admin'),
('juan.docente@sofiaeduca.com', '$2b$10$vGVL296M29/2qiS3vAsf.uG8.MLirFFEcg21O75WJ2ooL2U58oZ4a', 'profesor'),
('ana.perez@sofiaeduca.com', '$2b$10$vGVL296M29/2qiS3vAsf.uG8.MLirFFEcg21O75WJ2ooL2U58oZ4a', 'estudiante');

-- Perfiles
INSERT INTO `perfiles` (`usuario_id`, `nombre`, `apellido`, `fecha_nacimiento`, `genero`, `telefono`, `direccion`) VALUES
(1, 'Admin', 'Principal', '1980-01-01', 'otro', '999888777', 'Av. Central 100, Lima'),
(2, 'Juan', 'Docente', '1985-05-20', 'masculino', '987654321', 'Calle de los Sabios 20, Miraflores'),
(3, 'Ana', 'Pérez', '2008-04-10', 'femenino', '912345678', 'Jr. Los Girasoles 123, Surco');

-- Clases
INSERT INTO `clases` (`nombre`, `seccion`) VALUES
('3º de Secundaria', 'A'),
('4º de Secundaria', 'B'),
('5º de Secundaria', 'A');

-- Estudiantes (info específica)
INSERT INTO `estudiantes` (`usuario_id`, `clase_id`, `nombre_tutor`, `contacto_tutor`, `fecha_matricula`) VALUES
(3, 1, 'Carlos Pérez', '987654321', '2023-03-01');

-- Profesores (info específica)
INSERT INTO `profesores` (`usuario_id`, `departamento`, `especialidad`) VALUES
(2, 'Ciencias y Matemáticas', 'Matemáticas Puras');

-- Cursos
INSERT INTO `cursos` (`nombre`, `codigo`, `descripcion`, `profesor_id`, `clase_id`, `periodo_academico`) VALUES
('Álgebra y Geometría', 'MAT301', 'Curso introductorio a los fundamentos del álgebra y la geometría.', 1, 1, '2024-II'),
('Historia del Perú', 'HIS301', 'Un recorrido por la rica historia del Perú, desde las culturas preincas hasta la actualidad.', 1, 1, '2024-II');

-- Matrículas
INSERT INTO `matriculas` (`estudiante_id`, `curso_id`, `progreso`) VALUES
(1, 1, 75),
(1, 2, 60);
