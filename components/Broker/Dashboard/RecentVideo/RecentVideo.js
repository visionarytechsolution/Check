import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Card from './Card'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import axios from '../../../../utils/axios'
import Link from 'next/link'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PinterestIcon from '@mui/icons-material/Pinterest'
import RedditIcon from '@mui/icons-material/Reddit'
import axios2 from 'axios'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1400 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  lg: {
    breakpoint: { max: 1400, min: 1024 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  lgmobile: {
    breakpoint: { max: 767, min: 500 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 500, min: 200 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
}
const ActiveListingsList = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [trigger, setTrigger] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/order/broker_orders/`)
        setData(response?.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)

        //console.log(error);
      }
    }
    fetchData()
  }, [trigger])

  //console.log("data", data);

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [videotext, setVideoText] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [copied2, setCopied2] = useState(false)

  const [photourl, setPhotourl] = useState('')
  const [orderid, setOrderid] = useState('')

  const handleCopy = () => {
    navigator.clipboard
      .writeText(window.location.origin + `/video/` + orderid)
      .then(() => {
        setCopied(true)
        toast.success('Copied To Clipboard')
      })
      .catch(error => {
        console.error('Failed to copy:', error)
      })
  }

  const handleCopy2 = () => {
    navigator.clipboard
      .writeText(videotext)
      .then(() => {
        setCopied2(true)
        toast.success('Copied To Clipboard')
      })
      .catch(error => {
        console.error('Failed to copy:', error)
      })
  }

  const handleShare = platform => {
    const url = getShareUrl(platform, videotext, videoUrl)
    window.open(url, '_blank')
  }

  const getShareUrl = (platform, text) => {
    const url = getShareUrl(platform, videotext, videoUrl)
    switch (platform) {
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url,
        )}`
        setFacebookMetaTags(text, url, photourl) // Set OG meta tags for Facebook
        return facebookUrl
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text,
        )}%0A%0A${encodeURIComponent(url)}` // Add %0A%0A for two line breaks
      case 'linkedin':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url,
        )}&title=${encodeURIComponent(text)}`
      case 'pinterest':
        return `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
          url,
        )}&description=${encodeURIComponent(text)}`
      case 'reddit':
        return `https://www.reddit.com/submit?url=${encodeURIComponent(
          url,
        )}&title=${encodeURIComponent(text)}`
      default:
        return ''
    }
  }

  const setFacebookMetaTags = (text, url, photourl) => {
    const metaTags = document.getElementsByTagName('meta')
    const ogDescriptionTag = Array.from(metaTags).find(
      tag => tag.getAttribute('property') === 'og:description',
    )
    if (ogDescriptionTag) {
      ogDescriptionTag.setAttribute('content', text)
    } else {
      const newOgDescriptionTag = document.createElement('meta')
      newOgDescriptionTag.setAttribute('property', 'og:description')
      newOgDescriptionTag.setAttribute('content', text)
      document.head.appendChild(newOgDescriptionTag)
    }

    const ogImageTag = Array.from(metaTags).find(tag => tag.getAttribute('property') === 'og:image')
    if (ogImageTag) {
      ogImageTag.setAttribute('content', photourl) // Replace with your own thumbnail image URL
    } else {
      const newOgImageTag = document.createElement('meta')
      newOgImageTag.setAttribute('property', `og:image`)
      newOgImageTag.setAttribute('content', photourl) // Replace with your own thumbnail image URL
      document.head.appendChild(newOgImageTag)
    }

    const twitterCardTag = Array.from(metaTags).find(
      tag => tag.getAttribute('name') === 'twitter:card',
    )
    if (twitterCardTag) {
      twitterCardTag.setAttribute('content', 'summary_large_image')
    } else {
      const newTwitterCardTag = document.createElement('meta')
      newTwitterCardTag.setAttribute('name', 'twitter:card')
      newTwitterCardTag.setAttribute('content', 'summary_large_image')
      document.head.appendChild(newTwitterCardTag)
    }

    const twitterImageTag = Array.from(metaTags).find(
      tag => tag.getAttribute('name') === 'twitter:image',
    )
    if (twitterImageTag) {
      twitterImageTag.setAttribute('content', photourl) // Replace with the URL of your own thumbnail image
    } else {
      const newTwitterImageTag = document.createElement('meta')
      newTwitterImageTag.setAttribute('name', 'twitter:image')
      newTwitterImageTag.setAttribute('content', photourl) // Replace with the URL of your own thumbnail image
      document.head.appendChild(newTwitterImageTag)
    }
  }

  const [downloadProgress, setDownloadProgress] = useState(0)

  const downloadVideo = async () => {
    const downloading = toast.loading(`Downloading ${downloadProgress}%`, {
      toastId: 1,
    })
    try {
      axios2({
        url: videoUrl,
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
        link.setAttribute('download', 'video.mp4')
        document.body.appendChild(link)
        link.click()
        toast.dismiss(downloading)
      })
    } catch {}
  }

  //genarate new text

  const getNewGenatate = async () => {
    const loading = toast.loading('Genarating new text.')
    try {
      const res = await axios.put(`/api/order/regenerate_social_text/${orderid}/`)
      const { status, data } = res
      if (status == 200) {
        setVideoText(data?.social_media_post)
        toast.dismiss(loading)
        toast.success('Text Updated')
      }
      //console.log(res);
    } catch (err) {
      //console.log(err);
      toast.dismiss(loading)
    }
  }

  return (
    <>
      {data?.results?.data?.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between gap-4 items-center">
            <h2 className="w-full  text-lg md:text-xl lg:text-2xl  font-bold text-black block">
              Recent Videos
            </h2>
            <Link href="/broker/my-video" className="hover:text-red-500">
              See&nbsp;All
            </Link>
          </div>
          <div className=" bg-white p-5 rounded-xl mt-5">
            <div className="w-full flex flex-col  justify-between items-center gap-5"></div>
            <div className="w-full  ">
              <Carousel
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={3000}
                swipeable={true}
                draggable={true}
                showDots={true}
                infinite={true}
                partialVisible={false}
                containerClass="h-fit pb-10"
                dotListClassName="custom-dot-list-style"
                customLeftArrow={<span className=""></span>}
                customRightArrow={<span></span>}
              >
                {data?.results?.data?.length > 0 &&
                  data?.results?.data?.map((item, index) => {
                    return (
                      <div className="flex items-center h-full mx-0 lg:mx-5" key={index}>
                        <Card
                          item={item}
                          setTrigger={setTrigger}
                          handleOpen={handleOpen}
                          setVideoText={setVideoText}
                          setVideoUrl={setVideoUrl}
                          setPhotourl={setPhotourl}
                          setOrderid={setOrderid}
                        />
                      </div>
                    )
                  })}
              </Carousel>
            </div>
          </div>
        </div>
      )}{' '}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute bg-black/50 top-0 left-0 w-screen h-screen flex justify-center items-center">
          <div className="relative lg:w-1/2 w-[90vw] bg-white rounded-xl max-h-[90vh] lg:max-h-[95vh] overflow-auto p-5">
            <IconButton
              className="absolute top-0 right-0 m-2"
              onClick={() => {
                handleClose()
              }}
            >
              <CloseIcon />
            </IconButton>

            <p className="lg:text-lg font-bold mt-5 text-center">Share your video</p>

            <video className="object-contain w-4/5 lg:w-2/3  mx-auto mt-5" controls>
              <source src={videoUrl} type="video/mp4" />
            </video>

            {/* <div className="flex justify-center flex-wrap gap-3 my-3">
              <IconButton
                className="bg-blue-700/10 hover:bg-blue-700/20"
                onClick={() => handleShare("facebook")}
              >
                <FacebookIcon className="text-blue-700 lg:text-4xl" />
              </IconButton>
              <IconButton
                className="bg-blue-500/10 hover:bg-blue-500/20"
                onClick={() => handleShare("twitter")}
              >
                <TwitterIcon className="text-blue-500 lg:text-4xl" />
              </IconButton>

              <IconButton
                className="bg-blue-800/10 hover:bg-blue-800/20"
                onClick={() => handleShare("linkedin")}
              >
                <LinkedInIcon className="text-blue-800 lg:text-4xl" />
              </IconButton>
              <IconButton
                className="bg-red-600/10 hover:bg-red-600/20"
                onClick={() => handleShare("pinterest")}
              >
                <PinterestIcon className="text-red-600 lg:text-4xl" />
              </IconButton>
              <IconButton
                className="bg-orange-500/10 hover:bg-orange-500/20"
                onClick={() => handleShare("reddit")}
              >
                <RedditIcon className="text-orange-500 lg:text-4xl" />
              </IconButton>
            </div> */}

            <div className="mt-5 flex flex-col gap-2 items-center">
              <p className="text-center text-sm text-gray-500 lg:text-base font-semibold">
                Download the video by clicking the button below.
              </p>

              <KeyboardArrowDownIcon className="lg:text-4xl md:text-2xl animate-bounce mt-3" />

              <Button
                variant="contained"
                className="capitalize bg-primary2 hover:bg-primary text-white lg:text-2xl lg:w-1/2 font-bold"
                onClick={() => {
                  downloadVideo()
                }}
              >
                Download Now
              </Button>
            </div>

            {/* <div className="flex bg-white border rounded-lg overflow-hidden border-primary mt-5">
              <input
                type="text"
                className="w-full bg-white  py-1 px-5 rounded-full"
                value={window.location.origin + `/video/` + orderid}
                disabled
              />
              <Button
                variant="contained"
                className="bg-primary2 text-white hover:bg-primary2"
                onClick={() => handleCopy()}
              >
                <ContentCopyIcon />
                {!copied ? "Copy" : "Copied"}
              </Button>
            </div> */}

            <div className="flex gap-2 flex-col bg-white border   border-primary mt-5">
              <textarea
                rows={5}
                type="text"
                onChange={e => {
                  setVideoText(e.target.value)
                }}
                className="w-full bg-white  py-1 px-5 "
                value={videotext}
              />
              <div className="flex gap-2 ">
                <Button
                  onClick={() => getNewGenatate()}
                  variant="contained"
                  className="bg-primary2 text-white hover:bg-primary2 w-full capitalize"
                >
                  Re Genarate
                </Button>

                <Button
                  onClick={() => {
                    handleCopy2()
                  }}
                  variant="contained"
                  className="bg-primary2 text-white hover:bg-primary2 w-full capitalize"
                >
                  {!copied2 ? 'Copy Text' : 'Copied Text'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ActiveListingsList
