import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { toast } from 'react-toastify'
import axios2 from 'axios'

export default function LongMenu({ item }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  //console.log("My item", item);

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

  const pdfLink = process.env.NEXT_PUBLIC_API_URL + item?.invoice // Replace with the actual URL of your PDF file

  const handleDownload2 = () => {
    const link = document.createElement('a')
    link.href = pdfLink
    link.target = '_blank' // Open in a new tab
    link.download = 'your-file-name.pdf' // You can customize the downloaded file name here
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
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
        {item?.invoice && (
          <MenuItem
            onClick={() => {
              handleDownload2()
              handleClose()
            }}
          >
            Download Invoice
          </MenuItem>
        )}

        {item?.order_video?.order_video_file && (
          <MenuItem
            onClick={() => {
              handleClose()
              handleDownload()
            }}
          >
            Download video
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}
