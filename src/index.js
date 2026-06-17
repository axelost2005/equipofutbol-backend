//LEVANTA SERVIDOR

//carga variables de entorno desde el archivo .env
require("dotenv").config();
//importa la app de Express desde app.js  
const app = require("./app");
//levanta el servidor en el puerto definido en las variables de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});