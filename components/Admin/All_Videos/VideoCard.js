import { Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import TaskCard from './TaskCard'
export default function WorkList({ data, setShowDetails, setTempData, settrigger }) {
  return (
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

      {!data?.results?.data?.length > 0 && <div>No Data To Show</div>}
    </div>
  )
}
