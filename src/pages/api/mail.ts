import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function Mail(
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
  const mailOptions = {
    from: req.body.email,
    to: 'something@example.com',
    subject: `お問い合わせ(${req.body.name}様)`,
    text: `${req.body.message}sent from ${req.body.email}`,
    html: `
      <p>【名前】</p>
      <p>${req.body.name}</p>
      <p>【かな】</p>
      <p>${req.body.nameKana}</p>
      <p>【メールアドレス】</p>
      <p>${req.body.email}</p>
      <p>【電話番号】</p>
      <p>${req.body.phone}</p>
      <p>【メッセージ】</p>
      <p>${req.body.message}</p>
      `,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
  return res.send('成功しました');
}
