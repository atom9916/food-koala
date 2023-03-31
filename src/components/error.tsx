import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/error.module.css';

export default function Error() {
  return (
    <>
      <div className={styles.main}>
        <h1>ページが見つかりませんでした</h1>
        <div className={styles.wrapper}>
          <div className={styles.error_message}>
            <h2>404</h2>
            <p>
              お探しのページが見つかりません。
              <br />
              一時的にアクセスできない状況にあるか、
              <br />
              削除された可能性があります。
            </p>
            <Image
              src="/images/concept/foodkoala_img2.png"
              width={200}
              height={200}
              alt="logo"
            />
            <br />
            <Link href="/" className={styles.link}>
              →サイトトップへ戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
