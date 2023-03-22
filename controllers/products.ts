import { response, Request } from 'express';

import { Product } from '../models/Product'

export const createProduct = async( req: Request, res = response ) => {

    // const { name, price, description } = req.body

    const product = new Product( req.body )

    try {
        
        const producSave = await product.save()

        res.status(201).json({
            ok: true,
            product: producSave 
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el producto'
        })
    }

}

export const getAllProducts = async( req: Request, res = response ) => {

    try {

        const allProducts = await Product.find()

        res.status(201).json({
            ok: true,
            allProducts
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los productos'
        })
    }

}