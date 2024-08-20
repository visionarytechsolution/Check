import React from 'react'
import { Button } from '@mui/material'
import Image from 'next/image'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Modal from '@mui/material/Modal'
import ModalForSubmit from './ModalForSubmitFix'

export default function WorkListcard({ item, settrigger }) {
  const datetest = date => {
    const dateStr = date
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(dateStr))

    const currentDate = new Date()
    const timeDifference = Math.floor((currentDate - new Date(dateStr)) / 1000) // Difference in seconds

    const minutes = Math.floor(timeDifference / 60) % 60
    const hours = Math.floor(timeDifference / 3600) % 24
    const days = Math.floor(timeDifference / 86400) % 30
    const months = Math.floor(timeDifference / (86400 * 30))

    let timeAgo = ''
    if (months > 0) {
      timeAgo += `${months} month${months > 1 ? 's' : ''} `
    }
    if (days > 0) {
      timeAgo += `${days} day${days > 1 ? 's' : ''} `
    }
    if (hours > 0) {
      timeAgo += `${hours} hour${hours > 1 ? 's' : ''} `
    }
    if (minutes > 0) {
      timeAgo += `${minutes} minute${minutes > 1 ? 's' : ''} `
    }

    timeAgo += 'ago'

    return (
      <div className="text-sm">
        <p>{formattedDate}</p>
        <p className="text-red-500 font-bold">{timeAgo}</p>
      </div>
    )
  }

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <div className="rounded-xl bg-white p-5">
        <img
          src={item?.order?.property_photo_url || '/noimg.jpg'}
          width={500}
          height={500}
          alt="Picture of the author"
          className="object-contain h-60"
          onError={e => {
            e.target.src = '/noimg.jpg'
          }}
        />

        <h4 className="text-sm lg:text-base font-bold mt-5">{item?.order?.client_name}</h4>
        <p className="text-gray-400 text-sm border-b pb-3">{datetest(item?.order?.created_at)}</p>
        <p className="text-sm lg:text-base font-bold mt-2">{item?.order?.address}</p>
        <div className="mt-4">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Review Summery</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="p-2 bg-gray-50">{item?.bug_details}</div>

              <Button
                onClick={() => {
                  handleOpen()
                }}
                className="rounded-full text-white bg-primary hover:bg-primary2 text-sm w-full  py-2 capitalize mt-3"
              >
                Drop&nbsp;Fixed&nbsp;Video
              </Button>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalForSubmit handleClose={handleClose} settrigger={settrigger} item={item} />
      </Modal>
    </>
  )
}
