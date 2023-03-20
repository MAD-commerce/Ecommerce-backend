import mongoose, { Document, model } from "mongoose"

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);