import { MouseEventHandler, useState } from 'react';
import styles from 'styles/order_check.module.css';
import useSWR from 'swr';
import { Fetcher } from 'lib/Fetcher';
import type { Coupon } from 'types/coupon';
import Cookies from 'js-cookie';

export default function Coupon({
  subTotal,
  onClick,
}: {
  subTotal: number;
  onClick: MouseEventHandler<HTMLInputElement>;
}) {
  const [coupon, setCoupon] = useState('');
  const userId = Cookies.get('user_id');
  const { data, error } = useSWR(
    `/api/coupon?user_id=eq.${userId}`,
    Fetcher
  );

  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

  const calcDiscount = (subTotal * Number(coupon)) / 100;
  const calcTotal = subTotal - calcDiscount;

  //クーポンのdiscountをcartsデータにPATCHする
  const patchCoupon = async (
    selectedCoupon: string,
    selectedDiscount: number
  ) => {
    await fetch(`/api/patch_carts?user_id=eq.${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: Number(userId),
        discount: selectedDiscount,
        couponcode: selectedCoupon,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <h1>クーポン</h1>
      <div className={styles.order_list_details}>
        <dl>
          <dt>クーポン</dt>
          <dd>
            <select
              name="coupon-list"
              onChange={(e) => {
                const selectedDiscount = e.target.value;
                console.log(e.target);
                const selectedCoupon =
                  e.target.selectedOptions[0].text;
                setCoupon(selectedDiscount);
                patchCoupon(selectedCoupon, Number(selectedDiscount));
              }}
            >
              <option value={0} id={''}>
                --
              </option>
              {data.map((coupon: Coupon, index: number) => (
                <option key={index} value={coupon.discount}>
                  {coupon.couponcode}
                </option>
              ))}
            </select>
          </dd>
          <p>
            前回使った容器を返却すると次回使えるクーポンをプレゼント!
          </p>
          <dt>容器返却</dt>
          <dd>
            <input
              type="radio"
              id="true"
              name="container"
              onClick={onClick}
            />
            <label htmlFor="true">する</label>
          </dd>
          <dd>
            <input
              type="radio"
              id="false"
              name="container"
              onClick={onClick}
            />
            <label htmlFor="false">しない</label>
          </dd>
        </dl>
        <p>値引き合計：{calcDiscount}円</p>
      </div>
      <div>
        <h2>合計：{calcTotal}円</h2>
      </div>
    </>
  );
}
