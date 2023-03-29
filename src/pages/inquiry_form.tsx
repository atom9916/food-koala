import BreadList, {
  menu_list,
  inquiry_form,
} from 'components/bread_list';
import Header from 'components/header';
import Footer from 'components/footer';
import Head from 'next/head';
import styles from 'styles/Inquiry_form.module.css';
import InquiryList from 'components/inquiryList';
import Link from 'next/link';
import OrderListModal from 'components/orderlist_modal';
import { useState } from 'react';
import modalStyle from 'styles/OrderListModal.module.css';

export default function InquiryForm() {
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
        <title>お問い合わせフォーム</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={modalStyle[modalOpen]}>
          <Header openModal={openModal} />
          <div className={styles.main}>
            <BreadList list={[menu_list, inquiry_form]} />
            <div className={styles.Inquiry_form}>
              <h1>お問い合わせフォーム</h1>
              <dl className={styles.input_form}>
                <InquiryList />
              </dl>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
