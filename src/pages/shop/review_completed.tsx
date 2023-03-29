import Head from 'next/head';
import Header from 'components/header';
import Image from 'next/image';
import Link from 'next/link';
import Footer from 'components/footer';
import styles from '../../styles/review_completed.module.css';

export default function ReviewCompleted() {
  return (
    <>
      <Head>
        <title>ユーザー登録完了</title>
      </Head>
      <Header />
      <div className={styles.background}>
        <div className={styles.review_completed}>
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
            <h2>レビュー投稿</h2>
            <h2>ありがとうございます</h2>
            <p>
              いつもご利用ありがとうございます！ <br />
              今後もFood Koalaをよろしくお願いいたします
            </p>
            <Link
              href="/"
              className={styles.link}
              onClick={() => localStorage.removeItem('name')}
            >
              ホーム画面へ
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
