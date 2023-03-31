import styles from '../styles/Shop.module.css';
import Image from 'next/image';
import { Review } from 'types/review';
import useSWR from 'swr';
import { Fetcher } from 'lib/Fetcher';
import ShopScore from './shop/review_score';
import reviewDelete from './shop/review_delete';

export default function ShopReview({ id }: { id: number }) {
  //レビューのコアラアイコン
  function koalaIcon() {
    return (
      <Image
        src="/images/foodkoala_logo.png"
        alt="コアラ"
        width={50}
        height={50}
      />
    );
  }

  const { data, error } = useSWR(
    `/api/review?shop_id=eq.${id}`,
    Fetcher,
    {
      revalidateOnMount: true,
    }
  );

  if (error) return <div>Fail to Laod...</div>;
  if (!data) return <div>Loading...</div>;

  function getRev() {
    const review: Review[] = [];
    console.log('review', review);
    const rev = () =>
      review.map((rev: Review) => (
        <>
          <div className={styles.review}>
            <div className={styles.review_name}>
              {koalaIcon()}
              <span>{rev.name}さんのレビュー</span>
            </div>
            <div className={styles.review_score_component}>
              <ShopScore id={rev.id} />
            </div>
            <div className={styles.review_date}>
              利用日 {rev.date}
            </div>
            <br />
            <div className={styles.review_detail}>{rev.review}</div>
            <img src={''} />
            <div className={styles.review_delete}>
              {reviewDelete(rev.id, rev.user_id, rev.shop_id)}
            </div>
          </div>
        </>
      ));
    if (data.length === 0) {
      return (
        <div className={styles.review}>
          <p>まだレビューがありません。</p>
        </div>
      );
    } else if (data.length === 1 || data.length === 2) {
      for (let i = data.length - 1; i >= 0; i--) {
        review.push(data[i]);
      }
      console.log('review', review);
      const revData = rev();
      return revData;
    } else {
      for (let i = data.length - 1; i >= data.length - 3; i--) {
        review.push(data[i]);
      }
      const revData = rev();
      return revData;
    }
  }
  console.log('revdata', data);

  return (
    <>
      <div className={styles.shopDetail_review}>
        <div className={styles.shop_id_review_title}>
          <span>
            <i className="fa-solid fa-face-laugh"></i>
            &nbsp;みんなのレビュー
          </span>
        </div>
        {getRev()}
      </div>
    </>
  );
}

// async function toBeBase64() {
//   const res = await fetch('/images/foodkoala_logo.png');
//   const buffer = await res.arrayBuffer();
//   const base64buffer = Buffer.from(buffer).toString('base64');
// }
// toBeBase64();

// function ReviewImage(image_base64: any) {
//   if (
//     image_base64 === null ||
//     image_base64 === undefined ||
//     image_base64 === '{}'
//   ) {
//     return;
//   } else {
//     const blob = new Blob([image_base64], { type: 'image/jpeg' });
//     const imageUrl = URL.createObjectURL(blob);
//     return imageUrl;
//   }
// }
