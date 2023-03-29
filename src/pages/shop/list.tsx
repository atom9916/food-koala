import Head from 'next/head';
import { SyntheticEvent, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import ShopName from '../../components/shop_name';
import Header from 'components/header';
import Genre from 'components/genre';
import Area from 'components/area';
import Footer from 'components/footer';
import OrderListModal from 'components/orderlist_modal';
import BreadList, {
  menu_list,
  shop_list,
} from 'components/bread_list';
import { Fetcher } from 'lib/Fetcher';
import styles from 'styles/index.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import SortItems from 'components/sort';

export default function ShopList() {
  const [genreId, setGenreId] = useState<string>('gt.0');
  const [areaId, setAreaId] = useState<string>('gt.0');
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState('close');
  const [modalOpen, setModalOpen] = useState('false');

  const { data, error } = useSWR(
    `/api/shop?genreId=${genreId}&areaId=${areaId}`,
    Fetcher,
    {
      revalidateOnMount: true,
    }
  );
  const { mutate } = useSWRConfig();

  if (error) return <div>エラーです</div>;
  if (!data) return <div>Loading...</div>;

  // ページ数を取得
  const pageCount =
    data.length % 6 === 0 ? data.length / 6 : data.length / 6 + 1;

  //ページ数の配列を作成
  let pageArr = [];
  for (let i = 1; i <= pageCount; i++) {
    pageArr.push(i);
  }

  // 6個分のデータを作成
  let pagingData;
  if (data.length >= 6) {
    pagingData = data.slice(page * 6, page * 6 + 6);
  } else {
    pagingData = data;
  }

  const handleGenreClick = (clickedId: any) => {
    setAreaId('gt.0');
    setGenreId(`eq.${clickedId}`);
    console.log(clickedId);
    mutate(`/api/shop?genreId=${genreId}&areaId=${areaId}`);
  };

  const handleAreaClick = (clickedId: any) => {
    setGenreId('gt.0');
    setAreaId(`eq.${clickedId}`);
    console.log(clickedId);
    mutate(`/api/shop?areaId=${areaId}&genreId=${genreId}`);
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
        <title>ショップ一覧</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <main className={`${styles.main} ${modalStyle[modalOpen]}`}>
          <Header openModal={openModal} />
          <BreadList list={[menu_list, shop_list]} />
          <aside className={styles.aside}>
            <Genre
              onClick={(e: SyntheticEvent) => {
                const clickedId = e.currentTarget.id;
                handleGenreClick(clickedId);
              }}
            />
            <Area
              onClick={(e: SyntheticEvent) => {
                const clickedId = e.currentTarget.id;
                handleAreaClick(clickedId);
              }}
            />
          </aside>
          <ShopName data={pagingData} />
          <div className={styles.buttons}>
            {pageArr.map((page, index) => (
              <button
                key={index}
                value={page}
                onClick={() => {
                  setPage(index);
                  mutate;
                }}
              >
                {page}
              </button>
            ))}
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
