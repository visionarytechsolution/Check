import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import Modal from '@mui/material/Modal'
import axios from '../../../utils/axios'

import {
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material'
import { toast } from 'react-toastify'

export default function Header({ setEmail, setTrigger }) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [open2, setOpen2] = React.useState(false)
  const handleOpen2 = () => setOpen2(true)
  const handleClose2 = () => setOpen2(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [zuid, setZuid] = useState('')
  const [address, setAddress] = useState('')
  const [language, setLanguage] = useState('')
  const [email, setEmail1] = useState('')
  const [retailorID, setRetailorID] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = event => {
    setEmail1(event.target.value)
  }

  const handleFirstNameChange = event => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = event => {
    setLastName(event.target.value)
  }

  const handlePhoneNumberChange = event => {
    setPhoneNumber(event.target.value)
  }

  const handleZuidChange = event => {
    setZuid(event.target.value)
  }

  const handleAddressChange = event => {
    setAddress(event.target.value)
  }

  const handleLanguageChange = event => {
    setLanguage(event.target.value)
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
      const res = await axios.post('/api/auth/create_broker/', {
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        zuid: zuid,
        address: address,
        language: language,
        realtor_profile_url: retailorID,
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
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
        setZuid('')
        setAddress('')
        setLanguage('')
      }
    } catch (err) {
      const { response } = err
      toast.dismiss(loading)
      if (response?.data[0]?.email) {
        toast.error(response?.data[0]?.email)
      } else {
        toast.error('Not a valid email. Please try with another email.')
      }

      setEmail1('')
    }
    setIsLoading(false)
  }

  //file input
  const [file, setFile] = useState(null)

  const handleFileChange = event => {
    const selectedFile = event.target.files[0]
    setFile(selectedFile)
  }

  const createMemberFromCsv = async () => {
    setIsLoading(true)
    const loading = toast.loading('Please wait a moment.')
    try {
      const res = await axios.post('/api/auth/csv_create_broker/', {
        file: file,
      })

      const { status, data } = res
      if (status == 200) {
        setTrigger(
          Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, '0'),
        )
        toast.dismiss(loading)
        toast.success(data?.meesage)
        setOpen2(false)
        setFile(null)
      }
    } catch (err) {
      const { response } = err
      toast.dismiss(loading)
      setFile(null)
      toast.error('Not a valid csv.')
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-4 lg:justify-between">
        <h5 className="text-lg md:text-xl lg:text-2xl font-bold">Broker Clients</h5>

        <div className="bg-white lg:w-1/2 w-full flex px-5 py-2 rounded-2xl">
          <input
            className="focus:outline-none w-full px-5"
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

      <div className="mt-5 flex gap-2 justify-end">
        <Button
          onClick={handleOpen}
          variant="Contained"
          className="text-sm md:text-md lg:text-lg font-display capitalize text-white bg-primary hover:bg-primary shadow-none hover:shadow-md"
        >
          Add&nbsp;New&nbsp;Broker
        </Button>
        <Button
          onClick={handleOpen2}
          variant="Contained"
          className="text-sm md:text-md lg:text-lg font-display capitalize text-white bg-primary hover:bg-primary shadow-none hover:shadow-md"
        >
          Upload&nbsp;From&nbsp;CSV
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] lg:max-w-[50vw] md:max-w-[70vw] max-w-[90vw] w-full rounded-lg overflow-hidden bg-white md:p-10 p-5">
          <h6 className="py-3 text-center text-primary font-bold lg:text-xl md:text-lg text-base">
            Create a broker&apos;s account.
          </h6>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <FormControl fullWidth>
              <TextField
                type="text"
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                size="small"
                value={firstName}
                onChange={handleFirstNameChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                type="text"
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                size="small"
                value={lastName}
                onChange={handleLastNameChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                type="text"
                id="outlined-basic"
                label="Phone Number"
                variant="outlined"
                size="small"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                type="text"
                id="outlined-basic"
                label="ZUID"
                variant="outlined"
                size="small"
                value={zuid}
                onChange={handleZuidChange}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                type="text"
                id="outlined-basic"
                label="Retailor Profile Url"
                variant="outlined"
                size="small"
                value={retailorID}
                onChange={e => {
                  setRetailorID(e.target.value)
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                type="text"
                id="outlined-basic"
                label="Address"
                variant="outlined"
                size="small"
                value={address}
                onChange={handleAddressChange}
                required
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="language-label">Language</InputLabel>
              <Select
                labelId="language-label"
                id="language-select"
                label="Language"
                value={language}
                onChange={handleLanguageChange}
                required
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="French">French</MenuItem>
              </Select>
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

      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] lg:max-w-[50vw] md:max-w-[70vw] max-w-[90vw] w-full rounded-lg overflow-hidden bg-white md:p-10 p-5">
          <TextField
            type="file"
            id="standard-basic"
            label="Select Your CSV File"
            variant="standard"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              accept: '.csv',
            }}
            onChange={handleFileChange}
          />

          <div className="flex justify-center mt-10">
            <Button
              variant="contained bg-primary2 hover:bg-primary text-white font-bold w-full py-3"
              onClick={() => {
                createMemberFromCsv()
              }}
              disabled={!file}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
