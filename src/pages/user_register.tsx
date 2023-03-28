import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../styles/userRegisterPage.module.css';
import modalStyle from 'styles/OrderListModal.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import OrderListModal from 'components/orderlist_modal';

// 未入力の場合、エラーを返す
export function validate(input: { [k: string]: string }): {
  [k: string]: string;
} {
  const error = {
    name: 'ok',
    email: 'ok',
    zipcode: 'ok',
    address: 'ok',
    phone_number: 'ok',
    password: 'ok',
    passwordValidation: 'ok',
    password2: 'ok',
  };

  if (input.name === '') {
    error.name = 'alert';
  }

  if (input.email === '') {
    error.email = 'alert';
  }

  if (input.zipcode === '') {
    error.zipcode = 'alert';
  }

  if (
    !input.zipcode.match(
      /^[0-9]{3}-[0-9]{4}$/ || /^[0-9]{3}[0-9]{4}$/
    )
  ) {
    error.zipcode = 'alert';
  }

  if (input.address === '') {
    error.address = 'alert';
  }

  if (input.phone_number === '') {
    error.phone_number = 'alert';
  }

  if (input.password === '') {
    error.password = 'alert';
  }

  if (!input.password.match(/^[A-Za-z0-9]+$/)) {
    console.log('パスワードは半角英数で入力してください。');
    error.passwordValidation;
  }

  if (input.password2 === '') {
    error.password2 = 'alert';
  }
  return error;
}

