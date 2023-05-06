import { response, Request } from "express";

import { Product } from "../models/Product";

import fs from "fs";
import path from "path";
import { User } from "../models/User";
import { ProductInterface } from "../interfaces/CustomRequestJwt";

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

    const productSave = await product.save();

    const directory = path.join(__dirname, "../uploads");
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

interface Solicitud extends Request {
  uid: string;
}

export const addProductCart = async (req: Solicitud, res = response) => {
  const { product }: { product: ProductInterface } = req.body;

  try {
    let user = await User.findById(req.uid);

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no fue encontrado",
      });
    }

    user.cart.push(product);

    await user.save();

    res.status(201).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};

export const getCartById = async (req: Solicitud, res = response) => {
  try {
    let user = await User.findById(req.uid);
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no fue encontrado",
      });
    }
    res.status(201).json({
      ok: true,
      cart: user.cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};

export const deleteProductCart = async (req: Solicitud, res = response) => {
  const { _id: idProduct } = req.body;

  let nuevoArray: ProductInterface[];

  try {
    let user = await User.findById(req.uid);

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no fue encontrado",
      });
    }

    nuevoArray = user.cart.filter(
      (product: ProductInterface) => product._id !== idProduct
    );

    user.cart = nuevoArray;

    user.save();

    res.status(201).json({
      ok: true,
      cart: user.cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};
