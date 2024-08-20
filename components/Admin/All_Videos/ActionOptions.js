import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from '../../../utils/axios'
import { toast } from 'react-toastify'
import ReactPlayer from 'react-player'
import axios2 from 'axios'

export default function LongMenu({ item, settrigger }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  //watch video modal
  const [open3, setOpen3] = React.useState(false)

  const handleOpen3 = () => setOpen3(true)
  const handleClose3 = () => {
    setOpen3(false)
  }
  //download video

  const cancelOrder = async () => {
    const loading = toast.loading('Please wait a moment.')
    try {
      const res = await axios.put(`/api/order/admin_order_cancel/${item?._id}`)

      const { status, data } = res
      if (status == 200) {
        toast.dismiss(loading)
        toast.success(data?.message)
        settrigger(
          Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, '0'),
        )
      }
    } catch (err) {
      toast.dismiss(loading)

      toast.error(err?.response?.data?.error)
    }
  }

  const [downloadProgress, setDownloadProgress] = React.useState(0)
  const handleDownload = async () => {
    const downloading = toast.loading(`Downloading ${downloadProgress}%`, {
      toastId: 1,
    })
    try {
      axios2({
        url: process.env.NEXT_PUBLIC_API_URL + item?.order_video?.order_video_file,
        method: 'GET',
        responseType: 'blob',
        onDownloadProgress: progressEvent => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setDownloadProgress(percentage)
          toast.update(downloading, {
            render: `Downloading ${percentage}%`,
            toastId: 1,
          })
        },
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${item?.order_video?.video_title}.mp4`)
        document.body.appendChild(link)
        link.click()
        toast.dismiss(downloading)
      })
    } catch {
      toast.dismiss(downloading)
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
        <MenuItem
          onClick={() => {
            handleClose()
            cancelOrder()
          }}
        >
          Cancel Order
        </MenuItem>
        {item?.order_video?.order_video_file && (
          <MenuItem
            onClick={() => {
              handleClose()
              handleOpen3()
            }}
          >
            Watch Video
          </MenuItem>
        )}

        {item?.order_video?.order_video_file && (
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
            controls
            width="80vw"
            height="90vh"
            url={`${process.env.NEXT_PUBLIC_API_URL}${item?.order_video?.order_video_file}`}
          />
        </div>
      </Modal>
    </>
  )
}
