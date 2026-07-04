import nodemailer from "nodemailer";

interface EmailInput {
  credentials: {
    host: string;
    port: number;
    username: string;
    password: string;
  };

  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(input: EmailInput) {
  const transporter = nodemailer.createTransport({
    host: input.credentials.host,
    port: input.credentials.port,
    auth: {
      user: input.credentials.username,
      pass: input.credentials.password,
    },
  });

  return transporter.sendMail({
    from: input.credentials.username,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
}
