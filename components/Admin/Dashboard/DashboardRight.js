import React, { useEffect, useState } from 'react'
import SpeedIcon from '@mui/icons-material/Speed'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import Chart from './Chart'
import axios from '../../../utils/axios'
import PersonIcon from '@mui/icons-material/Person'

export default function DashboardRight() {
  const [clientmember, setclientmember] = useState(null)

  useEffect(() => {
    data1()
  }, [])

  const data1 = async () => {
    try {
      const response = await axios.get(`api/order/today_new_clients_percent/`)

      const { status } = response
      if (status == 200) {
        setclientmember(response?.data)
      }
    } catch (err) {}
  }

  return (
    <div>
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 lg:gap-4 ">
        <div className="border text-center rounded-lg bg-white w-full  h-64 lg:h-60 lg:w-60   flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <div className="p-3 border rounded">
            <SpeedIcon className="text-3xl text-primary" />
          </div>

          <div>
            <p className="text-3xl font-bold">
              {clientmember?.new_client_percentage
                ? parseFloat(clientmember?.new_client_percentage).toFixed(2)
                : `0`}
              %
            </p>

            <p className="text-gray-500 text-sm mt-2">New Clients</p>
          </div>
        </div>
        <div className="border text-center rounded-lg bg-white w-full  h-64 lg:h-60 lg:w-60   flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <div className="p-3 border rounded">
            <VideoCallIcon className="text-3xl text-primary" />
          </div>

          <div>
            <p className=" text-3xl font-bold ">{clientmember?.today_orders}</p>
            <p className="text-gray-500 text-sm mt-2">Today New Videos</p>
          </div>
        </div>
        <div className="border text-center rounded-lg bg-white w-full  h-64 lg:h-60 lg:w-60   flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <div className="p-3 border rounded">
            <PersonIcon className="text-3xl text-primary" />
          </div>

          <div>
            <p className=" text-3xl font-bold ">{clientmember?.total_broker}</p>
            <p className="text-gray-500 text-sm mt-2">Total Broker</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Chart />
      </div>
    </div>
  )
}
