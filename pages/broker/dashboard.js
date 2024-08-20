import React, { useState } from 'react'
import LayoutBroker from '../../components/Layout/LayoutBroker'
import Head from 'next/head'
import Yourstats from '@/components/Broker/Dashboard/Yourstats'
import CreateSection from '@/components/Broker/Dashboard/CreateSection'
import Graph from '@/components/Broker/Dashboard/Graph'
import RecentVideo from '@/components/Broker/Dashboard/RecentVideo/RecentVideo'
import { useSelector } from 'react-redux'
import ActiveListSlider from '../../components/Broker/Dashboard/ActiveListSlider/ActiveListSlider'
import withAuth from '@/hoc/withAuth'
import { Button } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import YouTube from 'react-youtube'
import PromoSlider from '@/components/Broker/Dashboard/PromoSlider'

export default withAuth(Dashboard)

function Dashboard() {
  const User = useSelector(state => state.User)
  const [haveData, setHaveData] = useState(true)
  const Price = useSelector(state => state.Price)

  return (
    <>
      <Head>
        <title>Dashboard - RealVision</title>
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
        <lf-lifecycle data-lifecycle="5" />
      </Head>
      <div>
        <LayoutBroker active="dashboard">
          <div className="lg:col-span-3 col-span-1 p-5 lg:p-10">
            {/* <CreateSection /> */}
            <h3 className="lg:text-3xl md:text-2xl text-xl font-bold">
              Hi {User?.UserData?.profile?.full_name}
            </h3>
            {haveData && (
              <>
                <div className="my-10 p-5 bg-white rounded-xl">
                  <p className="my-3 capitalize lg:text-2xl md:text-xl text-lg font-bold text-center">
                    Create your Order By clicking the button below:
                  </p>
                  <iframe
                    className="w-full aspect-video lg:w-1/2 mx-auto my-5  "
                    src="https://www.youtube.com/embed/TZBa13i2UvQ"
                  ></iframe>
                  <Link href="/process/property" className="flex justify-center">
                    <Button
                      className=" w-full lg:w-1/2 lg:text-lg bg-primary2 hover:bg-primary text-white font-bold lg:py-2"
                      variant="contained"
                    >
                      Convert property to video ${Price?.PriceData?.amount} &nbsp;
                      {Price?.PriceData?.amount < 69 && (
                        <span className="line-through text-red-700 text-2xl">69</span>
                      )}
                    </Button>
                  </Link>
                </div>
              </>
            )}

            <ActiveListSlider setHaveData={setHaveData} />
            <PromoSlider />
            <RecentVideo />
          </div>
        </LayoutBroker>
      </div>
    </>
  )
}
