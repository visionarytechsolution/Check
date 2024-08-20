import React, { useState, useRef, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import Image from 'next/image'
import DiamondIcon from '@mui/icons-material/Diamond'
import { Button } from '@mui/material'
import useWindowSize from '.././../hooks/useWindowSize'
import SettingsIcon from '@mui/icons-material/Settings'
import Profile from './profileDropdownBroker'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import MemoryIcon from '@mui/icons-material/Memory';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings'
import HistoryIcon from '@mui/icons-material/History'

import { useCookies } from 'react-cookie'
import store from '../../rtk/store/store'
import { addUserActions } from '../../rtk/feautes/addUser/addUserSlice'
import axios from '../../utils/axios'
import PostAddIcon from '@mui/icons-material/PostAdd'

export default function MiniDrawer({ children, active }) {
  const [Cookie, , removeCookie] = useCookies(['token', 'type'])
  const router = useRouter()

  //get user profile
  useEffect(() => {
    // //console.log("i am in");

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
    fetchData()
  }, [])

  const { drawer } = router.query
  const [open, setOpen] = React.useState(drawer == 'true' ? true : false)
  const theme = useTheme()
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const windowSize = useWindowSize()
  // //console.log(windowSize)

  const [drawerWidth, setDrawerWidth] = React.useState(240)
  useEffect(() => {
    if (windowSize?.width < 550) {
      setDrawerWidth(windowSize.width)
    } else {
      setDrawerWidth(240)
    }
  }, [windowSize])

  const openedMixin = theme => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  })

  const closedMixin = theme => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  })

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }))

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }))

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: prop => prop !== 'open',
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }))

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} className="bg-white  shadow-none border-b">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 0,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <div className="flex justify-between gap-4 w-full h-16">
            <Image
              src="/logo.png"
              width={200}
              height={200}
              alt="Logo"
              className={`object-contain h-16 w-40 p-1 ${open ? 'opacity-0 duration-150' : ''}   `}
            />

            <span></span>
            <div className="flex   items-center">
              <Link href="/broker/settings?notification=true">
                <IconButton>
                  <NotificationsIcon />
                </IconButton>
              </Link>

              <Profile />
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader className=" ">
          <ListItemButton onClick={handleDrawerClose} className="p-0 w-full h-full mx-0">
            {theme.direction === 'rtl' ? (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <ChevronRightIcon />
              </ListItemIcon>
            ) : (
              <ListItemIcon
                className="pl-2"
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeftIcon />
              </ListItemIcon>
            )}
            <Image
              src="/logo.png"
              width={200}
              height={200}
              alt="Logo"
              className="object-contain h-16 p-1  w-40"
            />
          </ListItemButton>
        </DrawerHeader>
        <Divider />
        <List>
          <Link href={`/broker/dashboard?drawer=${open}`}>
            <ListItemButton
              className={`flex justify-center m-2 rounded-2xl hover:bg-primary2 hover:text-white  group ${
                active == 'dashboard' ? 'bg-primary  text-white ' : ''
              }`}
              title="Dashboard"
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <DashboardCustomizeIcon
                  className={`${
                    active == 'dashboard' ? '  text-white ' : ''
                  } group-hover:text-white`}
                />
              </ListItemIcon>

              <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Link>
          <Link href={`/process/property?drawer=${open}`}>
            <ListItemButton
              className={`flex justify-center m-2 rounded-2xl hover:bg-primary2 hover:text-white  group ${
                active == 'process' ? 'bg-primary  text-white ' : ''
              }`}
              title="Process"
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <MemoryIcon
                  className={`${
                    active == 'process' ? '  text-white ' : ''
                  } group-hover:text-white`}
                />
              </ListItemIcon>

              <ListItemText primary="Process" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Link>

          <Link href={`/broker/my-videos?drawer=${open}`}>
            <ListItemButton
              className={`flex justify-center m-2 rounded-2xl hover:bg-primary2 hover:text-white  group ${
                active == 'myvideos' ? 'bg-primary  text-white ' : ''
              }`}
              title="My Videos "
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
                className=""
              >
                <VideoSettingsIcon
                  className={`${
                    active == 'myvideos' ? '  text-white ' : ''
                  } group-hover:text-white`}
                />
              </ListItemIcon>

              <ListItemText primary="My Videos" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Link>
          <Link href={`/broker/order-history?drawer=${open}`}>
            <ListItemButton
              className={`flex justify-center m-2 rounded-2xl hover:bg-primary2 hover:text-white  group ${
                active == 'order-history' ? 'bg-primary  text-white ' : ''
              }`}
              title="Order History"
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
                className=" "
              >
                <HistoryIcon
                  className={`${
                    active == 'order-history' ? '  text-white ' : ''
                  } group-hover:text-white`}
                />
              </ListItemIcon>

              <ListItemText primary="Order History" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Link>

          <Link href={`/broker/blog?drawer=${open}`}>
            <ListItemButton
              className={`flex justify-center m-2 rounded-2xl hover:bg-primary2 hover:text-white  group ${
                active == 'blog' ? 'bg-primary  text-white ' : ''
              }`}
              title="Blog"
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <PostAddIcon
                  className={`${active == 'blog' ? '  text-white ' : ''} group-hover:text-white`}
                />
              </ListItemIcon>

              <ListItemText primary="Blog" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Link>

          <Link href={`/broker/settings?drawer=${open}`}>
            <ListItemButton
              className={`flex justify-center m-2 rounded-2xl hover:bg-primary2 hover:text-white  group ${
                active == 'settings' ? 'bg-primary  text-white ' : ''
              }`}
              title="Settings"
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <SettingsIcon
                  className={`${
                    active == 'settings' ? '  text-white ' : ''
                  } group-hover:text-white`}
                />
              </ListItemIcon>

              <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Link>
        </List>
      </Drawer>
      <Box component="main" className="bg-bg1 w-full overflow-auto">
        <DrawerHeader />
        <main>{children}</main>
      </Box>
    </Box>
  )
}
