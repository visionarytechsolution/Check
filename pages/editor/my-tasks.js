import React, { useState } from 'react'
import LayoutBroker from '../../components/Layout/LayoutFreelancer'
import Head from 'next/head'
import Header from '@/components/Freelancer/Mytasks/Header'
import PaginationDetails from '@/components/Freelancer/Mytasks/Pagination'
import WorkList from '@/components/Freelancer/Mytasks/WorkList'
import axios from '../../utils/axios'
import { useEffect } from 'react'
import TaskDetails from '@/components/Freelancer/Mytasks/Taskdetails/TaskDetails'

import withAuth from '@/hoc/withAuth'

export default withAuth(MyVideos)

function MyVideos() {
  const [view, setView] = useState('table')
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [sortby, setSortby] = useState('')
  const [loading, setLoading] = useState(true)
  const [teigger, settrigger] = useState(1)
  const [showDetails, setShowDetails] = useState(false)
  const [tempData, setTempData] = useState(null)
  useEffect(() => {
    //console.log("i am in brother");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/order/freelancer_orders/?page=${page}&status_type=${sortby}`,
        )
        setData(response?.data)
        setLoading(false)
        //console.log("response", response);
      } catch (error) {
        setLoading(false)
        setData(null)
        //console.log("error", error);
      }
    }
    fetchData()
  }, [page, sortby, teigger])

  //console.log("data data data data", data);

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

      <LayoutBroker active="myvideos">
        <div className="p-5 lg:p-10 min-h-screen">
          {!showDetails ? (
            <>
              <Header setPage={setPage} setSortby={setSortby} sortby={sortby} />
              <WorkList
                data={data}
                setShowDetails={setShowDetails}
                setTempData={setTempData}
                settrigger={settrigger}
              />
              {data?.results?.data?.length > 0 && (
                <PaginationDetails data={data} setPage={setPage} />
              )}
            </>
          ) : (
            <TaskDetails
              setShowDetails={setShowDetails}
              setTempData={setTempData}
              tempData={tempData}
              setPage={setPage}
              settrigger={settrigger}
            />
          )}
        </div>
      </LayoutBroker>
    </>
  )
}
