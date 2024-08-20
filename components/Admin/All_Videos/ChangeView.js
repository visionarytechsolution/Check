import { Button, IconButton } from '@mui/material'
import React from 'react'
import WindowIcon from '@mui/icons-material/Window'
import TableRowsIcon from '@mui/icons-material/TableRows'

export default function ChangeView({ view, setView }) {
  return (
    <div className="mt-10 flex justify-end gap-2">
      <Button
        className={`${view == 'table' && 'bg-white'} hover:bg-white`}
        onClick={() => setView('table')}
      >
        <TableRowsIcon />
      </Button>

      <Button
        className={`${view == 'card' && 'bg-white'} hover:bg-white `}
        onClick={() => setView('card')}
      >
        <WindowIcon />
      </Button>
    </div>
  )
}
