import Image from 'next/image'
import React from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Button } from '@mui/material'
import ActionOptions from './ActionOptions'

export default function VideoCard({
  item,
  setTrigger,
  handleOpen,
  setVideoText,
  setVideoUrl,
  setPhotourl,
  setOrderid,
}) {
  return (
    <div className="shadow-lg border border-gray-200  h-full  p-5 rounded-lg relative">
      <div className="absolute top-0 right-0">
        <ActionOptions item={item} setTrigger={setTrigger} />
      </div>
      <img
        src={item?.property_photo_url || '/noimg.jpg'}
        alt="Logo"
        className="object-cover rounded-xl aspect-video w-full lg:px-2"
        onError={e => {
          e.target.src = '/noimg.jpg'
        }}
      />

      <div className="text-sm  text-center">
        <p className="font-bold lg:text-base mt-2">{item?.client_name}</p>
        <p>{item?.order_sender?.profile?.full_name}</p>

        <p className="font-bold lg:text-base">
          Price: <span className="text-primary2">$</span>
          {item?.amount}
        </p>
        <p className="mt-3 min-h-[50px]">
          <LocationOnIcon className="text-primary " /> {item?.address}
        </p>

        <p className="text-gray-400 text-xs mt-2">{datetest(item?.created_at)}</p>

        <div className="flex justify-between flex-wrap gap-2 mt-4">
          {item?.status == 'pending' && (
            <p className="bg-[#FFF8E6] border-primary border text-primary px-3 py-2 rounded-xl w-full  capitalize">
              Pending
            </p>
          )}
          {item?.status == 'assigned' && (
            <p className="bg-[#FFF8E6] border-primary border text-primary px-3 py-2 rounded-xl w-full  capitalize">
              Assigned
            </p>
          )}
          {item?.status == 'in_progress' && (
            <p className="bg-yellow-500 border-yellow-600 border text-black px-3 py-2 rounded-xl w-full  capitalize">
              In Progress
            </p>
          )}
          {item?.status == 'completed' && (
            <p className="bg-green-700 border-green-900 border text-white px-3 py-2 rounded-xl w-full  capitalize">
              Completed
            </p>
          )}
          {item?.status == 'demo' && (
            <p className="bg-[#E1ECF2] border-[#B4CD67] border text-[#B4CD67] px-3 py-2 rounded-xl w-full  capitalize">
              Demo
            </p>
          )}
          {item?.status == 'in_review' && (
            <p className="bg-[#FFF0F1] border-red-500 border text-red-500 px-3 py-2 rounded-xl w-full  capitalize">
              In Review
            </p>
          )}
          {item?.status == 'canceled' && (
            <p className="bg-red-600 border-red-700 border text-white px-3 py-2 rounded-xl w-full  capitalize">
              Canceled
            </p>
          )}
          {item?.status == 'processing' && (
            <p className="bg-yellow-500 border-yellow-600 border text-black px-3 py-2 rounded-xl w-full  capitalize">
              Processing
            </p>
          )}

          <Button
            onClick={() => {
              setOrderid(item?._id)
              setPhotourl(item?.property_photo_url || '/noimg.jpg')
              handleOpen()
              setVideoText(item?.social_media_post)
              setVideoUrl(
                `${process.env.NEXT_PUBLIC_API_URL}${item?.order_video?.order_video_file}`,
              )
              setTrigger(Math.floor(Math.random() * 9))
            }}
            disabled={item?.status !== 'completed'}
            variant="outlined"
            className="capitalize text-primary rounded-xl w-full  hover:bg-primary border-2 border-primary hover:text-white"
          >
            Publish&nbsp;Now
          </Button>
        </div>
      </div>
    </div>
  )
}

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
      <p>{timeAgo}</p>
    </div>
  )
}
