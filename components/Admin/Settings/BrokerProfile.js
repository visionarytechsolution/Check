import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import axios from '../../../utils/axios'
import { toast } from 'react-toastify'

export default function BrokerProfile() {
  const User = useSelector(state => state.User)

  const changepassword = async () => {
    try {
      if (password?.length < 4) {
        toast.warn('Minimum 4 characters required.')
      } else {
        const res = await axios.put(`/api/auth/password_change/`, {
          password: password,
        })

        const { status } = res
        if (status == 200) {
          toast.success('Password Changed Successfully.')
          setPassword('')
        }
      }
    } catch (err) {}
  }

  const [password, setPassword] = useState('')
  const handleImageError = event => {
    // If the image fails to load, set a fallback image source
    event.target.src = '/noimage.png'
  }

  return (
    <div className="w-full">
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Admin Profile</h5>
      <p className="text-gray-500 text-sm mt-3">
        The information in your profile is stored in our database and is not shared with any third
        party.
      </p>
      <div className="flex items-center mt-10">
        <img
          placeholder="blur"
          src={User?.UserData?.profile_pic || '/noimage.png'}
          alt="Logo"
          height={120}
          width={120}
          className="object-contain h-32 w-32 mx-auto lg:mx-0"
          blurDataURL="/blur.png"
          onError={handleImageError}
        />
      </div>
      <p className="text-sm text-gray-500 mt-3">Your Profile Picture</p>
      <div className="flex lg:flex-row flex-col lg:gap-8 gap-5 mt-5 lg:mt-10">
        <TextField
          disabled
          id="outlined-basic"
          label="Your Fullname"
          variant="outlined"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }} // Corrected prop
          value={User?.UserData?.full_name}
        />
      </div>

      <div className="flex lg:flex-row flex-col lg:gap-8 gap-5 mt-5 lg:mt-10">
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          size="small"
          fullWidth
          disabled
          InputLabelProps={{
            shrink: true,
          }}
          value={User?.UserData?.email}
        />

        <TextField
          onChange={e => {
            setPassword(e.target.value)
          }}
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
          value={password}
          size="small"
          fullWidth
        />
      </div>

      <div className="flex justify-end gap-4 flex-wrap lg:flex-nowrap mt-20 pb-10">
        <Button
          onClick={() => {
            setPassword('')
          }}
          className="capitalize rounded-2xl bg-[#FFEFF0] hover:bg-[#f8e6e7] text-gray-700  md:text-lg text-base w-full lg:w-80  font-bold"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            changepassword()
          }}
          className="capitalize bg-primary2 rounded-2xl hover:bg-primary text-white  md:text-lg text-base  w-full  lg:w-80  font-bold"
        >
          Save Settings
        </Button>
      </div>
    </div>
  )
}
