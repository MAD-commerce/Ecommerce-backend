const dbConnectionF = require("./src/database/config");

import express from "express";
require("dotenv").config();
const cors = require("cors");

// Crear el servidor express
const app = express();

// Bases de datos
dbConnectionF();

// cors para las solicitus del front
app.use(cors());

// Directorio publico
app.use(express.static("public"));

// Lectura de los datos enviados en json
app.use(express.json());

// rutasz
app.use("/api/auth", require("./src/routes/auth.js"));
app.use("/api/products", require("./src/routes/products.js"));

// Escuchar las peticiones
app.listen(process.env.PORT, () => {
  console.log(`sv corriendo ${process.env.PORT}`);
});
