import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from '../../../../utils/axios'
import { toast } from 'react-toastify'
import ReactPlayer from 'react-player'

export default function LongMenu({ item, setTrigger }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    if (item?.status == 'completed' || item?.order_video?.video_file) {
      setAnchorEl(event.currentTarget)
      //console.log("i am in");
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  //bug report modal
  const [open2, setOpen2] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [bugReport, setBugReport] = React.useState('')
  const handleOpen2 = () => setOpen2(true)
  const handleClose2 = () => {
    setOpen2(false)
    setBugReport('')
  }

  const Reportnow = async () => {
    const loading = toast.loading('Please wait a moment')
    const formData = new FormData()
    formData.append('bug_details', bugReport)
    setIsLoading(true)

    try {
      const response = await axios.put(`/api/order/revision_delivery/${item?._id}/`, formData)
      const { status, data } = response
      if (status == 200) {
        toast.success(data?.message)
        handleClose2()
        setTrigger(Math.floor(Math.random() * 9))
      }
      //console.log(response);
      toast.dismiss(loading)
      setIsLoading(false)
    } catch (error) {
      toast.dismiss(loading)
      setIsLoading(false)
      //console.log("error from error submit", error);
      toast.error(error?.response?.data?.message)
    }
  }

  //watch video modal
  const [open3, setOpen3] = React.useState(false)

  const handleOpen3 = () => setOpen3(true)
  const handleClose3 = () => {
    setOpen3(false)
  }
  //download video

  const handleDownload = async () => {
    toast.info('Download will start automatically in a few seconds.')

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + item?.order_video?.video_file)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${item?.order_video?.video_title}.mp4`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the created object URL after download
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error occurred during download:', error)
      // Handle the error
    }
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '20ch',
          },
        }}
      >
        {item?.order_video?.video_file && (
          <MenuItem
            onClick={() => {
              handleClose()
              handleOpen3()
            }}
          >
            Watch Video
          </MenuItem>
        )}

        {item?.status == 'completed' && (
          <MenuItem
            onClick={() => {
              handleClose()
              handleOpen2()
            }}
          >
            Ask Review
          </MenuItem>
        )}
        {item?.order_video?.video_file && (
          <MenuItem
            onClick={() => {
              handleClose()
              handleDownload()
            }}
          >
            Download Video
          </MenuItem>
        )}
      </Menu>

      <Modal open={open2} onClose={handleClose2}>
        <div className="absolute bg-white rounded-xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-[40vw] md:w-[80vw] w-[90vw]">
          <div className="flex items-center bg-primary text-white py-2 justify-between px-5 border-b">
            <span>Report Video</span>
            <IconButton
              onClick={() => {
                handleClose2()
              }}
            >
              <CloseIcon className="text-white" />
            </IconButton>
          </div>

          <div className="p-5 w-full">
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              onChange={e => {
                setBugReport(e.target.value)
              }}
              placeholder="Enter Bug Report"
            />
            {bugReport?.length < 8 && (
              <small className="text-red-500">Minimum 8 characters required !</small>
            )}

            <Button
              onClick={() => {
                Reportnow()
              }}
              disabled={bugReport?.length < 8 || isLoading}
              variant="contained"
              className="bg-primary2 hover:bg-primary font-bold text-white my-5 w-full"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={open3} onClose={handleClose3}>
        <div className="absolute bg-black rounded-xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] h-fit w-fit">
          <IconButton
            className="absolute z-10 right-0 top-0 m-5 bg-black/20 hover:bg-black/50"
            onClick={() => {
              handleClose3()
            }}
          >
            <CloseIcon className="text-white" />
          </IconButton>
          <ReactPlayer
            playing
            className="object-contain"
            progressInterval
            controls={true}
            width="80vw"
            height="90vh"
            url={`${process.env.NEXT_PUBLIC_API_URL}${item?.order_video?.video_file}`}
          />
        </div>
      </Modal>
    </>
  )
}
