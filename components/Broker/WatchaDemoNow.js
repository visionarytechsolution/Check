import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function BasicAccordion() {
  return (
    <div className="flex justify-center">
      <div className="lg:w-1/2 w-full">
        <Accordion className="bg-primary2">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <p className="text-center text-white font-bold w-full lg:text-lg">Watch Demo Now</p>
          </AccordionSummary>
          <AccordionDetails>
            <iframe
              className="w-full aspect-video  "
              src="https://www.youtube.com/embed/TZBa13i2UvQ"
            ></iframe>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}
