import MenuList from 'components/Menu-list';
import Head from 'next/head';
import Footer from 'components/footer';
import BreadList, { menu_list } from 'components/bread_list';
import Header from 'components/header';
import useSWR, { useSWRConfig } from 'swr';
import { useEffect, useState } from 'react';
import styles from 'styles/index.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import { Fetcher } from 'lib/Fetcher';
import OrderListModal from 'components/orderlist_modal';

export default function ItemListPage() {
  const [genreId, setGenreId] = useState<string>('gt.0');
  const [areaId, setAreaId] = useState<string>('gt.0');
  const [modal, setModal] = useState('close');
  const [modalOpen, setModalOpen] = useState('false');
  const itemId = 'gt.0';
  const { data, error } = useSWR(
    `/api/menu?genreId=${genreId}&areaId=${areaId}&id=${itemId}`,
    Fetcher,
    {
      revalidateOnMount: true,
    }
  );
  const { mutate } = useSWRConfig();

  if (error) return <div>エラーです</div>;
  if (!data) return <div>Loading...</div>;

  const handleMenuClick = () => {
    setAreaId('gt.0');
    setGenreId('gt.0');
    mutate(
      `/api/menu?genreId=${genreId}&areaId=${areaId}&id=${itemId}`
    );
  };

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
        <title>商品一覧ページ</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <main className={`${styles.main} ${modalStyle[modalOpen]}`}>
          <Header onClick={handleMenuClick} openModal={openModal} />
          <BreadList list={[menu_list]} />
          <MenuList />
          <Footer />
        </main>
      </div>
    </>
  );
}
