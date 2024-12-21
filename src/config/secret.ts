import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const PORT = process.env;
export const JWT_SECRET = process.env.JWT_SECRET;
