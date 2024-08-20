import { createSlice } from '@reduxjs/toolkit'

const UserData = {}

const addUserSlices = createSlice({
  name: 'User',
  initialState: UserData,
  reducers: {
    addUser: (state, action) => {
      state.UserData = action.payload
    },
    removeUser: state => {
      state.UserData = {}
    },
  },
})

export default addUserSlices.reducer
export const addUserActions = addUserSlices.actions
