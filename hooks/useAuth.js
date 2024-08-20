import React from 'react'
import axios from '../utils/axios'

export async function getProfile() {
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
  }
}
