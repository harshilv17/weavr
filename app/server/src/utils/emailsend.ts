import nodemailer from "nodemailer";
import { config } from "../config/config.ts";
const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: Number(config.smtpPort) || 587,
  secure: config.smtpSecure,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

export async function sendVerificationEmail(to: string, code: string): Promise<void> {
  await transporter.sendMail({
    from: `"Weavr" <${config.smtpUser}>`, // sender address
    to,
    subject: "Your verification code",
    text: `Your verification code is: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;">
        <h2>Verify your email</h2>
        <p>Use the code below to verify your account. It expires in 10 minutes.</p>
        <div style="font-size:2rem;font-weight:bold;letter-spacing:0.3em;padding:16px;background:#f4f4f4;border-radius:8px;text-align:center;">
          ${code}
        </div>
        <p style="color:#888;font-size:0.85rem;margin-top:16px;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
