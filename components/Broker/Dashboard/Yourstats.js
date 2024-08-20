import React from 'react'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { Button } from '@mui/material'

export default function Yourstats() {
  return (
    <div className="w-full bg-white rounded-xl p-5 " style={{ position: 'sticky', top: 0 }}>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold text-center">Your Stats</h5>

      <div className=" rounded-2xl bg-bg1 flex items-center gap-2 p-5 mt-5">
        <DoneAllIcon className="text-primary2" />

        <div>
          <p className="text-sm md:text-base ">Total Property Videos</p>
          <p className="text-sm md:text-base font-bold">150</p>
        </div>
      </div>

      <h5 className="text-lg md:text-xl lg:text-2xl font-bold text-center mt-10">
        Your Last Videos
      </h5>

      <div className="w-full mt-5">
        <iframe
          className="w-full lg:h-52 h-60"
          src="https://www.youtube.com/embed/CTFtOOh47oo"
          frameBorder="0"
          allowfullscreen
        ></iframe>
        <p className="text-center text-xs md:text-sm w-full mt-2">Elm Street, 23 Montreal Canada</p>
        <p className="text-center text-xs md:text-sm w-full mt-1">1 day , 23 mins ago</p>
      </div>

      <Button
        variant="contained"
        className="bg-primary text-white w-full mt-5 capitalize font-bold shadow-none text-base py-3 lg:text-lg rounded-xl lg:mt-10"
      >
        Publish Live
      </Button>
      {/* <Button variant="contained" className="bg-gray-600 hover:bg-gray-800 text-white w-full mt-5 capitalize font-bold shadow-none text-base py-3 lg:text-lg rounded-xl lg:mt-10">Create a new property video</Button> */}
    </div>
  )
}
