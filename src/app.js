//CONFIGURACION DE EXPRESS Y LAS RUTAS DE LA API

//Crear app express y configurar middlewares
const express = require("express");
const cors = require("cors");
const teamsRoutes = require("./routes/teams.routes");
//activar CORS para permitir solicitudes desde el frontend
const app = express();
//permite recibir JSON en el body de las solicitudes
app.use(cors());
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
//exporta la app para usarla de index.js
module.exports = app;