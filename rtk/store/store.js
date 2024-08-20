import { configureStore } from '@reduxjs/toolkit'
import addUserSlices from '../feautes/addUser/addUserSlice'
import addPriceSlices from '../feautes/addPrice/addPrice'

//configure store
const store = configureStore({
  reducer: {
    User: addUserSlices,
    Price: addPriceSlices,
  },
})

export default store
