import React, { useEffect, useState } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import PersonIcon from '@mui/icons-material/Person'
import MessageIcon from '@mui/icons-material/Message'
import axios from '../../../utils/axios'

export default function Notification() {
  const [steps1, setSteps1] = useState()
  const activeStep = steps1?.length

  useEffect(() => {
    getAllNotification()
  }, [])

  const getAllNotification = async () => {
    try {
      const resNotification = await axios.get(`/api/auth/all_ip/`)

      setSteps1(resNotification?.data)
    } catch (err) {}
  }

  return (
    <div>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Security</h5>

      <div className="bg-white rounded-2xl p-5 lg:p-10 lg:mt-10 mt-5 lg:max-h-[90vh] lg:overflow-auto scrollbar-thin scrollbar-thumb-primary2 scrollbar-track-gray-100">
        <div className="">
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps1?.length > 0 &&
              steps1.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    className="items-start lg:gap-4"
                    StepIconComponent={() =>
                      step?.notification_type === 'order' ? (
                        <div className="bg-primary rounded-lg h-8 w-8 md:h-12 md:w-12 flex justify-center items-center">
                          <MessageIcon className=" text-white md:text-xl text-lg" />
                        </div>
                      ) : (
                        <div className="bg-primary rounded-lg  h-8 w-8 md:h-12 md:w-12 flex justify-center items-center">
                          <PersonIcon className="text-white  md:text-xl text-lg" />
                        </div>
                      )
                    }
                  >
                    <div className=" text-sm">
                      <div className="flex gap-x-4 flex-wrap justify-between w-full ">
                        <p className="font-bold lg:text-base text-sm">Logged In</p>
                        <p className="text-xs text-gray-500 text-end ">
                          {datetest(step?.created_at)}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm">{step?.ip_address}</p>
                    </div>
                  </StepLabel>
                </Step>
              ))}
          </Stepper>
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
