import React from 'react'
import LayoutBroker from '../../components/Layout/LayoutBroker'
import Head from 'next/head'
import OrderList from '@/components/Broker/OrderHistory/OrderList'
import Pagination from '../../components/Broker/OrderHistory/Pagination'
import axios from '../../utils/axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import withAuth from '@/hoc/withAuth'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChangeView from '@/components/Broker/OrderHistory/ChangeView'
import { Button } from '@mui/material'
import useWindowSize from '@/hooks/useWindowSize'
import ActionOptions from '../../components/Broker/OrderHistory/ActionOptions'

export default withAuth(OrderHistory)

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

function OrderHistory() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [sortby, setSortby] = useState('')
  const [status_type, setStatus_Type] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/order/broker_orders/?page=${page}&status_type=${status_type}&${sortby}`,
        )
        setData(response?.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setData([])
        //console.log(error);
        toast.error('No Order Found.', { toastId: '1' })
      }
    }
    fetchData()
  }, [page, sortby, status_type])

  //console.log("data data data data", data);

  const [view, setView] = useState('table')

  const WindowSize = useWindowSize()

  useEffect(() => {
    if (WindowSize?.width < 750) {
      setView('card')
    }
  }, [WindowSize])

  return (
    <>
      <Head>
        <title>Order History - RealVision</title>
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
        <LayoutBroker active="order-history">
          <div className="p-5 lg:p-10 min-h-screen">
            <OrderList setSortby={setSortby} setPage={setPage} setStatus_Type={setStatus_Type} />

            {data?.results?.data?.length > 0 && (
              <>
                <ChangeView view={view} setView={setView} />

                {view == 'table' ? (
                  <div className="mt-10 overflow-auto">
                    <div className="bg-white rounded-t-xl overflow-hidden  min-w-[1200px] p-5">
                      <table className="table-auto w-full text-sm ">
                        <thead className="border-b">
                          <tr>
                            <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">
                              Client
                            </th>
                            <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">
                              Date
                            </th>
                            <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">
                              Address
                            </th>
                            <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">
                              Price
                            </th>
                            <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-center">
                              Status
                            </th>
                            <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.results?.data?.length > 0 &&
                            data?.results?.data?.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2">
                                  <div className="flex gap-2 lg:gap-4 items-center">
                                    <span className="lg:text-2xl md:text-xl font-bold text-primary">
                                      {item?.id}.
                                    </span>

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
                                <td className="px-4 py-2 lg:text-lg font-bold">
                                  <span className="text-primary  mr-1">$</span>
                                  {item?.amount}
                                </td>
                                <td className="px-4 py-2 ">
                                  {item?.status !== 'demo' && (
                                    <p className="bg-green-700 border-green-900 border text-white px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                                      Paid
                                    </p>
                                  )}
                                  {item?.status == 'demo' && (
                                    <p className="bg-[#E1ECF2] border-[#B4CD67] border text-[#B4CD67] px-3 py-2 rounded-xl w-fit  capitalize mx-auto">
                                      Demo
                                    </p>
                                  )}
                                </td>

                                <td className="mt-5 flex justify-center items-center h-full">
                                  <ActionOptions item={item} />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 py-10 rounded-t-xl bg-white p-5 lg:p-10 lg:gap-8 gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ">
                    {data?.results?.data?.length > 0 &&
                      data?.results?.data?.map((item, index) => (
                        <div key={index}>
                          <Card item={item} />
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}

            {!data?.results?.data?.length > 0 && (
              <div className="p-5 text-center">
                <h4 className="text-primary font-bold lg:text-4xl md:text-xl text-lg capitalize mt-10 lg:mt-20">
                  No order yet !
                </h4>
              </div>
            )}
            {data?.results?.data?.length > 0 && <Pagination data={data} setPage={setPage} />}
          </div>
        </LayoutBroker>
      </div>
    </>
  )
}
function Card({ item, setTrigger }) {
  return (
    <div className="shadow-lg border border-gray-200  h-full  p-5 rounded-lg relative">
      <div className="absolute top-0 right-0">
        <ActionOptions item={item} />
      </div>
      <img
        src={item?.property_photo_url || '/noimg.jpg'}
        alt="Logo"
        className="object-cover aspect-video rounded-xl w-full lg:px-2"
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
        <p className="mt-3">
          <LocationOnIcon className="text-primary" /> {item?.address}
        </p>

        <p className="text-gray-400 text-xs mt-3">{datetest(item?.created_at)}</p>

        <div className="flex justify-between flex-wrap gap-2 mt-4">
          {item?.status !== 'demo' && (
            <p className="bg-green-700 border-green-900 border text-white px-3 py-2 rounded-xl w-full  capitalize mx-auto">
              Paid
            </p>
          )}
          {item?.status == 'demo' && (
            <p className="bg-[#E1ECF2] border-[#B4CD67] border text-[#B4CD67] px-3 py-2 rounded-xl w-full  capitalize mx-auto">
              Demo
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
