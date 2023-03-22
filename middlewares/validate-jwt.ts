import {response, NextFunction} from 'express';

import { CustomRequestJwt } from '../interfaces/CustomRequestJwt';

const jwt = require('jsonwebtoken')

export const validateJWT = (req: CustomRequestJwt, res = response, next: NextFunction) => {

    // X-TOKEN
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false, 
            msg: 'No hay token en la peticion'
        })
    }

    try {
        
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = payload.uid;
        req.name = payload.name;

    } catch (error) {
        return res.status(401).json({
            ok: false, 
            msg: 'Token no valido'
        })
    }

    next()

}
