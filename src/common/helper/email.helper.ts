import * as nodemailer from 'nodemailer';
export async function sendMail(mailOptions:nodemailer.SendMailOptions) {
  const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});
  await transporter.sendMail(mailOptions)
}