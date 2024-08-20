import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import axios from '../utils/axioswithPublic'
import Head from 'next/head'

export default function auth() {
  //https://immovission.vercel.app/auth?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg5NjEyMDQwLCJpYXQiOjE2ODg3NDgwNDAsImp0aSI6ImNjNmY3NjdiYzVjMTQwMDI4MGUxYjgxY2NjYmMwMjgxIiwidXNlcl9pZCI6M30.0E0BI2hQ8p_cBVHuQsubJuSkbADz8F79qVfvY8aHMKY

  //login with

  const router = useRouter()
  //console.log(router.query.token);

  const token = router?.query?.token
  const [cookie, setCookie] = useCookies(['token', 'type'])

  useEffect(() => {
    if (token?.length > 0) {
      fetchData()
    }
    // //console.log("i am in");
  }, [router?.query?.token])

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/profile/my_profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      //console.log("get profile", res);

      const { status, data } = res

      if (status == 200) {
        toast.success('Logged in successfully.', { toastId: 1 })
        setCookie('token', token, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })

        setCookie('type', data?.profile?.user_type, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
        if (data?.profile?.user_type == 'BROKER') {
          router.push('/broker/dashboard')
        }
        if (data?.profile?.user_type == 'FREELANCER') {
          router.push('/editor/dashboard')
        }
      }
    } catch (err) {
      toast.error('Invalid URL.', { toastId: 1 })
      //console.log("profile error", err);
      router.push('/')
    }
  }

  return (
    <>
      <Head>
        <title>Logging in - RealVision</title>
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

      <div className="h-screen w-screen flex justify-center items-center">
        Please wait a moment...
      </div>
    </>
  )
}
