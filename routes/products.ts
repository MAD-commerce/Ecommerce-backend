const { Router } = require("express");
const router = Router();

import { check } from "express-validator";
import { createProduct, getAllProducts } from "../controllers/products";
import { validateJWT } from '../middlewares/validate-jwt';
import { validateEntries } from '../middlewares/validate_entries';

router.use( validateJWT )

router.post( 
    '/new',
        [
            check('name', 'El nombre es obligatorio').not().isEmpty(),
            check('price', 'El email es obligatorio').isNumeric(),
            check('description', 'La descripcion no puede ser vacia').not().isEmpty(), 
            validateEntries
        ],
    createProduct
)
router.get( 
    '/allProducts',
    getAllProducts
)
    
module.exports = router;
