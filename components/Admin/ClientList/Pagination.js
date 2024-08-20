import React, { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useWindowSize from '../../../hooks/useWindowSize'
export default function PaginationDetails({ profiles, setPage }) {
  const router = useRouter()

  const [siblings, setSiblings] = useState(1)
  const windowSize = useWindowSize()

  useEffect(() => {
    if (windowSize?.width < 450) {
      setSiblings(5)
    } else if (windowSize?.width < 720) {
      setSiblings(1)
    } else {
      setSiblings(3)
    }
  }, [windowSize])

  const handlePaginationChange = (event, page) => {
    setPage(page)
    window.scroll(0, 0)
  }

  return (
    <>
      {profiles?.count > 0 && (
        <div className="bg-white rounded-b-xl p-5 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-4  ">
            <p className="text-sm">
              Showing {profiles?.results?.current_page}-{profiles?.results?.total_pages} from{' '}
              {profiles?.count} members
            </p>
            <Pagination
              onChange={handlePaginationChange}
              boundaryCount={siblings}
              count={profiles?.results?.total_pages}
              shape="rounded"
              size="large"
              page={profiles?.results?.current_page}
            />
          </div>
        </div>
      )}
    </>
  )
}
