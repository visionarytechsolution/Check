import { Button } from '@mui/material'
import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

export default function CreateSection() {
  // const User = useSelector((state) => state.User?.UserData);

  return (
    <div>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Hello Dany</h5>

      <div className="bg-primary p-5 lg:p-10 mt-10 rounded-xl">
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-white">
          Try our AI Property Video
        </p>
        <Link href="/broker/new_order">
          <Button
            className="bg-primary2 hover:bg-primary2 mt-10 capitalize text-white lg:text-2xl text-xl font-bold"
            variant="contained"
          >
            {' '}
            Create a new video
          </Button>
        </Link>
      </div>
    </div>
  )
}
