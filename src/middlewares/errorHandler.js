//manejo de errores centralizado para toda la API

//envuelve un controlador async y manda cualquier rechazo a next(error).
//en Express 4 una promesa rechazada no la agarra Express solo: sin esto,
//queda como unhandled rejection y puede tumbar el proceso.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

//middleware para rutas que no coinciden con ninguna definida (404 en JSON)
const notFound = (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
};

//middleware final: traduce codigos de Prisma/PostgreSQL a HTTP con sentido.
//tiene la firma de 4 argumentos (err, req, res, next) que Express reconoce
//como manejador de errores; next queda sin usar pero es obligatorio.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  //log completo del lado del servidor para poder debuggear
  console.error(err);

  switch (err.code) {
    //registro inexistente (update/delete sobre un id que no esta)
    case "P2025":
      return res.status(404).json({ error: "Equipo no encontrado" });
    //violacion de restriccion unica
    case "P2002":
      return res.status(409).json({ error: "El equipo ya existe" });
    //identificador con formato invalido: P2023/P2003 (Prisma) y 22P02 (UUID
    //mal formado que reporta directamente el driver de PostgreSQL)
    case "P2023":
    case "P2003":
    case "22P02":
      return res.status(400).json({ error: "Identificador inválido" });
    default:
      break;
  }

  //cualquier otro error: 500 generico, sin filtrar el stack al cliente
  return res.status(500).json({ error: "Error inesperado del servidor" });
};

module.exports = { asyncHandler, notFound, errorHandler };
