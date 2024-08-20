import React, { useEffect, useState } from 'react'
import LayoutFreeLancer from '../../components/Layout/LayoutFreelancer'
import Head from 'next/head'
import Dashboardleft from '@/components/Freelancer/Dashboard/Dashboardleft'
import DashboardRight from '@/components/Freelancer/Dashboard/DashboardRight'
import { useSelector } from 'react-redux'
import withAuth from '@/hoc/withAuth'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import axios from '../../utils/axios'
import { useCookies } from 'react-cookie'
import store from '../../rtk/store/store'
import { addUserActions } from '../../rtk/feautes/addUser/addUserSlice'
import { toast } from 'react-toastify'

export default withAuth(Dashboard)
function Dashboard() {
  const User = useSelector(state => state.User)
  const [Cookie, , removeCookie] = useCookies(['token', 'type'])
  //console.log("User Data", User);

  const changeStatus = async () => {
    const loading = toast.loading('Changing status')
    // //console.log("i am in2");
    try {
      const res = await axios.put(`/api/profile/freelancer/status_change/`)
      //console.log("get profile", res);
      toast.dismiss(loading)
      if (res.status == 200) {
        fetchData()
      }
    } catch (err) {
      toast.dismiss(loading)
      //console.log("status change error", err);
    }
  }

  const fetchData = async () => {
    // //console.log("i am in2");
    try {
      const res = await axios.get(`/api/profile/my_profile/`)
      //console.log("get profile", res);
      store.dispatch(addUserActions.addUser(res?.data))
    } catch (err) {
      //console.log("profile error", err);
      store.dispatch(addUserActions.removeUser())
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('type')
      removeCookie('token', { path: '/' })
      removeCookie('type', { path: '/' })
      router.push('/')
    }
  }

  const [CountList, setCountList] = useState(null)

  const getCount = async () => {
    try {
      const res = await axios.get(`/api/order/freelancer_task/`)
      //console.log("SpecialData", res);
      setCountList(res?.data)
    } catch (err) {
      //console.log("counterror", err);
    }
  }

  useEffect(() => {
    getCount()
  }, [])

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
      </Head>
      <div>
        <LayoutFreeLancer active="dashboard">
          <div className="p-5 lg:p-10">
            <div className="flex justify-between gap-4 items-center flex-wrap">
              <h5 className="text-lg md:text-xl lg:text-2xl font-bold w-fit">
                Hello, {User?.UserData?.profile?.full_name}
              </h5>
              <div>
                <FormControlLabel
                  onClick={() => {
                    changeStatus()
                  }}
                  control={<Switch checked={User?.UserData?.status_type == 'active'} />}
                  className="capitalize"
                  label={User?.UserData?.status_type == 'active' ? 'Online' : 'Offline'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1   gap-8 mt-10">
              <Dashboardleft CountList={CountList} />

              {/* <DashboardRight CountList={CountList}/> */}
            </div>
          </div>
        </LayoutFreeLancer>
      </div>
    </>
  )
}
