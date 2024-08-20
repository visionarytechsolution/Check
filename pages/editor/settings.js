import React, { useEffect, useState } from 'react'
import LayoutBroker from '../../components/Layout/LayoutFreelancer'
import Head from 'next/head'
import LayoutSettings from '@/components/Freelancer/Settings/LayoutSettings'
import BrokerProfile from '@/components/Freelancer/Settings/BrokerProfile'
import Notification from '@/components/Freelancer/Settings/Notification'
import Security from '@/components/Freelancer/Settings/Security'
import Payment from '../../components/Freelancer/Settings/Payment'
import Help from '../../components/Freelancer/Settings/Help'
import Integration from '@/components/Freelancer/Settings/Integration'
import UserPreference from '@/components/Freelancer/Settings/UserPreference'
import { useRouter } from 'next/router'
import withAuth from '@/hoc/withAuth'

export default withAuth(Settings)

function Settings() {
  const [activeState, setActiveState] = useState('profile')

  const router = useRouter()

  useEffect(() => {
    if (router.query.notification == 'true') {
      setActiveState('notification')
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Settings - RealVision</title>
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
      <div className="">
        <LayoutBroker active="settings">
          <div className="p-5 lg:p-10 min-h-[93vh]">
            <h5 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">Settings</h5>
            <LayoutSettings activeState={activeState} setActiveState={setActiveState}>
              {activeState == 'profile' && <BrokerProfile />}
              {activeState == 'notification' && <Notification />}
              {activeState == 'security' && <Security />}
              {activeState == 'payment' && <Payment />}
              {activeState == 'help' && <Help />}
              {activeState == 'integration' && <Integration />}
              {activeState == 'user_preference' && <UserPreference />}
            </LayoutSettings>
          </div>
        </LayoutBroker>
      </div>
    </>
  )
}
