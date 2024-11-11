import { response, Request } from "express";

import { Product } from "../models/Product";

import fs from "fs";
import path from "path";
import { User } from "../models/User";
import { ProductInterface } from "../interfaces/CustomRequestJwt";
const nodemailer = require('nodemailer');

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

export const sendEmail = async (req: Request, res = response) => {

  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail', // También puedes usar otros servicios SMTP
    auth: {
      user: 'unilocalproyecto@gmail.com',       // Tu correo electrónico
      pass: 'qofa ivix aooh yxiv',            // Tu contraseña (puede que necesites una contraseña de aplicación para Gmail)
    }
  });

  const mailOptions = {
    to: email,      // Destinatario
    subject: 'Asunto del correo',
    text: 'Este es el contenido del correo en texto plano.',
    html: `${generateProductListHTML(req.body)}`, // El contenido del correo en HTML
    attachments: [
      {
        filename: 'imagen.png',
        content: `${req.body.evidence}`.replace(/^data:image\/png;base64,/, ""),
        encoding: 'base64'
      }
    ]
  };

  try {

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log('Error al enviar correo:', error);
        res.status(500).json({
          ok: false,
          msg: "Error al enviar el email",
        });
      } else {
        res.status(201).json({
          ok: true,
        });
        console.log('Correo enviado:', info.response);
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al enviar el email",
    });
  }
}

const generateProductListHTML = (req: any) => {

  const { email, adress, evidence, products, totalPrice } = req;

  // Genera las filas de la tabla para cada producto
  interface ProductEmail {
    id: string;
    name: string;
    cantidad: number;
  }

  const productRows = (products as ProductEmail[]).map((product: ProductEmail) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${product.id}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${product.cantidad}</td>
    </tr>
  `).join('');

  return `
    <h2>Resumen de Compra</h2>
    <p>Gracias por tu compra, <b>${email}</b>. A continuación, los detalles:</p>
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Nombre</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
          </tr>
          </thead>
          <tbody>
        ${productRows}
        <p>Total: $${totalPrice}</p>
      </tbody>
    </table>
  `;
};
