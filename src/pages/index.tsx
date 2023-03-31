import MenuList from 'components/Menu-list';
import Head from 'next/head';
import { useKey } from 'react-use';
import Footer from 'components/footer';
import BreadList, { menu_list } from 'components/bread_list';
import Header from 'components/header';
import { useState } from 'react';
import styles from 'styles/index.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import OrderListModal from 'components/orderlist_modal';

export default function ItemListPage() {
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
        <title>商品一覧ページ</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={modalStyle[modalOpen]}></div>
        <main className={styles.main}>
          <Header
            openModal={openModal}
            openSearchModal={openSearchModal}
            searchModal={searchModal}
          />
          <BreadList list={[menu_list]} />
          <MenuList />
          <Footer />
        </main>
      </div>
    </>
  );
}
