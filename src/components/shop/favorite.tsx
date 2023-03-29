import Head from 'next/head';
import Header from 'components/header';
import BreadList, {
  menu_list,
  favorite_list,
} from 'components/bread_list';
import ShopName from 'components/shop_name';
import Footer from 'components/footer';
import { Shop } from 'types/shops';
import styles from 'styles/favorite.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import { useState } from 'react';
import OrderListModal from 'components/orderlist_modal';

export default function Favorite({
  favoriteShops,
}: {
  favoriteShops: Shop[];
}) {
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
      <Head>
        <title>お気に入り店舗一覧</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={modalStyle[modalOpen]}>
          <Header openModal={openModal} />
          <div className={styles.main}>
            <BreadList list={[menu_list, favorite_list]} />
            <ShopName data={favoriteShops} />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
