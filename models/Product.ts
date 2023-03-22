import mongoose, { Document } from "mongoose"

interface IUproduct extends Document {
    name: string;
    price: number;
    description: string;
}

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
});

// crear copia eliminando id
// ProductSchema.method('toJSON', function() {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// })

export const Product = mongoose.model<IUproduct>('Product', ProductSchema);