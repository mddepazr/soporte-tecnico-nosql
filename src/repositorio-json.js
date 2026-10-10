const { readFile } = require("node:fs/promises");
const path = require("node:path");

class RepositorioJson {
  constructor(carpetaDatos) {
    this.carpetaDatos = carpetaDatos;
  }

  async cargarDatos() {
    const nombres = ["usuarios", "tickets", "comentarios"];

    const colecciones = await Promise.all(
      nombres.map(async (nombre) => {
        const ruta = path.join(this.carpetaDatos, `${nombre}.json`);
        const contenido = await readFile(ruta, "utf8");

        // Permite leer archivos guardados con BOM en Windows.
        const documentos = JSON.parse(contenido.replace(/^\uFEFF/, ""));

        if (!Array.isArray(documentos)) {
          throw new Error(`${nombre}.json debe contener un arreglo.`);
        }

        return [nombre, documentos];
      })
    );

    return Object.fromEntries(colecciones);
  }
}

module.exports = { RepositorioJson };