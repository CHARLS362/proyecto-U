-- Academia Nova - Esquema de Base de Datos
-- Versión 1.0
-- Este script crea todas las tablas necesarias para la aplicación,
-- establece relaciones y carga datos de ejemplo.

-- Borra las tablas si existen para una instalación limpia
DROP TABLE IF EXISTS `entregas`, `tareas`, `asistencia`, `inscripciones`, `cursos`, `asignaturas`, `solicitudes_permiso`, `comunicados`, `eventos_calendario`, `estudiantes`, `docentes`, `clases`, `usuarios`;

-- -----------------------------------------------------
-- Tabla `usuarios`
-- Almacena la información de inicio de sesión y rol para todos los usuarios.
-- -----------------------------------------------------
CREATE TABLE `usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'docente', 'estudiante') NOT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` TINYINT(1) NULL DEFAULT 1,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `clases`
-- Define los salones de clase, combinando grado y sección.
-- -----------------------------------------------------
CREATE TABLE `clases` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre_grado` VARCHAR(50) NOT NULL COMMENT 'Ej: 3º de Secundaria',
  `seccion` VARCHAR(10) NOT NULL COMMENT 'Ej: A',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_grado_seccion` (`nombre_grado` ASC, `seccion` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `docentes`
-- Contiene información detallada de los docentes.
-- -----------------------------------------------------
CREATE TABLE `docentes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE NULL,
  `telefono` VARCHAR(20) NULL,
  `direccion` TEXT NULL,
  `url_avatar` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_docentes_usuarios_idx` (`usuario_id` ASC),
  CONSTRAINT `fk_docentes_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `estudiantes`
-- Contiene información detallada de los estudiantes.
-- -----------------------------------------------------
CREATE TABLE `estudiantes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NOT NULL,
  `clase_id` INT UNSIGNED NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE NULL,
  `genero` ENUM('masculino', 'femenino', 'otro') NULL,
  `telefono` VARCHAR(20) NULL,
  `direccion` TEXT NULL,
  `url_avatar` VARCHAR(255) NULL,
  `nombre_tutor` VARCHAR(200) NULL,
  `contacto_tutor` VARCHAR(20) NULL,
  `email_tutor` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_estudiantes_usuarios_idx` (`usuario_id` ASC),
  INDEX `fk_estudiantes_clases_idx` (`clase_id` ASC),
  CONSTRAINT `fk_estudiantes_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_estudiantes_clases`
    FOREIGN KEY (`clase_id`)
    REFERENCES `clases` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `asignaturas`
-- Catálogo de materias o asignaturas que se imparten.
-- -----------------------------------------------------
CREATE TABLE `asignaturas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `departamento` VARCHAR(100) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `cursos`
-- Instancia de una asignatura impartida por un docente a una clase específica.
-- -----------------------------------------------------
CREATE TABLE `cursos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `asignatura_id` INT UNSIGNED NOT NULL,
  `docente_id` INT UNSIGNED NOT NULL,
  `clase_id` INT UNSIGNED NOT NULL,
  `nombre_curso` VARCHAR(255) NOT NULL COMMENT 'Ej: Álgebra Avanzada 2024',
  `codigo_curso` VARCHAR(20) NULL UNIQUE,
  `descripcion` TEXT NULL,
  `horario_texto` VARCHAR(255) NULL COMMENT 'Ej: Lun, Mie 10:00-11:30',
  `capacidad` INT UNSIGNED NULL,
  `url_plan_estudios` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_cursos_asignaturas_idx` (`asignatura_id` ASC),
  INDEX `fk_cursos_docentes_idx` (`docente_id` ASC),
  INDEX `fk_cursos_clases_idx` (`clase_id` ASC),
  CONSTRAINT `fk_cursos_asignaturas`
    FOREIGN KEY (`asignatura_id`)
    REFERENCES `asignaturas` (`id`),
  CONSTRAINT `fk_cursos_docentes`
    FOREIGN KEY (`docente_id`)
    REFERENCES `docentes` (`id`),
  CONSTRAINT `fk_cursos_clases`
    FOREIGN KEY (`clase_id`)
    REFERENCES `clases` (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `inscripciones`
-- Tabla de unión que registra qué estudiantes están en qué cursos.
-- -----------------------------------------------------
CREATE TABLE `inscripciones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `estudiante_id` INT UNSIGNED NOT NULL,
  `curso_id` INT UNSIGNED NOT NULL,
  `fecha_inscripcion` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `progreso` INT UNSIGNED NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_inscripciones_estudiantes_idx` (`estudiante_id` ASC),
  INDEX `fk_inscripciones_cursos_idx` (`curso_id` ASC),
  UNIQUE INDEX `idx_estudiante_curso_unique` (`estudiante_id` ASC, `curso_id` ASC),
  CONSTRAINT `fk_inscripciones_estudiantes`
    FOREIGN KEY (`estudiante_id`)
    REFERENCES `estudiantes` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_inscripciones_cursos`
    FOREIGN KEY (`curso_id`)
    REFERENCES `cursos` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `asistencia`
-- Registra la asistencia diaria de un estudiante a un curso.
-- -----------------------------------------------------
CREATE TABLE `asistencia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `inscripcion_id` INT UNSIGNED NOT NULL,
  `fecha` DATE NOT NULL,
  `estado` ENUM('presente', 'ausente', 'tarde', 'justificado') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_asistencia_inscripciones_idx` (`inscripcion_id` ASC),
  UNIQUE INDEX `idx_asistencia_unique` (`inscripcion_id` ASC, `fecha` ASC),
  CONSTRAINT `fk_asistencia_inscripciones`
    FOREIGN KEY (`inscripcion_id`)
    REFERENCES `inscripciones` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `tareas`
-- Define las tareas y trabajos para cada curso.
-- -----------------------------------------------------
CREATE TABLE `tareas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `curso_id` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `fecha_publicacion` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tareas_cursos_idx` (`curso_id` ASC),
  CONSTRAINT `fk_tareas_cursos`
    FOREIGN KEY (`curso_id`)
    REFERENCES `cursos` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `entregas`
-- Almacena las entregas de tareas de los estudiantes.
-- -----------------------------------------------------
CREATE TABLE `entregas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tarea_id` INT UNSIGNED NOT NULL,
  `estudiante_id` INT UNSIGNED NOT NULL,
  `fecha_entrega` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `url_archivo` VARCHAR(255) NULL,
  `comentarios_estudiante` TEXT NULL,
  `calificacion` DECIMAL(5,2) NULL,
  `retroalimentacion_docente` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_entregas_tareas_idx` (`tarea_id` ASC),
  INDEX `fk_entregas_estudiantes_idx` (`estudiante_id` ASC),
  UNIQUE INDEX `idx_entrega_unica` (`tarea_id` ASC, `estudiante_id` ASC),
  CONSTRAINT `fk_entregas_tareas`
    FOREIGN KEY (`tarea_id`)
    REFERENCES `tareas` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_entregas_estudiantes`
    FOREIGN KEY (`estudiante_id`)
    REFERENCES `estudiantes` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `comunicados`
-- Para noticias y avisos generales o por rol.
-- -----------------------------------------------------
CREATE TABLE `comunicados` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `emisor_id` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `contenido` TEXT NULL,
  `fecha_publicacion` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `importancia` ENUM('normal', 'informativo', 'advertencia', 'urgente') NULL DEFAULT 'normal',
  `visibilidad` ENUM('todos', 'docentes', 'estudiantes') NULL DEFAULT 'todos',
  PRIMARY KEY (`id`),
  INDEX `fk_comunicados_usuarios_idx` (`emisor_id` ASC),
  CONSTRAINT `fk_comunicados_usuarios`
    FOREIGN KEY (`emisor_id`)
    REFERENCES `usuarios` (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `eventos_calendario`
-- Para eventos escolares como feriados, exámenes, etc.
-- -----------------------------------------------------
CREATE TABLE `eventos_calendario` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `fecha_inicio` DATETIME NOT NULL,
  `fecha_fin` DATETIME NULL,
  `tipo` ENUM('feriado', 'examen', 'reunion', 'actividad', 'entrega') NOT NULL,
  `color` VARCHAR(20) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `solicitudes_permiso`
-- Para solicitudes de ausencia de docentes y estudiantes.
-- -----------------------------------------------------
CREATE TABLE `solicitudes_permiso` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `solicitante_id` INT UNSIGNED NOT NULL,
  `tipo_permiso` VARCHAR(100) NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `motivo` TEXT NOT NULL,
  `estado` ENUM('pendiente', 'aprobado', 'rechazado') NULL DEFAULT 'pendiente',
  `fecha_solicitud` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_solicitudes_permiso_usuarios_idx` (`solicitante_id` ASC),
  CONSTRAINT `fk_solicitudes_permiso_usuarios`
    FOREIGN KEY (`solicitante_id`)
    REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- INSERCIÓN DE DATOS DE EJEMPLO
-- -----------------------------------------------------

-- Usuarios (Contraseña para todos: 'password123')
INSERT INTO `usuarios` (`email`, `password_hash`, `rol`) VALUES
('admin@sofiaeduca.com', '$2b$10$E9.2qj2FvI.3iZ5eYx3U5uA/O0uB9ZzF9E1zG2r0p9C3bA5.X.Y.a', 'admin'),
('juan.docente@sofiaeduca.com', '$2b$10$E9.2qj2FvI.3iZ5eYx3U5uA/O0uB9ZzF9E1zG2r0p9C3bA5.X.Y.a', 'docente'),
('maria.docente@sofiaeduca.com', '$2b$10$E9.2qj2FvI.3iZ5eYx3U5uA/O0uB9ZzF9E1zG2r0p9C3bA5.X.Y.a', 'docente'),
('ana.perez@example.com', '$2b$10$E9.2qj2FvI.3iZ5eYx3U5uA/O0uB9ZzF9E1zG2r0p9C3bA5.X.Y.a', 'estudiante'),
('luis.garcia@example.com', '$2b$10$E9.2qj2FvI.3iZ5eYx3U5uA/O0uB9ZzF9E1zG2r0p9C3bA5.X.Y.a', 'estudiante'),
('sofia.rodriguez@example.com', '$2b$10$E9.2qj2FvI.3iZ5eYx3U5uA/O0uB9ZzF9E1zG2r0p9C3bA5.X.Y.a', 'estudiante');

-- Clases
INSERT INTO `clases` (`nombre_grado`, `seccion`) VALUES
('3º de Secundaria', 'A'),
('4º de Secundaria', 'A'),
('5º de Secundaria', 'A');

-- Docentes
INSERT INTO `docentes` (`usuario_id`, `nombre`, `apellido`) VALUES
(2, 'Juan', 'Docente'),
(3, 'María', 'Maestra');

-- Estudiantes
INSERT INTO `estudiantes` (`usuario_id`, `clase_id`, `nombre`, `apellido`, `nombre_tutor`, `contacto_tutor`) VALUES
(4, 1, 'Ana', 'Pérez', 'Carlos Pérez', '912345678'),
(5, 2, 'Luis', 'García', 'Marta García', '987654321'),
(6, 3, 'Sofía', 'Rodríguez', 'Elena Rodríguez', '999888777');

-- Asignaturas
INSERT INTO `asignaturas` (`nombre`, `departamento`) VALUES
('Matemáticas', 'Ciencias Exactas'),
('Historia', 'Humanidades'),
('Computación', 'Tecnología'),
('Química', 'Ciencias Naturales');

-- Cursos
INSERT INTO `cursos` (`asignatura_id`, `docente_id`, `clase_id`, `nombre_curso`, `codigo_curso`, `horario_texto`) VALUES
(1, 1, 3, 'Álgebra y Geometría', 'MAT501', 'Lun, Mie 10:00-11:30'),
(2, 2, 1, 'Historia del Perú', 'HIS301', 'Mar, Jue 08:00-09:30'),
(3, 1, 2, 'Computación Básica', 'CS401', 'Lun, Vie 14:00-15:30'),
(4, 2, 2, 'Química General', 'QUM401', 'Mar, Jue 11:00-12:30');

-- Inscripciones
INSERT INTO `inscripciones` (`estudiante_id`, `curso_id`, `progreso`) VALUES
(1, 2, 60), -- Ana en Historia
(2, 3, 90), -- Luis en Computación
(2, 4, 75), -- Luis en Química
(3, 1, 85); -- Sofía en Álgebra

-- Comunicados
INSERT INTO `comunicados` (`emisor_id`, `titulo`, `contenido`, `importancia`) VALUES
(1, 'AVISO DE VACACIONES', 'Las vacaciones de medio año comenzarán el 15 de julio.', 'urgente'),
(1, 'Reunión General de Docentes', 'La reunión será el próximo viernes a las 15:00 en el auditorio.', 'informativo');

-- Eventos Calendario
INSERT INTO `eventos_calendario` (`titulo`, `fecha_inicio`, `tipo`, `color`) VALUES
('Examen Final de Matemáticas', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'examen', 'hsl(var(--destructive))'),
('Entrega Proyecto de Arte', DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'entrega', 'hsl(var(--primary))');
