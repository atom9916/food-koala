// headerコンポーネントの作成
import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/Header.module.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Logout from 'lib/Logout';
import useSWR from 'swr';
import { Fetcher } from 'lib/Fetcher';

export default function Header({ onClick, openModal }: any) {
  const user_id = Cookies.get('user_id');
  const [loginStatus, setLoginStatus] = useState('true');
  const [logoutStatus, setLogoutStatus] = useState('false');
  let noItemCart = 'on';
  let koalaOnCart = 'off';
  let itemAmount = 0;

  const { data, error } = useSWR('/api/get_cart_items', Fetcher);

  if (error) <div>HTML Error</div>;
  if (!data) <div>Loading...</div>;
  console.log('cart-items', data);
  if (data === undefined || data.length === 0) {
    noItemCart = 'on';
    koalaOnCart = 'off';
  } else {
    koalaOnCart = 'on';
    noItemCart = 'off';
    itemAmount = data.length;
  }

  useEffect(() => {
    if (user_id) {
      setLoginStatus('false');
      setLogoutStatus('true');
    }
  }, [user_id]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/images/header_logo.png"
              alt="header-logo"
              width={170}
              height={170}
            />
          </Link>
        </div>
        {/* ここからハンバーガーメニュー */}
        <div className={styles.hamburger}>
          <input
            type="checkbox"
            id="menu_btn_check"
            className={styles.menu_btn_check}
          />
          <label htmlFor="menu_btn_check" className={styles.menu_btn}>
            <span></span>
          </label>
          {/* ここまでハンバーガーメニュー */}
          <nav className={styles.nav}>
            <ul>
              <li>
                <Link href="/" onClick={onClick}>
                  メニュー
                </Link>
              </li>
              <li>
                <Link href="/shop/list">ショップ</Link>
              </li>
              <li>
                <Link href="/shop/favorite">お気に入り</Link>
              </li>
              <li>
                <Link href="/order/order_history">注文履歴</Link>
              </li>
              <li className={styles[loginStatus]}>
                <Link href="/login">ログイン</Link>
              </li>
              <Logout className={styles[logoutStatus]} />
            </ul>
            <div className={styles[noItemCart]}>
              <button
                className={styles.shoppingcart}
                onClick={openModal}
              >
                <Image
                  alt="ショッピングカートのアイコン"
                  src="/images/shoppingcart.icon.png"
                  width={30}
                  height={30}
                />
              </button>
            </div>
            <div className={styles[koalaOnCart]}>
              <button
                className={styles.koala_on_cart}
                onClick={openModal}
              >
                <Image
                  alt="ショッピングカートのアイコン"
                  src="/images/koala-on-cart.png"
                  width={60}
                  height={60}
                />
                <span>{itemAmount}</span>
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
