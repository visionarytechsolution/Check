import React, { PureComponent, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import AdsClickIcon from '@mui/icons-material/AdsClick'

const data = [
  {
    name: 'Jan',
    Views: 4000,
    Clicks: 2400,
  },
  {
    name: 'Feb',
    Views: 3000,
    Clicks: 1398,
  },
  {
    name: 'Mar',
    Views: 2000,
    Clicks: 9800,
  },
  {
    name: 'Apr',
    Views: 2780,
    Clicks: 3908,
  },
  {
    name: 'May',
    Views: 1890,
    Clicks: 5800,
  },
  {
    name: 'Jun',
    Views: 2390,
    Clicks: 3800,
  },
  {
    name: 'Jul',
    Views: 3490,
    Clicks: 1300,
  },
  {
    name: 'Aug',
    Views: 2490,
    Clicks: 5300,
  },
  {
    name: 'Sep',
    Views: 7490,
    Clicks: 2300,
  },
  {
    name: 'Oct',
    Views: 3490,
    Clicks: 4300,
  },
  {
    name: 'Nov',
    Views: 1490,
    Clicks: 2300,
  },
  {
    name: 'Dec',
    Views: 2490,
    Clicks: 5300,
  },
]

export default function PureComponent1() {
  const [age, setAge] = useState(10)

  const handleChange = event => {
    setAge(event.target.value)
  }

  return (
    <div>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold mt-10">Social Network Statistique</h5>

      <div className=" bg-white mt-10 rounded-xl p-5">
        <div className="flex md:flex-row flex-col gap-4 md:flex-wrap md:justify-between md:items-center mb-10">
          <div className="flex flex-col gap-3">
            <h5 className="text-base md:text-lg lg:text-xl font-bold">Videos Stats</h5>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <RemoveRedEyeIcon />
                <div className="text-sm ">
                  <p>Total Views</p>
                  <p className="font-bold">1506</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AdsClickIcon />
                <div className="text-sm ">
                  <p>Total Clicks</p>
                  <p className="font-bold">2000</p>
                </div>
              </div>
            </div>
          </div>

          <FormControl className="" size="small">
            <InputLabel id="demo-simple-select-label">Location</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Location"
              onChange={handleChange}
            >
              <MenuItem value={10}>Elm Street, 23 Montreal Canada</MenuItem>
              <MenuItem value={20}>Elm Street, 23 Montreal Canada</MenuItem>
              <MenuItem value={30}>Elm Street, 23 Montreal Canada</MenuItem>
            </Select>
          </FormControl>

          <div className="flex flex-col gap-4">
            <FormControl className="" size="small">
              <InputLabel id="demo-simple-select-label">Social Media</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Social Media"
                onChange={handleChange}
              >
                <MenuItem value={10}>Facebook</MenuItem>
                <MenuItem value={20}>Instagram</MenuItem>
                <MenuItem value={30}>Twitter</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="" size="small">
              <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Sort by"
                onChange={handleChange}
              >
                <MenuItem value={10}>This month</MenuItem>
                <MenuItem value={20}>Last 6 months</MenuItem>
                <MenuItem value={30}>Last year</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Area type="monotone" dataKey="Views" stackId="1" stroke="#28CFB2" fill="#98CFB2" />
              <Area type="monotone" dataKey="Clicks" stackId="2" stroke="#26DAAB" fill="#86DAAB" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
