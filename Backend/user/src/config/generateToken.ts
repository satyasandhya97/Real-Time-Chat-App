import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const JET_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (user: any)=> {
    return jwt.sign({user}, JET_SECRET, {expiresIn: "15d"})
}