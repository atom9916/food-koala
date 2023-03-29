import type { NextApiRequest, NextApiResponse } from 'next';

export default async function CartItems(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = process.env['SUPABASE_URL'];
    const id = req.query.id;
    const response = await fetch(`${url}/cart_items?id=${id}`, {
      method: req.method,
      headers: {
        apikey: `${process.env['SUPABASE_ANON_KEY']}`,
        Authorization: `Bearer ${process.env['SUPABASE_ANON_KEY']}`,
      },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) {
      throw new Error('送信に失敗しました');
    }
    const data = await response.text();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
