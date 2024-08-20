import React, { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal'
import ReactPlayer from 'react-player'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useRouter } from 'next/router'

export default function WelcomeVideoModal() {
  const [open, setOpen] = React.useState(false) // Set initial state to false
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    sessionStorage.setItem('seenWelcomeModal', 'true')
    setOpen(false)
  }

  const [isChecked, setIsChecked] = useState(localStorage.getItem('switchState') === 'true')

  const handleChange = e => {
    const checked = e.target.checked
    setIsChecked(checked)
    localStorage.setItem('switchState', checked)
  }

  const router = useRouter()

  useEffect(() => {
    const isSwitchStateTrue = localStorage.getItem('switchState') === 'true'

    // Check if the route matches any of the desired routes
    const isAllowedRoute = ['admin', 'broker', 'editor'].some(route =>
      router.pathname.includes(route),
    )

    // Update the state of `open` based on switchState and the route
    const seen = sessionStorage.getItem('seenWelcomeModal')
    if (seen !== 'true') {
      setOpen(!isSwitchStateTrue && isAllowedRoute)
    }
  }, [router.pathname])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white  ">
        <div className="relative">
          <ReactPlayer
            className="object-contain lg:w-2/3 w-[95vw] aspect video"
            controls
            width="80vw"
            height="auto"
            url={`/welcome.mp4`}
            playing={true}
            autoPlay
          />
          <FormControlLabel
            className="absolute top-0 left-0 m-3"
            control={<Switch onChange={handleChange} />}
            label="Dont show"
          />

          <IconButton
            onClick={handleClose}
            className="bg-primary2 hover:bg-red-500 text-white absolute top-0 right-0 m-3 text-2xl"
          >
            <CloseIcon className="text-md" />
          </IconButton>
        </div>
      </div>
    </Modal>
  )
}
