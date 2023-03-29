import Cookies from 'js-cookie';
import { mutate } from 'swr';
import styles from '../../styles/Shop.module.css';

export default function reviewDelete(
  id: number,
  user_id: number,
  shop_id: number
) {
  const userId = Number(Cookies.get('user_id'));
  if (user_id !== userId || userId === undefined) {
    return;
  }
  async function handleClick() {
    await fetch(`/api/review_delete?id=${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json)
      .then((data) => console.log(data));
    mutate(`/api/review?shop_id=eq.${shop_id}`);
  }
  return (
    <button type="submit" onClick={handleClick}>
      削除
    </button>
  );
}
