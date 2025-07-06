--
-- Base de Datos: sofia_educa_db
-- Descripción: Esquema completo para el sistema de gestión escolar "Sofía Educa".
--

--
-- Desactivar verificación de claves foráneas para la carga inicial.
--
SET FOREIGN_KEY_CHECKS=0;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
-- Almacena las credenciales y roles para el inicio de sesión. Es la tabla central de autenticación.
--
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `correo` VARCHAR(255) NOT NULL UNIQUE,
  `contrasena` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'docente', 'estudiante') NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clases`
-- Define los grupos de aulas, por ejemplo: 3er Grado, Sección A.
--
DROP TABLE IF EXISTS `clases`;
CREATE TABLE `clases` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL COMMENT 'Ej: 3º de Secundaria',
  `seccion` VARCHAR(10) NOT NULL COMMENT 'Ej: A, B, C',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_clase_seccion_unica` (`nombre`, `seccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
-- Almacena información detallada de los docentes, vinculada a un usuario.
--
DROP TABLE IF EXISTS `docentes`;
CREATE TABLE `docentes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` INT UNSIGNED NOT NULL UNIQUE,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `fecha_nacimiento` DATE DEFAULT NULL,
  `genero` ENUM('masculino', 'femenino', 'otro') DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT 'https://placehold.co/100x100.png',
  `estado` ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
-- Almacena información detallada de los estudiantes, vinculada a un usuario.
--
DROP TABLE IF EXISTS `estudiantes`;
CREATE TABLE `estudiantes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` INT UNSIGNED NOT NULL UNIQUE,
  `id_clase` INT UNSIGNED,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `fecha_nacimiento` DATE DEFAULT NULL,
  `genero` ENUM('masculino', 'femenino', 'otro') DEFAULT NULL,
  `nombre_apoderado` VARCHAR(200) DEFAULT NULL,
  `contacto_apoderado` VARCHAR(20) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT 'https://placehold.co/100x100.png',
  `fecha_matricula` DATE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_clase`) REFERENCES `clases`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaturas`
-- Define las materias o asignaturas que se imparten en la institución.
--
DROP TABLE IF EXISTS `asignaturas`;
CREATE TABLE `asignaturas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `descripcion` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
-- Representa una asignatura impartida por un docente a una clase en un horario específico.
--
DROP TABLE IF EXISTS `cursos`;
CREATE TABLE `cursos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_asignatura` INT UNSIGNED NOT NULL,
  `id_docente` INT UNSIGNED NOT NULL,
  `id_clase` INT UNSIGNED NOT NULL,
  `codigo_curso` VARCHAR(20) NOT NULL UNIQUE,
  `horario` VARCHAR(100) COMMENT 'Ej: Lu, Mi 10:00-11:30',
  `capacidad` INT UNSIGNED,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_asignatura`) REFERENCES `asignaturas`(`id`),
  FOREIGN KEY (`id_docente`) REFERENCES `docentes`(`id`),
  FOREIGN KEY (`id_clase`) REFERENCES `clases`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
-- Tabla de unión para la relación muchos a muchos entre estudiantes y cursos.
--
DROP TABLE IF EXISTS `inscripciones`;
CREATE TABLE `inscripciones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_estudiante` INT UNSIGNED NOT NULL,
  `id_curso` INT UNSIGNED NOT NULL,
  `fecha_inscripcion` DATE NOT NULL,
  `progreso` INT UNSIGNED DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_estudiante_curso_unico` (`id_estudiante`, `id_curso`),
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_curso`) REFERENCES `cursos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
-- Registra la asistencia de un estudiante a un curso en una fecha específica.
--
DROP TABLE IF EXISTS `asistencia`;
CREATE TABLE `asistencia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_inscripcion` INT UNSIGNED NOT NULL,
  `fecha` DATE NOT NULL,
  `estado` ENUM('presente', 'ausente', 'tarde', 'justificado') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_asistencia_unica` (`id_inscripcion`, `fecha`),
  FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripciones`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
-- Define las tareas asignadas por un docente en un curso.
--
DROP TABLE IF EXISTS `tareas`;
CREATE TABLE `tareas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_curso` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_curso`) REFERENCES `cursos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entregas`
-- Almacena las entregas de los estudiantes para cada tarea, incluyendo calificación.
--
DROP TABLE IF EXISTS `entregas`;
CREATE TABLE `entregas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_tarea` INT UNSIGNED NOT NULL,
  `id_estudiante` INT UNSIGNED NOT NULL,
  `fecha_entrega` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `archivo_url` VARCHAR(255),
  `calificacion` DECIMAL(5, 2),
  `retroalimentacion` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_entrega_unica` (`id_tarea`, `id_estudiante`),
  FOREIGN KEY (`id_tarea`) REFERENCES `tareas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunicados`
-- Para el tablón de anuncios (noticias), permite segmentar por rol o clase.
--
DROP TABLE IF EXISTS `comunicados`;
CREATE TABLE `comunicados` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario_emisor` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `contenido` TEXT NOT NULL,
  `fecha_publicacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `importancia` ENUM('normal', 'media', 'alta') DEFAULT 'normal',
  `rol_destino` ENUM('todos', 'admin', 'docente', 'estudiante') DEFAULT 'todos',
  `id_clase_destino` INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario_emisor`) REFERENCES `usuarios`(`id`),
  FOREIGN KEY (`id_clase_destino`) REFERENCES `clases`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_permiso`
