/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import mongoose, { connect } from "mongoose";
import { MONGO_DB_CONNECTION_URL } from "./env.ts";

export default async function connectDB() {
    try {
        await connect(MONGO_DB_CONNECTION_URL!)
        console.log('DATABASE CONNECTED SUCCESSFULLY');
    } catch (error) {
        console.error(error);
    }
}

export async function disconnectDB() {
    try {
        await mongoose.connection.close()
    } catch (error) {
        console.error('mongoose connection disconnecting error', error);
    }
}