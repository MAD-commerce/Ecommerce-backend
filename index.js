"use strict";
exports.__esModule = true;
var dbConnectionF = require("./database/config");
var express_1 = require("express");
require("dotenv").config();
var cors = require("cors");
// Crear el servidor express
var app = (0, express_1["default"])();
// Bases de datos
dbConnectionF();
// cors para las solicitus del front
app.use(cors());
// Directorio publico
app.use(express_1["default"].static("public"));
// Lectura de los datos enviados en json
app.use(express_1["default"].json());
// rutasz
app.use("/api/auth", require("./routes/auth.ts"));
app.use("/api/products", require("./routes/products.ts"));
// Escuchar las peticiones
app.listen(process.env.PORT, function () {
    console.log("sv corriendo ".concat(process.env.PORT));
});
