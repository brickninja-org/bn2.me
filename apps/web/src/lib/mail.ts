import 'server-only';

import type { ReactElement } from 'react';
import type { Transporter } from 'nodemailer';
import type { Address } from 'nodemailer/lib/mailer';

import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

let transport: Transporter;

function getTransport() {
  if (transport) {
    return transport;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error('SMTP configuration missing');
    return undefined;
  }

  transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transport;
}

export async function sendMail(subject: string, to: string | Address, content: ReactElement) {
  console.log(`Sending mail "${subject}" to`, to);

  await getTransport()?.sendMail({
    subject,
    to,
    from: '"bn2.me" <noreply@bn2.me>',
    html: await render(content, { plainText: false }),
    text: await render(content, { plainText: true }),
  });
}

