import Image from 'next/image';
import Script from 'next/script';
import styles from 'styles/Shop_list.module.css';
import buttonStyles from 'styles/index.module.css';
import ShopMenu from 'components/shop_menu_top2';
import { Shop } from 'types/shops';
import Link from 'next/link';
import FavoriteButton from './favorite_button';
import ShopScore from 'components/shop/score';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { Fetcher } from 'lib/Fetcher';

export default function FavoriteShopName({ favoriteData }: any) {
  const [genreId, setGenreId] = useState<string>('gt.0');
  const [areaId, setAreaId] = useState<string>('gt.0');
  const [page, setPage] = useState(0);

  const { data, error } = useSWR(
    `/api/shop?genreId=${genreId}&areaId=${areaId}`,
    Fetcher,
    {
      revalidateOnMount: true,
    }
  );
  const { mutate } = useSWRConfig();

  if (error) return <div>Error...</div>;
  if (!data)
    return (
      <main className={styles.shop_list_main}>
        <div>Loading...</div>
      </main>
    );

  // ページ数を取得
  let pageCount =
    favoriteData.length % 3 === 0
      ? favoriteData.length / 3
      : favoriteData.length / 3 + 1;

  //ページ数の配列を作成
  let pageArr = [];
  for (let i = 1; i <= pageCount; i++) {
    pageArr.push(i);
  }

  // 3個分のデータを作成
  let pagingData;
  if (favoriteData.length >= 3) {
    pagingData = favoriteData.slice(page * 3, page * 3 + 3);
  } else {
    pagingData = favoriteData;
  }

  return (
    <>
      <Script
        src="https://kit.fontawesome.com/acecca202b.js"
        crossOrigin="anonymous"
      ></Script>
      <main className={styles.main}>
        {pagingData.map((shop: Shop) => (
          <div key={shop.id} className={styles.shop_list}>
            <Link href={`/shop/${shop.id}`}>
              <h2 className={styles.shop_list_name}>
                <i className="fa-solid fa-utensils"></i>
                &nbsp;&nbsp;{shop.name}
              </h2>
            </Link>
            <div className={styles.shop_list_score}>
              <ShopScore id={shop.id} />
            </div>
            <div className={styles.shop_list_image}>
              <Link href={`/shop/${shop.id}`}>
                <Image
                  src={shop.image_url}
                  alt="お店の画像"
                  width={160}
                  height={160}
                />
              </Link>
            </div>
            <FavoriteButton shop={shop} />
            <div className={styles.shop_list_menu}>
              <ShopMenu id={shop.id} />
            </div>
          </div>
        ))}
      </main>
      <div className={buttonStyles.buttons}>
        {pageArr.map((page, index) => (
          <button
            key={index}
            value={page}
            onClick={() => {
              setPage(index);
              mutate;
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}
