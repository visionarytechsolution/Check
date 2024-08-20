import React from 'react'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Button } from '@mui/material'

export default function Integration() {
  return (
    <div>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Our Integration plugin</h5>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-10">
        <div className="bg-white rounded-xl w-full p-5 flex flex-col gap-3 items-center">
          <FacebookIcon className="text-sky-700 lg:text-5xl" />
          <p className="text-sm text-gray-500">Facebook</p>
          <Button className="bg-primary2 hover:bg-primary rounded-2xl capitalize w-full lg:text-xl text-lg text-white font-bold">
            Connect
          </Button>
        </div>
        <div className="bg-white rounded-xl w-full p-5 flex flex-col gap-3 items-center">
          <InstagramIcon className="text-red-500 lg:text-5xl" />
          <p className="text-sm text-gray-500">Instagram</p>
          <Button className="bg-primary2 hover:bg-primary rounded-2xl capitalize w-full lg:text-xl text-lg text-white font-bold">
            Connect
          </Button>
        </div>
        <div className="bg-white rounded-xl w-full p-5 flex flex-col gap-3 items-center">
          <YouTubeIcon className="text-red-600 lg:text-5xl" />
          <p className="text-sm text-gray-500">Youtube</p>
          <Button className="bg-primary2 hover:bg-primary rounded-2xl capitalize w-full lg:text-xl text-lg text-white font-bold">
            Connect
          </Button>
        </div>
        <div className="bg-white rounded-xl w-full p-5 flex flex-col gap-3 items-center">
          <TwitterIcon className="text-sky-400 lg:text-5xl" />
          <p className="text-sm text-gray-500">Twitter</p>
          <Button className="bg-primary2 hover:bg-primary rounded-2xl capitalize w-full lg:text-xl text-lg text-white font-bold">
            Connect
          </Button>
        </div>
      </div>
    </div>
  )
}
