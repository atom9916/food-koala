import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MenuName } from 'lib/MenuName';
import type { Menu } from 'types/menu';
import styles from 'styles/Menu_list.module.css';
import { Fetcher } from 'lib/Fetcher';
import useSWR, { useSWRConfig } from 'swr';
import Aside from './Aside';
import SearchModal from './Search_modal';

export default function MenuList({
  openSearchModal,
  searchModal,
}: any) {
  const [page, setPage] = useState(0);
  const [genreId, setGenreId] = useState<string>('gt.0');
  const [areaId, setAreaId] = useState<string>('gt.0');
  const [sortBy, setSortBy] = useState('new');

  const { data, error } = useSWR(
    `/api/menu?genreId=${genreId}&areaId=${areaId}&order=${sortBy}`,
    Fetcher,
    {
      revalidateOnMount: true,
    }
  );
  const { mutate } = useSWRConfig();

  if (error) return <div>エラーです</div>;
  if (!data) return <div>Loading...</div>;

  const handleGenreClick = (clickedId: any) => {
    setSortBy('new');
    setAreaId('gt.0');
    setGenreId(`eq.${clickedId}`);
    mutate;
  };

  const handleAreaClick = (clickedId: any) => {
    setSortBy('new');
    setGenreId('gt.0');
    setAreaId(`eq.${clickedId}`);
    mutate;
  };

  // 並び替え
  const sortMenu = (clickedValue: string) => {
    setSortBy(clickedValue);
    mutate;
    console.log('並び替えました');
  };

  // ページ数を取得
  const pageCount =
    data.length % 6 === 0 ? data.length / 6 : data.length / 6 + 1;

  // ページ数の配列を作成
  let pageArr = [];
  for (let i = 1; i <= pageCount; i++) {
    pageArr.push(i);
  }

  // 9個分のメニューデータを作成
  let pagingData;
  if (data.length >= 6) {
    pagingData = data.slice(page * 6, page * 6 + 6);
  } else {
    pagingData = data;
  }

  if (!pagingData || pageArr.length === 0)
    return <div>Loading...</div>;

  return (
    <>
      <SearchModal
        openSearchModal={openSearchModal}
        searchModal={searchModal}
        handleGenreClick={handleGenreClick}
        handleAreaClick={handleAreaClick}
        sortMenu={sortMenu}
      />
      <div className={styles.topPage_aside}>
        <Aside
          handleGenreClick={handleGenreClick}
          handleAreaClick={handleAreaClick}
          sortMenu={sortMenu}
        />
      </div>
      <div className={styles.topPage}>
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
                  {MenuName(menu)} ¥{menu.price}(税込)
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
      </div>
    </>
  );
}
