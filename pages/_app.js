import '@/styles/globals.css'
import Head from 'next/head'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { StyledEngineProvider } from '@mui/material/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import store from '../rtk/store/store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AdminBackLogin from '@/components/Common/AdminBackLogin'
import WelcomeVideoModal from '@/components/Common/WelcomeVideoModal'
import axios from '../utils/axioswithPublic'
import { AddPriceAction } from '../rtk/feautes/addPrice/addPrice'

function MyApp({ Component, pageProps, router }) {
  useEffect(() => {
    GetAmount()
  }, [])

  const GetAmount = async () => {
    try {
      const res = await axios.get('/api/order/get_amount/')
      store.dispatch(AddPriceAction.addPrice(res?.data))
    } catch (err) {
      //console.log(err);
    }
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  NProgress.configure({ showSpinner: false })
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })

  const theme = createTheme({
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
    palette: {
      primary: {
        main: '#98CFB2',
      },
      secondary: {
        main: '#74E4A4',
      },
      // text: {
      //   primary: "#74E4A4",
      // },
    },
  })

  return (
    <>
      <StyledEngineProvider injectFirst>
        {!loading && (
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
                {/* <WelcomeVideoModal /> */}
                <AdminBackLogin />
              </ThemeProvider>
              <ToastContainer
                autoClose={2000}
                hideProgressBar={true}
                closeOnClick
                pauseOnHover
                draggable={true}
                position="top-right"
                toastClassName=""
                bodyClassName=""
                progressClassName=""
                pauseOnFocusLoss={false}
                newestOnTop={true}
                theme="colored"
              />
            </Provider>
          </GoogleOAuthProvider>
        )}
      </StyledEngineProvider>
    </>
  )
}
export default MyApp
