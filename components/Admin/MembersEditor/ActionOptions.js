import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { toast } from 'react-toastify'
import axios from '../../../utils/axios'

export default function LongMenu({ setTrigger, data }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const changeStatus = async value => {
    const loading = toast.loading('Changing status')

    const formData = new FormData()
    formData.append('status_type', value)
    try {
      const res = await axios.put(
        `/api/profile/admin/status_change/${data?.profile?.username}/`,
        formData,
      )

      toast.dismiss(loading)
      if (res.status == 200) {
        setTrigger(
          Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, '0'),
        )
      }
    } catch (err) {
      toast.dismiss(loading)
    }
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
        {data?.status_type !== 'suspended' && (
          <MenuItem
            onClick={() => {
              handleClose()
              changeStatus('suspended')
            }}
          >
            Suspended
          </MenuItem>
        )}
        {data?.status_type == 'suspended' && (
          <MenuItem
            onClick={() => {
              handleClose()
              changeStatus('unsuspended')
            }}
          >
            Unsuspended
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            handleClose()
            changeStatus('terminated')
          }}
        >
          Terminated
        </MenuItem>
      </Menu>
    </div>
  )
}
