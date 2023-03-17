import '@testing-library/jest-dom/extend-expect';

// ユーザー登録（初期画面）
describe('ユーザー登録画面', () => {
  test('初期表示の確認', () => {
    const userRegister = `
    <>
    <Head>
      <title>新規会員登録</title>
    </Head>
    <Header />
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
            if (name === '') {
              console.log('※お名前が入力されていません。');
              setErrorName('alert');
              return;
            }
            setErrorName('ok');
  
            if (email === '') {
              console.log('※メールアドレスが入力されていません。');
              setErrorEmail('alert');
              return;
            }
            setErrorEmail('ok');
  
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
  
            if (zipcode === '') {
              console.log('※郵便番号が入力されていません。');
              setErrorZipcode('alert');
              return;
            }
            setErrorZipcode('ok');
  
            if (
              !zipcode.match(
                /^[0-9]{3}-[0-9]{4}$/ || /^[0-9]{3}[0-9]{4}$/
              )
            ) {
              console.log('※郵便番号が正しくありません。');
              setZipcodeValidation('alert');
            }
            setZipcodeValidation('ok');
  
            if (address === '') {
              console.log('※住所が入力されていません。');
              setErrorAddress('alert');
              return;
            }
            setErrorAddress('ok');
  
            if (phone_number === '') {
              console.log('※電話番号が入力されていません。');
              setErrorPhoneNumber('alert');
              return;
            }
            setErrorPhoneNumber('ok');
            // 電話番号が9~12文字（ハイフン有無問わず）以外の場合エラーを表示
            if (!phone_number.match(/^0[-\d]{9,12}$/)) {
              console.log('※電話番号が正しくありません。');
              setPhoneLength('alert');
              return;
            }
            setPhoneLength('ok');
  
            if (password === '') {
              console.log('※パスワードが入力されていません。');
              setErrorPassword('alert');
              return;
            }
            setErrorPassword('ok');
  
            if (password.length < 8 || password.length > 16) {
              console.log(
                'パスワードは8文字以上、16文字以内で入力してください'
              );
              setPasswordLength('alert');
              return;
            }
            setPasswordLength('ok');
  
            if (!password.match(/^[A-Za-z0-9]+$/)) {
              console.log(
                'パスワードは半角英数で入力してください。'
              );
              setPasswordValidation('alert');
            }
            setPasswordValidation('ok');
  
            if (password2 === '') {
              console.log(
                '※確認用パスワードが入力されていません。'
              );
              setErrorPassword2('alert');
              return;
            }
            setErrorPassword2('ok');
  
            if (password2 !== password) {
              console.log('※パスワードが一致していません。');
              setErrorMismatchPassword('alert');
              return;
            }
            setErrorMismatchPassword('ok');
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
              placeholder="例:佐藤 太郎"
            />
            <p className={styles[errorName]}>
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
            <p className={styles[errorEmail]}>
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
            <p className={styles[errorZipcode]}>
              ※郵便番号を入力してください。
            </p>
            <p className={styles[zipcodeValidation]}>
              ※郵便番号は、xxx-xxxxの形で入力してください。
            </p>
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
            <p className={styles[errorAddress]}>
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
            <p className={styles[errorPhoneNumber]}>
              ※電話番号を入力してください。
            </p>
            <p className={styles[phoneLength]}>
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
            <p className={styles[errorPassword]}>
              ※パスワードを入力してください。
            </p>
            <p className={styles[passwordLength]}>
              ※パスワードは８文字以上１６文字以内で設定してください。
            </p>
            <p className={styles[passwordValidation]}>
              ※パスワードは半角英数で入力してください。
            </p>
          </div>
  
          <div className={styles.password2}>
            <label htmlFor="password2">パスワード（確認用）</label>
            <br />
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="前述のパスワード"
              pattern="^[a-zA-Z0-9]+$"
            />
            <p className={styles[errorPassword2]}>
              ※確認用パスワードを入力してください。
            </p>
            <p className={styles[errorMismatchPassword]}>
              ※パスワードが一致していません。
            </p>
          </div>
  
          <br />
          <button type="submit" className={styles.submit_button}>
            登録
          </button>
        </form>
      </div>
    </div>
    <Footer />
  </>
  `;
    expect(userRegister).toMatchSnapshot();
  });
});
