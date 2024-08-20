import React from 'react'
import Image from 'next/image'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Button } from '@mui/material'
import ActionOptions from '../MyVideos/ActionOptions'

export default function VideoTable({
  data,
  setTrigger,
  handleOpen,
  setVideoText,
  setVideoUrl,
  setPhotourl,
  setOrderid,
  setVideoTitle,
}) {
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

  return (
    <div className="mt-10 overflow-auto">
      <div className="bg-white rounded-t-xl overflow-hidden  min-w-[1200px] p-5">
        <table className="table-auto w-full text-sm ">
          <thead className="border-b">
            <tr>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Client</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Date</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Address</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Price</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-center">Status</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-center ">
                Publish
              </th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.results?.data?.length > 0 &&
              data?.results?.data?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 lg:gap-4 items-center">
                      <img
                        src={item?.property_photo_url || '/noimg.jpg'}
                        alt="Logo"
                        className="object-cover rounded-full h-16 w-16"
                        onError={e => {
                          e.target.src = '/noimg.jpg'
                        }}
                      />

                      <div className="text-sm ">
                        <p className="font-bold">{item?.client_name}</p>
                        <p>{item?.order_sender?.profile?.full_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{datetest(item?.created_at)}</td>
                  <td className="px-4 py-2 lg:w-80 w-64">
                    <LocationOnIcon className="text-primary" />{' '}
                    {item?.address ? item?.address : 'null'}
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-primary font-bold">$</span>
                    {item?.amount}
                  </td>
                  <td className="px-4 py-2 ">
                    {item?.status == 'pending' && (
                      <p className="bg-[#FFF8E6] border-primary border text-primary px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                        Pending
                      </p>
                    )}
                    {item?.status == 'assigned' && (
                      <p className="bg-[#FFF8E6] border-primary border text-primary px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                        Assigned
                      </p>
                    )}
                    {item?.status == 'in_progress' && (
                      <p className="bg-yellow-500 border-yellow-600 border text-black px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                        In&nbsp;Progress
                      </p>
                    )}
                    {item?.status == 'completed' && (
                      <p className="bg-green-700 border-green-900 border text-white px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                        Completed
                      </p>
                    )}
                    {item?.status == 'demo' && (
                      <p className="bg-[#E1ECF2] border-[#B4CD67] border text-[#B4CD67] px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                        Demo
                      </p>
                    )}
                    {item?.status == 'in_review' && (
                      <p className="bg-[#FFF0F1] border-red-500 border text-red-500 px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                        In&nbsp;Review
                      </p>
                    )}
                    {item?.status == 'canceled' && (
                      <p className="bg-red-600 border-red-700 border text-white px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                        Canceled
                      </p>
                    )}
                    {item?.status == 'processing' && (
                      <p className="bg-yellow-500 border-yellow-600 border text-black px-3 py-2 rounded-xl w-full  capitalize mx-auto">
                        Processing
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="w-fit mx-auto">
                      <Button
                        onClick={() => {
                          setPhotourl(item?.property_photo_url || '/noimg.jpg')
                          handleOpen()
                          setVideoText(item?.social_media_post)
                          setVideoUrl(
                            `${process.env.NEXT_PUBLIC_API_URL}${item?.order_video?.order_video_file}`,
                          )
                          setOrderid(item?._id)
                          setVideoTitle(item?.order_video?.video_title)
                        }}
                        disabled={item?.status !== 'completed'}
                        variant="outlined"
                        className="capitalize text-primary rounded-xl px-3  hover:bg-primary border-2 border-primary hover:text-white"
                      >
                        Publish&nbsp;Now
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <ActionOptions item={item} setTrigger={setTrigger} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
