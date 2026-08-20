import nodemailer from "nodemailer";

const passaro = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTP_GOOGLE_APP_KEY,
  },
});
