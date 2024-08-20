import React, { useEffect, useRef, useState } from 'react'
import FmdGoodIcon from '@mui/icons-material/FmdGood'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import axios from '../../../../utils/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import JSZip from 'jszip'
import axios2 from 'axios'

export default function TaskDetails({
  setTempData,
  setShowDetails,
  tempData,
  setPage,
  settrigger,
}) {
  const router = useRouter()

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
  console.log('tempData', tempData)
  const [isLoading, setIsLoading] = useState(false)

  const AcceptOrder = async () => {
    const loading = toast.loading('Please wait a moment.')
    setIsLoading(true)
    try {
      const response = await axios.put(`/api/order/order_accept/${tempData?._id}/`)
      //console.log("accept api data", response);
      if (response?.status == 200) {
        toast.success(response?.data?.message)
        setShowDetails(false)
        setTempData(null)
        scrollTo(0, 0)
        settrigger(Math.floor(Math.random() * 9))
      }
      toast.dismiss(loading)
      setIsLoading(false)
    } catch (error) {
      //console.log("error from accept", error);
      toast.dismiss(loading)
      setIsLoading(false)
      toast.error(error?.response?.data?.error)
    }
  }

  const CancelOrder = async () => {
    const loading = toast.loading('Please wait a moment.')
    setIsLoading(true)
    try {
      const response = await axios.put(`/api/order/order_cancel/${tempData?._id}/`)
      //console.log("accept api data", response);
      if (response?.status == 200) {
        toast.success(response?.data?.success)
        setShowDetails(false)
        setTempData(null)
        scrollTo(0, 0)
        settrigger(Math.floor(Math.random() * 9))
      }
      toast.dismiss(loading)
      setIsLoading(false)
    } catch (error) {
      //console.log("error from accept", error);
      toast.dismiss(loading)
      setIsLoading(false)
      toast.error(error?.response?.data?.error)
      toast.error('Not A Valid Action.')
    }
  }

  //download images
  const downloadImages = async () => {
    const loading = toast.loading('Please wait a moment.')
    const options = {
      method: 'GET',
      url: 'https://zillow-com1.p.rapidapi.com/images',
      params: { zpid: tempData?.zpid },
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_XRapidAPIKey,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_XRapidAPIHost,
      },
    }

    try {
      const response = await axios.request(options)
      toast.dismiss(loading)
      //console.log(response.data);
      if (response?.data?.images?.length > 0) {
        downloadImagesNow(response?.data?.images)
      } else {
        toast.error('No image found !')
      }
    } catch (error) {
      console.error(error)
      toast.dismiss(loading)
      toast.error('No image found !')
    }
  }

  const downloadImagesNow = async imageUrls => {
    const zip = new JSZip()
    const requests = imageUrls.map(async (url, index) => {
      const response = await fetch(url)
      const blob = await response.blob()
      zip.file(`image${index + 1}.jpg`, blob)
    })

    await Promise.all(requests)

    zip
      .generateAsync({ type: 'blob' })
      .then(content => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(content)
        link.download = 'images.zip'
        link.click()
        toast.success('Download started!')
      })
      .catch(() => {
        toast.error('Failed to start download.')
      })
  }

  const [allPData, setAllPData] = useState(null)
  const allDatanow = async () => {
    const options = {
      method: 'GET',
      url: 'https://zillow-com1.p.rapidapi.com/property',
      params: { zpid: tempData.zpid },
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_XRapidAPIKey,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_XRapidAPIHost,
      },
    }
    try {
      const response = await axios2.request(options)
      //console.log(response.data);
      setAllPData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const [retailorInfo, setRetailorInfo] = useState()

  useEffect(() => {
    allDatanow()
  }, [tempData])

  const handleDownload = imageUrl => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobURL = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobURL
        link.download = 'image.jpg'
        link.click()
        URL.revokeObjectURL(blobURL)
      })
  }

  useEffect(() => {
    if (tempData?.url) {
      getRetailorPropertyInformation()
    }
  }, [tempData?.url])

  const getRetailorPropertyInformation = async () => {
    const options = {
      method: 'GET',
      url: 'https://us-real-estate-listings.p.rapidapi.com/v2/property',
      params: {
        property_url: `https://www.realtor.com/realestateandhomes-detail/${tempData?.url}`,
      },
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_XRapidAPIKeyRealstate,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_XRapidAPIHostRealState,
      },
    }

    try {
      const response = await axios2.request(options)
      setRetailorInfo(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  console.log('retailorInfo', retailorInfo)
  async function getImageLinks(data) {
    const options = {
      method: 'GET',
      url: 'https://us-real-estate-listings.p.rapidapi.com/propertyPhotos',
      params: {
        property_url: `https://www.realtor.com/realestateandhomes-detail/${tempData?.url}`,
      },
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_XRapidAPIKeyRealstate,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_XRapidAPIHostRealState,
      },
    }

    try {
      const response = await axios2.request(options)
      const imageLinks = response?.data?.photos?.map(item => ({
        url: item.href,
      }))
      const imageLinksText = imageLinks.map(link => link.url).join('\n')
      const blob = new Blob([imageLinksText], { type: 'text/plain' })

      // Create a temporary link element and trigger the download
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(blob)
      downloadLink.download = 'image_links.txt'
      downloadLink.click()
    } catch (error) {
      console.error(error)
    }
  }

  console.log('retailorInfo ', retailorInfo)

  return (
    <div>
      <Button
        onClick={() => {
          setShowDetails(false)
          setTempData(null)
          scrollTo(0, 0)
        }}
        variant="outlined"
      >
        Back
      </Button>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold mt-5">Task Details</h5>

      <div className="mt-10 rounded-xl p-5 bg-white flex gap-3 md:gap-6 flex-wrap md:flex-row flex-col md:justify-between md:items-center">
        <div className="flex flex-col ">
          <p className="w-fit lg:text-lg md:text-base text-sm font-semibold">Posted</p>
          <p className="md:text-sm text-xs text-gray-600">{datetest(tempData?.created_at)}</p>
        </div>

        <div className="flex flex-col ">
          <p className="w-fit  ">Comission</p>
          <p className="lg:text-lg md:text-base text-sm text-gray-600 font-bold">
            <span className=" text-primary text-lg ">$</span>&nbsp;
            {tempData?.order_commission ? tempData?.order_commission : '0'}
          </p>
        </div>

        <div className="flex flex-col ">
          <p className="w-fit  ">Order&nbsp;Type</p>
          <p className="lg:text-lg md:text-base text-sm text-gray-600 font-bold">
            {tempData?.order_type}
          </p>
        </div>
        <div className="flex flex-col ">
          <p className="w-fit  ">Address</p>
          <p className="lg:text-lg md:text-base text-sm text-gray-600 font-bold  gap-1">
            <FmdGoodIcon className="text-primary" />
            {tempData?.address}
          </p>
        </div>

        <Button
          onClick={() => {
            if (retailorInfo) {
              getImageLinks(retailorInfo?.data?.photos)
            } else {
              downloadImages()
            }
          }}
          className="h-fit w-fit text-primary rounded-full capitalize shadow-none"
          variant="outlined"
        >
          Collect&nbsp;Images
        </Button>
      </div>

      <div className="mt-10 rounded-xl p-5 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allPData?.bedrooms && (
          <div className="flex flex-col ">
            <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">Bedrooms</p>
            <p className="md:text-sm text-xs text-gray-600">{allPData?.bedrooms}</p>
          </div>
        )}

        {allPData?.bathrooms && (
          <div className="flex flex-col ">
            <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">Bathrooms</p>
            <p className="md:text-sm text-xs text-gray-600">{allPData?.bathrooms}</p>
          </div>
        )}

        {allPData?.homeType ||
          (retailorInfo?.data?.description?.type && (
            <div className="flex flex-col">
              <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">Home Type</p>
              <p className="md:text-sm text-xs text-gray-600">
                {allPData?.homeType?.replace('', ' ') || retailorInfo?.data?.description?.type}
              </p>
            </div>
          ))}

        {allPData?.livingArea ||
          (retailorInfo?.data?.description?.sqft && (
            <div className="flex flex-col ">
              <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">Square feet</p>
              <p className="md:text-sm text-xs text-gray-600">
                {allPData?.livingArea} {allPData?.livingAreaUnits}{' '}
                {retailorInfo?.data?.description?.sqft} {retailorInfo?.data?.description?.unit}
              </p>
            </div>
          ))}

        {allPData?.price ||
          (retailorInfo?.data?.list_price && (
            <div className="flex flex-col ">
              <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
                Property Price
              </p>
              <p className="md:text-sm text-xs text-gray-600">
                ${allPData?.price?.toLocaleString()} {retailorInfo?.data?.list_price}
              </p>
            </div>
          ))}

        {tempData?.order_sender?.profile?.full_name && (
          <div className="flex flex-col ">
            <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">Broker Name</p>
            <p className="md:text-sm text-xs text-gray-600">
              {tempData?.order_sender?.profile?.full_name}
            </p>
          </div>
        )}

        {tempData?.order_sender?.profile?.phone_number && (
          <div className="flex flex-col ">
            <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">Broker Phone</p>
            <p className="md:text-sm text-xs text-gray-600">
              {tempData?.order_sender?.profile?.phone_number}
            </p>
          </div>
        )}

        <div className="flex flex-col">
          <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">Broker Picture</p>

          <Button
            variant="contained"
            className="capitalize md:text-sm text-xs text-gray-600 w-fit"
            onClick={() => handleDownload(tempData?.order_sender?.profile?.profile_pic)}
          >
            Download
          </Button>
        </div>
        {retailorInfo?.data?.details?.map((item, index) => {
          return (
            <div className="flex flex-col" key={index}>
              <p className=" md:text-base text-sm text-gray-700 font-semibold">{item?.category}</p>
              <p className="md:text-sm text-xs text-gray-600">
                {item?.text?.map(
                  (text, innerIndex) =>
                    innerIndex < 3 && (
                      <p key={innerIndex}>
                        {text}
                        {text?.length <= innerIndex + 1 ? ',' : ''}
                      </p>
                    ),
                )}
              </p>
            </div>
          )
        })}
      </div>
      <div className="mt-5">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <h4 className="text-center w-full">Here is the script for the video</h4>
          </AccordionSummary>
          <AccordionDetails className="bg-gray-50 p-10">
            <Typography>{tempData?.property_details}</Typography>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="mt-5 flex flex-wrap gap-y-3 gap-x-20 bg-white rounded-xl p-5">
        <FormControl disabled>
          <p>AI Assistant (Gender)</p>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="ai_gender"
            value={tempData?.assistant_type}
          >
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
        <FormControl disabled>
          <p> Show assistant in video.</p>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="ai_gender"
            value={tempData?.assistant}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No (Voice Only)" />
          </RadioGroup>
        </FormControl>

        <FormControl disabled>
          <p>Subtitle</p>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="subtitle"
            value={tempData?.apply_subtitle}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        <FormControl disabled>
          <p>Video Language</p>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="language"
            value={tempData?.video_language}
          >
            <FormControlLabel value="english" control={<Radio />} label="English" />
            <FormControlLabel value="french" control={<Radio />} label="French" />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="mt-10 ">
        <h5 className=" md:text-base lg:text-lg font-bold ">Some quality advice :</h5>
        <p className="mt-5 text-gray-600">
          1. Replay the paragraph multiple times to ensure correct pronunciation without any voice
          glitches.
        </p>
        <p className=" text-gray-600">
          2. If the assistant has difficulty pronouncing numbers or specific words, you can manually
          add the pronunciation.
        </p>
        <p className=" text-gray-600">
          3. We recommend using Synthesia for the avatar assistant video and a green background for
          the script. For better control and quality transition effects, we suggest using Filmora
          for video editing.
        </p>

        <p className="mt-10 text-gray-600">
          <span className="text-red-600 font-bold">Important</span> : Do not exceed 60 seconds for
          this video.
        </p>
        <p className=" text-gray-600">
          <span className="text-red-600 font-bold">Important</span> :Make sure to synchronize the
          assistant&apos;s voice with the corresponding house image room.
        </p>
      </div>
      {tempData?.status == 'assigned' && (
        <div className="mt-10 flex justify-end gap-4">
          <Button
            onClick={() => {
              CancelOrder()
            }}
            disabled={isLoading}
            variant="contained"
            className="bg-red-500 hover:bg-red-700 text-white font-bold lg:px-5 py-2"
          >
            Reject
          </Button>
          <Button
            onClick={() => {
              AcceptOrder()
            }}
            disabled={isLoading}
            variant="contained"
            className="bg-primary2 hover:bg-primary text-gray-800 font-bold lg:px-5 py-2"
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  )
}
