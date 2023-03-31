// headerコンポーネントの作成
import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/Header.module.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Logout from 'lib/Logout';
import Shoppingcart from './Shoppingcart';

export default function Header({ openModal }: any) {
  const user_id = Cookies.get('user_id');
  const [loginStatus, setLoginStatus] = useState('true');
  const [logoutStatus, setLogoutStatus] = useState('false');

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
              className={styles.logo_img}
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
              <Link href="/">
                <li>メニュー</li>
              </Link>
              <Link href="/shop/list">
                <li>ショップ</li>
              </Link>
              <Link href="/shop/favorite">
                <li>お気に入り</li>
              </Link>
              <Link href="/order/order_history">
                <li>注文履歴</li>
              </Link>
              <Link href="/login">
                <li className={styles[loginStatus]}>ログイン</li>
              </Link>
              <Logout className={styles[logoutStatus]} />
            </ul>
          </nav>
          <Shoppingcart openModal={openModal} />
        </div>
      </header>
    </>
  );
}
