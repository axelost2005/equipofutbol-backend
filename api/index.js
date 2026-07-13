//Handler serverless para Vercel.
//Vercel no ejecuta app.listen(): importa la app de Express (que ya es una
//funcion (req, res)) y la exporta como handler de la funcion serverless.
require("dotenv").config();
const app = require("../src/app");

module.exports = app;
