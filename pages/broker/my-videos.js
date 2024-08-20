import React, { useState } from 'react'
import LayoutBroker from '../../components/Layout/LayoutBroker'
import Head from 'next/head'
import Header from '@/components/Broker/MyVideos/Header'
import VideoTable from '@/components/Broker/MyVideos/VideoTable'
import PaginationDetails from '@/components/Broker/MyVideos/Pagination'
import VideoCard from '@/components/Broker/MyVideos/VideoCard'
import ChangeView from '@/components/Broker/MyVideos/ChangeView'
import axios from '../../utils/axios'
import { useEffect } from 'react'
import withAuth from '@/hoc/withAuth'
import useWindowSize from '@/hooks/useWindowSize'
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
import ReactPlayer from 'react-player'
import axios2 from 'axios'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default withAuth(MyVideos)

function MyVideos() {
  const [view, setView] = useState('table')
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [sortby, setSortby] = useState('')
  const [loading, setLoading] = useState(true)
  const [status_type, setStatus_Type] = useState('')

  const [trigger, setTrigger] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/order/broker_orders/?page=${page}&sort_by=${sortby}`)
        //console.log(response?.data);
        setData(response?.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)

        //console.log(error);
      }
    }
    fetchData()
  }, [page, sortby, trigger])

  const WindowSize = useWindowSize()

  useEffect(() => {
    if (WindowSize?.width < 750) {
      setView('card')
    }
  }, [WindowSize])

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [videotext, setVideoText] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [copied2, setCopied2] = useState(false)

  const [photourl, setPhotourl] = useState('')
  const [orderid, setOrderid] = useState('')

  const [videotitle, setVideoTitle] = useState('')

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
    const url = window.location.origin + `/video/` + orderid
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
        link.setAttribute('download', `${videotitle}.mp4`)
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
        setTrigger(Math.floor(Math.random() * 9))
      }
      //console.log(res);
    } catch (err) {
      //console.log(err);
      toast.dismiss(loading)
    }
  }

  //console.log("my order id", orderid);

  return (
    <>
      <Head>
        <title>My Videos - RealVision</title>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NB69L1J8JY"></script>{' '}
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '253613074265740');
            fbq('track', 'PageView');
          `}
        </script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=253613074265740&ev=PageView&noscript=1"
          />
        </noscript>
        <script
          async
          defer
          src="https://tools.luckyorange.com/core/lo.js?site-id=3c1f694c"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NB69L1J8JY');
            `,
          }}
        />
        <script
          defer
          src="//app.leadfox.co/js/api/leadfox.js"
          data-key="31177e82f5fc2d8cd289b06ad7dd3a2e"
        />
      </Head>
      <div>
        <LayoutBroker active="myvideos">
          <div className="p-5 lg:p-10 min-h-screen">
            {data?.results?.data?.length > 0 && (
              <div className="">
                <Header setSortby={setSortby} setPage={setPage} setStatus_Type={setStatus_Type} />
              </div>
            )}

            {data?.results?.data?.length > 0 && (
              <>
                <ChangeView view={view} setView={setView} />

                {view == 'table' ? (
                  <VideoTable
                    data={data}
                    setTrigger={setTrigger}
                    handleOpen={handleOpen}
                    setVideoText={setVideoText}
                    setVideoUrl={setVideoUrl}
                    setPhotourl={setPhotourl}
                    setOrderid={setOrderid}
                    setVideoTitle={setVideoTitle}
                  />
                ) : (
                  <VideoCard
                    data={data}
                    setTrigger={setTrigger}
                    handleOpen={handleOpen}
                    setVideoText={setVideoText}
                    setVideoUrl={setVideoUrl}
                    setPhotourl={setPhotourl}
                    setOrderid={setOrderid}
                    setVideoTitle={setVideoTitle}
                  />
                )}
              </>
            )}

            {!data?.results?.data?.length > 0 && (
              <div className="p-5 text-center">
                <h4 className="text-primary font-bold lg:text-4xl md:text-xl text-lg capitalize">
                  No Video Found !
                </h4>
              </div>
            )}
            <PaginationDetails data={data} setPage={setPage} />
          </div>
        </LayoutBroker>
      </div>

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
