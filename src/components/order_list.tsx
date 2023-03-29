import styles from 'styles/order_list.module.css';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import type { CurrentCartItems } from 'types/current_cart_items';
import Image from 'next/image';
import DeleteButton from 'components/DeleteButton';
import { CartItem } from 'types/cart_item';

export default function OrderList({ data }: any) {
  const [cartItems, setCartItems] = useState<CurrentCartItems[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const cartItemData: CartItem[] = data;

  //item_idが一致する商品のデータを取得
  useEffect(() => {
    if (!data || !cartItemData) {
      return;
    }
    async function itemData() {
      const newCartItems: CurrentCartItems[] = [];
      for (let i = 0; i <= cartItemData.length - 1; i++) {
        await fetch(`/api/item?id=eq.${cartItemData[i].item_id}`)
          .then((res) => res.json())
          .then((data) => {
            newCartItems.push({
              ...data[0],
              count: cartItemData[i].count,
              cart_itemId: cartItemData[i].id,
            });
          });
      }
      setCartItems(newCartItems);
    }
    itemData();
  }, [data, cartItemData]);

  //商品の小計を計算
  useEffect(() => {
    const add = cartItems.reduce(
      (sum, i) => sum + i.price * i.count,
      0
    );
    setSubTotal(add);
  }, [cartItems, subTotal]);

  if (cartItems.length === 0) {
    return (
      <>
        <div className={styles.main}>
          <br />
          <p>カートに商品はありません</p>
          <br />
        </div>
      </>
    );
  }

  return (
    <div className={styles.main}>
      <div>
        {cartItems.map((item, index) => (
          <dl key={index}>
            <dt>{item.name}</dt>
            <dd>
              <Image
                src={item.image_url}
                alt="商品画像"
                width={150}
                height={150}
              />
            </dd>
            <dd>
              <select
                name="itemCount"
                id={`itemCount-${index}`}
                onChange={async (e) => {
                  const selectedCount = e.target.value;
                  const newCartItems = [...cartItems];
                  newCartItems[index].count = parseInt(selectedCount);
                  setCartItems(newCartItems);
                  await fetch(`/api/patch_cart_items`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      item_id: Number(item.id),
                      count: Number(selectedCount),
                    }),
                  });
                }}
                value={item.count}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
              個
            </dd>
            <dd>{item.price * item.count}円</dd>
            <dd>
              <DeleteButton value={item.cart_itemId} />
            </dd>
          </dl>
        ))}
        <p>小計：{subTotal}円</p>
      </div>
    </div>
  );
}
