# Soporte técnico — Diseño NoSQL

Proyecto de la semana 11 de Programación IV.
Propone una base de datos documental para gestionar solicitudes
de soporte técnico y demuestra dos consultas con archivos JSON locales.

## Qué incluye

- Colección principal `tickets`.
- Dos documentos JSON de ejemplo de tickets.
- Usuarios y comentarios relacionados mediante identificadores.
- Estado y fecha de creación de cada ticket.
- Justificación del modelo documento.
- Dos consultas propuestas para MongoDB.
- Comparación breve con SQL.

El diseño completo está en [docs/modelo-nosql.md](docs/modelo-nosql.md).

## Requisitos

- Node.js 24 LTS.
- npm, incluido con Node.js.
- Git para clonar el repositorio.

La demostración no necesita dependencias externas,
MongoDB instalado ni una conexión a internet.

## Ejecución

Desde la carpeta del proyecto:

```powershell
npm.cmd start
```

En otras terminales también puede utilizarse `npm start`.

El programa carga y valida los ejemplos. Luego muestra:

1. Tickets abiertos, del más antiguo al más reciente.
2. Tickets de `usuario-001`, del más reciente al más antiguo.
3. Los comentarios de ejemplo y sus autores.

Las consultas muestran hasta 20 tickets.
Las fechas se presentan en horario de Guatemala.

## Archivos

| Ruta | Contenido |
|---|---|
| `data/tickets.json` | Dos tickets de ejemplo |
| `data/usuarios.json` | Solicitantes y técnico de ejemplo |
| `data/comentarios.json` | Comentarios relacionados con los tickets |
| `docs/modelo-nosql.md` | Los cinco entregables y decisiones del modelo |
| `src/repositorio-json.js` | Lectura de los archivos JSON |
| `src/servicio-tickets.js` | Validaciones y consultas |
| `src/index.js` | Inicio del programa y presentación de resultados |

## Organización del código

El repositorio se encarga de leer datos.
El servicio valida la información y realiza las consultas.
El archivo principal muestra los resultados.

El servicio recibe el repositorio mediante su constructor.
Esto permite sustituir la lectura local por otro origen de datos
que implemente `cargarDatos()` y entregue la misma estructura.

Las responsabilidades están separadas y los comentarios explican
los pasos que necesitan aclaración.

## Validaciones

El programa comprueba:

- Identificadores de texto, no vacíos y únicos por colección.
- Campos de texto obligatorios.
- Fechas de creación interpretables.
- Estados permitidos: `abierto`, `en_proceso` y `resuelto`.
- Existencia del usuario de cada ticket.
- Existencia del ticket y del autor de cada comentario.

Si encuentra un error, muestra un mensaje y termina con código de error.

## Alcance

Este proyecto diseña una base NoSQL.
La demostración consulta archivos locales y no ejecuta MongoDB.

El documento del modelo propone índices y separación de comentarios
para facilitar el crecimiento del sistema. La paginación y las pruebas
de rendimiento quedan para una implementación posterior.

## Autor

Marcos Daniel de Páz Rodas  
Carnet: 2500587  
Universidad San Pablo de Guatemala