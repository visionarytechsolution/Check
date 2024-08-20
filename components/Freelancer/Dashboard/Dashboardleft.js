import React, { useState } from 'react'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import { Button } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InfoIcon from '@mui/icons-material/Info'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from '../../../utils/axios'
import store from '../../../rtk/store/store'
import { addUserActions } from '../../../rtk/feautes/addUser/addUserSlice'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/router'
import DashboardRight from './DashboardRight'
import SpeedIcon from '@mui/icons-material/Speed'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import Chart from './Chart'
import FeedbackIcon from '@mui/icons-material/Feedback'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import Link from 'next/link'

export default function Dashboardleft({ CountList }) {
  const [age, setAge] = useState(10)

  const handleChange = event => {
    setAge(event.target.value)
  }

  const router = useRouter()

  const User = useSelector(state => state.User?.UserData)

  //console.log("my user", User);

  //check user is eligible for or not
  const makeWithDraw = async () => {
    if (User?.withdraw_info == null) {
      router.push('/editor/settings?payment=true')
    } else {
      if (User?.total_income > 0) {
        RequestWithDraw()
      } else {
        toast.warn('Insufficient Balance to withdraw.')
      }
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  //request for withdraw
  const RequestWithDraw = async () => {
    const loading = toast.loading('Please wait a moment.')
    setIsLoading(true)

    try {
      const res = await axios.post(`/api/order/withdraw_request/`)

      const { status } = res
      if (status == 200) {
        toast.success('WithDraw Requested Successfully.')
        fetchData()
      }
      toast.dismiss(loading)
      setIsLoading(false)
    } catch (err) {
      toast.dismiss(loading)
      setIsLoading(false)
      //console.log("Error from submit request", err);
      toast.error(err?.response?.data?.error)
    }
  }

  //get user profile
  const fetchData = async () => {
    // //console.log("i am in2");
    try {
      const res = await axios.get(`/api/profile/my_profile/`)
      //console.log("get profile", res);
      store.dispatch(addUserActions.addUser(res?.data))
    } catch (err) {
      //console.log("profile error", err);
    }
  }

  //get request history

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [modalData, setModalData] = React.useState(null)

  const GetPaymentList = async () => {
    const loading = toast.loading('Please wait a moment.')
    try {
      const res = await axios.get(`/api/order/my_withdraw_request/`)
      //console.log("Modal Data", res);
      const { status } = res
      if (status == 200) {
        setModalData(res?.data)
        handleOpen()
      }

      toast.dismiss(loading)
    } catch (err) {
      toast.dismiss(loading)
      toast.error(err?.response?.data?.error)
      //console.log("Modal Data error", err);
    }
  }

  return (
    <>
      <div className="bg-white lg:p-10 p-5 rounded-2xl">
        <div className="flex justify-between gap-4 flex-wrap">
          <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">My Dashboard</h5>
        </div>

        {/* <div className="flex flex-wrap justify-between gap-5 mt-10 rounded-xl border lg:p-10 p-5 w-fit">
          <div className="flex gap-4 ">
            <div className=" w-full">
              <div className="bg-primary rounded p-2">
                <MonetizationOnIcon className="text-white text-5xl" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="w-fit text-gray-500 text-sm">Total&nbsp;Earnings</p>
              <p className="text-lg md:text-xl lg:text-xl font-extrabold">
                ${User?.total_revenue}
              </p>
            </div>
          </div>
          <div className="flex gap-4  ">
            <div className=" w-full">
              <div className="bg-primary rounded p-2">
                <HourglassBottomIcon className="text-white text-5xl" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="w-fit text-gray-500 text-sm">
                Pending&nbsp;Earnings
              </p>
              <p className="text-lg md:text-xl lg:text-xl font-extrabold">
                ${User?.pending_earn}
              </p>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-4 w-full mt-5">
            <Button
              disabled={isLoading}
              onClick={() => {
                makeWithDraw();
              }}
              className="text-base md:text-lg bg-primary text-white hover:bg-primary2 capitalize w-full"
            >
              Withdraw&nbsp;Request
            </Button>
            <Button
              onClick={GetPaymentList}
              className="text-base md:text-lg bg-primary text-white hover:bg-primary2 capitalize w-full"
            >
              Payment&nbsp;History
            </Button>
          </div>
        </div> */}

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-2 mt-10">
          <div className="border text-center rounded-lg w-full   flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
            <MonetizationOnIcon className="text-3xl text-primary" />

            <div className="w-full">
              <p className=" text-3xl font-bold "> ${User?.total_revenue}</p>
              <p className="text-gray-500 text-sm mt-2">Total&nbsp;Earnings</p>

              <Button
                disabled={isLoading}
                onClick={() => {
                  makeWithDraw()
                }}
                className="mt-2 md:text-base w-full bg-primary text-white hover:bg-primary2 capitalize "
              >
                Withdraw&nbsp;Request
              </Button>
            </div>
          </div>
          <div className="border text-center rounded-lg w-full   flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
            <HourglassBottomIcon className="text-3xl text-primary" />

            <div className="w-full">
              <p className=" text-3xl font-bold "> ${User?.pending_earn}</p>
              <p className="text-gray-500 text-sm mt-2">Pending&nbsp;Earnings</p>
              <Button
                onClick={GetPaymentList}
                className="mt-2 md:text-base w-full bg-primary text-white hover:bg-primary2 capitalize "
              >
                Payment&nbsp;History
              </Button>
            </div>
          </div>

          <div className="border text-center rounded-lg w-full   flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
            <DoneAllIcon className="text-3xl text-primary" />

            <div>
              <p className=" text-3xl font-bold ">{CountList?.complete_task}</p>
              <p className="text-gray-500 text-sm mt-2">Task Completed</p>
            </div>
          </div>
          <Link
            href="/editor/my-tasks"
            className="border text-center rounded-lg w-full hover:bg-primary/10   lg:p-10 p-5 h-full"
          >
            <div className="w-full  h-full flex flex-col gap-4 justify-center items-center ">
              <CheckCircleOutlineIcon className="text-3xl text-primary" />

              <div>
                <p className=" text-3xl font-bold ">{CountList?.pending_task}</p>
                <p className="text-gray-500 text-sm mt-2">Pending Task</p>
              </div>
            </div>
          </Link>

          <div className="border text-center rounded-lg w-full   flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
            <InfoIcon className="text-3xl text-primary" />

            <div>
              <p className=" text-3xl font-bold ">{User?.late_task}</p>
              <p className="text-gray-500 text-sm mt-2">Task&nbsp;in&nbsp;late</p>
            </div>
          </div>

          <div className="border text-center rounded-lg bg-white w-full    flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
            <div className="p-3 border rounded">
              <SpeedIcon className="text-3xl text-primary" />
            </div>

            <div>
              <p className=" text-3xl font-bold ">{CountList?.avg_speed_delivery}</p>
              <p className="text-gray-500 text-sm mt-2">Your Speed Delivery</p>
            </div>
          </div>
          <div className="border text-center rounded-lg bg-white w-full    flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
            <div className="p-3 border rounded">
              <FeedbackIcon className="text-3xl text-primary" />
            </div>

            <div>
              <p className="text-3xl font-bold">{CountList?.bug_rate?.toFixed(2)}%</p>
              <p className="text-gray-500 text-sm mt-2">Bug Reported</p>
            </div>
          </div>
          <div className="border text-center rounded-lg bg-white w-full    flex flex-col gap-4 justify-center items-center lg:p-10 p-5">
            <div className="p-3 border rounded">
              <ThumbUpAltIcon className="text-3xl text-primary" />
            </div>

            <div>
              <p className=" text-3xl font-bold ">{CountList?.satisfaction_note}</p>
              <p className="text-gray-500 text-sm mt-2">Your Satisfaction Note</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className=" rounded-xl bg-white w-full  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:max-w-[50vw] max-w-[90vw] max-h-[90vh] overflow-auto">
          <div className="p-5">
            <div className="flex justify-between items-center">
              <span className="lg:text-2xl md:text-xl text-lg font-bold">Payment History</span>

              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>

            <div className="mt-5">
              {modalData?.length > 0 &&
                modalData.map((data, index) => (
                  <div key={index} className="my-2  p-2 lg:text-sm text-xs bg-gray-100">
                    <p>Type: Crypto</p>
                    <p>Amount: {data?.withdraw_amount}$</p>
                    <p className="break-all">Withdrawal Details: {data?.withdrawal_details}</p>
                    <p>
                      Status:
                      <span className="text-base font-bold capitalize pl-1">
                        {data?.withdraw_status}
                      </span>
                    </p>
                  </div>
                ))}

              {modalData?.length < 1 && <small>No Payment History.</small>}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
