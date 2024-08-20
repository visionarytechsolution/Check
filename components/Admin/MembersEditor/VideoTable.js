import React from 'react'
import Image from 'next/image'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Button } from '@mui/material'
import ActionOptions from './ActionOptions'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { dateConverter } from '../../../hooks/useDateConverter'

import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import axios from '../../../utils/axios'
import { useRouter } from 'next/router'

export default function VideoTable({ setStatus, profiles, setTrigger }) {
  const [age, setAge] = React.useState('')

  const handleChange = event => {
    setAge(event.target.value)
    setStatus(event.target.value)
  }

  const [cookie, setCookie] = useCookies(['token', 'type'])
  const [Cookie, , removeCookie] = useCookies(['token', 'type'])
  const router = useRouter()

  const Gologin = async username => {
    const loading = toast.loading('Loggin in.')

    const formData = new FormData()
    formData.append('username', username)

    try {
      const res = await axios.post(`/api/auth/admin_login/`, formData)
      const { status, data } = res

      if (status === 200) {
        toast.dismiss(loading)
        toast.success('Logged in successfully.')

        const Type1 = sessionStorage.getItem('type')
        const Token2 = sessionStorage.getItem('token')

        sessionStorage.setItem('token1', Token2)
        sessionStorage.setItem('type1', Type1)
        sessionStorage.setItem('url', '/admin/members-editor')

        sessionStorage.setItem('token', data?.token)
        sessionStorage.setItem('type', data?.type)

        removeCookie('token', { path: '/' })
        removeCookie('type', { path: '/' })

        if (data?.type == 'BROKER') {
          router.push('/broker/dashboard')
        }
        if (data?.type == 'FREELANCER') {
          router.push('/editor/dashboard')
        }
        if (data?.isAdmin == true) {
          router.push('/admin/dashboard')
        }
      }
    } catch (error) {
      toast.dismiss(loading)
      toast.error(error?.response?.data?.detail)
    }
  }

  return (
    <div className="mt-10 overflow-auto">
      <div className="bg-white rounded-t-xl overflow-hidden  min-w-[1200px] p-5">
        <table className="table-auto w-full text-sm ">
          <thead className="border-b">
            <tr>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Client</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Date</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Language</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Type</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">
                <FormControl size="small" className="p-0 m-0" fullWidth>
                  <Select
                    value={age}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="">Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                    <MenuItem value="not_available">Not Available</MenuItem>
                    <MenuItem value="terminated">Terminated</MenuItem>
                  </Select>
                </FormControl>
              </th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-center ">View</th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.results?.data?.map((data, index) => {
              return (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 lg:gap-4 items-center">
                      <img
                        src={data?.profile?.profile_pic}
                        alt="profile pic"
                        width={60}
                        height={60}
                        className="object-cover rounded-full border border-primary  h-16 w-16"
                      />

                      <div className="text-sm ">
                        <p className="font-bold">{data?.profile?.username}</p>
                        <p>{data?.profile?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(data?.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                  </td>
                  <td className="px-4 font-bold py-2">English / French</td>
                  <td className="font-bold px-4 py-2 capitalize">{data?.profile?.user_type}</td>
                  <td className="px-4 py-2">
                    {data?.status_type == 'active' && (
                      <p className="bg-primary px-3 py-2 rounded-xl w-full text-center text-white capitalize">
                        {data?.status_type}
                      </p>
                    )}
                    {data?.status_type == 'suspended' && (
                      <p className="bg-red-700 px-3 py-2 rounded-xl w-full text-center text-white capitalize">
                        {data?.status_type}
                      </p>
                    )}
                    {data?.status_type == 'not_available' && (
                      <p className="bg-gray-600 px-3 py-2 rounded-xl w-full text-center text-white capitalize">
                        {data?.status_type}
                      </p>
                    )}
                    {data?.status_type == 'terminated' && (
                      <p className="bg-red-700 px-3 py-2 rounded-xl w-full text-center text-white capitalize">
                        {data?.status_type}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="w-fit mx-auto">
                      <Button
                        onClick={() => {
                          Gologin(data?.profile?.username)
                        }}
                        variant="outlined"
                        className="capitalize text-primary rounded-xl px-3  hover:bg-primary border-2 border-primary hover:text-white"
                      >
                        Login as Editor
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <ActionOptions data={data} setTrigger={setTrigger} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {!profiles?.count && (
        <div className="bg-white text-center w-full rounded-b-xl overflow-hidden">
          <p className="py-5">No data to show </p>
        </div>
      )}
    </div>
  )
}
