import { response, NextFunction } from "express";

import { validationResult } from "express-validator/src/validation-result";

export const validateEntries = ( req: Request, res = response, next: NextFunction ) => {

    // manejo de errores
    const errores = validationResult( req )
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false, 
            errores: errores.mapped()
        })
    }

    next()

}
