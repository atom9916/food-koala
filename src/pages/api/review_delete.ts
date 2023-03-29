import { NextApiRequest, NextApiResponse } from 'next';

export default async function reviewDelete(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id;
    const url = process.env['SUPABASE_URL'];
    const response = await fetch(`${url}/review?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: `${process.env['SUPABASE_ANON_KEY']}`,
        Authorization: `Bearer ${process.env['SUPABASE_ANON_KEY']}`,
      },
    });
    if (response.ok) {
      const data = response.text();
      res.status(200).json(data);
    } else {
      throw new Error('送信に失敗しました');
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
