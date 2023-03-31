import Image from 'next/image';
import styles from 'styles/Header.module.css';
import { Fetcher } from 'lib/Fetcher';
import useSWR from 'swr';

export default function Shoppingcart({ openModal }: any) {
  const { data, error } = useSWR('/api/get_cart_items', Fetcher);
  if (error) return <div>HTML Error</div>;
  if (!data) return <div>Loading...</div>;

  let noItemCart = 'on';
  let koalaOnCart = 'off';
  let itemAmount = 0;

  if (data === undefined || data.length === 0) {
    noItemCart = 'on';
    koalaOnCart = 'off';
  } else {
    koalaOnCart = 'on';
    noItemCart = 'off';
    itemAmount = data.length;
  }
  return (
    <>
      <div className={`${styles[noItemCart]} ${styles.shoppingcart}`}>
        <button onClick={openModal}>
          <Image
            alt="ショッピングカートのアイコン"
            src="/images/shoppingcart.icon.png"
            width={30}
            height={30}
          />
        </button>
      </div>
      <div
        className={`${styles[koalaOnCart]} ${styles.koala_on_cart}`}
      >
        <button onClick={openModal}>
          <Image
            alt="ショッピングカートのアイコン"
            src="/images/koala-on-cart.png"
            width={60}
            height={60}
          />
          <span>{itemAmount}</span>
        </button>
      </div>
    </>
  );
}
