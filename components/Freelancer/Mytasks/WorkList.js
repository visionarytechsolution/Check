import { Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import TaskCard from './TaskCard'
export default function WorkList({ data, setShowDetails, setTempData, settrigger }) {
  return (
    <>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 md:gap-8 ">
        {data?.results?.data?.length > 0 &&
          data?.results?.data?.map((item, index) => (
            <div key={index}>
              <TaskCard
                item={item}
                setShowDetails={setShowDetails}
                setTempData={setTempData}
                settrigger={settrigger}
              />
            </div>
          ))}
      </div>
      {!data?.results?.data?.length > 0 && (
        <p className="text-primary lg:text-2xl text-lg font-bold mt-10 text-center w-full  bg-white p-5 rounded-xl">
          You don't have any tasks at this moment.
        </p>
      )}
    </>
  )
}
