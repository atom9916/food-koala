// footerコンポーネントの作成
import Link from 'next/link';
import styles from 'styles/Fotter.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link className={styles.link} href="/concept">
        About us
      </Link>
      <Link className={styles.link} href="/inquiry_form">
        お問い合わせ
      </Link>
    </footer>
  );
}
