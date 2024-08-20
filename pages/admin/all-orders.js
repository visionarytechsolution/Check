import React, { useState, useEffect } from 'react'
import LayoutAdmin from '../../components/Layout/LayoutAdmin'
import Head from 'next/head'
import Header from '@/components/Admin/All_Videos/Header'
import VideoTable from '@/components/Admin/All_Videos/VideoTable'
import PaginationDetails from '@/components/Admin/All_Videos/Pagination'
import ChangeView from '@/components/Admin/All_Videos/ChangeView'
import VideoCard from '@/components/Admin/All_Videos/VideoCard'
import axios from '../../utils/axios'
import TaskDetails from '../../components/Admin/All_Videos/TaskDetails'
import { toast } from 'react-toastify'

import withAuth from '@/hoc/withAuth'

function Dashboard() {
  const [view, setView] = useState('table')
  const [page, setPage] = useState(1)
  const [sortby, setSortby] = useState('')
  const [loading, setLoading] = useState(true)
  const [teigger, settrigger] = useState(1)
  const [data, setData] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [tempData, setTempData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/order/all/?page=${page}&status_type=${sortby}`)
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
        <title>All Orders - RealVision</title>
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
        <LayoutAdmin active="allvideos">
          <div className="lg:p-10 p-5 min-h-[90vh]">
            {!showDetails ? (
              <>
                <Header setPage={setPage} setSortby={setSortby} sortby={sortby} />

                {data?.results?.data?.length > 0 && (
                  <>
                    <ChangeView view={view} setView={setView} />
                    {view == 'table' ? (
                      <VideoTable
                        data={data}
                        settrigger={settrigger}
                        setShowDetails={setShowDetails}
                        setTempData={setTempData}
                      />
                    ) : (
                      <VideoCard
                        data={data}
                        setShowDetails={setShowDetails}
                        setTempData={setTempData}
                        settrigger={settrigger}
                      />
                    )}
                  </>
                )}

                {data?.results?.data?.length < 1 && (
                  <h1 className="lg:text-3xl md:text-2xl text-xl font-bold mt-16  text-center">
                    No data to show
                  </h1>
                )}

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
        </LayoutAdmin>
      </div>
    </>
  )
}
export default withAuth(Dashboard)
