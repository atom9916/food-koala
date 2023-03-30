import Head from 'next/head';
import Header from 'components/header';
import { useKey } from 'react-use';
import { useState } from 'react';
import BreadList, {
  menu_list,
  favorite_list,
} from 'components/bread_list';
import Footer from 'components/footer';
import OrderListModal from 'components/orderlist_modal';
import styles from 'styles/index.module.css';
import modalStyle from 'styles/OrderListModal.module.css';

export default function LoadingFavorite() {
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
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={`${styles.main} ${modalStyle[modalOpen]}`}>
          <Header openModal={openModal} />
          <BreadList list={[menu_list, favorite_list]} />
          <div>Loading...</div>
          <Footer />
        </div>
      </div>
    </>
  );
}
