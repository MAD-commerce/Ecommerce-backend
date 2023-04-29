import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(
  "650875211792-ul73nog7sgkup12s4f82io9vddvco3jt.apps.googleusercontent.com"
);
import { response, NextFunction } from "express";
import { CustomRequestJwt } from "../interfaces/CustomRequestJwt";
import { generateJwt } from "../helpers/jwt";

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
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = payload.uid;
    req.name = payload.name;
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
    const uid: string = payload!["sub"];
    const name: string | undefined = payload!["name"];

    const renewToken = await generateJwt(uid, name!);

    res.json({
      ok: true,
      msg: "renew",
      uid,
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
