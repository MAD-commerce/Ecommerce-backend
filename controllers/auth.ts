import { response, Request } from "express";

import bcrypt from "bcryptjs";

import { User } from "../models/User";
import { generateJwt } from "../helpers/jwt";
import { CustomRequestJwt } from "../interfaces/CustomRequestJwt";

export const createUser = async (req: Request, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario existe con ese correo",
      });
    }

    req.body.role = "user";
    req.body.cart = [];

    user = new User(req.body);

    // Encriptar contraseña
    const salt: string = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password!, salt);

    await user.save();

    const token = await generateJwt(user.id, user.name, user.role);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      cart: user.cart,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};

export const loginUser = async (req: Request, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no fue encontrado",
      });
    }

    const confirmPassword = bcrypt.compareSync(password!, user.password);

    if (!confirmPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    const token = await generateJwt(user.id, user.name, user.role);

    res.status(201).json({
      ok: true,
      uid: user.id,
      email: user.email,
      address: user.address,
      name: user.name,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};

export const updateUser = async (req: Request, res = response) => {
  const { name, email, address } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no fue encontrado",
      });
    }

    user.name = name;
    user.address = address;

    user.save();

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
}

export const deleteUser = async (req: Request, res = response) => {
  const { password } = req.body;
  const userId: string = req.params.id;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no fue encontrado",
      });
    }

    const confirmPassword = bcrypt.compareSync(password!, user.password);

    if (!confirmPassword && user.email) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    const userDeleted = await User.findByIdAndDelete(user.id, { new: true });

    res.status(201).json({
      ok: true,
      userDeleted,
      msg: "El usuario fue eliminado con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};

export const updatePassword = async (req: Request, res = response) => {
  const { email, password, newPassword } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user === null) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    if (!bcrypt.compareSync(password!, user.password)) {
      return res.status(400).json({
        ok: false,
        msg: "Las contraseñas no coinciden",
      });
    }

    // Encriptar contraseña
    const salt: string = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(newPassword!, salt);

    await user.save();

    const token = await generateJwt(user.id, user.name, user.role);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};

export const revalidateToken = async (
  req: CustomRequestJwt,
  res = response
) => {
  const { uid, name, role } = req;

  // Generar un nuevo token
  const token = await generateJwt(uid, name, role);

  res.json({
    ok: true,
    msg: "renew",
    uid,
    name,
    role,
    token,
  });
};
