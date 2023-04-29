import { response, Request } from "express";

import { Product } from "../models/Product";

import fs from "fs";
import path from "path";

export const createProduct = async (req: Request, res = response) => {
  try {
    let images;

    if (req.files && Array.isArray(req.files)) {
      images = req.files.map((file: Express.Multer.File) => {
        const fileData = fs.readFileSync(file.path);
        return fileData.toString("base64");
      });
    }

    // Crear el producto con los datos enviados en la solicitud
    const product = new Product({
      ...req.body,
      images,
    });

    console.log(product);

    const productSave = await product.save();

    const directory = path.join(__dirname, "../uploads");
    console.log(directory);
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });

    res.status(201).json({
      ok: true,
      product: productSave,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el producto",
    });
  }
};

export const getAllProducts = async (req: Request, res = response) => {
  try {
    const allProducts = await Product.find();

    res.status(201).json({
      ok: true,
      allProducts,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los productos",
    });
  }
};

export const getProductById = async (req: Request, res = response) => {
  const _id = req.header("productId");

  try {
    const product = await Product.findById(_id);

    res.status(201).json({
      ok: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al obtener el producto",
    });
  }
};
