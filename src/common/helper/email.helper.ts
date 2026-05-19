import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({
  to,
  subject,
  html,
}: SendMailOptions) {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_USER as string,
      to,
      subject,
      html,
    });

    console.log(response);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}