import { SyntheticEvent, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Area from 'components/area';
import Genre from 'components/genre';
import { Fetcher } from 'lib/Fetcher';
import { MenuName } from 'lib/MenuName';
import type { Menu } from 'types/menu';
import styles from 'styles/Menu_list.module.css';

export default function MenuList() {
  const [genreId, setGenreId] = useState<string>('gt.0');
  const [areaId, setAreaId] = useState<string>('gt.0');
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(0);
  const itemId = 'gt.0';

  const { data, error } = useSWR(
    `/api/menu?genreId=${genreId}&areaId=${areaId}&id=${itemId}`,
    Fetcher,
    {
      revalidateOnMount: true,
    }
  );
  const { mutate } = useSWRConfig();

  if (error) return <div>エラーです</div>;
  if (!data) return <div>Loading...</div>;

  // ページ数を取得
  const pageCount =
    data.length % 9 === 0 ? data.length / 9 : data.length / 9 + 1;

  // ページ数の配列を作成
  let pageArr = [];
  for (let i = 1; i <= pageCount; i++) {
    pageArr.push(i);
  }

  // 9個分のメニューデータを作成
  let pagingData;
  if (data.length >= 9) {
    pagingData = data.slice(page * 9, page * 9 + 9);
  } else {
    pagingData = data;
  }

  if (!pagingData || pageArr.length === 0)
    return <div>Loading...</div>;

  const handleGenreClick = (clickedId: any) => {
    setAreaId('gt.0');
    setGenreId(`eq.${clickedId}`);
    mutate(
      `/api/menu?genreId=${genreId}&areaId=${areaId}&id=${itemId}`
    );
  };

  const handleAreaClick = (clickedId: any) => {
    setGenreId('gt.0');
    setAreaId(`eq.${clickedId}`);
    mutate(
      `/api/menu?areaId=${areaId}&genreId=${genreId}&id=${itemId}`
    );
  };

  return (
    <>
      <Head>
        <title>FoodKoala トップ</title>
      </Head>
      <aside className={styles.aside}>
        <Genre
          onClick={(e: SyntheticEvent) => {
            const clickedId = e.currentTarget.id;
            handleGenreClick(clickedId);
          }}
        />
        <Area
          onClick={(e: SyntheticEvent) => {
            const clickedId = e.currentTarget.id;
            handleAreaClick(clickedId);
          }}
        />
      </aside>
      <main className={styles.topPage}>
        <div className={styles.all_menu}>
          {pagingData.map((menu: Menu) => (
            <div key={menu.id} className={styles.menu}>
              <Link
                href={`/item/${menu.id}`}
                className={styles.menu_link}
              >
                <div className={styles.menu_img}>
                  <Image
                    src={menu.image_url}
                    alt="メニュー画像"
                    width={250}
                    height={250}
                  />
                </div>
                <div className={styles.shop_detail_menuName}>
                  {MenuName(menu)} ¥{menu.price}円
                </div>
              </Link>
            </div>
          ))}
          <div className={styles.buttons}>
            {pageArr.map((page, index) => (
              <input
                type="button"
                value={page}
                key={index}
                onClick={() => {
                  setPage(Number(index));
                  mutate;
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
