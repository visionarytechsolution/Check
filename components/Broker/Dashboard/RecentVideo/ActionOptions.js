import * as React from 'react'
import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from '../../../../utils/axios'
import { toast } from 'react-toastify'
import ReactPlayer from 'react-player'
import { useSelector } from 'react-redux'
import Stripe from './CheckoutForDemo/Checkout/Stripe'
import Rating from '@mui/material/Rating'
import axios2 from 'axios'

export default function LongMenu({ item, setTrigger }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const User = useSelector(state => state.User?.UserData)

  const handleClick = event => {
    if (item?.status == 'completed' || item?.order_video?.order_video_file) {
      setAnchorEl(event.currentTarget)
      //console.log("i am in");
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  //bug report modal
  const [open2, setOpen2] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [bugReport, setBugReport] = React.useState('')
  const handleOpen2 = () => setOpen2(true)

  const [ratingModal, setRatingModal] = useState(false)

  const handleClose2 = () => {
    setOpen2(false)
    setBugReport('')
  }

  const Reportnow = async () => {
    const loading = toast.loading('Please wait a moment')
    const formData = new FormData()
    formData.append('bug_details', bugReport)
    setIsLoading(true)

    try {
      const response = await axios.put(`/api/order/revision_delivery/${item?._id}/`, formData)
      const { status, data } = response
      if (status == 200) {
        toast.success(data?.message)
        handleClose2()
        setTrigger(Math.floor(Math.random() * 9))
      }
      //console.log(response);
      toast.dismiss(loading)
      setIsLoading(false)
    } catch (error) {
      toast.dismiss(loading)
      setIsLoading(false)
      //console.log("error from error submit", error);
      toast.error(error?.response?.data?.message)
    }
  }

  //watch video modal
  const [open3, setOpen3] = React.useState(false)

  const handleOpen3 = () => setOpen3(true)
  const handleClose3 = () => {
    setOpen3(false)

    if (item?.rating == null) {
      setRatingModal(true)
    }
  }

  //download video

  const [downloadProgress, setDownloadProgress] = useState(0)
  const handleDownload = async () => {
    const downloading = toast.loading(`Downloading ${downloadProgress}%`, {
      toastId: 15,
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
            toastId: 15,
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

  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [payData, setPayData] = useState(false)

  const createOrder = async () => {
    if (User?.profile?.payment_info !== null) {
      setShowModal2(true)
    } else {
      createPayInt()
    }
  }

  const createPayInt = async () => {
    const loading = toast.loading('Please wait a moment.')
    try {
      const res = await axios.post(`/api/order/payment_create/`)
      //console.log("res for create payment", res);
      setPayData(res?.data)
      setShowModal(true)
      toast.dismiss(loading)
    } catch {
      toast.dismiss(loading)
    }
  }

  const createOrder2 = async data2 => {
    setIsLoading(true)

    const formData = new FormData()

    if (data2) {
      if (data2?.payment_method !== undefined) {
        formData.append('payment_method_id', data2?.payment_method)
      }
      if (data2?.id !== undefined) {
        formData.append('payment_intent_id', data2?.id)
      }
      if (data2.payment_method_types !== undefined) {
        formData.append('payment_type', data2.payment_method_types[0])
      }
    }

    const rawFormData = new URLSearchParams(formData).toString()

    const loading = toast.loading('Please wait a moment...')
    try {
      const res = await axios.put(`/api/order/unpaid_orders/${item?._id}/`, formData)
      const { status, data } = res
      //console.log("submit data ", res);
      if (status === 200) {
        setIsLoading(false)
        toast.dismiss(loading)
        toast.success('order updated successfully')
        const randomNum = Math.floor(Math.random() * 100000000)
          .toString()
          .padStart(8, '0')
        setTrigger(randomNum)
      }
    } catch (error) {
      //console.log(error);
      toast.dismiss(loading)
      setIsLoading(false)
      if (error.response && error.response.data && Array.isArray(error.response.data)) {
        const errors = error.response.data

        // Display toast error messages for each error
        errors.forEach(error => {
          toast.error(error.error)
        })
      } else {
        // Handle other types of errors
        toast.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : 'Something went wrong please try again',
        )
      }
    }
  }

  const savePayInfo = async () => {
    try {
      const res = await axios.put(`/api/order/save_payment/`)

      //console.log("Spidy payment save", res);
    } catch (err) {
      //console.log("Spidy payment save eerr", err);
    }
  }

  //user rating
  const [userrating, setUserrating] = React.useState(0)

  const rateNow = async () => {
    const loading = toast.loading('Please wait a moment.')

    try {
      const res = await axios.put(`/api/order/rating_create/${item?._id}/`, {
        rating: userrating,
      })

      //console.log("rating clg", res);
      toast.dismiss(loading)
      const { status, data } = res
      if (status == 200) {
        setRatingModal(false)
        setTrigger(Math.floor(Math.random() * 9))
        toast.success(data?.message)
        setUserrating(0)
      }
    } catch (err) {
      toast.dismiss(loading)
      //console.log("err", err);
      setRatingModal(false)
    }
  }

  return (
    <>
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
        {item?.order_video?.order_video_file && (
          <MenuItem
            onClick={() => {
              handleClose()
              handleOpen3()
            }}
          >
            Watch Video
          </MenuItem>
        )}

        {item?.status == 'completed' && (
          <MenuItem
            onClick={() => {
              handleClose()
              handleOpen2()
            }}
          >
            Ask Review
          </MenuItem>
        )}

        {item?.status == 'demo' && (
          <MenuItem
            onClick={() => {
              handleClose()
              createOrder()
            }}
          >
            Remove Watermark
          </MenuItem>
        )}

        {item?.order_video?.order_video_file && (
          <MenuItem
            onClick={() => {
              handleClose()
              handleDownload()
            }}
          >
            Download Video
          </MenuItem>
        )}
      </Menu>

      <Modal open={open2} onClose={handleClose2}>
        <div className="absolute bg-white rounded-xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-[40vw] md:w-[80vw] w-[90vw]">
          <div className="flex items-center bg-primary text-white py-2 justify-between px-5 border-b">
            <span>Report Video</span>
            <IconButton
              onClick={() => {
                handleClose2()
              }}
            >
              <CloseIcon className="text-white" />
            </IconButton>
          </div>

          <div className="p-5 w-full">
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              onChange={e => {
                setBugReport(e.target.value)
              }}
              placeholder="Enter Bug Report"
            />
            {bugReport?.length < 8 && (
              <small className="text-red-500">Minimum 8 characters required !</small>
            )}

            <Button
              onClick={() => {
                Reportnow()
              }}
              disabled={bugReport?.length < 8 || isLoading}
              variant="contained"
              className="bg-primary2 hover:bg-primary font-bold text-white my-5 w-full"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={open3} onClose={handleClose3}>
        <div className="absolute bg-black rounded-xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] h-fit w-fit">
          <IconButton
            className="absolute z-10 right-0 top-0 m-5 bg-black/20 hover:bg-black/50"
            onClick={() => {
              handleClose3()
            }}
          >
            <CloseIcon className="text-white" />
          </IconButton>
          <ReactPlayer
            playing
            className="object-contain"
            progressInterval
            controls={true}
            width="80vw"
            height="90vh"
            url={`${process.env.NEXT_PUBLIC_API_URL}${item?.order_video?.order_video_file}`}
          />
        </div>
      </Modal>

      <Modal
        open={showModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 max-h-[90vh] overflow-auto -translate-y-1/2 p-5 lg:p-10 rounded-lg lg:min-w-1/3 md:w-1/2 w-[90vw] bg-white">
          <IconButton
            className="absolute top-0 right-0"
            onClick={() => {
              setShowModal(false)
            }}
          >
            <CloseIcon />
          </IconButton>
          <Stripe payData={payData} createOrder2={createOrder2} savePayInfo={savePayInfo} />
        </div>
      </Modal>

      <Modal
        open={showModal2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 max-h-[90vh] overflow-auto -translate-y-1/2 p-5 lg:p-10 rounded-lg lg:min-w-1/3 md:w-1/2 w-[90vw] bg-white">
          <IconButton
            className="absolute top-0 right-0"
            onClick={() => {
              setShowModal2(false)
            }}
          >
            <CloseIcon />
          </IconButton>
          <div>
            <p className="font-bold "> Do you want to use the last card you have used ?</p>
            <div className="text-sm p-3 rounded-xl border border-primary mt-3">
              <p>**** **** **** {User?.UserData?.profile?.payment_info?.last4}</p>
              <p>
                EXP:
                {User?.UserData?.profile?.payment_info?.exp_month}/
                {User?.UserData?.profile?.payment_info?.exp_year}
              </p>
            </div>

            <p className="mt-3 text-xs text-red-500">
              NB:Anytime you can remove your last saved card from settings.
            </p>
            <Button
              onClick={() => {
                createOrder2()
              }}
              disabled={isLoading}
              variant="contained"
              className="mt-5 bg-primary2 hover:bg-primary text-white font-bold"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={ratingModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 max-h-[90vh] overflow-auto -translate-y-1/2 p-5 lg:p-10 rounded-lg lg:min-w-1/3 md:w-1/2 w-[90vw] bg-white">
          <IconButton
            className="absolute top-0 right-0"
            onClick={() => {
              setRatingModal(false)
            }}
          >
            <CloseIcon />
          </IconButton>

          <div className="">
            <p className="text-center lg:text-2xl md:text-xl text-lg font-bold">Rate this video</p>

            <div className="mt-5 flex flex-col items-center">
              <Rating
                className="lg:text-4xl md:text-2xl text-xl"
                name="simple-controlled"
                value={userrating}
                onChange={(event, newValue) => {
                  setUserrating(newValue)
                }}
              />
              <Button
                variant="contained"
                className="bg-primary mt-5 lg:text-xl text-lg font-bold w-full text-white"
                onClick={() => rateNow()}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
