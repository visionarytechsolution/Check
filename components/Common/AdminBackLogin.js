import React from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'

export default function AdminBackLogin() {
  const [Cookie, , removeCookie] = useCookies(['token', 'type'])
  const Token = sessionStorage.getItem('token1')
  const Type = sessionStorage.getItem('type1')
  const Url = sessionStorage.getItem('url')

  const router = useRouter()
  const Back = async () => {
    removeCookie('token', { path: '/' })
    removeCookie('type', { path: '/' })
    sessionStorage.setItem('token', Token)
    sessionStorage.setItem('type', Type)
    sessionStorage.removeItem('token1')
    sessionStorage.removeItem('type1')
    sessionStorage.removeItem('url')
    router.push(Url)
  }

  return (
    <>
      {Token && Type && (
        <Button
          variant="contained"
          className="fixed bottom-0 z-40 right-0 m-5 bg-primary2 hover:bg-primary  font-bold capitalize"
          onClick={() => {
            Back()
          }}
        >
          Go Admin
        </Button>
      )}
    </>
  )
}
