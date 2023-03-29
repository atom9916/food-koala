import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Option from 'components/option';
import SelectPay from 'components/select_pay';
import Header from 'components/header';
import Footer from 'components/footer';
import Coupon from 'components/Coupon';
import BreadList, {
  menu_list,
  order_check,
} from 'components/bread_list';
import type { CartItem } from 'types/cart_item';
import type { CurrentCartItems } from 'types/current_cart_items';
import styles from 'styles/order_check.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import Cookies from 'js-cookie';
import { Options } from 'types/options';
import OrderListModal from 'components/orderlist_modal';

export default function OrderCheck() {
  const userId = Cookies.get('user_id');
  const router = useRouter();
  const [itemId, setItemId] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<CurrentCartItems[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [errorAlert, setErrorAlert] = useState('ok');
  const [optionData, setOptionData] = useState<Options>();
  const memorizedOptionData = useMemo(() => optionData, [optionData]);
  let thanks = '';

  //cart_itemsテーブルからデータを取得
  useEffect(() => {
    async function getItemId() {
      if (userId === null || userId === undefined) {
        router.push('/login');
      } else {
        await fetch('/api/get_cart_items')
          .then((res) => res.json())
          .then((data) => {
            setItemId(data);
          });
      }
    }
    getItemId();
  }, [router, userId]);

  //item_idが一致する商品のデータを取得
  useEffect(() => {
    async function itemData() {
      const newCartItems: CurrentCartItems[] = [];
      for (let i = 0; i <= itemId.length - 1; i++) {
        await fetch(
          `/api/menu?genre_id=gt.0&area_id=gt.0&id=eq.${itemId[i].item_id}`
        )
          .then((res) => res.json())
          .then((data) => {
            newCartItems.push({ ...data[0], count: itemId[i].count });
          });
      }
      setCartItems(newCartItems);
    }
    itemData();
  }, [itemId]);

  //商品の小計を計算
  useEffect(() => {
    const add = cartItems.reduce(
      (sum, i) => sum + i.price * i.count,
      0
    );
    setSubTotal(add);
  }, [cartItems, subTotal]);

  // クレジットAPIからのリダイレクトの場合はorder_sendingページに遷移
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const credit = urlParams.get('credit');
    const thanks = urlParams.get('thanks');
    const options = urlParams.get('options');
    console.log(credit);
    if (credit === null) {
      return;
    } else if (credit === 'ok') {
      console.log('options', options);
      console.log('thanks', thanks);
      router.push({
        pathname: '/order/order_sending',
        query: {
          cartItems: JSON.stringify(cartItems),
          amount: subTotal,
          options: options,
          thanks: thanks,
        },
      });
    }
  }, [cartItems, memorizedOptionData, router, subTotal, thanks]);

  // 現金の場合は注文コード等の作成へ、クレジットカードの場合はAPIに接続
  const handleOrder = async () => {
    try {
      const res = await fetch(`/api/carts?user_id=eq.${userId}`);
      const data = await res.json();
      console.log('cartsテーブルから取得したデータ', data[0]);
      setOptionData(data[0]);
      if (data[0].payment_method === null) {
        console.log('payment_methodがnullです');
        setErrorAlert('alert');
        return;
      } else if (data[0].payment_method === '現金') {
        setErrorAlert('ok');
        router.push({
          pathname: '/order/order_sending',
          query: {
            cartItems: JSON.stringify(cartItems),
            amount: subTotal,
            options: JSON.stringify(data[0]),
            thanks: thanks,
          },
        });
      } else if (data[0].payment_method === 'クレジットカード') {
        router.push({
          pathname: '/checkout_form',
          query: {
            amount: subTotal,
            thanks: thanks,
            options: JSON.stringify(data[0]),
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (itemId.length === 0 || cartItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>注文確認ページ</title>
      </Head>
      <BreadList list={[menu_list, order_check]} />
      <div className={styles.order_check}>
        <div className={styles.order_check_float1}>
          <>
            <div className={styles.h1}>
              <h1 className={styles.order_list_h1}>注文リスト</h1>
            </div>
            <div className={styles.order_list}>
              <div>
                {cartItems.map((item, index) => (
                  <div key={index}>
                    <dl>
                      <dt>{item.name}</dt>
                      <dd>
                        <Image
                          src={item.image_url}
                          alt="商品画像"
                          width={100}
                          height={100}
                        />
                      </dd>
                      <dd>{item.count}個</dd>
                      <dd>{item.price * item.count}円</dd>
                    </dl>
                  </div>
                ))}
                <p>小計：{subTotal}円</p>
              </div>
            </div>
          </>
          <SelectPay />
          <p className={styles[errorAlert]}>
            ※お支払い方法を選択してください
          </p>
        </div>
        <div className={styles.order_check_float2}>
          <Option />
          <Coupon
            subTotal={subTotal}
            onClick={(e) => {
              console.log(e.currentTarget.id);
              thanks = e.currentTarget.id;
            }}
          />
          <div>
            <button
              onClick={handleOrder}
              className={styles.order_check_button}
            >
              注文確定
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
