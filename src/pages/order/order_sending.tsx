import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import type { Options } from 'types/options';

export default function OrderSending() {
  const router = useRouter();
  const userId = Cookies.get('user_id');

  if (
    userId === null ||
    userId === undefined ||
    router.query === null
  ) {
    return;
  } else {
    const itemData = router.query.cartItems as string;
    const itemDataObj = JSON.parse(itemData);
    const cartItems = Object.values(itemDataObj);
    const subTotal = Number(router.query.amount);
    const optionData = router.query.options as string;
    const options = JSON.parse(optionData);
    const thanks = router.query.thanks as string;

    // 1.注文した日付を取得
    let orderedAt: Date;
    const orderDate = async () => {
      const date = new Date();
      orderedAt = date;
      console.log('注文日付：', orderedAt);
      orderCode();
    };

    // 2.ランダムな10文字を生成（注文コード）
    let code: string;
    const orderCode = async () => {
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let str = '';
      for (let i = 1; i <= 10; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = str;
      console.log('注文コードを作成しました:', code);
      postOrders();
    };

    // 3.注文データ(オプション系)をorder-hisotoryテーブルにPOST
    const postOrders = async () => {
      fetch('/api/post_orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: Number(userId),
          order_code: code,
          ordered_at: orderedAt,
          discount: options.discount,
          couponcode: options.couponcode,
          subtotal: subTotal,
          total: subTotal - (subTotal * options.discount) / 100,
          payment_method: options.payment_method,
          chopstick: options.chopstick,
          folk: options.folk,
          spoon: options.spoon,
          oshibori: options.oshibori,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('order_historyにデータをPOSTしました');
          deleteCoupon();
        })
        .catch((error) => console.error(error));
    };

    //使用したクーポンの削除
    const deleteCoupon = async () => {
      if (options.couponcode === undefined) {
        addThanksCoupon();
      } else {
        await fetch(
          `/api/delete_coupon?user_id=eq.${userId}&couponcode=eq.${options.couponcode}`
        )
          .then((res) => res.json())
          .then((data) => {
            console.log('使用したクーポンを削除しました');
            addThanksCoupon();
          })
          .catch((error) => console.error(error));
      }
    };

    //容器返却を選択した場合、thanks couponを取得
    const addThanksCoupon = async () => {
      if (thanks === 'true') {
        await fetch(`/api/post_coupon`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: Number(userId),
            discount: 10,
            couponcode: 'thanks coupon',
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('thanksクーポンをPOSTしました');
            deleteCarts();
          });
      } else {
        deleteCarts();
      }
    };

    // 4.cartsテーブルからuser_idが一致するデータを削除
    const deleteCarts = async () => {
      await fetch(`/api/delete_carts?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('cartsテーブルのデータを削除しました');
          getCartId();
        })
        .catch((error) => console.log(error));
    };

    // 5.order_historyテーブルから最新のcart_idを取得
    let latestCartId: number;
    const getCartId = async () => {
      await fetch(`/api/order_history?user_id=eq.${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('order_history', data);
          latestCartId = data[data.length - 1].cart_id;
          console.log('latestCartId', latestCartId);
          postOrderItems();
        });
    };

    // 6.order_itemsテーブルにcartItemsをPOST(cart_idはorder_historyから取得したもの)
    const postOrderItems = () => {
      cartItems.map((item: any) => {
        fetch('/api/post_order_items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: latestCartId,
            item_name: item.name,
            price: item.price,
            shop_id: item.shop_id,
            quantitiy: item.count,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('order-itemsテーブルにデータをPOSTしました');
          });
      });
      deleteCartItems();
    };

    // 7.cart_itemsからuser_idが一致するデータを削除
    const deleteCartItems = async () => {
      await fetch(`/api/delete_all_cart_items`)
        .then((res) => res.json())
        .then((data) => {
          console.log('cart_itemsからデータを削除しました');
          router.push('/order/order_completed');
        })
        .catch((error) => console.error(error));
    };

    // 8.注文完了後メール発送
    const sendMail = async () => {
      await fetch('/api/mail_ordered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ここでメール本文に送るデータをもうちょい足したいが
        // 現時点では注文コードのみ…要改善
        body: JSON.stringify(code),
      })
        .then((res) => {
          if (res.status === 200) {
            console.log('【success】', code);
          }
        })
        .catch((error) => {
          console.error(error);
          alert('エラーー');
        });
    };

    orderDate();
    sendMail();
  }

  return <h1>注文中...</h1>;
}
