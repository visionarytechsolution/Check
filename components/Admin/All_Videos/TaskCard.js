import React from 'react'
import { Button } from '@mui/material'
import Image from 'next/image'
import Modal from '@mui/material/Modal'
import ActionOptions from './ActionOptions'

export default function WorkListcard({ item, setShowDetails, setTempData, settrigger }) {
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

    return <p>{formattedDate}</p>
  }

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <div className="rounded-xl bg-white p-5 relative">
        <div className="w-fit absolute top-0 left-0 m-3">
          {item?.status == 'pending' && (
            <p className="bg-[#FFF8E6]  text-primary px-3 py-2 rounded-xl w-full  capitalize">
              Pending
            </p>
          )}
          {item?.status == 'assigned' && (
            <p className="bg-[#FFF8E6]  text-primary px-3 py-2 rounded-xl w-full  capitalize">
              Assigned
            </p>
          )}
          {item?.status == 'in_progress' && (
            <p className="bg-yellow-500   text-black px-3 py-2 rounded-xl w-full  capitalize">
              In&nbsp;Progress
            </p>
          )}
          {item?.status == 'completed' && (
            <p className="bg-green-700   text-white px-3 py-2 rounded-xl w-full  capitalize">
              Completed
            </p>
          )}
          {item?.status == 'demo' && (
            <p className="bg-[#E1ECF2]  text-[#B4CD67] px-3 py-2 rounded-xl w-full  capitalize">
              Demo
            </p>
          )}
          {item?.status == 'in_review' && (
            <p className="bg-[#FFF0F1]  text-red-500 px-3 py-2 rounded-xl w-full  capitalize">
              In&nbsp;Review
            </p>
          )}
          {item?.status == 'canceled' && (
            <p className="bg-red-600  text-white px-3 py-2 rounded-xl w-full  capitalize">
              Canceled
            </p>
          )}
        </div>

        <div className="absolute top-0 right-0 m-3">
          <ActionOptions item={item} />
        </div>

        <img
          src={item?.property_photo_url}
          width={500}
          height={500}
          alt="Picture of the author"
          className="object-cover aspect-video w-full"
          onError={e => {
            e.target.src = '/noimg.jpg'
          }}
        />

        <h4 className="text-sm lg:text-base font-bold mt-5">{item?.client_name}</h4>
        <p className="text-gray-400 text-sm border-b pb-3">{datetest(item?.created_at)}</p>
        <p className="text-sm lg:text-base font-bold mt-2 min-h-[80px]">{item?.address}</p>
        <div className="flex gap-2 w-full flex-wrap lg:flex-nowrap justify-between mt-4">
          <Button
            onClick={() => {
              setShowDetails(true)
              setTempData(item)
              scrollTo(0, 0)
            }}
            className="rounded-full text-white bg-primary hover:bg-primary2 text-sm w-full  py-2 capitalize"
          >
            More&nbsp;Details
          </Button>
        </div>
      </div>
    </>
  )
}
