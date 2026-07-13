//CONFIGURACION DE EXPRESS Y LAS RUTAS DE LA API

//Crear app express y configurar middlewares
const express = require("express");
const cors = require("cors");
const teamsRoutes = require("./routes/teams.routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

//CORS: si FRONTEND_URL esta definida, solo se permiten esos origenes
//(varios separados por coma); si no esta, se permite todo (comodo en dev).
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim()).filter(Boolean)
  : null;

//el frontend en Vercel cambia de subdominio en cada deploy (previews con hash),
//asi que ademas de la lista blanca se aceptan los despliegues *.vercel.app
const isVercelDeploy = (origin) => /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
//y localhost, para desarrollar el frontend local contra este backend
const isLocalhost = (origin) => /^http:\/\/localhost(:\d+)?$/i.test(origin);

const corsOptions = {
  origin: (origin, callback) => {
    //sin lista blanca (dev) o requests sin origin (curl, Postman) -> se permiten
    if (!allowedOrigins || !origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin) || isVercelDeploy(origin) || isLocalhost(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origen no permitido por CORS"));
  },
};

app.use(cors(corsOptions));
//permite recibir JSON en el body de las solicitudes
app.use(express.json());
//define la ruta GET /api/health para verificar que la API está funcionando
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando correctamente",
  });
});
//monta las rutas de equipos bajo /api/equipos
app.use("/api/equipos", teamsRoutes);
//404 en JSON para cualquier ruta no definida
app.use(notFound);
//manejo de errores centralizado (siempre al final de la cadena de middlewares)
app.use(errorHandler);
//exporta la app para usarla de index.js
module.exports = app;