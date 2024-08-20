import React, { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import axios from '../../../utils/axios'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'

export default function Dashboardleft() {
  const [type, setType] = useState('data1')
  const [clientmember, setClientmember] = useState(null)
  const [trigger, setTrigger] = useState(true)

  const handleChange = event => {
    setType(event.target.value)
  }

  useEffect(() => {
    const storedData = localStorage.getItem(type)
    setClientmember(JSON.parse(storedData))
  }, [type, trigger])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get('api/order/admin_orders_info/?today_type=true')
        localStorage.setItem('data1', JSON.stringify(response1?.data))
        setTrigger(!trigger)
        const response2 = await axios.get('api/order/admin_orders_info/?week_type=true')
        localStorage.setItem('data2', JSON.stringify(response2?.data))
        setTrigger(!trigger)
        const response3 = await axios.get('api/order/admin_orders_info/?last_month_type=true')
        localStorage.setItem('data3', JSON.stringify(response3?.data))
        setTrigger(!trigger)
        const response4 = await axios.get('api/order/admin_orders_info/?six_month_type=true')
        localStorage.setItem('data4', JSON.stringify(response4?.data))
        setTrigger(!trigger)
        const response5 = await axios.get('api/order/admin_orders_info/?all_time=true')
        localStorage.setItem('data5', JSON.stringify(response5?.data))
        setTrigger(!trigger)

        const response6 = await axios.get('api/order/admin_orders_info/?yesterday=true')
        localStorage.setItem('data6', JSON.stringify(response6?.data))
        setTrigger(!trigger)
      } catch (err) {}
    }
    fetchData()
  }, [])

  return (
    <div className="bg-white lg:p-10 p-5 rounded-2xl">
      <div className="flex justify-between gap-4 flex-wrap">
        <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Order History</h5>

        <FormControl className="" size="small">
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="Sort By"
            onChange={handleChange}
          >
            <MenuItem value="data1">Today</MenuItem>
            <MenuItem value="data6">Yesterday</MenuItem>
            <MenuItem value="data2">This week</MenuItem>
            <MenuItem value="data3">This Month</MenuItem>
            <MenuItem value="data4">This 6 Months</MenuItem>
            <MenuItem value="data5">All time</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-2 mt-10">
        <div className="border text-center rounded-lg w-full h-56  flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <PeopleOutlineIcon className="text-3xl text-primary" />

          <div>
            <p className=" text-3xl font-bold ">{clientmember?.new_clients}</p>
            <p className="text-gray-500 text-sm mt-2">New Clients</p>
          </div>
        </div>

        <div className="border text-center rounded-lg w-full h-56  flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <SmartDisplayIcon className="text-3xl text-primary" />

          <div>
            <p className=" text-3xl font-bold ">{clientmember?.sold_videos}</p>
            <p className="text-gray-500 text-sm mt-2">Sold Videos</p>
          </div>
        </div>
        <div className="border text-center rounded-lg w-full h-56  flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <StopCircleIcon className="text-3xl text-primary" />

          <div>
            <p className=" text-3xl font-bold ">{clientmember?.pending_videos}</p>
            <p className="text-gray-500 text-sm mt-2">Videos Not Converted</p>
          </div>
        </div>

        <div className="border text-center rounded-lg w-full h-56  flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
          <SupervisorAccountIcon className="text-3xl text-primary" />

          <div>
            <p className=" text-3xl font-bold ">{clientmember?.new_members}</p>
            <p className="text-gray-500 text-sm mt-2">Brokers</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-5 mt-10 rounded-xl border lg:p-10 p-5">
        <div className="flex gap-4 ">
          <div className=" w-full">
            <div className="bg-primary rounded p-2">
              <MonetizationOnIcon className="text-white text-5xl" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="w-fit text-gray-500 text-sm">Total&nbsp;Earnings</p>
            <p className="text-lg md:text-xl lg:text-xl font-extrabold">
              ${clientmember?.total_earning}
            </p>
          </div>
        </div>
        <div className="flex gap-4  ">
          <div className=" w-full">
            <div className="bg-primary rounded p-2">
              <HourglassBottomIcon className="text-white text-5xl" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="w-fit text-gray-500 text-sm">Pending&nbsp;Earnings</p>
            <p className="text-lg md:text-xl lg:text-xl font-extrabold">
              ${clientmember?.pending_earning}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
