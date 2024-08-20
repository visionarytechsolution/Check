import React from 'react'
import Card from './Card'
export default function ReviewCardList({ data, settrigger }) {
  return (
    <div>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Requested Reviews</h5>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
        {data?.length > 0 &&
          data?.map((item, index) => (
            <div key={index}>
              <Card item={item} settrigger={settrigger} />
            </div>
          ))}

        <h1>{data?.message}</h1>
      </div>
    </div>
  )
}
