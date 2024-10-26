import mongoose, { Document } from "mongoose";
import { ProductInterface } from "../interfaces/CustomRequestJwt";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  address: string;
  role: string;
  cart: ProductInterface[];
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, required: true },
  cart: { type: [], required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
