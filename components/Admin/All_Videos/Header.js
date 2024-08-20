import { Button } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

export default function Header({ setPage, setSortby, sortby }) {
  const [age, setAge] = useState(sortby)

  const handleChange = event => {
    setAge(event.target.value)
    setSortby(event.target.value)
    setPage(1)
  }
  return (
    <div className="flex lg:flex-row flex-col gap-4 lg:justify-between">
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">All Orders</h5>

      <FormControl className="md:w-1/3 w-1/2 " size="small">
        <InputLabel id="demo-simple-select-label">Status Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Status Type"
          onChange={handleChange}
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
    </div>
  )
}
