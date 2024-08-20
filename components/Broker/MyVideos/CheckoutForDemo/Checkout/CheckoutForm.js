import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CheckoutForm = ({ amount, createOrder2, savePayInfo }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // make payment through stripe
  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }
    setIsLoading(true)
    const loading = toast.loading('Please wait a moment while we are processing your payment.')

    try {
      const data = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.href}/userprofile/subscriptions`,
        },
        redirect: 'if_required',
      })
      toast.dismiss(loading)
      const { error } = data

      if (error) {
        setMessage(error.message)
        toast.error(message)
        setIsLoading(false)
      } else {
        setMessage('Payment successful!')
        toast.success(message)
        await submitForm(data)
      }
    } catch (error) {
      setMessage('Error processing payment.')
      toast.error(message)
    }
  }

  // save data to backend
  async function submitForm(paymentIntentId) {
    // the data I got when finishing submitting the form is paymentIntentId
    //console.log("Payment Intent ID:", paymentIntentId);
    const data2 = paymentIntentId?.paymentIntent
    createOrder2({ data2 })
    savePayInfo()
  }

  return (
    <>
      <div className="lg:p-10 md:p-8 p-5 mt-10 bg-white  w-full border rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="mt-2">
          <PaymentElement />

          <div className="mt-5">
            <Button
              name="Pay now"
              variant="contained"
              type="submit"
              className="lg:text-xl md:textlg text-base capitalize font-display font-bold w-full py-2 bg-primary text-white hover:text-white hover:bg-primary2"
            >
              Pay Now
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CheckoutForm
