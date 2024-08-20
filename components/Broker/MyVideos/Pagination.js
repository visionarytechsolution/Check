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

  // //console.log("meta data test",data)

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
      {data && (
        <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-4  ">
          <p className="text-sm">
            Showing {data?.results?.current_page}-{data?.results?.total_pages} from {data?.count}{' '}
            data
          </p>
          <Pagination
            boundaryCount={siblings}
            count={data?.results?.total_pages}
            onChange={(event, page) => {
              setPage(page)
              scrollTo(0, 0)
            }}
            shape="rounded"
            size="large"
            page={data?.results?.current_page}
          />
        </div>
      )}
    </div>
  )
}
