import styles from '../../styles/Shop.module.css';
import type { Shop } from 'types/shops';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function FavoriteButton({ shop }: { shop: Shop }) {
  const [heart, setHeart] = useState('shop_favorite_false');
  const router = useRouter();
  const userId = Cookies.get('user_id');
  //ページ遷移時にログイン前の場合はお気に入りボタンをグレーに。ログイン後の場合はshop_idとuser_idが一致するデータがfavoriteテーブルに存在するか確認してCSSを切り替え。
  useEffect((): void => {
    if (userId === undefined || userId === null) {
      setHeart('shop_favorite_false');
    } else {
      fetch(
        `/api/favorite_button?shop_id=eq.${shop.id}&user_id=eq.${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            setHeart('shop_favorite_false');
          } else {
            setHeart('shop_favorite_true');
          }
        });
    }
  }, [shop.id, userId]);

  //ログイン前はonClickでログイン画面に切り替え。ログイン後はcheckFavoriteを呼び出し
  function handleClick() {
    if (userId === undefined || userId === null) {
      console.log('ログインしてください');
      router.push('/login');
    } else {
      checkFavorite();
    }
  }

  //shop_idとuser_idが一致するデータがfavoriteテーブルに存在するか確認。→POSTかDELETE
  function checkFavorite() {
    fetch(
      `/api/favorite_button?shop_id=eq.${shop.id}&user_id=eq.${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('favdata', data);
        if (data.length === 0) {
          postFavorite();
        } else {
          deleteFavorite();
        }
      });
  }

  //favoriteテーブルに登録（shop_id&user_id)してボタンのCSSをsetHeart
  function postFavorite() {
    fetch(
      `/api/favorite_post?shop_id=eq.${shop.id}&user_id=eq.${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_id: shop.id,
          user_id: userId,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log('response', response);
          setHeart('shop_favorite_true');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //favoriteテーブルから削除（shop_id&user_id)してボタンのCSSをsetHeart
  function deleteFavorite() {
    fetch(
      `/api/favorite_delete?shop_id=eq.${shop.id}&user_id=eq.${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          setHeart('shop_favorite_false');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //ハートボタンの表示
  return (
    <div className={`${styles[heart]}`}>
      <button
        type="button"
        onClick={handleClick}
        data-testid={'favorite'}
      >
        <i className="fa-solid fa-heart"></i>
      </button>
    </div>
  );
}
