import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import React, { useEffect, useState } from 'react'

export default function Stripe({
  payData,
  createOrder2,
  savePayInfo,
  selectedAddress,
  firstphoto,
  realtorImage,
  cs,
  pk
}) {
  const paymentIntent = {
    //this payment intent id that genarates from backend on get api hit
    client_secret: payData?.clientSecret || cs,

    //this is publishable key that also comes from backend
    publishable_key: payData?.publishable_key || pk,
  }

  const stripePromise = loadStripe(paymentIntent?.publishable_key)

  const appearance = {
    theme: 'light',
    labels: 'floating',
  }

  const options = {
    clientSecret: paymentIntent?.client_secret,
    appearance,
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        amount={paymentIntent?.amount}
        createOrder2={createOrder2}
        savePayInfo={savePayInfo}
        selectedAddress={selectedAddress}
        firstphoto={firstphoto}
        realtorImage={realtorImage}
      />
    </Elements>
  )
}
