import React from 'react'
import SpeedIcon from '@mui/icons-material/Speed'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import Chart from './Chart'
import FeedbackIcon from '@mui/icons-material/Feedback'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'

export default function DashboardRight({ CountList }) {
  return (
    <div>
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 lg:gap-4 ">
        <div className="border text-center rounded-lg bg-white w-full    flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <div className="p-3 border rounded">
            <SpeedIcon className="text-3xl text-primary" />
          </div>

          <div>
            <p className=" text-3xl font-bold ">{CountList?.avg_speed_delivery}</p>
            <p className="text-gray-500 text-sm mt-2">Your Speed Delivery</p>
          </div>
        </div>
        <div className="border text-center rounded-lg bg-white w-full    flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <div className="p-3 border rounded">
            <FeedbackIcon className="text-3xl text-primary" />
          </div>

          <div>
            <p className="text-3xl font-bold">{CountList?.bug_rate?.toFixed(2)}%</p>
            <p className="text-gray-500 text-sm mt-2">Bug Reported</p>
          </div>
        </div>
        <div className="border text-center rounded-lg bg-white w-full    flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <div className="p-3 border rounded">
            <ThumbUpAltIcon className="text-3xl text-primary" />
          </div>

          <div>
            <p className=" text-3xl font-bold ">
              {parseFloat(CountList?.satisfaction_note).toFixed(1)}
            </p>
            <p className="text-gray-500 text-sm mt-2">Your Satisfaction Note</p>
          </div>
        </div>
      </div>

      {/* <div className="mt-10">
        <Chart />
      </div> */}
    </div>
  )
}
