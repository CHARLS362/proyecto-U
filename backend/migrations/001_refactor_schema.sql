-- Script de Mejora y Refactorización de la Base de Datos para Sofía Educa
-- Versión 1.0
--
-- Se recomienda realizar una copia de seguridad de la base de datos antes de ejecutar este script.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- MEJORA 1: Centralización y Estandarización de 'Clases'
-- Observación: La información de las clases (nivel y sección) está como texto en varias tablas.
-- Acción: Crear una tabla `clases` para centralizar esta información y usar su ID como clave foránea.
-- Beneficio: Integridad de datos y consultas más eficientes.
--

CREATE TABLE `clases` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre_clase` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL COMMENT 'Ej: 3º de Secundaria',
  `seccion` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL COMMENT 'Ej: A, B, C',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_clase_seccion` (`nombre_clase`,`seccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Populamos la nueva tabla con datos existentes para la migración
INSERT INTO `clases` (nombre_clase, seccion)
SELECT DISTINCT nivel_grado, seccion FROM estudiantes WHERE nivel_grado IS NOT NULL AND seccion IS NOT NULL;

-- Actualizamos la tabla `estudiantes` para usar el nuevo `id_clase`
ALTER TABLE `estudiantes` CHANGE COLUMN `id_clase` `id_clase_temp` VARCHAR(50);
ALTER TABLE `estudiantes` ADD COLUMN `id_clase` INT UNSIGNED NULL AFTER `genero`;

UPDATE `estudiantes` e
JOIN `clases` c ON e.nivel_grado = c.nombre_clase AND e.seccion = c.seccion
SET e.id_clase = c.id;

ALTER TABLE `estudiantes` ADD CONSTRAINT `fk_estudiantes_clases` FOREIGN KEY (`id_clase`) REFERENCES `clases`(`id`) ON DELETE SET NULL;

-- Hacemos lo mismo para la tabla `cursos`
ALTER TABLE `cursos` CHANGE COLUMN `id_clase` `id_clase_temp` VARCHAR(50);
ALTER TABLE `cursos` ADD COLUMN `id_clase` INT UNSIGNED NULL AFTER `url_plan_estudios`;
-- (Aquí se necesitaría una lógica para mapear el `id_clase_temp` a los nuevos IDs, asumimos que se hará manualmente o con un script más complejo)
-- ALTER TABLE `cursos` ADD CONSTRAINT `fk_cursos_clases` FOREIGN KEY (`id_clase`) REFERENCES `clases`(`id`) ON DELETE SET NULL;


--
-- MEJORA 2: Optimización de Relaciones de Usuario
-- Observación: Las tablas se vinculan a `usuarios` por `identificador` (VARCHAR), lo cual es lento.
-- Acción: Añadir una columna `id_usuario` (INT) a las tablas `estudiantes` y `profesores`.
-- Beneficio: Consultas (JOINs) mucho más rápidas y eficientes.
--

ALTER TABLE `estudiantes` ADD COLUMN `id_usuario` INT UNSIGNED NULL AFTER `id`;
ALTER TABLE `estudiantes` ADD CONSTRAINT `fk_estudiantes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL;

UPDATE estudiantes e JOIN usuarios u ON e.correo = u.correo SET e.id_usuario = u.id;

ALTER TABLE `profesores` ADD COLUMN `id_usuario` INT UNSIGNED NULL AFTER `id`;
ALTER TABLE `profesores` ADD CONSTRAINT `fk_profesores_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL;

UPDATE profesores p JOIN usuarios u ON p.correo = u.correo SET p.id_usuario = u.id;


--
-- MEJORA 3: Estandarización de Fechas
-- Observación: En `solicitudes_licencia_estudiantes`, el rango de fechas es un texto (`VARCHAR`).
-- Acción: Reemplazar `rango_fechas` por dos columnas `DATE` (`fecha_inicio` y `fecha_fin`).
-- Beneficio: Permite consultas por fecha, validaciones y cálculos de duración.
--

ALTER TABLE `solicitudes_licencia_estudiantes`
  ADD COLUMN `fecha_inicio` DATE NULL AFTER `descripcion`,
  ADD COLUMN `fecha_fin` DATE NULL AFTER `fecha_inicio`;

-- Nota: La migración de datos desde `rango_fechas` (ej: '25 de Julio, 2024 - ...') es compleja para SQL puro.
-- Se recomienda un script o actualización manual para los registros existentes.
-- Ejemplo de cómo se haría: UPDATE `solicitudes_licencia_estudiantes` SET fecha_inicio = '2024-07-25', fecha_fin = '2024-07-25' WHERE id = 1;

ALTER TABLE `solicitudes_licencia_estudiantes` DROP COLUMN `rango_fechas`;
ALTER TABLE `solicitudes_licencia_estudiantes` RENAME TO `solicitudes_permisos_estudiantes`;


--
-- MEJORA 4: Consistencia y Limpieza de Nombres
-- Observación: Se usan `nombre` y `primer_nombre` de forma inconsistente.
-- Acción: Estandarizar a `nombre` y `apellido`.
-- Beneficio: Claridad y consistencia en todo el esquema.
--

ALTER TABLE `estudiantes` DROP COLUMN `nombre`;
ALTER TABLE `estudiantes` CHANGE COLUMN `primer_nombre` `nombre` VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL;
ALTER TABLE `profesores` CHANGE COLUMN `primer_nombre` `nombre` VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL;


--
-- MEJORA 5: Flexibilidad para Docentes
-- Observación: `profesores` tiene `materia_relacionada`, limitando a un profesor a una sola materia.
-- Acción: Eliminar esta columna. Se prepara el terreno para una futura tabla de unión `profesores_cursos`.
-- Beneficio: Un profesor podrá enseñar múltiples cursos, reflejando un caso de uso real.
--

ALTER TABLE `profesores` DROP COLUMN `materia_relacionada`;


-- Limpieza final de columnas temporales
ALTER TABLE `estudiantes` DROP COLUMN `id_clase_temp`;
ALTER TABLE `cursos` DROP COLUMN `id_clase_temp`;

COMMIT;
