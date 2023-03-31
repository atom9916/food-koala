import React, { useEffect, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import CheckoutForm from '../components/CheckoutForm';
import Cookies from 'js-cookie';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();
  const amount = Number(router.query.amount);
  const thanks = router.query.thanks as string;
  const optionData = router.query.options;
  const userId = Cookies.get('user_id');

  //stripeのpayment_intentを作成
  useEffect(() => {
    if (userId === undefined || userId === null) {
      return;
    } else {
      fetch('/api/create_payment_intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [amount, userId]);

  const appearance = {
    theme: 'stripe',

    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    },
  };

  const options: any = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm thanks={thanks} optionData={optionData} />
        </Elements>
      )}
    </div>
  );
}
