const nodemailer = require("nodemailer");
import { env } from "./env";
const speakeasy = require("speakeasy");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: env.EMAIL ,
    pass: env.EMAIL_PASSWORD ,
  },
});

export function generateOTP() {
    const otp = speakeasy.totp({
    secret: env.OTP_SECRET,
    encoding: "base32",
    step: 300, 
    });
    return otp;
}
export async function sendEmail(text: string, to: string, subject: string) {
  const info = await transporter.sendMail({
    from: env.EMAIL,
    to: to,
    subject: subject,
    text: text, 
    html: "<p>" + text + "</p>", 
  });

  console.log("Message sent:", info.messageId);
}