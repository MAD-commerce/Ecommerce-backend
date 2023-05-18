import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(
  "650875211792-ul73nog7sgkup12s4f82io9vddvco3jt.apps.googleusercontent.com"
);
import { response, NextFunction } from "express";
import { CustomRequestJwt, TokenPayload } from "../interfaces/CustomRequestJwt";
import { generateJwt } from "../helpers/jwt";
import { User } from "../models/User";
import { createUser } from "../controllers/auth";
import bcrypt from "bcryptjs";

const jwt = require("jsonwebtoken");

export const validateJWT = (
  req: CustomRequestJwt,
  res = response,
  next: NextFunction
) => {
  // X-TOKEN
  const token = req.header("xtoken");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }

  try {
    const payload: TokenPayload = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED
    );

    req.uid = payload.uid;
    req.name = payload.name;
    req.role = payload.role;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }

  next();
};

export const validateJWTGoogle = async (req: any, res = response) => {
  const CLIENT_ID =
    "650875211792-ul73nog7sgkup12s4f82io9vddvco3jt.apps.googleusercontent.com";
  const token = req.header("xtoken");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const name: string | undefined = payload!["name"];
    const email: string | undefined = payload!["email"];

    let user = await User.findOne({ email });

    if (!user) {
      // Encriptar contraseña
      const salt: string = bcrypt.genSaltSync();
      let password = bcrypt.hashSync("123456", salt);

      user = new User({
        name,
        email,
        password,
        role: "user",
        cart: [],
      });

      await user.save();
    }
    const renewToken = await generateJwt(user.id, name!, "user");

    res.json({
      ok: true,
      msg: "renew",
      uid: user.id,
      name,
      renewToken,
    });
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }
};
