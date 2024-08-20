import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import Modal from '@mui/material/Modal'
import axios from '../../../utils/axios'

import { TextField, Button, FormControl, FormHelperText } from '@mui/material'
import { toast } from 'react-toastify'

export default function Header({ setEmail, setTrigger }) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [email, setEmail1] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = event => {
    setEmail1(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()

    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      setError(true)
    } else {
      // Valid email, do something with it
      setError(false)
      createMember()
    }
  }

  const createMember = async () => {
    setIsLoading(true)
    const loading = toast.loading('Please wait a moment.')
    try {
      const res = await axios.post('/api/auth/create_freelancer/', {
        email: email,
      })

      const { status, data } = res
      if (status == 201) {
        setTrigger(
          Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, '0'),
        )
        toast.dismiss(loading)
        toast.success(
          `Account has been created successfully. Credential is sent to the email ${email}`,
        )
        setOpen(false)
        setEmail1('')
      }
    } catch (err) {
      const { response } = err
      toast.dismiss(loading)
      if (response?.data[0]?.email) {
        toast.error(response?.data[0]?.email)
      } else {
        toast.error('Not a valid email. Please try with other email')
      }

      setEmail1('')
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4 lg:justify-between">
        <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Members Editor</h5>

        <div className="bg-white lg:w-1/2 w-full  flex px-5 py-2 rounded-2xl">
          <input
            className=" focus:outline-none w-full px-5"
            placeholder="Enter email to search"
            onChange={e => setEmail(e.target.value)}
            type="text"
          />

          <Button
            className="capitalize"
            onClick={() => {
              setTrigger(
                Math.floor(Math.random() * 100000000)
                  .toString()
                  .padStart(8, '0'),
              )
            }}
          >
            <SearchIcon className="mr-2 " /> Search
          </Button>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          onClick={handleOpen}
          variant="Contained"
          className="text-sm md:text-md lg:text-lg font-display capitalize text-white bg-primary hover:bg-primary shadow-none hover:shadow-md"
        >
          Add&nbsp;New&nbsp;Editor
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] lg:max-w-[50vw] md:max-w-[70vw] max-w-[90vw] w-full rounded-lg overflow-hidden bg-white  md:p-10 p-5">
          <h6 className="py-3 text-center text-primary font-bold lg:text-xl md:text-lg text-base">
            Create an editors account.
          </h6>

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <TextField
                type="email"
                id="outlined-basic"
                label="Email"
                variant="outlined"
                size="small"
                value={email}
                onChange={handleChange}
                error={error}
                required
              />
              {error && <FormHelperText error>Please enter a valid email address.</FormHelperText>}
            </FormControl>

            <div className="mt-5 flex gap-4 justify-end">
              <Button
                disabled={isLoading}
                onClick={handleClose}
                variant="contained"
                className="bg-red-500 hover:bg-red-700 capitalize font-bold text-white shadow-none"
              >
                Cancel
              </Button>

              <Button
                disabled={isLoading}
                type="submit"
                variant="contained"
                className="bg-primary2 hover:bg-primary capitalize font-bold text-white shadow-none"
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}
