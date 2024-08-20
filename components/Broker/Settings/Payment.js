import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { useCookies } from 'react-cookie'
import store from '../../../rtk/store/store'
import { addUserActions } from '../../../rtk/feautes/addUser/addUserSlice'
import axios from '../../../utils/axios'
import { toast } from 'react-toastify'

export default function Payment() {
  const User = useSelector(state => state.User?.UserData)
  //console.log("UserData", User);
  const [isLoading, setIsLoading] = React.useState(false)

  const RemoveSavedCard = async () => {
    const loading = toast.loading('Please wait a moment')
    setIsLoading(true)

    try {
      const res = await axios.put(`/api/order/remove_payment/`)
      //console.log("Res from remove card",res);
      setIsLoading(false)
      toast.dismiss(loading)
      const { status } = res
      if (status == 200) {
        fetchData()
        toast.success('Removed Info Successfully.')
      }
    } catch (err) {
      toast.dismiss(loading)
      setIsLoading(false)
      //console.log("Error from remove card",err);
    }
  }

  const fetchData = async () => {
    // //console.log("i am in2");
    try {
      const res = await axios.get(`/api/profile/my_profile/`)
      //console.log("get profile", res);
      store.dispatch(addUserActions.addUser(res?.data))
    } catch (err) {
      //console.log("profile error", err);
      store.dispatch(addUserActions.removeUser())
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('type')
      removeCookie('token', { path: '/' })
      removeCookie('type', { path: '/' })
      router.push('/')
    }
  }

  return (
    <>
      {User?.profile?.payment_info == null ? (
        <div className="py-10">
          <p className="font-bold lg:text-2xl md:text-xl text-lg">No Saved Payment Info found !</p>
          {/* <Button
            variant="contained"
            className="mt-5 bg-primary2 hover:bg-primary text-white font-bold"
          >
            Connect Now
          </Button> */}
        </div>
      ) : (
        <div className="py-10 border-2 w-fit p-5 lg:p-10 rounded-3xl border-primary">
          <p className="font-bold lg:text-2xl md:text-xl text-lg">Payment Method</p>
          <div className="text-sm p-3 rounded-xl border border-primary mt-3 w-fit">
            <p>**** **** **** {User?.profile?.payment_info?.last4}</p>
            <p>
              EXP:
              {User?.profile?.payment_info?.exp_month}/{User?.profile?.payment_info?.exp_year}
            </p>
          </div>

          <p className="mt-3 text-xs text-red-500">
            NB:Anytime you can remove your last payment info from the button below.
          </p>
          <Button
            onClick={() => {
              RemoveSavedCard()
            }}
            disabled={isLoading}
            variant="contained"
            className="mt-5 bg-red-400 hover:bg-red-700 text-white font-bold"
          >
            Remove
          </Button>
        </div>
      )}
    </>
  )
}
