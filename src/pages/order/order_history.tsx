import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useKey } from 'react-use';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import BreadList, {
  menu_list,
  order_history,
} from 'components/bread_list';
import Footer from 'components/footer';
import Header from 'components/header';
import type { OrderHistory } from 'types/order_history';
import type { OrderItems } from 'types/order_items';
import { Fetcher } from 'lib/Fetcher';
import styles from 'styles/order_history.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import Cookies from 'js-cookie';
import OrderListModal from 'components/orderlist_modal';

export default function OrderHistory() {
  const [orderDate, setOrderDate] = useState<Date[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItems[]>();
  const [pageId, setPageId] = useState(1);
  const userId = Cookies.get('user_id');
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

  //order_historyテーブルから注文内容を取得
  const { data, error } = useSWR(
    `/api/order_history?user_id=eq.${userId}`,
    Fetcher
  );

  //ordersテーブルのcart_idを使用して、order_itemsテーブルからitemのデータを取得
  useEffect(() => {
    async function getOrderItems() {
      if (
        data === undefined ||
        data === null ||
        data.length === 0 ||
        pageId === undefined ||
        userId === undefined ||
        userId === null
      ) {
        return;
      } else {
        await fetch(
          `/api/order_items?user_id=eq.${userId}&order_id=eq.${
            data[data.length - pageId].cart_id
          }`
        )
          .then((res) => res.json())
          .then((data) => {
            setOrderItems(data);
          })
          .catch((error) => console.error(error));
      }
    }
    getOrderItems();
  }, [data, pageId, userId]);

  //ordered_atをDate型に変換
  useEffect(() => {
    if (data === undefined || data === null) {
      return;
    }
    const newDateArray = () => {
      const newOrderDate: Date[] = [];
      for (let i = 0; i <= data.length - 1; i++) {
        const orderDate = new Date(data[i].ordered_at);
        newOrderDate.push(orderDate);
      }
      setOrderDate(newOrderDate);
    };
    newDateArray();
  }, [data]);

  if (error) return <div>Error...</div>;

  //ログイン前（cookieなし）はログインを促す
  if (userId === null || userId === undefined) {
    return (
      <>
        <Head>
          <title>注文履歴</title>
        </Head>
        <div className={modalStyle.screen}>
          <div className={modalStyle[modal]}>
            <OrderListModal closeModal={closeModal} />
          </div>
          <div className={`${styles.main} ${modalStyle[modalOpen]}`}>
            <Header openModal={openModal} />
            <BreadList list={[menu_list, order_history]} />
            <div className={styles.before_login}>
              <Image
                src="/images/foodkoala_img2.png"
                alt="コアラ"
                width={300}
                height={300}
              />
              <Link href="/login">ログインする</Link>
              <p>※注文履歴を表示したい場合はログインをしてください</p>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  if (!data || !orderItems) {
    return (
      <>
        <Head>
          <title>注文履歴</title>
        </Head>
        <div className={modalStyle.screen}>
          <div className={modalStyle[modal]}>
            <OrderListModal closeModal={closeModal} />
          </div>
          <div className={styles.main}>
            <Header openModal={openModal} />
            <BreadList list={[menu_list, order_history]} />
            <div className={styles.h1}>
              <h1>注文履歴一覧</h1>
            </div>
            <div>Loading...</div>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  if (orderItems.length === 0) {
    return (
      <>
        <Head>
          <title>注文履歴</title>
        </Head>
        <div className={modalStyle.screen}>
          <div className={modalStyle[modal]}>
            <OrderListModal closeModal={closeModal} />
          </div>
          <div className={styles.main}>
            <Header openModal={openModal} />
            <BreadList list={[menu_list, order_history]} />
            <div className={styles.before_login}>
              <Image
                src="/images/foodkoala_img2.png"
                alt="コアラ"
                width={300}
                height={300}
              />
              <p>※注文履歴がありません</p>
              <Link href="/">メニューから注文する</Link>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>注文履歴</title>
        </Head>
        <div className={modalStyle.screen}>
          <div className={modalStyle[modal]}>
            <OrderListModal closeModal={closeModal} />
          </div>
          <Header openModal={openModal} />
          <div className={`${styles.main} ${modalStyle.modalOpen}`}>
            <BreadList list={[menu_list, order_history]} />
            <div className={styles.order_history}>
              <h2>
                注文日：
                {orderDate[data.length - pageId].getFullYear()}年
                {orderDate[data.length - pageId].getMonth() + 1}月
                {orderDate[data.length - pageId].getDate()}日&nbsp;
                {orderDate[data.length - pageId].getHours()}:
                {orderDate[data.length - pageId].getMinutes()}
              </h2>
              <div>
                <dl className={styles.dl}>
                  <div className={styles.background_orange}>
                    <dt>
                      <span>注文コード</span>
                    </dt>
                    <dd>{data[data.length - pageId].order_code}</dd>
                  </div>
                  <div>
                    <dt>
                      <span>ご注文内容</span>
                    </dt>
                    {orderItems.map((item, index) => (
                      <dd key={index}>{item.item_name}</dd>
                    ))}
                  </div>
                  <div className={styles.background_orange}>
                    <dt>
                      <span>お支払い金額</span>
                    </dt>
                    <dd>{data[data.length - pageId].total}円</dd>
                  </div>
                  <div>
                    <dt>
                      <span>お支払い方法</span>
                    </dt>
                    <dd>
                      {data[data.length - pageId].payment_method}
                    </dd>
                  </div>
                </dl>
                <div className={styles.map}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1620.2499744702093!2d139.70209411744383!3d35.689312900000026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d9c8bc1bfbb%3A0xcb44f68a614c714a!2z5qCq5byP5Lya56S-44Op44Kv44K544OR44O844OI44OK44O844K6!5e0!3m2!1sja!2sjp!4v1678233520521!5m2!1sja!2sjp"
                    width="350"
                    height="300"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              {data.map((item: OrderHistory, index: number) => (
                <input
                  type="button"
                  value={index + 1}
                  onClick={() => {
                    setPageId(index + 1);
                  }}
                  key={index}
                />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }
}
