import React, { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'

export default function OrderList({ setPage, setSortby, setStatus_Type }) {
  const [age2, setAge2] = useState(null)
  const [age, setAge] = useState(null)

  const handleChange = event => {
    setAge(event.target.value)
    setSortby(event.target.value)
    setPage(1)
  }
  const handleChange2 = event => {
    setAge2(event.target.value)
    setStatus_Type(event.target.value)
    setPage(1)
  }
  return (
    <div>
      <div className="flex justify-between gap-4 flex-wrap">
        <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Order History</h5>

        <div className="flex justify-end gap-2 w-full">
          <div className="md:w-1/5 w-full">
            <FormControl className="" size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Sort By"
                onChange={handleChange}
              >
                <MenuItem value="">All Time</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="six_month">Last 6 months</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* <div className="md:w-1/5 w-full">
            <FormControl className="" size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Status Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age2}
                label="Sort By"
                onChange={handleChange2}
              >
                <MenuItem value="">All Type</MenuItem>

                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="demo">Demo</MenuItem>
                <MenuItem value="in_review">In Review</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>
          </div> */}
        </div>
      </div>
    </div>
  )
}
