/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { APP_NAME, CLIENT_ORIGIN, SMTP_USER } from "../../config/env.ts";
import { mailer } from "../../config/mailer.ts";

const escapeHtml = (str: string) => str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");


interface SendVerificationEmailParams {
    to: string;
    name: string;
    token: string;
}

export async function sendRegistrationVerificationEmail({
    to,
    name,
    token,
}: SendVerificationEmailParams) {
    const baseUrl = CLIENT_ORIGIN ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const safeName = escapeHtml(name);
    return mailer.sendMail({
        from: `"${APP_NAME}" <${SMTP_USER}>`,
        to,
        subject: `Verify your email for ${APP_NAME}`,
        html: `
  <div style="background:#f4f4f7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <tr>
        <td>
          <h1 style="margin:0 0 24px;font-size:24px;color:#111827;">${APP_NAME}</h1>
          <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Verify your email address</h2>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
            Hi ${safeName}, welcome to ${APP_NAME}! Please confirm your email address to finish creating your account.
          </p>
          <p style="margin:24px 0;">
            <a href="${verifyUrl}"
               style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:bold;">
              Verify Email
            </a>
          </p>
          <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#6b7280;">
            This link will expire in 24 hours. If the button doesn't work, copy and paste this URL into your browser:
          </p>
          <p style="margin:0 0 24px;font-size:13px;word-break:break-all;color:#4f46e5;">${verifyUrl}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            If you didn't create a ${APP_NAME} account, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>
  </div>`
    });
}

