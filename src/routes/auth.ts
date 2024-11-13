const { Router } = require("express");
const router = Router();

import { check } from "express-validator";
import {
  createUser,
  loginUser,
  deleteUser,
  updatePassword,
  revalidateToken,
  updateUser,
} from "../controllers/auth";
import { validateJWT, validateJWTGoogle } from "../middlewares/validate-jwt";
import { validateEntries } from "../middlewares/validate_entries";

router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validateEntries,
  ],
  createUser
);

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validateEntries,
  ],
  loginUser
);

router.delete("/:id", deleteUser);

router.post(
  "/update",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validateEntries,
  ],
  updatePassword
);

router.put(
  "/updateUser",
  [
    check("email", "El email es obligatorio").isEmail(),
    validateEntries,
  ],
  updateUser
);

router.get("/renewJwt", validateJWT, revalidateToken);

router.get("/renewJwtGoogle", validateJWTGoogle);

module.exports = router;
