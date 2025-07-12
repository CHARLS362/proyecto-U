-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: MYSQL1003.site4now.net
-- Tiempo de generación: 12-07-2025 a las 09:16:01
-- Versión del servidor: 8.4.5
-- Versión de PHP: 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_abb6c5_gestion`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ActualizarCurso` (IN `p_id` VARCHAR(50), IN `p_codigo` VARCHAR(50), IN `p_nombre` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_horario` VARCHAR(100), IN `p_instructor` VARCHAR(100), IN `p_id_instructor` VARCHAR(50), IN `p_avatar_instructor` VARCHAR(255), IN `p_cantidad_estudiantes_matriculados` INT, IN `p_capacidad` INT, IN `p_departamento` VARCHAR(50), IN `p_url_plan_estudios` VARCHAR(255), IN `p_id_clase` VARCHAR(50))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al actualizar curso';
    END;

    START TRANSACTION;
    UPDATE cursos
    SET 
        codigo = p_codigo,
        nombre = p_nombre,
        descripcion = p_descripcion,
        horario = p_horario,
        instructor = p_instructor,
        id_instructor = p_id_instructor,
        avatar_instructor = p_avatar_instructor,
        cantidad_estudiantes_matriculados = p_cantidad_estudiantes_matriculados,
        capacidad = p_capacidad,
        departamento = p_departamento,
        url_plan_estudios = p_url_plan_estudios,
        id_clase = p_id_clase
    WHERE id = p_id;
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ActualizarEstudiante` (IN `p_id` VARCHAR(50), IN `p_nombre` VARCHAR(100), IN `p_primer_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50), IN `p_url_avatar` VARCHAR(255), IN `p_correo` VARCHAR(100), IN `p_telefono` VARCHAR(20), IN `p_direccion` VARCHAR(255), IN `p_nivel_grado` VARCHAR(50), IN `p_nombre_tutor` VARCHAR(100), IN `p_contacto_tutor` VARCHAR(20), IN `p_fecha_nacimiento` DATE, IN `p_genero` ENUM('masculino','femenino','otro'), IN `p_id_clase` VARCHAR(50), IN `p_seccion` VARCHAR(10), IN `p_departamento` VARCHAR(50), IN `p_ciudad` VARCHAR(50), IN `p_correo_tutor` VARCHAR(100), IN `p_direccion_tutor` VARCHAR(255), IN `p_fecha_nacimiento_tutor` DATE)   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al actualizar estudiante';
    END;

    START TRANSACTION;
    UPDATE estudiantes
    SET 
        nombre = p_nombre,
        primer_nombre = p_primer_nombre,
        apellido = p_apellido,
        url_avatar = p_url_avatar,
        correo = p_correo,
        telefono = p_telefono,
        direccion = p_direccion,
        nivel_grado = p_nivel_grado,
        nombre_tutor = p_nombre_tutor,
        contacto_tutor = p_contacto_tutor,
        fecha_nacimiento = p_fecha_nacimiento,
        genero = p_genero,
        id_clase = p_id_clase,
        seccion = p_seccion,
        departamento = p_departamento,
        ciudad = p_ciudad,
        correo_tutor = p_correo_tutor,
        direccion_tutor = p_direccion_tutor,
        fecha_nacimiento_tutor = p_fecha_nacimiento_tutor
    WHERE id = p_id;
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ActualizarSolicitudLicenciaEstado` (IN `p_id` INT, IN `p_estado` ENUM('aprobado','rechazado','pendiente'))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al actualizar estado de solicitud de licencia';
    END;

    START TRANSACTION;
    UPDATE solicitudes_licencia_estudiantes
    SET estado = p_estado
    WHERE id = p_id;
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `CalificarTarea` (IN `p_id` VARCHAR(50), IN `p_nota` INT, IN `p_retroalimentacion` TEXT)   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al calificar tarea';
    END;

    START TRANSACTION;
    UPDATE tareas
    SET estado = 'Calificado', nota = p_nota, retroalimentacion = p_retroalimentacion
    WHERE id = p_id;
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `EliminarEstudiante` (IN `p_id` VARCHAR(50))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al eliminar estudiante';
    END;

    START TRANSACTION;
    DELETE FROM estudiantes_cursos WHERE id_estudiante = p_id;
    DELETE FROM notas_bimestre WHERE id_estudiante = p_id;
    DELETE FROM registros_asistencia WHERE id_estudiante = p_id;
    DELETE FROM puntuaciones_notas WHERE id_estudiante = p_id;
    DELETE FROM estudiantes WHERE id = p_id;
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `EnviarTarea` (IN `p_id` VARCHAR(50), IN `p_id_curso` VARCHAR(50), IN `p_titulo` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_fecha_entrega` DATE, IN `p_archivo_entregado` VARCHAR(255))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al enviar tarea';
    END;

    START TRANSACTION;
    INSERT INTO tareas (id, id_curso, titulo, descripcion, fecha_entrega, estado, archivo_entregado)
    VALUES (p_id, p_id_curso, p_titulo, p_descripcion, p_fecha_entrega, 'Entregado', p_archivo_entregado);
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `InsertarAnuncioCurso` (IN `p_id` VARCHAR(50), IN `p_id_curso` VARCHAR(50), IN `p_titulo` VARCHAR(100), IN `p_contenido` TEXT, IN `p_fecha` DATE)   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al insertar anuncio de curso';
    END;

    START TRANSACTION;
    INSERT INTO anuncios_cursos (id, id_curso, titulo, contenido, fecha)
    VALUES (p_id, p_id_curso, p_titulo, p_contenido, p_fecha);
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `InsertarComunicado` (IN `p_id` VARCHAR(50), IN `p_titulo` VARCHAR(100), IN `p_fecha` DATE, IN `p_remitente` VARCHAR(100), IN `p_estado` ENUM('urgente','informativo','normal','advertencia'), IN `p_contenido` TEXT, IN `p_nombre_archivo` VARCHAR(100), IN `p_tamano_archivo` VARCHAR(50), IN `p_tipo_archivo` VARCHAR(50))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al insertar comunicado';
    END;

    START TRANSACTION;
    INSERT INTO comunicados (
        id, titulo, fecha, remitente, estado, contenido, nombre_archivo, tamano_archivo, tipo_archivo
    ) VALUES (
        p_id, p_titulo, p_fecha, p_remitente, p_estado, p_contenido, p_nombre_archivo, p_tamano_archivo, p_tipo_archivo
    );
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `InsertarCurso` (IN `p_id` VARCHAR(50), IN `p_codigo` VARCHAR(50), IN `p_nombre` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_horario` VARCHAR(100), IN `p_instructor` VARCHAR(100), IN `p_id_instructor` VARCHAR(50), IN `p_avatar_instructor` VARCHAR(255), IN `p_cantidad_estudiantes_matriculados` INT, IN `p_capacidad` INT, IN `p_departamento` VARCHAR(50), IN `p_url_plan_estudios` VARCHAR(255), IN `p_id_clase` VARCHAR(50))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al insertar curso';
    END;

    START TRANSACTION;
    INSERT INTO cursos (
        id, codigo, nombre, descripcion, horario, instructor, id_instructor, avatar_instructor,
        cantidad_estudiantes_matriculados, capacidad, departamento, url_plan_estudios, id_clase
    ) VALUES (
        p_id, p_codigo, p_nombre, p_descripcion, p_horario, p_instructor, p_id_instructor, p_avatar_instructor,
        p_cantidad_estudiantes_matriculados, p_capacidad, p_departamento, p_url_plan_estudios, p_id_clase
    );
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `InsertarEstudiante` (IN `p_id` VARCHAR(50), IN `p_nombre` VARCHAR(100), IN `p_primer_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50), IN `p_url_avatar` VARCHAR(255), IN `p_correo` VARCHAR(100), IN `p_telefono` VARCHAR(20), IN `p_fecha_matricula` DATE, IN `p_direccion` VARCHAR(255), IN `p_nivel_grado` VARCHAR(50), IN `p_nombre_tutor` VARCHAR(100), IN `p_contacto_tutor` VARCHAR(20), IN `p_fecha_nacimiento` DATE, IN `p_genero` ENUM('masculino','femenino','otro'), IN `p_id_clase` VARCHAR(50), IN `p_seccion` VARCHAR(10), IN `p_departamento` VARCHAR(50), IN `p_ciudad` VARCHAR(50), IN `p_correo_tutor` VARCHAR(100), IN `p_direccion_tutor` VARCHAR(255), IN `p_fecha_nacimiento_tutor` DATE)   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al insertar estudiante';
    END;

    START TRANSACTION;
    INSERT INTO estudiantes (
        id, nombre, primer_nombre, apellido, url_avatar, correo, telefono, fecha_matricula,
        direccion, nivel_grado, nombre_tutor, contacto_tutor, fecha_nacimiento, genero,
        id_clase, seccion, departamento, ciudad, correo_tutor, direccion_tutor, fecha_nacimiento_tutor
    ) VALUES (
        p_id, p_nombre, p_primer_nombre, p_apellido, p_url_avatar, p_correo, p_telefono, p_fecha_matricula,
        p_direccion, p_nivel_grado, p_nombre_tutor, p_contacto_tutor, p_fecha_nacimiento, p_genero,
        p_id_clase, p_seccion, p_departamento, p_ciudad, p_correo_tutor, p_direccion_tutor, p_fecha_nacimiento_tutor
    );
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `InsertarEventoEscolar` (IN `p_id` VARCHAR(50), IN `p_titulo` VARCHAR(100), IN `p_fecha` DATE, IN `p_tipo` ENUM('Feriado','Examen','Reunión','Actividad','Entrega'), IN `p_descripcion` TEXT, IN `p_ubicacion` VARCHAR(100), IN `p_color` VARCHAR(50))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al insertar evento escolar';
    END;

    START TRANSACTION;
    INSERT INTO eventos_escolares (id, titulo, fecha, tipo, descripcion, ubicacion, color)
    VALUES (p_id, p_titulo, p_fecha, p_tipo, p_descripcion, p_ubicacion, p_color);
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `InsertarNotasBimestre` (IN `p_id_nota_bimestre` INT, IN `p_id_estudiante` VARCHAR(50), IN `p_bimestre` INT, IN `p_notas` JSON)   BEGIN
    DECLARE v_promedio DECIMAL(5,2);
    DECLARE v_nota INT;
    DECLARE v_curso VARCHAR(100);
    DECLARE v_codigo_curso VARCHAR(50);
    DECLARE v_index INT DEFAULT 0;
    DECLARE v_length INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al insertar notas de bimestre';
    END;

    START TRANSACTION;
    -- Insertar en notas_bimestre
    INSERT INTO notas_bimestre (id, id_estudiante, bimestre, promedio)
    VALUES (p_id_nota_bimestre, p_id_estudiante, p_bimestre, 0);

    -- Calcular promedio e insertar entradas
    SET v_length = JSON_LENGTH(p_notas);
    SET v_promedio = 0;

    WHILE v_index < v_length DO
        SET v_curso = JSON_UNQUOTE(JSON_EXTRACT(p_notas, CONCAT('$[', v_index, '].nombre_curso')));
        SET v_codigo_curso = JSON_UNQUOTE(JSON_EXTRACT(p_notas, CONCAT('$[', v_index, '].codigo_curso')));
        SET v_nota = JSON_EXTRACT(p_notas, CONCAT('$[', v_index, '].nota_final'));

        INSERT INTO entradas_notas (id_nota_bimestre, nombre_curso, codigo_curso, nota_final)
        VALUES (p_id_nota_bimestre, v_curso, v_codigo_curso, v_nota);

        SET v_promedio = v_promedio + v_nota;
        SET v_index = v_index + 1;
    END WHILE;

    -- Actualizar promedio en notas_bimestre
    SET v_promedio = v_promedio / v_length;
    UPDATE notas_bimestre
    SET promedio = v_promedio
    WHERE id = p_id_nota_bimestre;

    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `InsertarRegistroAsistencia` (IN `p_id` VARCHAR(50), IN `p_id_estudiante` VARCHAR(50), IN `p_nombre_estudiante` VARCHAR(100), IN `p_id_curso` VARCHAR(50), IN `p_nombre_curso` VARCHAR(100), IN `p_fecha` DATE, IN `p_estado` ENUM('Presente','Ausente','Tarde','Justificado'))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al insertar registro de asistencia';
    END;

    START TRANSACTION;
    INSERT INTO registros_asistencia (
        id, id_estudiante, nombre_estudiante, id_curso, nombre_curso, fecha, estado
    ) VALUES (
        p_id, p_id_estudiante, p_nombre_estudiante, p_id_curso, p_nombre_curso, p_fecha, p_estado
    );
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `InsertarSolicitudLicencia` (IN `p_id` INT, IN `p_tipo` VARCHAR(100), IN `p_fecha_solicitud` VARCHAR(50), IN `p_estado` ENUM('aprobado','rechazado','pendiente'), IN `p_descripcion` TEXT, IN `p_rango_fechas` VARCHAR(100))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al insertar solicitud de licencia';
    END;

    START TRANSACTION;
    INSERT INTO solicitudes_licencia_estudiantes (
        id, tipo, fecha_solicitud, estado, descripcion, rango_fechas
    ) VALUES (
        p_id, p_tipo, p_fecha_solicitud, p_estado, p_descripcion, p_rango_fechas
    );
    COMMIT;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerAnunciosPorCurso` (IN `p_id_curso` VARCHAR(50))   BEGIN
    SELECT * FROM anuncios_cursos 
    WHERE id_curso = p_id_curso
    ORDER BY fecha DESC;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerAsistenciaPorCursoFecha` (IN `p_id_curso` VARCHAR(50), IN `p_fecha` DATE)   BEGIN
    SELECT ra.*, e.nombre AS estudiante_nombre
    FROM registros_asistencia ra
    JOIN estudiantes e ON ra.id_estudiante = e.id
    WHERE ra.id_curso = p_id_curso AND ra.fecha = p_fecha
    ORDER BY e.apellido, e.primer_nombre;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerComunicadosPorEstado` (IN `p_estado` ENUM('urgente','informativo','normal','advertencia'))   BEGIN
    SELECT * FROM comunicados
    WHERE estado = p_estado
    ORDER BY fecha DESC;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerCursosPorClase` (IN `p_id_clase` VARCHAR(50))   BEGIN
    SELECT * FROM cursos 
    WHERE id_clase = p_id_clase
    ORDER BY nombre;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerCursosPorInstructor` (IN `p_id_instructor` VARCHAR(50))   BEGIN
    SELECT * FROM cursos 
    WHERE id_instructor = p_id_instructor
    ORDER BY nombre;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerEstudiantePorId` (IN `p_id` VARCHAR(50))   BEGIN
    SELECT * FROM estudiantes WHERE id = p_id;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerEstudiantesPorClaseSeccion` (IN `p_id_clase` VARCHAR(50), IN `p_seccion` VARCHAR(10))   BEGIN
    SELECT * FROM estudiantes 
    WHERE id_clase = p_id_clase AND seccion = p_seccion
    ORDER BY apellido, primer_nombre;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerEventosPorFecha` (IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    SELECT * FROM eventos_escolares
    WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY fecha, tipo;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerNotasPorEstudianteBimestre` (IN `p_id_estudiante` VARCHAR(50), IN `p_bimestre` INT)   BEGIN
    SELECT nb.*, en.nombre_curso, en.codigo_curso, en.nota_final
    FROM notas_bimestre nb
    LEFT JOIN entradas_notas en ON nb.id = en.id_nota_bimestre
    WHERE nb.id_estudiante = p_id_estudiante AND nb.bimestre = p_bimestre;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ObtenerTareasPorCurso` (IN `p_id_curso` VARCHAR(50))   BEGIN
    SELECT * FROM tareas
    WHERE id_curso = p_id_curso
    ORDER BY fecha_entrega DESC;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ReporteAsistenciaPorCurso` (IN `p_id_curso` VARCHAR(50), IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    SELECT 
        ra.nombre_estudiante,
        ra.fecha,
        ra.estado
    FROM registros_asistencia ra
    WHERE ra.id_curso = p_id_curso 
    AND ra.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY ra.fecha, ra.nombre_estudiante;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ReporteNotasPorClase` (IN `p_nombre_clase` VARCHAR(50))   BEGIN
    SELECT 
        e.nombre AS estudiante,
        nb.bimestre,
        nb.promedio,
        en.nombre_curso,
        en.nota_final
    FROM reportes_notas rn
    JOIN puntuaciones_notas pn ON rn.id = pn.id_reporte_notas
    JOIN estudiantes e ON pn.id_estudiante = e.id
    JOIN notas_bimestre nb ON e.id = nb.id_estudiante
    JOIN entradas_notas en ON nb.id = en.id_nota_bimestre
    WHERE rn.nombre_clase = p_nombre_clase
    ORDER BY e.apellido, e.primer_nombre, nb.bimestre;
END$$

CREATE DEFINER=`abb6c5_gestion`@`%` PROCEDURE `ResumirAsistenciaPorCurso` (IN `p_id_curso` VARCHAR(50), IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    SELECT 
        estado, 
        COUNT(*) AS total
    FROM registros_asistencia
    WHERE id_curso = p_id_curso 
    AND fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY estado
    ORDER BY estado;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades_recientes`
--

CREATE TABLE `actividades_recientes` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `icono` enum('UsuarioNuevo','EditarPortapapeles','AgregarCalendario','Megafono','ArchivoTexto') COLLATE utf8mb3_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `marca_tiempo` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `actividades_recientes`
--

INSERT INTO `actividades_recientes` (`id`, `icono`, `descripcion`, `marca_tiempo`) VALUES
('RA001', 'UsuarioNuevo', 'Nuevo estudiante \'Carlos Luna\' registrado.', 'Hace 5 minutos'),
('RA002', 'EditarPortapapeles', 'Notas actualizadas para \'Álgebra y Geometría\'.', 'Hace 30 minutos'),
('RA003', 'AgregarCalendario', 'Nuevo evento \'Feria de Ciencias\' añadido al calendario.', 'Hace 1 hora'),
('RA004', 'Megafono', 'Publicado nuevo aviso: \'Reunión General de Docentes\'.', 'Hace 2 horas'),
('RA005', 'ArchivoTexto', 'Se subió el reporte de \'Asistencia Mensual\'.', 'Hace 4 horas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anuncios_cursos`
--

CREATE TABLE `anuncios_cursos` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `id_curso` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `titulo` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `contenido` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `anuncios_cursos`
--

INSERT INTO `anuncios_cursos` (`id`, `id_curso`, `titulo`, `contenido`, `fecha`) VALUES
('CA001', 'C001', 'Cambio de fecha para el Examen Parcial', 'Hola a todos, la fecha del examen parcial se ha movido del 15 de Agosto al 22 de Agosto. Por favor, tomen nota.', '2024-07-20'),
('CA002', 'C001', 'Clase de repaso adicional', 'Tendremos una sesión de repaso opcional este viernes a las 4 PM en el aula 305.', '2024-07-18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunicados`
--

CREATE TABLE `comunicados` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `fecha` date NOT NULL,
  `remitente` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `estado` enum('urgente','informativo','normal','advertencia') COLLATE utf8mb3_unicode_ci NOT NULL,
  `contenido` text COLLATE utf8mb3_unicode_ci,
  `nombre_archivo` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `tamano_archivo` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `tipo_archivo` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `comunicados`
--

INSERT INTO `comunicados` (`id`, `titulo`, `fecha`, `remitente`, `estado`, `contenido`, `nombre_archivo`, `tamano_archivo`, `tipo_archivo`) VALUES
('N001', 'AVISO DE VACACIONES', '2025-06-10', 'Administración', 'urgente', 'Las vacaciones de medio año comenzarán el 15 de julio. Disfruten su descanso.', 'calendario_vacaciones.pdf', '120 KB', 'pdf'),
('N002', 'SUSPENSIÓN DE CLASES', '2025-05-31', 'Administración', 'informativo', 'Debido a fumigación, las clases se suspenderán el día 5 de junio.', NULL, NULL, NULL),
('N003', 'EXAMEN DE PRIMERA UNIDAD', '2025-05-31', 'Dr. Eduardo López', 'normal', 'El examen de la primera unidad de Matemáticas Avanzadas será el 12 de junio. ¡A estudiar!', 'temario.docx', '45 KB', 'docx'),
('N004', 'Aviso de Simulacro', '2024-06-19', 'Administración', 'advertencia', 'Habrá un simulacro de sismo el día 25 de junio a las 10:00 AM.', NULL, NULL, NULL),
('N005', 'Campaña de reciclaje', '2024-06-19', 'Prof. Isabel Vargas', 'normal', 'Participen en la campaña de reciclaje de esta semana. Habrá contenedores en el patio.', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_unicode_ci,
  `horario` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `instructor` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `id_instructor` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `avatar_instructor` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `cantidad_estudiantes_matriculados` int NOT NULL,
  `capacidad` int NOT NULL,
  `departamento` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `url_plan_estudios` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `id_clase` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `codigo`, `nombre`, `descripcion`, `horario`, `instructor`, `id_instructor`, `avatar_instructor`, `cantidad_estudiantes_matriculados`, `capacidad`, `departamento`, `url_plan_estudios`, `id_clase`) VALUES
('C001', 'MAT501', 'Álgebra y Geometría', 'Curso avanzado sobre cálculo y álgebra lineal para el último año.', 'Lun, Mié, Vie 10:00-11:30', 'Dr. Eduardo López', 'T1749005331', 'https://placehold.co/40x40.png', 25, 30, 'Matemáticas', '/syllabi/MAT501.pdf', '5-sec'),
('C201', 'COM101', 'Comunicación', 'Desarrollo de habilidades de comunicación para 1º de Primaria', 'Lun, Mié 08:00-09:00', 'Eduardo Perez', 'T1749005331', 'default_user.png', 28, 30, 'Comunicación', '/syllabi/COM101.pdf', '1-pri');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entradas_notas`
--

CREATE TABLE `entradas_notas` (
  `id` int NOT NULL,
  `id_nota_bimestre` int DEFAULT NULL,
  `nombre_curso` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `codigo_curso` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `nota_final` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `entradas_notas`
--

INSERT INTO `entradas_notas` (`id`, `id_nota_bimestre`, `nombre_curso`, `codigo_curso`, `nota_final`) VALUES
(1, 1, 'Álgebra y Geometría', 'MAT501', 15),
(2, 1, 'Historia del Perú', 'HIS301', 18),
(3, 1, 'Computación Básica', 'CS401', 16),
(4, 2, 'Álgebra y Geometría', 'MAT501', 14),
(5, 2, 'Historia del Perú', 'HIS301', 16),
(6, 2, 'Computación Básica', 'CS401', 13),
(7, 2, 'Química General', 'QUM401', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entregas`
--

CREATE TABLE `entregas` (
  `id` int UNSIGNED NOT NULL,
  `id_tarea` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `id_estudiante` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `fecha_entrega` datetime NOT NULL,
  `archivo_url` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `comentario_estudiante` text COLLATE utf8mb3_unicode_ci,
  `calificacion` decimal(5,2) DEFAULT NULL,
  `comentario_docente` text COLLATE utf8mb3_unicode_ci,
  `estado` enum('Entregado','Calificado','Observado') COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `entregas`
--

INSERT INTO `entregas` (`id`, `id_tarea`, `id_estudiante`, `fecha_entrega`, `archivo_url`, `comentario_estudiante`, `calificacion`, `comentario_docente`, `estado`) VALUES
(1, 'AS002', 'S001', '2024-07-29 15:45:00', 'https://example.com/uploads/integrales_ana.pdf', 'Resolví todos los ejercicios y revisé con la guía.', 18.00, 'Muy bien resuelto. Cuida la presentación.', 'Calificado'),
(4, 'AS001', 'S002', '2024-08-14 09:00:00', 'https://example.com/uploads/ensayo_luis.pdf', 'Ensayo completo entregado a tiempo.', NULL, NULL, 'Entregado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas_asistencia`
--

CREATE TABLE `estadisticas_asistencia` (
  `id` int NOT NULL,
  `estado` enum('presente','ausente','tarde','justificado') COLLATE utf8mb3_unicode_ci NOT NULL,
  `estudiantes` int NOT NULL,
  `color_relleno` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `estadisticas_asistencia`
--

INSERT INTO `estadisticas_asistencia` (`id`, `estado`, `estudiantes`, `color_relleno`) VALUES
(1, 'presente', 180, 'hsl(var(--chart-1))'),
(2, 'ausente', 15, 'hsl(var(--chart-2))'),
(3, 'tarde', 5, 'hsl(var(--chart-3))'),
(4, 'justificado', 2, 'hsl(var(--chart-4))');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `primer_nombre` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `apellido` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `url_avatar` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `fecha_matricula` date NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `nombre_tutor` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `contacto_tutor` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('masculino','femenino','otro') COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `seccion` varchar(10) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `departamento` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `ciudad` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `correo_tutor` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `direccion_tutor` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `fecha_nacimiento_tutor` date DEFAULT NULL,
  `nivel` enum('Primaria','Secundaria') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grado` tinyint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `nombre`, `primer_nombre`, `apellido`, `url_avatar`, `correo`, `telefono`, `fecha_matricula`, `direccion`, `nombre_tutor`, `contacto_tutor`, `fecha_nacimiento`, `genero`, `seccion`, `departamento`, `ciudad`, `correo_tutor`, `direccion_tutor`, `fecha_nacimiento_tutor`, `nivel`, `grado`) VALUES
('S001', 'Ana Pérez', 'Ana', 'Pérez', 'https://placehold.co/100x100.png', 'ana.perez@example.com', '987654321', '2023-03-01', 'Calle Falsa 123, Miraflores', 'Carlos Pérez', '912345678', '2008-04-10', 'femenino', 'A', 'Lima', 'Lima', 'carlos.perez@example.com', 'Calle Falsa 123, Miraflores', '1980-05-15', 'Primaria', 1),
('S002', 'Luis García', 'Luis', 'García', 'https://placehold.co/100x100.png', 'luis.garcia@example.com', '987654322', '2023-03-01', 'Avenida Siempreviva 742, San Isidro', 'María García', '912345677', '2007-08-22', 'masculino', 'B', 'Lima', 'Lima', 'maria.garcia@example.com', 'Avenida Siempreviva 742, San Isidro', '1982-10-20', 'Primaria', 2),
('S003', 'Sofía Rodríguez', 'Sofía', 'Rodríguez', 'https://placehold.co/100x100.png', 'sofia.rodriguez@example.com', '987654323', '2022-03-01', 'Boulevard de los Sueños Rotos 45, Barranco', 'Elena Rodríguez', '912345676', '2006-11-05', 'femenino', 'A', 'Lima', 'Lima', 'elena.rodriguez@example.com', 'Boulevard de los Sueños Rotos 45, Barranco', '1985-01-30', 'Primaria', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes_cursos`
--

CREATE TABLE `estudiantes_cursos` (
  `id_estudiante` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `id_curso` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `progreso` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `estudiantes_cursos`
--

INSERT INTO `estudiantes_cursos` (`id_estudiante`, `id_curso`, `progreso`) VALUES
('S001', 'C001', 75),
('S002', 'C001', 85);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_escolares`
--

CREATE TABLE `eventos_escolares` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `fecha` date NOT NULL,
  `tipo` enum('Feriado','Examen','Reunión','Actividad','Entrega') COLLATE utf8mb3_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_unicode_ci,
  `ubicacion` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `eventos_escolares`
--

INSERT INTO `eventos_escolares` (`id`, `titulo`, `fecha`, `tipo`, `descripcion`, `ubicacion`, `color`) VALUES
('E001', 'Examen Final de Matemáticas', '2025-07-13', 'Examen', 'Evaluación de fin de trimestre', 'Aula 101', 'hsl(var(--destructive))'),
('E002', 'Entrega Proyecto de Arte', '2025-07-16', 'Entrega', 'Última entrega del semestre', 'Online', 'hsl(var(--primary))'),
('E003', 'Reunión de Padres', '2025-07-21', 'Reunión', 'Primera reunión anual con apoderados', 'Auditorio', 'hsl(var(--accent))'),
('E004', 'Feriado: Día del Trabajo', '2025-05-01', 'Feriado', 'Día no laborable', NULL, 'hsl(var(--muted-foreground))'),
('E005', 'Actividad Deportiva', '2025-07-11', 'Actividad', 'Competencias interclases', 'Cancha Principal', 'hsl(120, 70%, 50%)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias_reportes_notas`
--

CREATE TABLE `materias_reportes_notas` (
  `id` int NOT NULL,
  `id_reporte_notas` int DEFAULT NULL,
  `materia` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `materias_reportes_notas`
--

INSERT INTO `materias_reportes_notas` (`id`, `id_reporte_notas`, `materia`) VALUES
(1, 1, 'Historia del Perú'),
(2, 1, 'Música'),
(3, 1, 'Dibujo'),
(4, 2, 'Computación'),
(5, 2, 'Química'),
(6, 2, 'Física'),
(7, 3, 'Álgebra'),
(8, 3, 'Contabilidad'),
(9, 3, 'Economía');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notas_bimestre`
--

CREATE TABLE `notas_bimestre` (
  `id` int NOT NULL,
  `id_estudiante` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `bimestre` int NOT NULL,
  `promedio` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `notas_bimestre`
--

INSERT INTO `notas_bimestre` (`id`, `id_estudiante`, `bimestre`, `promedio`) VALUES
(1, 'S001', 1, 16.33),
(2, 'S001', 2, 13.25);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `primer_nombre` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `apellido` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `url_avatar` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `numero_telefono` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `seccion` varchar(10) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `materia_relacionada` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `contacto_referencia` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `relacion_referencia` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb3_unicode_ci NOT NULL,
  `nivel` enum('Primaria','Secundaria') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grado` tinyint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id`, `primer_nombre`, `apellido`, `url_avatar`, `correo`, `numero_telefono`, `direccion`, `fecha_nacimiento`, `genero`, `seccion`, `materia_relacionada`, `contacto_referencia`, `relacion_referencia`, `estado`, `nivel`, `grado`) VALUES
('T0038240242', 'Pedro ', 'Ticona Flores', 'default_user.png', 'pedro-florez@gmail.com', '934234723', 'Av. Mártirez Moquegua', '2002-05-15', 'masculino', 'B', 'Álgebra y Geometría', '923134213', 'Madre', 'Activo', 'Secundaria', 5),
('T0780498698', 'Martha', 'Flores Mendoza', 'default_user.png', 'martha-flores@gmail.com', '932421421', 'Av. Ejército Puno Perú', '1996-05-22', 'femenino', 'B', 'Ciencia y Tecnología', '932842321', 'Esposo', 'Activo', 'Primaria', 3),
('T1749005331', 'Eduardo', 'Perez', 'default_user.png', 'eduardo.lopez@example.com', '987654321', 'Calle Falsa 123, Ciudad', '1985-05-20', 'masculino', 'A', 'Matemáticas', '912345678', 'Esposa', 'Inactivo', 'Primaria', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuaciones_notas`
--

CREATE TABLE `puntuaciones_notas` (
  `id` int NOT NULL,
  `id_reporte_notas` int DEFAULT NULL,
  `id_estudiante` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `nombre_estudiante` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `puntuaciones_notas`
--

INSERT INTO `puntuaciones_notas` (`id`, `id_reporte_notas`, `id_estudiante`, `nombre_estudiante`) VALUES
(7, 1, 'S001', 'Ana Pérez'),
(8, 2, 'S002', 'Luis García'),
(9, 3, 'S003', 'Sofía Rodríguez');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recordatorios`
--

CREATE TABLE `recordatorios` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `texto` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `color` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `recordatorios`
--

INSERT INTO `recordatorios` (`id`, `texto`, `color`) VALUES
('R001', 'Reunión con padres de familia hoy a las 3 de la tarde', 'hsl(var(--accent))'),
('R002', 'Preparar material para la clase de mañana.', 'hsl(var(--primary))'),
('R003', 'Calificar exámenes pendientes de Química.', 'hsl(var(--destructive))');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_asistencia`
--

CREATE TABLE `registros_asistencia` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `id_estudiante` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `nombre_estudiante` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `id_curso` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `nombre_curso` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `fecha` date NOT NULL,
  `estado` enum('Presente','Ausente','Tarde','Justificado') COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `registros_asistencia`
--

INSERT INTO `registros_asistencia` (`id`, `id_estudiante`, `nombre_estudiante`, `id_curso`, `nombre_curso`, `fecha`, `estado`) VALUES
('A001', 'S001', 'Ana Pérez', 'C001', 'Álgebra y Geometría', '2024-05-01', 'Presente'),
('A002', 'S002', 'Luis García', 'C001', 'Álgebra y Geometría', '2024-05-01', 'Presente'),
('A003', 'S001', 'Ana Pérez', 'C001', 'Álgebra y Geometría', '2024-05-03', 'Ausente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes_notas`
--

CREATE TABLE `reportes_notas` (
  `id` int NOT NULL,
  `nombre_clase` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `reportes_notas`
--

INSERT INTO `reportes_notas` (`id`, `nombre_clase`) VALUES
(1, '3º de Secundaria'),
(2, '4º de Secundaria'),
(3, '5º de Secundaria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_licencia_estudiantes`
--

CREATE TABLE `solicitudes_licencia_estudiantes` (
  `id` int NOT NULL,
  `tipo` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `fecha_solicitud` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `estado` enum('aprobado','rechazado','pendiente') COLLATE utf8mb3_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `rango_fechas` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `solicitudes_licencia_estudiantes`
--

INSERT INTO `solicitudes_licencia_estudiantes` (`id`, `tipo`, `fecha_solicitud`, `estado`, `descripcion`, `rango_fechas`) VALUES
(1, 'Licencia por enfermedad', '20 de Julio, 2024', 'aprobado', 'Cita médica para chequeo general.', '25 de Julio, 2024 - 25 de Julio, 2024'),
(2, 'Licencia por viaje familiar', '15 de Julio, 2024', 'pendiente', 'Viaje familiar programado con antelación.', '1 de Agosto, 2024 - 7 de Agosto, 2024'),
(3, 'Licencia por enfermedad', '10 de Junio, 2024', 'rechazado', 'Reposo por gripe.', '11 de Junio, 2024 - 12 de Junio, 2024');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `id_curso` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `titulo` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb3_unicode_ci,
  `fecha_entrega` date NOT NULL,
  `estado` enum('Pendiente','Entregado','Calificado') COLLATE utf8mb3_unicode_ci NOT NULL,
  `nota` int DEFAULT NULL,
  `archivo_entregado` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `retroalimentacion` text COLLATE utf8mb3_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `id_curso`, `titulo`, `descripcion`, `fecha_entrega`, `estado`, `nota`, `archivo_entregado`, `retroalimentacion`) VALUES
('AS001', 'C001', 'Ensayo sobre el Teorema Fundamental del Cálculo', 'Escribir un ensayo de 5 páginas sobre la importancia y aplicaciones del Teorema Fundamental del Cálculo.', '2024-08-15', 'Pendiente', NULL, NULL, NULL),
('AS002', 'C001', 'Resolución de Problemas de Integrales', 'Resolver la lista de problemas adjunta.', '2024-07-30', 'Calificado', 18, 'integrales_resueltas.pdf', 'Excelente trabajo. Presta más atención al problema 7.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int UNSIGNED NOT NULL,
  `identificador` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(700) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','profesor','estudiante','propietario') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tema` enum('claro','oscuro') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'claro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `identificador`, `correo`, `contrasena`, `rol`, `tema`) VALUES
(1, 'A9876543210', 'admin@gmail.com', '$2y$10$2MrhbQa30mll8mKG6LPyjuI7CQPC4abCvqrSvczxXVRu4RVueRfoe', 'admin', 'claro'),
(2, 'T1718791191', 'profesor1@gmail.com', '$2y$10$2MrhbQa30mll8mKG6LPyjuI7CQPC4abCvqrSvczxXVRu4RVueRfoe', 'profesor', 'claro'),
(3, 'T1718791192', 'profesor2@gmail.com', '$2y$10$2MrhbQa30mll8mKG6LPyjuI7CQPC4abCvqrSvczxXVRu4RVueRfoe', 'profesor', 'oscuro'),
(4, 'S1718791292', 'estudiante1@gmail.com', '$2y$10$2MrhbQa30mll8mKG6LPyjuI7CQPC4abCvqrSvczxXVRu4RVueRfoe', 'estudiante', 'claro'),
(5, 'S1718791293', 'estudiante2@gmail.com', '$2y$10$2MrhbQa30mll8mKG6LPyjuI7CQPC4abCvqrSvczxXVRu4RVueRfoe', 'estudiante', 'claro'),
(6, 'O7898987845', 'propietario@gmail.com', '$2y$10$2MrhbQa30mll8mKG6LPyjuI7CQPC4abCvqrSvczxXVRu4RVueRfoe', 'propietario', 'claro'),
(17, 'T0038240242', 'pedro-florez@gmail.com', '$2b$10$EiEc13EBnbBxXQ4Yx3s0XueIAHetxfoSPEP6S/Rb6pDkBLh/6oeX.', 'profesor', 'claro'),
(18, 'T0780498698', 'martha-flores@gmail.com', '$2b$10$kT4r.g9.9UEUnAOR7m2TB.mv65tW5WmfrusF7mBfDR1xNGyZgn98y', 'profesor', 'claro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valores_puntuaciones_notas`
--

CREATE TABLE `valores_puntuaciones_notas` (
  `id` int NOT NULL,
  `id_puntuacion_nota` int DEFAULT NULL,
  `id_materia` int DEFAULT NULL,
  `puntuacion` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `valores_puntuaciones_notas`
--

INSERT INTO `valores_puntuaciones_notas` (`id`, `id_puntuacion_nota`, `id_materia`, `puntuacion`) VALUES
(19, 7, 1, 18),
(20, 7, 2, 15),
(21, 7, 3, 17),
(22, 8, 1, 16),
(23, 8, 2, 17),
(24, 8, 3, 16),
(25, 9, 4, 17),
(26, 9, 5, 14),
(27, 9, 6, 16);

--
-- Estructura de tabla para la tabla `comentarios_estudiantes`
--
CREATE TABLE comentarios_estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_estudiante VARCHAR(50) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  comentario TEXT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades_recientes`
--
ALTER TABLE `actividades_recientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `anuncios_cursos`
--
ALTER TABLE `anuncios_cursos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anuncios_cursos_ibfk_1` (`id_curso`);

--
-- Indices de la tabla `comunicados`
--
ALTER TABLE `comunicados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cursos_ibfk_1` (`id_instructor`);

--
-- Indices de la tabla `entradas_notas`
--
ALTER TABLE `entradas_notas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entradas_notas_ibfk_1` (`id_nota_bimestre`);

--
-- Indices de la tabla `entregas`
--
ALTER TABLE `entregas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_tarea` (`id_tarea`,`id_estudiante`),
  ADD KEY `id_estudiante` (`id_estudiante`);

--
-- Indices de la tabla `estadisticas_asistencia`
--
ALTER TABLE `estadisticas_asistencia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `estudiantes_cursos`
--
ALTER TABLE `estudiantes_cursos`
  ADD PRIMARY KEY (`id_estudiante`,`id_curso`),
  ADD KEY `estudiantes_cursos_ibfk_2` (`id_curso`);

--
-- Indices de la tabla `eventos_escolares`
--
ALTER TABLE `eventos_escolares`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `materias_reportes_notas`
--
ALTER TABLE `materias_reportes_notas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_reporte_notas` (`id_reporte_notas`);

--
-- Indices de la tabla `notas_bimestre`
--
ALTER TABLE `notas_bimestre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notas_bimestre_estudiante` (`id_estudiante`);

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `puntuaciones_notas`
--
ALTER TABLE `puntuaciones_notas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_reporte_notas` (`id_reporte_notas`),
  ADD KEY `id_estudiante` (`id_estudiante`);

--
-- Indices de la tabla `recordatorios`
--
ALTER TABLE `recordatorios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `registros_asistencia`
--
ALTER TABLE `registros_asistencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_estudiante` (`id_estudiante`),
  ADD KEY `idx_registros_asistencia_curso_fecha` (`id_curso`,`fecha`);

--
-- Indices de la tabla `reportes_notas`
--
ALTER TABLE `reportes_notas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `solicitudes_licencia_estudiantes`
--
ALTER TABLE `solicitudes_licencia_estudiantes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tareas_ibfk_1` (`id_curso`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `valores_puntuaciones_notas`
--
ALTER TABLE `valores_puntuaciones_notas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_puntuacion_nota` (`id_puntuacion_nota`),
  ADD KEY `id_materia` (`id_materia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `entradas_notas`
--
ALTER TABLE `entradas_notas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `entregas`
--
ALTER TABLE `entregas`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `estadisticas_asistencia`
--
ALTER TABLE `estadisticas_asistencia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `materias_reportes_notas`
--
ALTER TABLE `materias_reportes_notas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `notas_bimestre`
--
ALTER TABLE `notas_bimestre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `puntuaciones_notas`
--
ALTER TABLE `puntuaciones_notas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `reportes_notas`
--
ALTER TABLE `reportes_notas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `valores_puntuaciones_notas`
--
ALTER TABLE `valores_puntuaciones_notas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `anuncios_cursos`
--
ALTER TABLE `anuncios_cursos`
  ADD CONSTRAINT `anuncios_cursos_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`id_instructor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `entradas_notas`
--
ALTER TABLE `entradas_notas`
  ADD CONSTRAINT `entradas_notas_ibfk_1` FOREIGN KEY (`id_nota_bimestre`) REFERENCES `notas_bimestre` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `entregas`
--
ALTER TABLE `entregas`
  ADD CONSTRAINT `entregas_ibfk_1` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `entregas_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `estudiantes_cursos`
--
ALTER TABLE `estudiantes_cursos`
  ADD CONSTRAINT `estudiantes_cursos_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `estudiantes_cursos_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `materias_reportes_notas`
--
ALTER TABLE `materias_reportes_notas`
  ADD CONSTRAINT `materias_reportes_notas_ibfk_1` FOREIGN KEY (`id_reporte_notas`) REFERENCES `reportes_notas` (`id`);

--
-- Filtros para la tabla `notas_bimestre`
--
ALTER TABLE `notas_bimestre`
  ADD CONSTRAINT `notas_bimestre_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `puntuaciones_notas`
--
ALTER TABLE `puntuaciones_notas`
  ADD CONSTRAINT `puntuaciones_notas_ibfk_1` FOREIGN KEY (`id_reporte_notas`) REFERENCES `reportes_notas` (`id`),
  ADD CONSTRAINT `puntuaciones_notas_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`);

--
-- Filtros para la tabla `registros_asistencia`
--
ALTER TABLE `registros_asistencia`
  ADD CONSTRAINT `registros_asistencia_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`),
  ADD CONSTRAINT `registros_asistencia_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `valores_puntuaciones_notas`
--
ALTER TABLE `valores_puntuaciones_notas`
  ADD CONSTRAINT `valores_puntuaciones_notas_ibfk_1` FOREIGN KEY (`id_puntuacion_nota`) REFERENCES `puntuaciones_notas` (`id`),
  ADD CONSTRAINT `valores_puntuaciones_notas_ibfk_2` FOREIGN KEY (`id_materia`) REFERENCES `materias_reportes_notas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
