import { Button, TextField } from '@mui/material'
import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from '../../../utils/axios'
import store from '../../../rtk/store/store'
import { addUserActions } from '../../../rtk/feautes/addUser/addUserSlice'

export default function BrokerProfile() {
  const User = useSelector(state => state.User)
  //console.log("UserProfile", User);

  const fetchData = async () => {
    // //console.log("i am in2");
    try {
      const res = await axios.get(`/api/profile/my_profile/`)
      //console.log("get profile", res);
      store.dispatch(addUserActions.addUser(res?.data))
    } catch (err) {
      //console.log("profile error", err);
    }
  }

  const validationSchema = yup.object().shape({
    realEstateAgency: yup.string().required('Real Estate Agency is required'),
    phone: yup.string().required('Phone is required'),
    fullName: yup.string().required('Your Fullname is required'),
    brokerWebsite: yup.string().required('Your Broker Website is required'),
    address: yup.string().required('Address is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup
      .string()
      .test('password', 'Password must be at least 8 characters', function (value) {
        if (value && value.trim().length > 0) {
          return value.length >= 8
        }
        return true
      }),
  })

  // Formik setup
  const formik = useFormik({
    initialValues: {
      realEstateAgency: User?.UserData?.real_estate_agency,
      phone: User?.UserData?.profile?.phone_number,
      fullName: User?.UserData?.profile?.full_name,
      brokerWebsite: User?.UserData?.website,
      address: User?.UserData?.profile?.address,
      email: User?.UserData?.profile?.email,
      password: '',
      profilePicture: null,
    },
    validationSchema,

    onSubmit: values => {
      // Log the form values
      UpdateProfile(values)
    },
    enableReinitialize: true,
  })

  // Handle file selection for profile picture
  const onFileChange = event => {
    formik.setFieldValue('profilePicture', event.currentTarget.files[0])
  }

  const [isLoading, setIsLoading] = React.useState(false)
  const UpdateProfile = async values => {
    setIsLoading(true)
    //console.log("i am the data for sign in", values);

    const formData = new FormData()
    formData.append('address', values.address)
    if (values.profilePicture) {
      formData.append('profile_image', values.profilePicture)
    }

    formData.append('real_estate_agency', values.realEstateAgency)
    formData.append('website', values.brokerWebsite)
    formData.append('name', values.fullName)
    formData.append('phone_number', values.phone)
    formData.append('password', values.password)

    const loading = toast.loading('Please wait a moment...')
    try {
      const res = await axios.put(`/api/profile/broker/update_profile/`, formData)
      const { status, data } = res
      //console.log("submit data ", res);
      toast.dismiss(loading)

      if (status === 201) {
        setIsLoading(false)
        fetchData()
        toast.success('Profile Updated Successfully.')
      }
    } catch (error) {
      //console.log(error);
      toast.dismiss(loading)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Broker Profile</h5>
      <p className="text-gray-500 text-sm mt-3">
        The information in your profile is stored in our database and is not shared with any third
        party.
      </p>

      <form onSubmit={formik.handleSubmit}>
        <p className="text-sm text-gray-500 my-5">Your Profile Picture</p>

        <div className="flex  flex-col gap-3 ">
          <img
            placeholder="blur"
            src={User?.UserData?.profile?.profile_pic || '/noimage.png'}
            alt="Logo"
            height={120}
            width={120}
            className="object-contain h-32 w-32 mx-auto lg:mx-0"
            blurDataURL="/blur.png"
          />

          <div>
            <input
              type="file"
              accept="image/*"
              id="profilePicture"
              name="profilePicture"
              onChange={onFileChange}
            />
          </div>
        </div>

        <div className="flex lg:flex-row flex-col lg:gap-8 gap-5 mt-5 lg:mt-10">
          <TextField
            id="realEstateAgency"
            name="realEstateAgency"
            label="Real Estate Agency"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }} // Corrected prop
            fullWidth
            value={formik.values.realEstateAgency}
            onChange={formik.handleChange}
            error={formik.touched.realEstateAgency && Boolean(formik.errors.realEstateAgency)}
            helperText={formik.touched.realEstateAgency && formik.errors.realEstateAgency}
          />
          <TextField
            id="phone"
            name="phone"
            label="Phone"
            InputLabelProps={{ shrink: true }} // Corrected prop
            variant="outlined"
            size="small"
            fullWidth
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </div>
        <div className="flex lg:flex-row flex-col lg:gap-8 gap-5 mt-5">
          <TextField
            id="fullName"
            name="fullName"
            label="Your Fullname"
            variant="outlined"
            InputLabelProps={{ shrink: true }} // Corrected prop
            size="small"
            fullWidth
            value={formik.values.fullName}
            onChange={formik.handleChange}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
          <TextField
            id="brokerWebsite"
            name="brokerWebsite"
            label="Your Broker Website"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }} // Corrected prop
            fullWidth
            value={formik.values.brokerWebsite}
            onChange={formik.handleChange}
            error={formik.touched.brokerWebsite && Boolean(formik.errors.brokerWebsite)}
            helperText={formik.touched.brokerWebsite && formik.errors.brokerWebsite}
          />
        </div>

        <div className="w-full">
          <TextField
            id="address"
            name="address"
            label="Address"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }} // Corrected prop
            fullWidth
            className="mt-5"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
        </div>

        <div className="flex lg:flex-row flex-col lg:gap-8 gap-5 mt-5 ">
          <TextField
            disabled
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }} // Corrected prop
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            type="password"
            id="password"
            name="password"
            label="Password"
            variant="outlined"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }} // Corrected prop
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </div>

        <div className="flex justify-end gap-4 flex-wrap lg:flex-nowrap mt-10 pb-10">
          <Button
            disabled={isLoading}
            className="capitalize bg-primary2 rounded-2xl hover:bg-primary text-white lg:text-lg md:text-base   w-full  lg:w-80  font-bold"
            type="submit"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
