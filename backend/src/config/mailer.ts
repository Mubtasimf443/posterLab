/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import nodemailer from 'nodemailer';
import { NODE_ENV, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from './env.ts';


export const mailer = nodemailer.createTransport({
    host : SMTP_HOST,
    port:SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
    secure :false,
    tls: {
        rejectUnauthorized: false,
        ciphers:'SSLv3'
    },
    connectionTimeout: 10000, 
    dnsTimeout : 3000,
    socketTimeout : 3000,
    greetingTimeout : 3000
})