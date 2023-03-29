import OrderList from './order_list';
import styles from 'styles/order_list.module.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Fetcher } from 'lib/Fetcher';

export default function OrderListModal({
  closeModal,
  cartItems,
}: any) {
  const userId = Cookies.get('user_id');
  const router = useRouter();
  let itemId;

  // //cart_itemsテーブルからデータを取得
  const { data, error } = useSWR('/api/get_cart_items', Fetcher);

  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

  if (!cartItems) {
    itemId = data;
  } else {
    itemId = cartItems;
  }

  //cookieの有無を確認し、ログインしていれば注文確認ページへ
  const handleClick = async () => {
    if (userId === undefined || userId === null) {
      router.push('/login');
    } else {
      router.push('/order/order_check');
    }
  };

  if (!itemId) return <div>Loading...</div>;

  if (itemId.length === 0) {
    return (
      <>
        <div className={styles.modal}>
          <h1>注文リスト</h1>
          <button className={styles.closebtn} onClick={closeModal}>
            &times;
          </button>
          <OrderList data={itemId} />
          <div className={styles.alert}>
            <p>※カートに商品がないため、購入できません</p>
            <button>
              <Link href="/">メニュー一覧へ</Link>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.modal}>
        <h1>注文リスト</h1>
        <button className={styles.closebtn} onClick={closeModal}>
          &times;
        </button>
        <OrderList data={itemId} />
        <button
          className={styles.transition_button}
          onClick={handleClick}
        >
          お会計に進む
        </button>
      </div>
    </>
  );
}