-- Para las solicitudes de licencia de estudiantes y docentes.
--
DROP TABLE IF EXISTS `solicitudes_permiso`;
CREATE TABLE `solicitudes_permiso` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario_solicitante` INT UNSIGNED NOT NULL,
  `tipo_permiso` VARCHAR(100) NOT NULL,
  `motivo` TEXT NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',
  `fecha_solicitud` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_calendario`
-- Para eventos generales de la escuela (feriados, reuniones, etc.).
--
DROP TABLE IF EXISTS `eventos_calendario`;
CREATE TABLE `eventos_calendario` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT,
  `fecha_inicio` DATETIME NOT NULL,
  `fecha_fin` DATETIME,
  `tipo_evento` VARCHAR(50) DEFAULT 'General',
  `color` VARCHAR(50) DEFAULT 'hsl(var(--primary))',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigos_otp`
-- Almacena temporalmente los códigos para la recuperación de contraseñas.
--
DROP TABLE IF EXISTS `codigos_otp`;
CREATE TABLE `codigos_otp` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` INT UNSIGNED NOT NULL,
  `codigo` VARCHAR(10) NOT NULL,
  `fecha_expiracion` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Activar verificación de claves foráneas.
--
SET FOREIGN_KEY_CHECKS=1;

-- --------------------------------------------------------
-- INSERCIÓN DE DATOS DE EJEMPLO
-- --------------------------------------------------------

-- Usuarios (contraseña para todos: 'password')
-- Contraseña hasheada con bcrypt: $2b$10$T8rL/3D.Lp1/pB.0K9.bSOu8U.I0/3sVz4eT.I5t/6L.O0T.H0E3G
INSERT INTO `usuarios` (`id`, `correo`, `contrasena`, `rol`) VALUES
(1, 'admin@sofiaeduca.com', '$2b$10$T8rL/3D.Lp1/pB.0K9.bSOu8U.I0/3sVz4eT.I5t/6L.O0T.H0E3G', 'admin'),
(2, 'juan.docente@sofiaeduca.com', '$2b$10$T8rL/3D.Lp1/pB.0K9.bSOu8U.I0/3sVz4eT.I5t/6L.O0T.H0E3G', 'docente'),
(3, 'maria.docente@sofiaeduca.com', '$2b$10$T8rL/3D.Lp1/pB.0K9.bSOu8U.I0/3sVz4eT.I5t/6L.O0T.H0E3G', 'docente'),
(4, 'ana.perez@example.com', '$2b$10$T8rL/3D.Lp1/pB.0K9.bSOu8U.I0/3sVz4eT.I5t/6L.O0T.H0E3G', 'estudiante'),
(5, 'luis.garcia@example.com', '$2b$10$T8rL/3D.Lp1/pB.0K9.bSOu8U.I0/3sVz4eT.I5t/6L.O0T.H0E3G', 'estudiante');


-- Clases
INSERT INTO `clases` (`id`, `nombre`, `seccion`) VALUES
(1, '3º de Secundaria', 'A'),
(2, '4º de Secundaria', 'A'),
(3, '5º de Secundaria', 'A');


-- Docentes
INSERT INTO `docentes` (`id`, `id_usuario`, `nombre`, `apellido`) VALUES
(1, 2, 'Juan', 'Docente'),
(2, 3, 'María', 'Maestra');


-- Estudiantes
INSERT INTO `estudiantes` (`id`, `id_usuario`, `id_clase`, `nombre`, `apellido`, `nombre_apoderado`, `contacto_apoderado`) VALUES
(1, 4, 1, 'Ana', 'Pérez', 'Carlos Pérez', '987654321'),
(2, 5, 2, 'Luis', 'García', 'Elena García', '912345678');


-- Asignaturas
INSERT INTO `asignaturas` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Matemáticas', 'Curso de álgebra, geometría y cálculo.'),
(2, 'Historia', 'Curso sobre historia universal y del Perú.'),
(3, 'Ciencias', 'Curso de biología, química y física.'),
(4, 'Arte', 'Curso de apreciación artística y técnicas de pintura.');


-- Cursos
INSERT INTO `cursos` (`id`, `id_asignatura`, `id_docente`, `id_clase`, `codigo_curso`, `horario`) VALUES
(1, 1, 1, 1, 'MAT-3A', 'Lu, Mi 08:00-09:30'),
(2, 2, 2, 1, 'HIS-3A', 'Ma, Ju 08:00-09:30'),
(3, 1, 1, 2, 'MAT-4A', 'Lu, Mi 10:00-11:30');

-- Inscripciones
INSERT INTO `inscripciones` (`id_estudiante`, `id_curso`, `fecha_inscripcion`, `progreso`) VALUES
(1, 1, '2024-03-01', 75),
(1, 2, '2024-03-01', 60),
(2, 3, '2024-03-01', 85);

-- Eventos del Calendario
INSERT INTO `eventos_calendario` (`titulo`, `descripcion`, `fecha_inicio`, `tipo_evento`) VALUES
('Reunión de Docentes', 'Reunión mensual de planificación.', NOW() + INTERVAL 5 DAY, 'Reunión'),
('Feria de Ciencias', 'Exposición de proyectos de los estudiantes.', NOW() + INTERVAL 10 DAY, 'Actividad');
