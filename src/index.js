const path = require("node:path");
const { RepositorioJson } = require("./repositorio-json");
const { ServicioTickets } = require("./servicio-tickets");

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Guatemala",
  }).format(new Date(fecha));
}

function obtenerNombre(usuarios, usuarioId) {
  return usuarios.find((usuario) => usuario._id === usuarioId)?.nombre
    ?? usuarioId;
}

function mostrarTickets(tickets, usuarios) {
  if (tickets.length === 0) {
    console.log("No se encontraron tickets.");
    return;
  }

  for (const ticket of tickets) {
    console.log(`\nTicket: ${ticket._id}`);
    console.log(`Título: ${ticket.titulo}`);
    console.log(`Descripción: ${ticket.descripcion}`);
    console.log(`Usuario: ${obtenerNombre(usuarios, ticket.usuarioId)}`);
    console.log(`Estado: ${ticket.estado}`);
    console.log(`Prioridad: ${ticket.prioridad}`);
    console.log(`Creación: ${formatearFecha(ticket.fechaCreacion)}`);
  }

  console.log(`\nResultados mostrados: ${tickets.length}`);
}

function mostrarComentarios(comentarios, usuarios) {
  for (const comentario of comentarios) {
    console.log(`\nComentario: ${comentario._id}`);
    console.log(`Ticket: ${comentario.ticketId}`);
    console.log(`Autor: ${obtenerNombre(usuarios, comentario.usuarioId)}`);
    console.log(`Mensaje: ${comentario.contenido}`);
    console.log(`Creación: ${formatearFecha(comentario.fechaCreacion)}`);
  }
}

async function main() {
  // Localiza los datos desde la carpeta del proyecto.
  const carpetaDatos = path.join(__dirname, "..", "data");
  const repositorio = new RepositorioJson(carpetaDatos);
  const servicio = new ServicioTickets(repositorio);
  const datos = await servicio.cargarYValidar();

  console.log("\nSOPORTE TÉCNICO: MODELO NoSQL");
  console.log("Demostración con archivos JSON locales.");
  console.log("Colección principal propuesta: tickets");
  console.log("Fechas mostradas en horario de Guatemala.");

  console.log(
    `\nDatos validados: ${datos.usuarios.length} usuarios, ` +
      `${datos.tickets.length} tickets y ` +
      `${datos.comentarios.length} comentarios.`
  );

  console.log("\nCONSULTA 1: TICKETS ABIERTOS");
  console.log("Orden: del más antiguo al más reciente.");
  mostrarTickets(
    servicio.obtenerAbiertos(datos.tickets),
    datos.usuarios
  );

  const usuarioId = "usuario-001";

  console.log("\nCONSULTA 2: TICKETS DE UN USUARIO");
  console.log(`Usuario consultado: ${obtenerNombre(datos.usuarios, usuarioId)}`);
  console.log("Orden: del más reciente al más antiguo.");
  mostrarTickets(
    servicio.obtenerPorUsuario(datos.tickets, usuarioId),
    datos.usuarios
  );

  console.log("\nCOMENTARIOS DE EJEMPLO");
  mostrarComentarios(datos.comentarios, datos.usuarios);
}

main().catch((error) => {
  console.error(`\nNo se pudo ejecutar la demostración: ${error.message}`);
  process.exitCode = 1;
});