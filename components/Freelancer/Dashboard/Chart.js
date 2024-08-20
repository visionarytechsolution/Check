import React, { useState, PureComponent } from 'react'
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

const data = [
  {
    name: 'Sat',
    order: 4000,
    paid: 2400,
  },
  {
    name: 'Sun',
    order: 3000,
    paid: 1398,
  },
  {
    name: 'Mon',
    order: 2000,
    paid: 9800,
  },
  {
    name: 'Tue',
    order: 2780,
    paid: 3908,
  },
  {
    name: 'Wed',
    order: 1890,
    paid: 4800,
  },
  {
    name: 'Thu',
    order: 2390,
    paid: 3800,
  },
  {
    name: 'Fri',
    order: 3490,
    paid: 4300,
  },
]
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
  const [age, setAge] = useState(20)

  const handleChange = event => {
    setAge(event.target.value)
  }
  return (
    <div className="lg:p-10 p-5 rounded-xl bg-white">
      <div className="flex flex-wrap justify-between gap-4">
        <p className="text-xl lg:text-2xl font-bold">Performance Statistic</p>

        <FormControl className="" size="small">
          <InputLabel id="demo-simple-select-label">Location</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Location"
            onChange={handleChange}
          >
            <MenuItem value={10}>Today</MenuItem>
            <MenuItem value={20}>This Month</MenuItem>
            <MenuItem value={30}>This Year</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="flex justify-between lg:flex-row flex-col gap-4 mt-5">
        <div className="flex gap-4 ">
          <div className="flex  gap-4">
            <div className="bg-primary h-4 w-4 mt-1"></div>
            <div className="text-sm ">
              <p>This Week</p>
              <p className="font-bold">50%</p>
            </div>
          </div>

          <div className="flex  gap-4">
            <div className="bg-primary h-4 w-4 mt-1"></div>
            <div className="text-sm ">
              <p>Last week</p>
              <p className="font-bold">300%</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <p className="mb-2">
            Avg. Performance&nbsp;&nbsp;
            <span className="font-extrabold">77%</span>
          </p>
          <BorderLinearProgress variant="determinate" className="" value={50} />
        </div>
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
            <XAxis dataKey="name" axisLine={false} />
            <YAxis axisLine={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="paid" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="order" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
