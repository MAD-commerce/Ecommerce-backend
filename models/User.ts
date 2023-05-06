import mongoose, { Document } from "mongoose";
import { ProductInterface } from "../interfaces/CustomRequestJwt";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cart: ProductInterface[];
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: { type: [], required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
