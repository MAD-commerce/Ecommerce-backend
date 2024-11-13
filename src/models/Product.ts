import mongoose, { Document } from "mongoose";

interface IUproduct extends Document {
  name: string;
  price: number;
  description: string;
  type: string;
  images: any;
  discount: string;
}

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  type: { type: String, require: true },
  discount: { type: String, require: true },
  images: { type: [], require: true },
});

export const Product = mongoose.model<IUproduct>("Product", ProductSchema);
