import React, { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useWindowSize from '../../../hooks/useWindowSize'
export default function PaginationDetails({ data, setPage }) {
  const router = useRouter()

  const [siblings, setSiblings] = useState(1)
  const windowSize = useWindowSize()

  // //console.log("meta data test",metadata)

  useEffect(() => {
    if (windowSize?.width < 450) {
      setSiblings(5)
    } else if (windowSize?.width < 720) {
      setSiblings(1)
    } else {
      setSiblings(3)
    }
  }, [windowSize])

  return (
    <div className=" p-5 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-4  ">
        <p className="text-sm">Showing 1-5 from 100 data</p>
        <Pagination
          onChange={(event, page) => {
            setPage(page)
            scrollTo(0, 0)
          }}
          boundaryCount={siblings}
          count={data?.results?.total_pages || 1}
          shape="rounded"
          size="large"
          page={data?.results?.current_page || 1}
        />
      </div>
    </div>
  )
}
