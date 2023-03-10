
const express = require("express");

// Crear el servidor express
const app= express();

// Rutas
app.get('/', (req, res) => {

    console.log('get')
    res.json({
        ok: true
    })

});

app.listen( 4000, () => {
    console.log(`Servidor corriendo en el puerto ${ 4000 }`)
})
