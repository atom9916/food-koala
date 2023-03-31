import styles from '../../styles/Shop.module.css';
import { SyntheticEvent, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import stream from 'stream';

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = ('00' + (currentDate.getMonth() + 1)).slice(-2);
const date = ('00' + currentDate.getDate()).slice(-2);
const today = `${year}-${month}-${date}`;
export default function ReviewForm({ id }: { id: number }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [score, setScore] = useState('');
  const [review, setReview] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState({
    name: '',
    date: '',
    score: '',
    review: '',
    overReview: '',
  });
  const router = useRouter();
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    setUserId(Cookies.get('user_id'));
  }, []);

  function validate(input: { [k: string]: string }) {
    const error = {
      name: '',
      date: '',
      score: '',
      review: '',
      overReview: '',
    };

    if (input.name === '') {
      error.name = '※ニックネームを入力してください';
    }
    if (input.date === '') {
      error.date = '※購入日を選択してください';
    }
    if (input.score === '') {
      error.score = '※スコアを入力してください';
    }
    if (input.review === '') {
      error.review = '※レビューを入力してください';
    } else if (input.review.length > 500) {
      error.overReview = '※レビューを500字以内で入力してください';
    }
    return error;
  }

  function handleSelect(event: SyntheticEvent) {
    event.preventDefault();
    const formData = new FormData();
    if (image === null) {
      console.log('ミス！！');
      return;
    } else {
      formData.append('image', image);
      console.log('formData', formData.get('image'));
      fetch('/api/upload_image', { method: 'POST', body: formData });
    }
  }

  // const shop_id = router.asPath.split('/shop/')[1];
  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    const results = validate({ name, date, score, review });
    setError(results);
    if (
      name !== '' &&
      date !== '' &&
      score !== '' &&
      review !== '' &&
      review.length <= 500 &&
      userId !== undefined
    ) {
      postReview();
    }
  }

  async function postReview() {
    await fetch('/api/post_review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shop_id: id,
        review: review,
        user_id: userId,
        name: name,
        date: date,
        score: score,
      }),
    });
    router.push('/shop/review_completed');
    return;
  }

  if (userId === null || userId === undefined) {
    return (
      <>
        <div className={styles.review_form_title}>
          <span>
            <i className="fa-solid fa-face-laugh"></i>
            &nbsp;レビュー投稿
          </span>
        </div>
        <div className={styles.review_form}>
          <div className={styles.review}>
            <div className={styles.not_review}>
              レビューの投稿にはログインをしてください。
            </div>
            <Link href={'/login'}>ログイン画面へ</Link>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className={styles.review_form_title}>
        <span>
          <i className="fa-solid fa-face-laugh"></i>
          &nbsp;レビュー投稿
        </span>
      </div>
      <div className={styles.review_form}>
        <form
          action=""
          method="POST"
          className={styles.review}
          onSubmit={(e) => handleSubmit(e)}
          id="review"
        >
          <div className={styles.review_forms}>
            <div className={styles.review_forms_name}>
              <input
                type="text"
                name="name"
                placeholder="ニックネーム※投稿に表示されます"
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
              {error.name && (
                <p className={styles['error_name']}>{error.name}</p>
              )}
            </div>
            <div className={styles.review_forms_flexbox}>
              <div className={styles.review_forms_date}>
                <label htmlFor="date">購入日</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="date"
                  name="date"
                  max={`${today}`}
                  onChange={(e) => setDate(e.currentTarget.value)}
                />
                {error.date && (
                  <p className={styles['error_date']}>{error.date}</p>
                )}
              </div>
              <div className={styles.review_forms_score}>
                <label htmlFor="score">スコア</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  name="score"
                  onChange={(e) => setScore(e.currentTarget.value)}
                />
                {error.score && (
                  <p className={styles['error_score']}>
                    {error.score}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.review_forms_review}>
              <textarea
                name="review"
                cols={50}
                rows={5}
                placeholder="レビューを500字以内で入力してください"
                onChange={(e) => setReview(e.currentTarget.value)}
              />
              {error.review && (
                <p className={styles['error_review']}>
                  {error.review}
                </p>
              )}
              {error.overReview && (
                <p className={styles['error_overReview']}>
                  {error.overReview}
                </p>
              )}
            </div>
            {/* <div className={styles.review_forms_img}>
              <input
                type="file"
                accept="image/jpg,image/png"
                name="filetoupload"
                id="img_url"
                onChange={(e) => {
                  if (e.target.files === null) {
                    return console.log('ミス');
                  } else {
                    setImage(e.target.files);
                  }
                  handleSelect;
                }}
              />
            </div> */}
          </div>
          <button
            type="submit"
            className={styles.review_forms_button}
          >
            送信
          </button>
        </form>
      </div>
    </>
  );
}

// async function patchReview(formData: BodyInit | null | undefined) {
//   await fetch('/api/patch_review', {
//     method: 'PATCH',
//     body: formData,
//   });
// }

// let formData = new FormData();
//       formData.append('shop_id', shop_id);
//       formData.append('review', review);
//       formData.append('user_id', userId);
//       formData.append('name', name);
//       formData.append('date', date);
//       formData.append('score', score);
//       formData.append('image', image || '');
//       console.log('formData', formData);

// body: JSON.stringify({
//   shop_id: id,
//   review: review,
//   user_id: userId,
//   name: name,
//   date: date,
//   score: score,
// }),

// for (let [key, value] of formData.entries()) {
//   console.log(key + ': ' + value);
// }

// formData.append('image', image || '');

// const [image, setImage] = useState<File | null>(null);

// onChange={(e) => setImage(e.target.files[0])}