export default function UserRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
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

  // 半角英数指定のエラー表示
  // const [validation, setValidation] = useState({
  //   zipcode: 'ok',
  //   phone_number: 'ok',
  //   password: 'ok',
  // });

  // 未入力時のエラー表示
  const [error, setError] = useState<{ [k: string]: string }>({
    name: 'ok',
    email: 'ok',
    zipcode: 'ok',
    address: 'ok',
    phone_number: 'ok',
    password: 'ok',
    passwordValidation: 'ok',
    password2: 'ok',
  });

  const [errorZipcode, setErrorZipcode] = useState('ok');

  const [errorNoAddress, setErrorNoAddress] = useState('ok');
  // メールアドレスの重複エラー表示
  const [errorMail, setErrorMail] = useState('ok');
  // 文字数に対するエラー表示
  const [lengthError, setLengthError] = useState('ok');
  const [passLength, setPassLength] = useState('ok');
  // パスワードが不一致のエラー表示
  const [mismatchPassword, setMismatchPassword] = useState('ok');

  const router = useRouter();

  function getZipcode() {
    if (zipcode === '') {
      console.log('※郵便番号を入力してください。');
      setErrorZipcode('alert');
      return;
    }
    setErrorZipcode('ok');

    fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results === null) {
          console.log('郵便番号が取得できませんでした');
          setErrorNoAddress('alert');
          return;
        } else {
          console.log('郵便番号が取得できました');
          setAddress(
            `${
              data.results[0].address1 +
              data.results[0].address2 +
              data.results[0].address3
            }`
          );
        }
        setErrorNoAddress('ok');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function userPost() {
    fetch('/api/post_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        address: address,
        zipcode: zipcode,
        phone_number: phone_number,
        password: password,
      }),
    }).then((response) => {
      //userテーブルからidを取得
      if (response.ok) {
        fetch('/api/get_users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            const user_id = data[0].id;
            console.log('user_id', user_id);
            //couponテーブルにwelcome couponをPOST
            fetch(`/api/post_coupon`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: user_id,
                couponcode: 'welcome coupon',
                discount: 10,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                // 登録完了画面へ遷移
                console.log('welcome couponを付与しました');
                localStorage.setItem('name', name);
                router.push('/user_register_completed');
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      }
    });
  }

  return (
    <>
      <Head>
        <title>新規会員登録</title>
      </Head>
      <div className={modalStyle.screen}>
        <div className={modalStyle[modal]}>
          <OrderListModal closeModal={closeModal} />
        </div>
        <div className={modalStyle[modalOpen]}>
          <Header openModal={openModal} />
          <div className={styles.background}>
            <div className={styles.logo}>
              <Image
                src="/images/foodkoala_logo.png"
                width={100}
                height={100}
                alt="logo"
              />
              <h1>Food Koala</h1>
            </div>
            <div className={styles.form_position}>
              <h2>新規会員登録</h2>
              <p className={styles.message}>
                必要事項を入力し、登録ボタンを押してください。
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const results = validate({
                    name,
                    email,
                    zipcode,
                    address,
                    phone_number,
                    password,
                    password2,
                  });
                  console.log(results);
                  // 各項目が未入力だった場合、エラーを表示する
                  for (const prop in results) {
                    if (results[prop] === 'alert') {
                      setError(results);
                      // console.log(results);
                    }
                  }

                  // 電話番号が9~12文字（ハイフン有無問わず）以外の場合エラーを表示
                  if (!phone_number.match(/^0[-\d]{9,12}$/)) {
                    console.log('※電話番号が正しくありません。');
                    setLengthError('alert');
                    return;
                  }
                  setLengthError('ok');

                  if (password.length < 8 || password.length > 16) {
                    console.log(
                      'パスワードは8文字以上、16文字以内で入力してください'
                    );
                    setPassLength('alert');
                    return;
                  }
                  setPassLength('ok');

                  if (password2 !== password) {
                    console.log('※パスワードが一致していません。');
                    setMismatchPassword('alert');
                    return;
                  }
                  setMismatchPassword('ok');

                  fetch('/api/get_users', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: email,
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.length > 0) {
                        console.log(
                          '※このメールアドレスは、既に使われています。'
                        );
                        setErrorMail('alert');
                        return;
                      }
                      setErrorMail('ok');
                    });

                  userPost();
                }}
              >
                <div className={styles.name}>
                  <label htmlFor="name">お名前（漢字）</label>
                  <br />
                  <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="佐藤 太郎"
                  />
                  <p className={styles[error.name]}>
                    ※お名前を入力してください。
                  </p>
                </div>

                <div className={styles.email}>
                  <label htmlFor="email">メールアドレス</label>
                  <br />
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@example.com"
                  />
                  <p className={styles[error.email]}>
                    ※メールアドレスを入力してください。
                  </p>
                  <p className={styles[errorMail]}>
                    ※このメールアドレスは、既に使われています。
                  </p>
                </div>

                <div className={styles.zipcode}>
                  <label htmlFor="zipcode">郵便番号</label>
                  <br />
                  <input
                    name="zipcode"
                    type="text"
                    size={8}
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="xxx-xxxx"
                  />
                  &nbsp;
                  <button
                    type="button"
                    className={styles.search_button}
                    onClick={getZipcode}
                  >
                    検索
                  </button>
                  <p className={styles[error.zipcode]}>
                    ※郵便番号を入力してください。
                  </p>
                  {/* <p className={styles[validation.zipcode]}>
                ※郵便番号は、xxx-xxxxの形で入力してください。
              </p> */}
                </div>

                <div className={styles.address}>
                  <label htmlFor="address">住所</label>
                  <br />
                  <input
                    name="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="東京都新宿区新宿4-3-25"
                  />
                  <p className={styles[errorNoAddress]}>
                    ※郵便番号を取得できませんでした。住所を入力してください。
                  </p>
                  <p className={styles[error.address]}>
                    ※住所を入力してください。
                  </p>
                </div>

                <div className={styles.phone_number}>
                  <label htmlFor="phone_number">電話番号</label>
                  <br />
                  <input
                    name="phone_number"
                    type="tel"
                    value={phone_number}
                    onChange={(e) => setPhone_number(e.target.value)}
                    placeholder="0366753638"
                  />
                  <p className={styles[error.phone_number]}>
                    ※電話番号を入力してください。
                  </p>
                  <p className={styles[lengthError]}>
                    ※電話番号が正しくありません。
                  </p>
                </div>

                <div className={styles.password}>
                  <label htmlFor="password">パスワード</label>
                  <br />
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="半角英数字で8文字以上、16文字以内"
                    pattern="^[a-zA-Z0-9]+$"
                  />
                  <p className={styles[error.password]}>
                    ※パスワードを入力してください。
                  </p>
                  <p className={styles[passLength]}>
                    ※パスワードは８文字以上１６文字以内で設定してください。
                  </p>
                  <p className={styles[error.passwordValidation]}>
                    ※パスワードは半角英数で入力してください。
                  </p>
                </div>

                <div className={styles.password2}>
                  <label htmlFor="password2">
                    パスワード（確認用）
                  </label>
                  <br />
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="前述のパスワード"
                    pattern="^[a-zA-Z0-9]+$"
                  />
                  <p className={styles[error.password2]}>
                    ※確認用パスワードを入力してください。
                  </p>
                  <p className={styles[mismatchPassword]}>
                    ※パスワードが一致していません。
                  </p>
                </div>
                <br />
                <button
                  type="submit"
                  className={styles.submit_button}
                >
                  登録
                </button>
              </form>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
