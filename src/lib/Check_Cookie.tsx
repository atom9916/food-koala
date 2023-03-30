import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import styles from 'styles/OrderListModal.module.css';

//cookieの有無を確認し、ログインしていれば注文確認ページへ

export default function CheckCookieButton() {
  const user_id = Cookies.get('user_id');
  const router = useRouter();

  const checkCookies = () => {
    if (user_id === null || user_id === undefined) {
      router.replace('/login');
    } else {
      router.replace('/order/order_check');
    }
  };

  return (
    <button
      className={styles.transition_button}
      onClick={checkCookies}
    >
      購入画面へ
    </button>
  );
}
