import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import googlesvg from '../assests/google.svg'
import facebooksvg from '../assests/facebook.svg'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import FilledInput from '@mui/material/FilledInput'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from 'next/link'
import axios from '../utils/axioswithPublic'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

export default function Index() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('')
  const [recovery_token, setrecovery_token] = useState('')
  const [otp, setotp] = useState('')
  const [mypassword, setMypassword] = useState('')

  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = () => {
    event.preventDefault()
  }

  const [email, setEmail] = useState('')

  const checkemail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)

  const sentOtpFun = async () => {
    try {
      const res = await axios.post(`/api/recovery-account/reset-password/`, {
        email: email,
      })
      const { status, data } = res
      if (status == 200) {
        toast.success(data?.message)
        setrecovery_token(data?.recovery_token)
        router.push(`/change-password?token=${data?.recovery_token}`)
      }
      //console.log("sent otp response", res);
    } catch (err) {
      //console.log("err otp response", err);
      setrecovery_token('')
      toast.error('User not exists.')
    }
  }

  return (
    <>
      <Head>
        <title>Reset Password - RealVision</title>
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

      <div className="flex min-h-screen ">
        <div className="lg:w-1/2 lg:block hidden h-full overflow-hidden">
          <Image
            placeholder="blur"
            src="/login.png"
            alt="Logo"
            className="object-cover h-screen w-full"
            blurDataURL="/blur.png"
            width={1000}
            height={800}
          />
        </div>

        <div className="lg:w-1/2 w-full lg:p-20 md:p-10 p-5 min-h-screen flex justify-center items-center">
          <div className="w-full md:w-2/3 lg:w-full h-fit">
            <h1 className="font-display font-bold lg:text-4xl md:text-2xl text-xl text-[#242424]  text-center">
              Reset Password
            </h1>

            <div className="flex flex-col gap-4 items-center mt-10 lg:mt-20">
              {!recovery_token?.length > 0 && (
                <div className="flex flex-col gap-1 lg:w-4/5 xl:w-3/5">
                  <TextField
                    disabled={recovery_token?.length > 0}
                    id="standard-basic"
                    label="Email"
                    variant="standard"
                    onChange={e => {
                      setEmail(e.target.value)
                    }}
                    className="w-full "
                  />
                  <small className="text-red-500">
                    {!checkemail && email.length > 0 && 'Invalid Email Address'}
                  </small>
                </div>
              )}

              <div className=" w-full lg:w-4/5 xl:w-3/5 flex justify-end">
                <Button
                  onClick={() => sentOtpFun()}
                  disabled={!checkemail}
                  variant="contained"
                  className="bg-primary2 shadow-none text-white font-bold hover:bg-primary rounded-full py-3 w-full"
                >
                  Reset Password
                </Button>
              </div>
            </div>

            <p className="text-center mt-10">
              <Link className="underline hover:text-red-500" href="/">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
