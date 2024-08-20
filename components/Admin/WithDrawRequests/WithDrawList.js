import React, { useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import axios from '../../../utils/axios'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Image from 'next/image'

export default function WithDrawList({
  data,
  setTrigger,
  trigger,
  sortby,
  setSortby,
  setPage,
  setEmail,
}) {
  const handleChange = event => {
    setSortby(event.target.value)
    setPage(1)
  }

  const [test, setTest] = useState('')

  const setEmail1 = async () => {
    setEmail(test)
  }

  const ChangeStatus = async data => {
    const loading = toast.loading('Changing Status.')

    try {
      const res = await axios.put(`/api/order/${data}`)
      //console.log("res", res);
      const { status } = res
      toast.dismiss(loading)
      if (status == 200) {
        setTrigger(!trigger)
      }
    } catch (err) {
      toast.dismiss(loading)
      //console.log(err);
    }
  }

  return (
    <>
      <div class="flex gap-8 lg:flex-nowrap flex-wrap ">
        <div className="border bg-white rounded w-full flex  overflow-clip">
          <input
            onChange={e => {
              setTest(e.target.value)
            }}
            type="email"
            id="emailField"
            placeholder="Enter your email"
            class="focus:outline-none w-full px-5 py-2"
          />
          <button
            onClick={() => {
              setEmail1()
            }}
            id="submitButton"
            class="submit-button bg-primary text-white hover:bg-primary2 duration-300 px-5"
          >
            Search
          </button>
        </div>

        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortby}
            label="Sort By"
            onChange={handleChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
            <MenuItem value="cancel">Cancel</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="mt-5 lg:mt-10  rounded-2xl overflow-clip  bg-white min-w-[800px] text-center">
        <table className="w-full">
          <thead>
            <tr className=" border-b">
              <th className=" px-2 py-4 lg:text-lg ">ID</th>
              <th className=" px-2 py-4 lg:text-lg ">User Photo</th>
              <th className=" px-2 py-4 lg:text-lg">User Info</th>
              <th className=" px-2 py-4 lg:text-lg">Type</th>
              <th className=" px-2 py-4 lg:text-lg">Details</th>
              <th className=" px-2 py-4 lg:text-lg">Amount</th>
              <th className=" px-2 py-4 lg:text-lg">Status</th>
              <th className=" px-2 py-4 lg:text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.results?.data?.length > 0 &&
              data?.results?.data.map(item => (
                <tr key={item.id}>
                  <td className="">{item?.id}</td>

                  <td className="">
                    <img
                      placeholder="blur"
                      src={item?.profile?.profile_pic}
                      width={500}
                      height={500}
                      alt="Picture of the author"
                      blurDataURL="/blur.png"
                      className="object-cover rounded-full overflow-hidden h-20 w-20 mx-auto p-2"
                    />
                  </td>

                  <td className=" text-sm">
                    <span className="font-bold">Full Name: </span>
                    {item?.profile?.full_name}
                    <br />
                    <span className="font-bold">Email: </span>
                    {item?.profile?.email}
                  </td>
                  <td className="">{item?.withdrawal_type}</td>
                  <td className="">{item?.withdrawal_details}</td>
                  <td className="font-bold">
                    <span className="text-primary">$</span>
                    {item?.withdraw_amount}
                  </td>

                  {item?.withdraw_status == 'complete' && (
                    <td className="capitalize">
                      <span className="px-3 py-2 rounded-xl bg-primary text-white">
                        {item?.withdraw_status}
                      </span>
                    </td>
                  )}
                  {item?.withdraw_status == 'pending' && (
                    <td className="capitalize">
                      <span className="px-3 py-2 rounded-xl bg-gray-600 text-white">
                        {item?.withdraw_status}
                      </span>
                    </td>
                  )}
                  {item?.withdraw_status == 'cancel' && (
                    <td className="capitalize">
                      <span className="px-3 py-2 rounded-xl bg-red-500 text-white">
                        {item?.withdraw_status}
                      </span>
                    </td>
                  )}
                  <td className="px-3  ">
                    {item?.withdraw_status == `pending` ? (
                      <div>
                        <IconButton
                          className="hover:text-primary"
                          onClick={() => {
                            ChangeStatus(`withdraw_confirm/${item.id}`)
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          className="hover:text-red-500"
                          onClick={() => {
                            ChangeStatus(`withdraw_cancel/${item.id}`)
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <div className="text-sm h-full">No Action</div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
