import type { NextApiRequest, NextApiResponse } from 'next';

export default async function ItemData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = process.env['SUPABASE_URL'];
  const genreId = req.query.genreId;
  const areaId = req.query.areaId;
  const order = req.query.order;
  // 並び替えをする場合のfetch
  if (order === 'inexpensive') {
    await fetch(
      `${url}/items?genre_id=${genreId}&area_id=${areaId}&order=price.asc`,
      {
        headers: {
          apikey: `${process.env['SUPABASE_ANON_KEY']}`,
          Authorization: `Bearer ${process.env['SUPABASE_ANON_KEY']}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => res.status(400).json(error));
  } else if (order === 'expensive') {
    await fetch(
      `${url}/items?genre_id=${genreId}&area_id=${areaId}&order=price.desc`,
      {
        headers: {
          apikey: `${process.env['SUPABASE_ANON_KEY']}`,
          Authorization: `Bearer ${process.env['SUPABASE_ANON_KEY']}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => res.status(400).json(error));
  } else {
    // 特に指定がないときのfetch
    await fetch(
      `${url}/items?genre_id=${genreId}&area_id=${areaId}`,
      {
        headers: {
          apikey: `${process.env['SUPABASE_ANON_KEY']}`,
          Authorization: `Bearer ${process.env['SUPABASE_ANON_KEY']}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => res.status(400).json(error));
  }
}
