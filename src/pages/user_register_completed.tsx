import Header from 'components/header';
import Footer from 'components/header';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/userRegister_completed.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import { useEffect, useState } from 'react';
import OrderListModal from 'components/orderlist_modal';

export default function ItemListPage() {
  const [userName, setUserName] = useState<string>('');
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

  useEffect(() => {
    const newUserName = localStorage.getItem('name');
    if (newUserName === null || newUserName === undefined) {
      return;
    } else {
      setUserName(newUserName);
    }
  }, []);

  if (userName === undefined || userName === '') {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Head>
        <title>ユーザー登録完了</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={modalStyle[modalOpen]}>
          <Header openModal={openModal} />
          <div className={styles.background}>
            <div className={styles.userResister_completed}>
              <div className={styles.logo}>
                <Image
                  src="/images/foodkoala_logo.png"
                  width={100}
                  height={100}
                  alt="logo"
                />
                <h1>Food Koala</h1>
              </div>
              <div className={styles.message}>
                <h2>アカウント登録完了</h2>
                <h2>ようこそ、{userName}さん</h2>
                <p>
                  お客様のアカウント登録が完了しました！ <br />
                  ログインする場合は、以下の「ログイン画面へ」ボタンをクリックしてください。
                </p>
                <Link
                  href="/login"
                  className={styles.link}
                  onClick={() => localStorage.removeItem('name')}
                >
                  ログイン画面へ
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
