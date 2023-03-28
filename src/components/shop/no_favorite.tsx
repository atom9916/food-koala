import Header from 'components/header';
import Footer from 'components/footer';
import BreadList, {
  menu_list,
  favorite_list,
} from 'components/bread_list';
import Image from 'next/image';
import styles from 'styles/Shop_list.module.css';
import Link from 'next/link';
import OrderListModal from 'components/orderlist_modal';
import { useState } from 'react';

export default function NoFavorite() {
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

  return (
    <>
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
                <br />
                <br />
                <Link href="/shop/list">ショップ一覧へ</Link>
              </div>
              <br />
              <p>お気に入り店舗がありません</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
