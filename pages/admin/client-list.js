import React, { useState, useEffect } from 'react'

import LayoutAdmin from '../../components/Layout/LayoutAdmin'
import Head from 'next/head'
import Header from '@/components/Admin/ClientList/Header'
import VideoTable from '@/components/Admin/ClientList/VideoTable'
import PaginationDetails from '@/components/Admin/ClientList/Pagination'
import axios from '../../utils/axios'
import { toast } from 'react-toastify'
import withAuth from '@/hoc/withAuth'

export default withAuth(Dashboard)
function Dashboard() {
  const [profiles, setProfiles] = useState([])
  const [page, setPage] = useState(1)
  const [trigger, setTrigger] = useState(0)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `api/profile/broker/all/?page=${page}&email=${email}&status_type=${status}`,
        )
        setProfiles(response.data)
        //console.log(response.data);
      } catch (error) {
        setProfiles([])
        toast.error(error?.response?.data?.error, { toastId: 13 })
        //console.log(error);
      }
    }

    fetchData()
  }, [page, trigger, status])

  return (
    <>
      <Head>
        <title>Client List - RealVision</title>
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
        <LayoutAdmin active="clientlist">
          <div className="lg:p-10 p-5">
            <Header setEmail={setEmail} setTrigger={setTrigger} />
            <VideoTable setStatus={setStatus} profiles={profiles} />
            <PaginationDetails profiles={profiles} setPage={setPage} />
          </div>
        </LayoutAdmin>
      </div>
    </>
  )
}
