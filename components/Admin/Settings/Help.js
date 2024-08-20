import { Button } from '@mui/material'
import React from 'react'
import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import KeyIcon from '@mui/icons-material/Key'

export default function Help() {
  return (
    <div>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Freelance revenue configuration</h5>
      <p className="text-sm text-gray-500">Set commission rate and bonus</p>

      <div className="mt-10 rounded-xl bg-white  lg:p-10 p-5 flex flex-col gap-8">
        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            Please choose commission amount on product
          </InputLabel>
          <Input
            defaultValue="50.00"
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <AttachMoneyIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">
            Confirm change with admin password
          </InputLabel>
          <Input
            type="password"
            defaultValue="000000000"
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        <div className="flex justify-end gap-4">
          <Button className="capitalize bg-red-500/50 rounded-2xl hover:bg-red-500 text-white md:text-lg text-base  w-full  lg:w-1/5 py-3 font-bold">
            Cancel
          </Button>

          <Button className="capitalize bg-primary2 rounded-2xl hover:bg-primary text-white md:text-lg text-base  w-full  lg:w-1/5 py-3 font-bold">
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
