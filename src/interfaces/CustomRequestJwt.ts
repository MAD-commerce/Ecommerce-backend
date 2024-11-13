import { Request } from "express";

export interface ProductInterface {
  _id?: string;
  name?: string;
  price?: string;
  images?: any;
  discount?: string;
  description?: string;
  type: string;
  colors?: {};
  sizes?: {};
}

export interface CustomRequestJwt extends Request {
  uid: string;
  name: string;
  role: string;
  email: string;
  address: string;
}

export interface TokenPayload {
  uid: string;
  name: string;
  role: string;
  address: string;
}
