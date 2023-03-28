import Head from 'next/head';
import Link from 'next/link';
import styles from 'styles/order_completed.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Timer from 'components/Timer';
import Header from 'components/header';
import Footer from 'components/footer';
import OrderListModal from 'components/orderlist_modal';
import { useRouter } from 'next/router';
import { Fetcher } from 'lib/Fetcher';
import type { OrderItems } from 'types/order_items';
import Cookies from 'js-cookie';

export default function OrderCompleted() {
  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
  const router = useRouter();
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

  //order_historyテーブルから注文内容を取得
  const { data, error } = useSWR(
    `/api/order_history?user_id=eq.${userId}`,
    Fetcher,
    {
      revalidateOnMount: true,
    }
  );

  //order_historyテーブルのcart_idを使用して、order_itemsテーブルからitemのデータを取得
  useEffect(() => {
    async function getOrderItems() {
      if (data === undefined || data === null || data.length === 0) {
        return;
      } else if (userId === null || userId === undefined) {
        router.push('/login');
      } else {
        await fetch(
          `/api/order_items?order_id=eq.${
            data[data.length - 1].cart_id
          }`
        )
          .then((res) => res.json())
          .then((data) => {
            console.log('order_itemsの最新データ', data);
            setOrderItems(data);
          })
          .catch((error) => console.error(error));
      }
    }
    getOrderItems();
  }, [data, router, userId]);

  if (error) return <div>エラーです</div>;
  if (!data) return <div>Loading...</div>;

  if (orderItems.length === 0) {
    return <div>Loading...</div>;
  } else if (orderItems.length > 0) {
    return (
      <>
        <Head>
          <title>注文完了画面</title>
        </Head>
        <div className={modalStyle.screen}>
          <div className={modalStyle[modal]}>
            <OrderListModal closeModal={closeModal} />
          </div>
          <div className={modalStyle[modalOpen]}>
            <Header openModal={openModal} />
            <div className={styles.main}>
              <div className={styles.position}>
                <h1>ご注文ありがとうございました！</h1>
                <h2>
                  ご注文コード:{' '}
                  <span>{data[data.length - 1].order_code}</span>
                </h2>
                <Timer date={data[data.length - 1].ordered_at} />
                <div className={styles.order_complete}>
                  <dl className={styles.dl}>
                    <div className={styles.background_orange}>
                      <dt>
                        <span>ご注文内容</span>
                      </dt>
                      {orderItems.map((item, index) => (
                        <dd key={index}>{item.item_name}</dd>
                      ))}
                    </div>
                    <dt>
                      <span>小計（税込）</span>
                    </dt>
                    <dd>{data[data.length - 1].subtotal}円</dd>
                    <div className={styles.background_orange}>
                      <dt>
                        <span>クーポン</span>{' '}
                      </dt>
                      <dd>-{data[data.length - 1].discount}%</dd>
                    </div>
                    <dt>
                      <span>合計（税込）</span>{' '}
                    </dt>
                    <dd>{data[data.length - 1].total}円</dd>
                    <div className={styles.background_orange}>
                      <dt>
                        <span>お支払い方法</span>{' '}
                      </dt>
                      <dd>{data[data.length - 1].payment_method}</dd>
                    </div>
                  </dl>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1620.2499744702093!2d139.70209411744383!3d35.689312900000026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d9c8bc1bfbb%3A0xcb44f68a614c714a!2z5qCq5byP5Lya56S-44Op44Kv44K544OR44O844OI44OK44O844K6!5e0!3m2!1sja!2sjp!4v1678233520521!5m2!1sja!2sjp"
                    width="400"
                    height="400"
                    loading="lazy"
                    className={styles.map}
                  ></iframe>
                  {/* <div className={styles.link}>
              <Link href={'#'}>詳細を見る</Link>
            </div> */}
                </div>
                <div className={styles.topbtn}>
                  <Link href={'/'}>別のメニューを注文する</Link>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }
}
