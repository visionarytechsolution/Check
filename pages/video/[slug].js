import Head from 'next/head'
import React from 'react'
import axios from '../../utils/axioswithPublic'
import ReactPlayer from 'react-player'
import { useRouter } from 'next/router'

export default function VideoPage({ OrderData }) {
  const router = useRouter()
  if (!OrderData?.order_video?.order_video_file) {
    router.push('/404')
  }
  return (
    <>
      <Head>
        <title>{OrderData?.order_video?.video_title || `Not Found`} - RealVision</title>
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
        <meta property="og:title" content={OrderData?.order_video?.video_title || 'Not Found'} />
        <meta
          property="og:description"
          content={OrderData?.social_media_post || `No Description`}
        />
        <meta property="og:type" content="video" />
        <meta
          property="og:url"
          content={typeof window !== 'undefined' && OrderData?.property_photo_url}
        />
        <meta
          property="og:video"
          content={
            `${process.env.NEXT_PUBLIC_API_URL}${OrderData?.order_video?.order_video_file}` ||
            `nosource.com`
          }
        />
        <meta property="og:image" content={OrderData?.property_photo_url} />
      </Head>

      <div>
        <ReactPlayer
          playing
          className="object-contain"
          controls
          width="100vw"
          height="100vh"
          url={`${process.env.NEXT_PUBLIC_API_URL}${OrderData?.order_video?.order_video_file}`}
        />
      </div>
    </>
  )
}

async function GETDATA(url) {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    return null
  }
}

export async function getServerSideProps({ query }) {
  const { slug } = query
  const url = `/api/order/order_details/${slug}`
  const OrderData = await GETDATA(url)
  return { props: { OrderData } }
}
