import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import Error from '../components/error';

export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>エラー</title>
      </Head>
      <Header />
      <Error />
      <Footer />
    </>
  );
}
