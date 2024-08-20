import { createSlice } from '@reduxjs/toolkit'

const PriceData = {}

const addPriceSlice = createSlice({
  name: 'Price',
  initialState: PriceData,
  reducers: {
    addPrice: (state, action) => {
      state.PriceData = action.payload
    },
  },
})

export default addPriceSlice.reducer
export const AddPriceAction = addPriceSlice.actions
