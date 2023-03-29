import styles from 'styles/order_check.module.css';
import useSWR, { useSWRConfig } from 'swr';
import { Fetcher } from '../lib/Fetcher';

export default function DeleteButton({ value }: { value: number }) {
  const { data, error } = useSWR('/api/get_cart_items', Fetcher);
  const { mutate } = useSWRConfig();

  //商品の削除
  const handleDelete = async (clickedId: number) => {
    console.log(clickedId);
    await fetch(`/api/delete_cart_items?id=eq.${clickedId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: clickedId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('削除しました');
        mutate('/api/get_cart_items');
      });
  };

  return (
    <button
      className={styles.delete_button}
      value={value}
      onClick={(e) => handleDelete(Number(e.currentTarget.value))}
    >
      削除
    </button>
  );
}
