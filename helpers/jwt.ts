import jwt from "jsonwebtoken";

export const generateJwt = (uid: string, name: string, role: string, email?: string, address?: string) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
      name,
      role,
      email,
      address,
    };

    // contenido, firma, duracion
    jwt.sign(
      payload,
      `${process.env.SECRET_JWT_SEED}`,
      {
        expiresIn: "2h",
      },
      (err: Error | null, token: string | undefined) => {
        if (err) {
          reject("No se puede generar el token");
        }

        resolve(token);
      }
    );
  });
};
