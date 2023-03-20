import mongoose from 'mongoose';

const dbConnection = async() => {

    try {

        // crear conexion a la db
        await mongoose.connect( `${process.env.DB_CNN}` );

        console.log('DB online')

    } catch (error) {
        console.log(error)
        throw new Error('Error para inicializar la bd')
    }

}

module.exports = dbConnection

