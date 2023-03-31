import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function MailOrdered(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
    secure: true,
    tls: {
      rejectUnauthorized: true,
    },
  });

  // 受け取るメール
  const mailOptionsOrdered = {
    from: 'something@example.com',
    to: '仮',
    subject: `ご注文ありがとうございます`,
    text: req.body,
    html: `
      <p>【注文コード】</p>
      <p>${req.body}</p>
      `,
  };

  transport.sendMail(mailOptionsOrdered, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
  return res.send('成功しました');
}
