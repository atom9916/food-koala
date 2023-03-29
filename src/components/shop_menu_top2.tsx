import styles from '../styles/Shop_list.module.css';
import useSWR from 'swr';
import Image from 'next/image';
import type { Menu } from 'types/shops';
import { Fetcher } from 'lib/Fetcher';
import { MenuName } from 'lib/MenuName';

export default function ShopMenu({ id }: { id: number }) {
  const { data, error } = useSWR(
    `/api/menu_top2?shop_id=eq.${id}`,
    Fetcher
  );

  if (error) return <div>エラーです</div>;
  if (!data) return <div>データを取得できませんでした</div>;

  const menus = data.slice(0, 2);

  return (
    <>
      <div className={styles.shop_menu_list}>
        {menus.map((menu: Menu) => (
          <div key={menu.id} className={styles.shop_menu}>
            <a href={`/item/${menu.id}`}>
              <div className={styles.shop_list_menuImg}>
                <Image
                  src={menu.image_url}
                  alt="メニュー画像"
                  width={100}
                  height={100}
                />
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
