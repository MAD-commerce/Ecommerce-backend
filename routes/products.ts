const { Router } = require("express");
const router = Router();

import { check } from "express-validator";
import {
  addProductCart,
  createProduct,
  deleteProductCart,
  getAllProducts,
  getCartById,
  getProductById,
} from "../controllers/products";
import { validateJWT } from "../middlewares/validate-jwt";

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/new", upload.array("images"), createProduct);

router.get("/allProducts", getAllProducts);

router.get("/productById", getProductById);

router.post("/updateCart", validateJWT, addProductCart);

router.post("/deleteProductCart", validateJWT, deleteProductCart);

router.get("/getCartById", validateJWT, getCartById);

module.exports = router;
