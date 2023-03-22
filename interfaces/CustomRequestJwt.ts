import { Request } from 'express';

export interface CustomRequestJwt extends Request {
    uid: string,
    name: string 
}
