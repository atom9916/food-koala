import Image from 'next/image';
import Script from 'next/script';
import styles from '../styles/Shop_list.module.css';
import ShopMenu from '../components/shop_menu_top2';
import { Shop } from 'types/shops';
import Link from 'next/link';
import FavoriteButton from './shop/favorite_button';
import ShopScore from 'components/shop/score';

export default function ShopName({ data }: any) {
  return (
    <>
      <Script
        src="https://kit.fontawesome.com/acecca202b.js"
        crossOrigin="anonymous"
      ></Script>
      <main className={styles.shop_list_main}>
        {data.map((shop: Shop) => (
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
    </>
  );
}
