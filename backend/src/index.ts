/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import express from 'express';
import { CLIENT_ORIGIN, PORT } from './config/env.ts';
import connectDB, { disconnectDB } from './config/connectDb.ts';
import { UploadRouter } from './routes/upload.route.ts';
import morgan from 'morgan'
import { authRouter } from './routes/auth.route.ts';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { postersRouter } from './routes/poster.route.ts';
import { TemplatesRouter } from './routes/templates.route.ts';
import { AdminRouter } from './routes/admin.routes.ts';
import { mailer } from './config/mailer.ts';
import os from 'os';


const app = express();

connectDB();
app.use(
    cors({
        origin : CLIENT_ORIGIN,
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        credentials : true
    })
);
app.use(cookieParser())
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/upload', UploadRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/posters', postersRouter);
app.use('/api/templates', TemplatesRouter);


app.listen(PORT!, () => {
    console.log('Alhamdulillah, Server is runing on PORT:'+ PORT);
});