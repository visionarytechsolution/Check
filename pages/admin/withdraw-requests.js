import React, { useEffect, useState } from 'react'
import LayoutAdmin from '../../components/Layout/LayoutAdmin'
import Head from 'next/head'
import axios from '../../utils/axios'
import WithDrawList from '@/components/Admin/WithDrawRequests/WithDrawList'
import Pagination from '../../components/Admin/WithDrawRequests/Pagination'

export default function WithDraw() {
  const [data, setData] = useState(null)
  const [trigger, setTrigger] = useState(false)
  const [sortby, setSortby] = useState('')
  const [page, setPage] = useState(1)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/order/all_withdraw_request/?page=${page}&status_type=${sortby}&email=${email}`,
        )
        setData(response?.data)
        //console.log("response", response);
      } catch (error) {
        setData(null)
        //console.log("error", error);
      }
    }
    fetchData()
  }, [trigger, sortby, email, page])

  return (
    <>
      <Head>
        <title>Withdraw Requests- RealVision</title>
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

      <LayoutAdmin active="withdraw">
        <div className="lg:p-10 p-5 min-h-[90vh]">
          <h1 className="lg:text-2xl md:text-xl text-lg font-bold">
            Freelancer Requested Withdraw
          </h1>
          <div className="mt-5">
            <WithDrawList
              data={data}
              trigger={trigger}
              setEmail={setEmail}
              setTrigger={setTrigger}
              setSortby={setSortby}
              sortby={sortby}
              setPage={setPage}
            />

            <Pagination data={data} setPage={setPage} />
          </div>
        </div>
      </LayoutAdmin>
    </>
  )
}
