# Diseño NoSQL para soporte técnico

## 1. Colección principal

La base propuesta se llama `soporte_tecnico` y su colección
principal es `tickets`.

Cada ticket registra el usuario que lo creó, el título del
problema, su descripción, estado, prioridad y fecha de creación.

El modelo también incluye las colecciones `usuarios` y
`comentarios`. Los tickets se relacionan con los usuarios mediante
`usuarioId`. Cada comentario identifica su ticket mediante
`ticketId` y a su autor mediante `usuarioId`.

Los estados permitidos son `abierto`, `en_proceso` y `resuelto`.

## 2. Dos documentos JSON

El archivo `data/tickets.json` contiene dos documentos de ejemplo:

- `ticket-001`: problema de acceso al correo, con estado `abierto`.
- `ticket-002`: problema de impresión, con estado `en_proceso`.

Los archivos `data/usuarios.json` y `data/comentarios.json`
completan los ejemplos del sistema.

Para facilitar la lectura, usamos identificadores de texto y fechas
ISO 8601 en UTC. En estos ejemplos, las fechas son cadenas.
Una implementación con MongoDB puede convertirlas a BSON Date
para realizar operaciones propias de fechas.

## 3. Elección del modelo documento

Elegí el modelo documento porque cada ticket puede representarse
como un objeto con los datos necesarios para describir el problema.
Además, permite incorporar campos opcionales, como categoría o
equipo afectado, cuando el sistema lo necesite.

Los usuarios se guardan por separado para evitar repetir su nombre
y correo en cada ticket. Los comentarios también tienen su propia
colección porque su cantidad puede crecer sin aumentar
indefinidamente el tamaño del documento del ticket.

Esta flexibilidad requiere validaciones. El sistema debe comprobar
los campos obligatorios, los estados permitidos y la existencia
de los usuarios y tickets referenciados.

## 4. Dos consultas necesarias

### Consulta 1: tickets abiertos, del más antiguo al más reciente

Permite identificar solicitudes pendientes y atender primero
las que llevan más tiempo esperando.

```javascript
db.tickets
  .find({ estado: "abierto" })
  .sort({ fechaCreacion: 1, _id: 1 })
  .limit(20);
```

### Consulta 2: tickets de un usuario, del más reciente al más antiguo

Permite consultar el historial de solicitudes de una persona.

```javascript
db.tickets
  .find({ usuarioId: "usuario-001" })
  .sort({ fechaCreacion: -1, _id: -1 })
  .limit(20);
```

Estas son consultas propuestas para MongoDB.
La demostración del proyecto realiza consultas equivalentes
sobre archivos JSON locales.

## 5. Comparación con SQL

En SQL, el sistema podría organizarse en tablas de usuarios,
tickets y comentarios, relacionadas mediante claves foráneas.
En el modelo documento, esos datos se representan como documentos
agrupados en colecciones y relacionados mediante identificadores.

Ambos modelos sirven para este caso. SQL facilita la integridad
referencial mediante claves foráneas. MongoDB permite documentos
con campos opcionales y estructuras anidadas, aunque también
necesita validaciones. La elección depende de las consultas y
de cómo evolucionará la información.

## Crecimiento del sistema

Se proponen los siguientes índices para las consultas principales:

```javascript
db.tickets.createIndex({
  estado: 1,
  fechaCreacion: 1,
  _id: 1
});

db.tickets.createIndex({
  usuarioId: 1,
  fechaCreacion: -1,
  _id: -1
});

db.comentarios.createIndex({
  ticketId: 1,
  fechaCreacion: 1,
  _id: 1
});
```

Los índices buscan reducir el trabajo de búsqueda y ordenamiento.
El límite de 20 documentos controla el tamaño de cada respuesta.
Para recorrer todos los resultados, una implementación posterior
debe incorporar paginación.

Separar los comentarios permite consultar su historial por partes.
Estas decisiones preparan el modelo para crecer, pero la
escalabilidad debe comprobarse con una base real y pruebas de carga.