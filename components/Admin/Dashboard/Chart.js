import React, { useState, PureComponent, useEffect } from 'react'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import axios from '../../../utils/axios'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#98CFB2' : '#308fe8',
  },
}))

export default function PureComponent1() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const res = await axios.get(`/api/order/avg_percentage/`)
      setData(res?.data)
    } catch (err) {}
  }

  return (
    <div className="lg:p-10 p-5 rounded-xl bg-white">
      <div className="flex flex-wrap justify-between gap-4">
        <p className="text-xl lg:text-2xl font-bold">Performance Statistic</p>
      </div>

      <div className="w-full h-64 lg:h-80 mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="none" horizontal={false} />
            {/* Set vertical prop to false */}
            <XAxis dataKey="title" axisLine={false} />
            <YAxis axisLine={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_paid_orders"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="total_orders" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
