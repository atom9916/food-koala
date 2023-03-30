import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useKey } from 'react-use';
import Image from 'next/image';
import Header from '../components/header';
import Footer from '../components/footer';
import OrderListModal from 'components/orderlist_modal';
import styles from '../styles/concept.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import BreadList, { menu_list, concept } from 'components/bread_list';

export default function TopPage() {
  const [modal, setModal] = useState('close');
  const [modalOpen, setModalOpen] = useState('false');

  //カートアイコンがクリックされると、モーダルを表示し、背景を暗くする
  const openModal = () => {
    setModal('open');
    setModalOpen('true');
  };

  //×ボタンがクリックされると、モーダルを非表示にし、背景を元に戻す
  const closeModal = () => {
    setModal('close');
    setModalOpen('false');
  };

  //エスケープボタンが押された時にモーダルを閉じる
  useKey('Escape', closeModal);

  return (
    <>
      <Head>
        <title>Food Koala について</title>
        <script
          async
          src="https://kit.fontawesome.com/acecca202b.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={modalStyle[modalOpen]}>
          <Header openModal={openModal} />
          <div className={styles.main}>
            <BreadList list={[menu_list, concept]} />
            <div className={styles.concept}>
              <div className={styles.concept_flex}>
                <div className={styles.concept_koala}>
                  <Image
                    src="/images/concept/foodkoala_img2.png"
                    alt="concept"
                    width={250}
                    height={250}
                  />
                </div>
                <div className={styles.concept_koala}>
                  <h2>いつまでも「おいしい」に包まれた世界へ</h2>
                  <h3>
                    FoodKoalaは廃棄寸前の食品専門のテイクアウト予約サービス。
                    <br />
                    捨てられるはずの「おいしい」を食卓に届け、
                    <br />
                    「おいしい」に包まれた未来を守ります。
                  </h3>
                </div>
              </div>
              <div className={styles.about}>
                <h2>Food Koalaについて</h2>
                <div className={styles.flex_box}>
                  <div className={styles.box}>
                    <div className={styles.Img}>
                      <Image
                        src="/images/concept/waste.concept.png"
                        alt="concept"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.text}>
                      <h3>食品ロス削減に貢献！</h3>
                      <p>日本国内における食品ロスは年間520万トン。</p>
                      <p>
                        うち、事業系による食品ロスは275万トン。※2020年度
                      </p>
                      <p>FoodKoalaの利用で、</p>
                      <p>
                        食品廃棄物削減の社会貢献をすることができます。
                      </p>
                    </div>
                  </div>

                  <div className={styles.box}>
                    <div className={styles.Img}>
                      <Image
                        src="/images/concept/eat.concept.png"
                        alt="concept"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.text}>
                      <h3>おいしい店舗たくさん！</h3>
                      <p>Food Koalaの登録店舗のジャンルは様々。</p>
                      <p>
                        気になっていたお店のお試しにもご利用いただけます。
                      </p>
                      <p>あなたのお気に入りなお店も見つかるかも！</p>
                      <p>おいしく楽しい食事の時間を提供します。</p>
                    </div>
                  </div>

                  <div className={styles.box}>
                    <div className={styles.Img}>
                      <Image
                        src="/images/concept/money.concept.png"
                        alt="concept"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.text}>
                      <h3>環境への配慮でお得に！</h3>
                      <p>廃棄予定の食品を販売しているため、</p>
                      <p>
                        すべてのメニューが通常よりお得な金額となっております。
                      </p>
                      <p>さらに、容器の持参で</p>
                      <p>地球にやさしくお得な割引も行っています。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.howTo}>
                <h2>ご利用方法</h2>
                <div className={styles.flex_box}>
                  <div className={styles.box}>
                    <div className={styles.Img}>
                      <Image
                        src="/images/concept/search.concept.png"
                        alt="concept"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.text}>
                      <br />
                      <i className="fa-solid fa-1"></i>
                      <h3>商品を探す</h3>
                    </div>
                  </div>

                  <div className={styles.box}>
                    <div className={styles.Img}>
                      <Image
                        src="/images/concept/cart.concept.png"
                        alt="concept"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.text}>
                      <br />
                      <i className="fa-solid fa-2"></i>
                      <h3>商品を予約する</h3>
                    </div>
                  </div>

                  <div className={styles.box}>
                    <div className={styles.Img}>
                      <Image
                        src="/images/concept/get.concept.png"
                        alt="concept"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.text}>
                      <br />
                      <i className="fa-solid fa-3"></i>
                      <h3>お店で商品を受け取る</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.start}>
                <h2>&nbsp;&nbsp;いますぐ始める&nbsp;&nbsp;</h2>
                <div className={styles.start_flex_box}>
                  <div className={styles.start_box}>
                    <Link href="/user_register">
                      会員登録はこちら&nbsp;
                      <i className="fa-solid fa-users"></i>
                    </Link>
                  </div>
                  <div className={styles.start_box}>
                    <Link href="/">
                      商品一覧はこちら&nbsp;
                      <i className="fa-solid fa-cart-shopping"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
