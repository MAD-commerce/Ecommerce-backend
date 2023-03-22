
const dbConnectionF = require('./database/config');

import express from 'express'
require('dotenv').config()
// const cors = require('cors')

// Crear el servidor express
const app= express();

// Bases de datos
dbConnectionF()

// cors
// app.use(cors())

// Directorio publico
app.use( express.static('public') );

// Lectura de los datos enviados en json
app.use( express.json() );

// rutasz
app.use( '/api/auth', require('./routes/auth.ts') )
app.use( '/api/products', require('./routes/products.ts') )

// Escuchar las peticiones
app.listen( process.env.PORT, () => {
    console.log(`sv corriendo ${ process.env.PORT }`)
} )

