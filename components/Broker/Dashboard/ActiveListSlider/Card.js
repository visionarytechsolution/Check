import { Button } from '@mui/material'
import Link from 'next/link'
import { useSelector } from 'react-redux'

export default function VideoCard({ item }) {
  const Price = useSelector(state => state.Price)

  //console.log("Item", item);
  const idParam = item?.zpid ? `id=${item.zpid}` : `retailor=${item?.permalink}`

  const CommaSeparatedData = () => {
    let dataString = ''

    if (item?.location?.address) {
      const { coordinate: undefined, ...restOfLocation } = item.location.address

      const nonNullValues = Object.values(restOfLocation).filter(value => value !== null)

      dataString = nonNullValues.join(', ')
    }

    return <p>{dataString}</p>
  }

  return (
    <div className="shadow-lg border border-gray-200  h-full  rounded-2xl overflow-hidden  cursor-grab relative">
      {/* <p className="absolute top-2 left-2 text-sm font-bold bg-primary rounded-xl px-3 text-white py-1">
        -30% off
      </p> */}
      <img
        src={item?.primary_photo_url || item?.primary_photo?.href || '/noimg.jpg'}
        alt="Logo"
        className="object-cover aspect-video w-full  pointer-events-none"
        onError={e => {
          e.target.src = '/noimg.jpg'
        }}
      />

      <div className="text-sm  text-center p-5 ">
        {item?.address?.postalCode && (
          <p className="font-bold text-sm mt-2 h-full">
            {item?.address?.line1},{item?.address?.line2},{item?.address?.postalCode},
            {item?.address?.stateOrProvince}
          </p>
        )}
        {item?.location?.address && (
          <p className="font-bold text-sm mt-2 h-full">{CommaSeparatedData()}</p>
        )}

        <p className="mt-2 lg:text-base font-bold">
          Price: ${Price?.PriceData?.amount}{' '}
          {Price?.PriceData?.amount < 69 && (
            <span className="line-through text-red-700 text-2xl">69</span>
          )}
        </p>
        <Link href={`/process/property`}>
          <Button variant="contained mt-2 bg-primary2 duration-300 text-white font-bold  hover:bg-primary capitalize text-sm">
            <p>convert in video now </p>
          </Button>
        </Link>
      </div>
    </div>
  )
}
