import Header from 'components/header';
import Footer from 'components/footer';
import { useKey } from 'react-use';
import BreadList, {
  menu_list,
  favorite_list,
} from 'components/bread_list';
import Link from 'next/link';
import styles from 'styles/Shop_list.module.css';
import OrderListModal from 'components/orderlist_modal';
import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function NoLoginFavorite() {
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
        <title>お気に入り店舗一覧</title>
      </Head>
      <div className={styles.screen}>
        <div className={styles[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={`${styles.main} ${styles[modalOpen]}`}>
          <Header openModal={openModal} />
          <BreadList list={[menu_list, favorite_list]} />
          <div>
            <div className={styles.favorite_login}>
              <div className={styles.favorite_login_link}>
                <Image
                  src="/images/foodkoala_img2.png"
                  alt="コアラ"
                  width={300}
                  height={300}
                />
                <Link href="/login">ログインする</Link>
                <p>
                  ※お気に入り店舗一覧を表示したい場合はログインをしてください
                </p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
