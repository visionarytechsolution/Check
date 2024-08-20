import React from 'react'
import PersonIcon from '@mui/icons-material/Person'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SecurityIcon from '@mui/icons-material/Security'
import PaidIcon from '@mui/icons-material/Paid'
import HelpIcon from '@mui/icons-material/Help'
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
export default function LayoutSettings({ children, activeState, setActiveState }) {
  const InfoData = [
    {
      id: 'profile',
      title: 'Admin Profile',
      description: 'My Admin.',
      icon: PersonIcon,
    },
    {
      id: 'notification',
      title: 'Notification',
      description: 'Choose your notification parameter preferences.',
      icon: NotificationsIcon,
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Login History and 2FA (two-factor-authentification) settings.',
      icon: SecurityIcon,
    },
    // {
    //   id: "payment",
    //   title: "Payment",
    //   description: "Payment hisory and payment mode settings.",
    //   icon: PaidIcon,
    // },

    // {
    //   id: "help",
    //   title: "Payment Gateway",
    //   description: "Configuration of stripe integration.",
    //   icon: LocalAtmIcon,
    // },
    // {
    //   id: "integration",
    //   title: "Integration",
    //   description: "Our Plugins and social integration.",
    //   icon: ConnectWithoutContactIcon,
    // },
  ]

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <div className=" rounded-xl bg-gray-50 overflow-hidden hidden lg:flex ">
        <div className="w-80  bg-white">
          {InfoData?.map((data, index) => {
            return (
              <div
                className={`${
                  activeState == data?.id ? 'bg-sky-100' : ''
                } flex gap-2 text-sm m-3 p-3 rounded-xl  hover:bg-sky-100 duration-300 cursor-pointer`}
                key={index}
                onClick={() => {
                  setActiveState(data?.id)
                }}
              >
                {data?.icon && <data.icon className="text-4xl" />}

                <div>
                  <p className="font-bold">{data?.title}</p>
                  <p className="text-gray-500">{data?.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:px-10 px-5 py-5 w-full">
          <main>{children}</main>
        </div>
      </div>

      <div className="lg:hidden rounded-md bg-gray-50 overflow-hidden ">
        <Tabs
          value={activeState}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          className="bg-white x"
        >
          {InfoData?.map((data, index) => {
            return (
              <Tab
                className="capitalize text-sm"
                key={index}
                onClick={() => {
                  setActiveState(data?.id)
                }}
                label={
                  <div>
                    {data?.icon && <data.icon className="" />}&nbsp;{data?.title}
                  </div>
                }
                value={data?.id}
              />
            )
          })}
        </Tabs>
        <div className="lg:px-10 px-5 py-5 w-full  ">
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}
