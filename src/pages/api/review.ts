import { NextApiRequest, NextApiResponse } from 'next';

export default async function getReview(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = process.env['SUPABASE_URL'];
  const shop_id = req.query.shop_id;
  try {
    const response = await fetch(`${url}/review?shop_id=${shop_id}`, {
      headers: {
        apikey: `${process.env['SUPABASE_ANON_KEY']}`,
        Authorization: `Bearer ${process.env['SUPABASE_ANON_KEY']}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to load...');
    }
    if (!data) {
      throw new Error('Loading');
    }
    console.log('res_data', data);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
