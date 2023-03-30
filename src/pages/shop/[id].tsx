import useSWR from 'swr';
import { useKey } from 'react-use';
import Head from 'next/head';
import Image from 'next/image';
import Header from 'components/header';
import Footer from 'components/footer';
import ShopScore from 'components/shop/score';
import ShopReview from 'components/shop_review';
import BreadList, {
  shop_page,
  shop_list,
  menu_list,
} from 'components/bread_list';
import FavoriteButton from 'components/shop/favorite_button';
import { Fetcher } from 'lib/Fetcher';
import { Shop, GetStaticProps, ShopProps, Menu } from 'types/shops';
import styles from '../../styles/Shop_detail.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import ReviewForm from 'components/shop/review_form';
import { useState } from 'react';
import OrderListModal from 'components/orderlist_modal';
import Link from 'next/link';

//お店情報の取得
const url = process.env['SUPABASE_URL'];

export async function getStaticPaths() {
  const res = await fetch(`${url}/shops`, {
    headers: {
      apikey: `${process.env['SUPABASE_ANON_KEY']}`,
      Authorization: `Bearer ${process.env['SUPABASE_ANON_KEY']}`,
    },
  });
  const shops = await res.json();
  const paths = shops.map((shop: Shop) => ({
    params: {
      id: `${shop.id}`,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticProps) {
  const res = await fetch(`${url}/shops?id=eq.${params.id}`, {
    headers: {
      apikey: `${process.env['SUPABASE_ANON_KEY']}`,
      Authorization: `Bearer ${process.env['SUPABASE_ANON_KEY']}`,
    },
  });
  const shopData = await res.json();
  return {
    props: { shopData },
  };
}

//メニュー情報の取得
export function MenuList({ data }: { data: Menu[] }) {
  return (
    <>
      <div className={styles.shop_id_menu_list}>
        {data.map((menu: Menu) => (
          <div key={menu.id} className={styles.shop_id_menu}>
            <Link href={`/item/${menu.id}`}>
              <Image
                src={menu.image_url}
                alt="メニュー画像"
                width={150}
                height={150}
              />
              <p>
                {menu.name} ¥{menu.price}円
              </p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export function ShopMenu({ shopId }: { shopId: number }) {
  const { data, error } = useSWR(
    `/api/items?shop_id=eq.${shopId}`,
    Fetcher
  );

  if (error) return <div>エラーです</div>;
  if (!data) return <div>データを取得できませんでした</div>;

  return <MenuList data={data} />;
}

//全体
export default function ShopDetail({ shopData }: ShopProps) {
  const shop = shopData[0];
  const [modal, setModal] = useState('close');
  const [modalOpen, setModalOpen] = useState('false');

  //カートアイコンがクリックされると、モーダルを表示し、背景を暗くする
  const openModal = () => {
    setModal('open');
    setModalOpen('true');
  };

  //×ボタンがクリックされると、モーダルを非表示にし、背景を元に戻す
  const closeModal = () => {
    setModal('close');
    setModalOpen('false');
  };

  //エスケープボタンが押された時にモーダルを閉じる
  useKey('Escape', closeModal);

  return (
    <>
      <Head>
        <title id="title">ショップ詳細画面</title>
        <script
          async
          src="https://kit.fontawesome.com/acecca202b.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={modalStyle[modalOpen]}>
          <Header openModal={openModal} />
          <div className={styles.main}>
            <div className={styles.bread}>
              <BreadList list={[menu_list, shop_list, shop_page]} />
            </div>
            <div key={shop.id} className={styles.contents}>
              <div className={styles.shop_id_name}>
                <h1>
                  <i className="fa-solid fa-utensils"></i>
                  &nbsp;&nbsp;{shop.name}
                </h1>
                <ShopScore id={shop.id} />
              </div>
              <div className={styles.shop_id_image}>
                <Image
                  src={shop.image_url}
                  alt="お店の画像"
                  width={300}
                  height={300}
                />
                <div className={styles.favorite}>
                  <FavoriteButton shop={shop} />
                </div>
                <p>{shop.description}</p>
              </div>
              <ShopMenu shopId={shop.id} />
              <div className={styles.review_contents}>
                <ShopReview id={shop.id} />
                <ReviewForm id={shop.id} />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
