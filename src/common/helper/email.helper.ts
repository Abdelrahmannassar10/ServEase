import { Resend } from 'resend';

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

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is missing in environment variables');
  }

  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: 'ServEase <noreply@contact.servease.me>',
    to,
    subject,
    html,
  });

  return response;
}