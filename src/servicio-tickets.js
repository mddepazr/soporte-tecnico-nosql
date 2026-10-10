class ServicioTickets {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  async cargarYValidar() {
    const datos = await this.repositorio.cargarDatos();
    const estados = new Set(["abierto", "en_proceso", "resuelto"]);

    for (const [nombre, documentos] of Object.entries(datos)) {
      const ids = documentos.map((documento) => documento._id);

      if (
        ids.some((id) => typeof id !== "string" || !id.trim()) ||
        new Set(ids).size !== ids.length
      ) {
        throw new Error(`Hay identificadores inválidos o repetidos en ${nombre}.`);
      }
    }

    const usuarios = new Set(datos.usuarios.map((usuario) => usuario._id));
    const tickets = new Set(datos.tickets.map((ticket) => ticket._id));

    for (const usuario of datos.usuarios) {
      this.exigirTexto(usuario.nombre, "nombre del usuario");
      this.exigirTexto(usuario.correo, "correo del usuario");
      this.exigirTexto(usuario.rol, "rol del usuario");
    }

    for (const ticket of datos.tickets) {
      this.exigirTexto(ticket.titulo, "título del ticket");
      this.exigirTexto(ticket.descripcion, "descripción del ticket");
      this.exigirTexto(ticket.prioridad, "prioridad del ticket");
      this.validarFecha(ticket.fechaCreacion);

      if (!usuarios.has(ticket.usuarioId) || !estados.has(ticket.estado)) {
        throw new Error(`Usuario o estado inválido en ${ticket._id}.`);
      }
    }

    for (const comentario of datos.comentarios) {
      this.exigirTexto(comentario.contenido, "contenido del comentario");
      this.validarFecha(comentario.fechaCreacion);

      // Comprueba que el comentario tenga un ticket y un autor existentes.
      if (
        !tickets.has(comentario.ticketId) ||
        !usuarios.has(comentario.usuarioId)
      ) {
        throw new Error(`Referencia inválida en ${comentario._id}.`);
      }
    }

    return datos;
  }

  exigirTexto(valor, campo) {
    if (typeof valor !== "string" || !valor.trim()) {
      throw new Error(`Falta un valor válido para ${campo}.`);
    }
  }

  validarFecha(valor) {
    if (typeof valor !== "string" || Number.isNaN(Date.parse(valor))) {
      throw new Error("La fecha de creación no es válida.");
    }
  }

  compararAscendente(a, b) {
    return (
      Date.parse(a.fechaCreacion) - Date.parse(b.fechaCreacion) ||
      a._id.localeCompare(b._id)
    );
  }

  obtenerAbiertos(tickets) {
    return tickets
      .filter((ticket) => ticket.estado === "abierto")
      .sort((a, b) => this.compararAscendente(a, b))
      .slice(0, 20);
  }

  obtenerPorUsuario(tickets, usuarioId) {
    return tickets
      .filter((ticket) => ticket.usuarioId === usuarioId)
      .sort((a, b) => this.compararAscendente(b, a))
      .slice(0, 20);
  }
}

module.exports = { ServicioTickets };