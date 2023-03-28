import Header from 'components/header';
import Footer from 'components/footer';
import Head from 'next/head';
import styles from 'styles/Inquiry_form.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import Link from 'next/link';
import Image from 'next/image';
import OrderListModal from 'components/orderlist_modal';
import { useState } from 'react';

export default function InquiryCompleated() {
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

  return (
    <>
      <Head>
        <title>お問い合わせ完了</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={modalStyle[modalOpen]}>
          <Header openModal={openModal} />
          <div className={styles.Inquiry_form}>
            <Image
              src="/images/foodkoala_img2.png"
              alt="concept"
              width={300}
              height={300}
              className={styles.koala}
            />
            <h1>お問い合わせ、ありがとうございました</h1>
            <p>後日、担当者よりご連絡差し上げます</p>
          </div>
          <div>
            <button type="submit" className={styles.button_design}>
              <Link href="/">お買い物を続ける</Link>
            </button>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
