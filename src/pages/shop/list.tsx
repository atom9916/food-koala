import Head from 'next/head';
import { useState } from 'react';
import { useKey } from 'react-use';
import ShopName from '../../components/shop_name';
import Header from 'components/header';
import Footer from 'components/footer';
import OrderListModal from 'components/orderlist_modal';
import BreadList, {
  menu_list,
  shop_list,
} from 'components/bread_list';
import styles from 'styles/index.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import Aside from 'components/Aside';

export default function ShopList() {
  const [modal, setModal] = useState('close');
  const [modalOpen, setModalOpen] = useState('false');
  const [searchModal, setSearchModal] = useState(false);

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

  // スマホサイズの時に検索用モーダルを開閉する
  const openSearchModal = () => {
    setSearchModal(!searchModal);
  };

  //エスケープボタンが押された時にモーダルを閉じる
  useKey('Escape', closeModal);

  return (
    <>
      <Head>
        <title>ショップ一覧</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <main className={`${styles.main} ${modalStyle[modalOpen]}`}>
          <Header openModal={openModal} />
          <BreadList list={[menu_list, shop_list]} />
          <ShopName
            openSearchModal={openSearchModal}
            searchModal={searchModal}
          />
          <Footer />
        </main>
      </div>
    </>
  );
}
