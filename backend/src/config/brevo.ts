/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { BrevoClient } from "@getbrevo/brevo";


const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY!,
});

export default brevo;