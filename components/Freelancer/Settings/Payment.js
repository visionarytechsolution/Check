import React from 'react'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import axios from '../../../utils/axios'
import store from '../../../rtk/store/store'
import { addUserActions } from '../../../rtk/feautes/addUser/addUserSlice'

export default function Payment() {
  const User = useSelector(state => state.User.UserData)
  //console.log("my profile", User);

  const validationSchema = Yup.object({
    paymentType: Yup.string().required('Payment Type is required'),
    address: Yup.string().required('Address is required'),
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      paymentType: User?.withdraw_info?.withdrawal_type || '',
      address: User?.withdraw_info?.crypto_address || User?.withdraw_info?.paypal_email || '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      //console.log("Form submitted", values);
      savePayment(values)
    },
  })

  const savePayment = async values => {
    const loading = toast.loading('Please wait a moment')

    const formData = new FormData()
    formData.append('withdrawal_type', values.paymentType)

    if (values?.paymentType == 'paypal') {
      formData.append('paypal_email', values.address)
    } else {
      formData.append('crypto_address', values.address)
    }

    try {
      const res = await axios.put(`/api/order/freelancer_payment_save/`, formData)

      const { status } = res

      toast.dismiss(loading)
      if (status == 200) {
        toast.success('Saved Successfully.')
        fetchData()
      }
    } catch (err) {
      toast.dismiss(loading)
      //console.log("err", err);
    }
  }

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/profile/my_profile/`)
      //console.log("get profile", res);
      if (res?.data?.status_type == 'suspended') {
        setIsSuspended(true)
      }
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

  const DeleteData = async () => {
    try {
      const res = await axios.put(`/api/order/freelancer_payment_remove/`)

      const { status } = res
      if (status == 200) {
        toast.success('Payment Info removed Successfully.')
        fetchData()
      }
    } catch (err) {
      //console.log(err)
    }
  }

  return (
    <div>
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold">My Payment Info</h1>

      <div className="mt-10 border bg-white rounded-xl p-5">
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Payment Type</InputLabel>
            <Select
              disabled={User?.withdraw_info !== null}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="paymentType"
              label="payment type"
              value={formik.values.paymentType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.paymentType && formik.errors.paymentType}
            >
              <MenuItem value="">Select Payment Type</MenuItem>
              <MenuItem value="crypto">BitCoin Address</MenuItem>
              <MenuItem value="paypal">PayPal Email</MenuItem>
            </Select>
          </FormControl>

          {formik.values.paymentType === 'crypto' && (
            <FormControl fullWidth size="small" className="mt-5">
              <TextField
                size="small"
                disabled={User?.withdraw_info !== null}
                id="address"
                name="address"
                label="Crypto Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && formik.errors.address}
              />
            </FormControl>
          )}

          {formik.values.paymentType === 'paypal' && (
            <FormControl fullWidth size="small" className="mt-5">
              <TextField
                disabled={User?.withdraw_info !== null}
                size="small"
                id="address"
                name="address"
                label="PayPal Email"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && formik.errors.address}
              />
            </FormControl>
          )}
          {User?.withdraw_info == null ? (
            <Button
              type="submit"
              className="mt-5 w-full bg-primary2 hover:bg-primary text-white  rounded-xl font-bold"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={() => {
                DeleteData()
              }}
              className="mt-5 bg-red-400 hover:bg-red-500 w-full text-white  rounded-xl font-bold"
            >
              Remove
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
