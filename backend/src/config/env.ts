/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
import { config } from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
config();

// SERVER
export const PORT = process.env.PORT;
export const NODE_ENV= process.env.NODE_ENV;
export const APP_NAME = process.env.APP_NAME;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
// JWT
export const JWT_SECRET = process.env.JWT_SECRET;
// DATABASE
export const MONGO_DB_CONNECTION_URL = process.env.MONGO_DB_CONNECTION_URL;
// CLOUDINARY
export const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
// SMTP
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
// REDIS
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_HOST = process.env.REDIS_HOST;
// GOOGLE GEN AI
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;