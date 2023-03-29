import styles from '../../styles/Shop.module.css';
import { SyntheticEvent, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    const results = validate({ name, date, score, review });
    setError(results);
    if (
      name !== '' &&
      date !== '' &&
      score !== '' &&
      review !== '' &&
      review.length <= 500
    ) {
      postReview();
    }
  }

  function postReview() {
    fetch('/api/post_review', {
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
        >
          <div className={styles.review_forms}>
            <div className={styles.review_forms_name}>
              <input
                type="text"
                name="name"
                placeholder="ニックネーム（投稿に表示されます）"
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
              {error.name && (
                <p className={styles[error.name]}>{error.name}</p>
              )}
            </div>
            <div className={styles.review_forms_flexbox}>
              <div className={styles.review_forms_date}>
                <label htmlFor="date">購入日</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="date"
                  name="date"
                  max={`${currentDate}`}
                  onChange={(e) => setDate(e.currentTarget.value)}
                />
                {error.date && (
                  <p className={styles[error.date]}>{error.date}</p>
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
                  <p className={styles[error.score]}>{error.score}</p>
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
                <p className={styles[error.review]}>{error.review}</p>
              )}
              {error.overReview && (
                <p className={styles[error.overReview]}>
                  {error.overReview}
                </p>
              )}
            </div>
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

// const [image_url, setImage] = useState<string | ArrayBuffer | null>(
//   ''
// );

// function handleUpload(event: any) {
//   const file = event.target.files[0];
//   const reader = new FileReader();
//   reader.onloadend = () => {
//     setImage(reader.result);
//   };
//   reader.readAsDataURL(file);
// }

/* <div className={styles.review_forms_img}>
                <input
                  type="file"
                  accept="image/jpg,image/png"
                  name="img_url"
                  alt="画像を選択してください"
                  onChange={handleUpload}
                />
              </div> */

// export function validate(input: { [k: string]: string }): {
//   [k: string]: string;
// } {
//   const error = {
//     name: 'ok',
//     date: 'ok',
//     score: 'ok',
//     review: 'ok',
//   };

//   if (input.name === '') {
//     error.name = 'alert';
//   }

//   if (input.date === '') {
//     error.date = 'alert';
//   }

//   if (input.score === '') {
//     error.score = 'alert';
//   }

//   if (input.review === '') {
//     error.review = 'alert';
//   }
//   return error;
// }
