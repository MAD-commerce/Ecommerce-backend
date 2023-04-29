const { Router } = require("express");
const router = Router();

import { check } from "express-validator";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/products";

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/new", upload.array("images"), createProduct);

router.get("/allProducts", getAllProducts);

router.get("/productById", getProductById);

module.exports = router;
