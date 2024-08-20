import React, { useEffect, useState } from 'react'
import Switch from '@mui/material/Switch'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import axios from '../../../utils/axios'

export default function UserPreference() {
  useEffect(() => {
    getCurrentStatus()
  }, [])

  const [currentstatus, setCurrentstatus] = useState(null)

  //get user current update status
  const getCurrentStatus = async () => {
    try {
      const res = await axios.get(`api/notification/all_alert/`)
      //console.log(res);
      if (res?.status == 200) {
        setCurrentstatus(res?.data)
      }
    } catch (error) {
      //console.log(error);
    }
  }

  //update status
  const updateStatus = async url => {
    try {
      const res = await axios.put(`${url}`)
      //console.log("ressadsda",res);
      getCurrentStatus()
    } catch (error) {}
  }

  return (
    <div>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">User Accesablity</h5>
      <p className="text-gray-500 mt-3">Manage account accesablity from below:.</p>

      <div className="mt-10 bg-white rounded-xl p-5 lg:p-10">
        <h5 className="text-lg md:text-xl lg:text-2xl font-bold ">Notification Shortcuts</h5>

        <div className="mt-5 flex gap-4 lg:gap-8 flex-wrap">
          <FormControlLabel
            value="end"
            control={
              <Switch
                color="primary"
                checked={currentstatus?.video_ready_alert}
                onChange={() => {
                  updateStatus('/api/notification/action_ready_video/')
                }}
              />
            }
            label="Video Ready Alert"
            labelPlacement="end"
          />
          <FormControlLabel
            value="end"
            control={
              <Switch
                color="primary"
                checked={currentstatus?.sms_alert}
                onChange={() => {
                  updateStatus('/api/notification/action_sms_aleart/')
                }}
              />
            }
            label="Sms Alert"
            labelPlacement="end"
          />
          <FormControlLabel
            value="end"
            control={
              <Switch
                color="primary"
                checked={currentstatus?.offer_alert}
                onChange={() => {
                  updateStatus('/api/notification/action_send_offer/')
                }}
              />
            }
            label="Offer Alert"
            labelPlacement="end"
          />

          {/* 
          <FormControlLabel
            value="end"
            control={
              <Switch color="primary" checked={currentstatus?.ai_document_ready_alert}      onChange={()=>{updateStatus('/api/notification/ai_docs_ready/')}}/>
            }
       
            label="AI Document"
            labelPlacement="end"
          />
          <FormControlLabel
            value="end"
            control={
              <Switch color="primary" checked={currentstatus?.blog_post_alert}  onChange={()=>{updateStatus('/api/notification/action_blog_post/')}} />
            }
           
            label="Blog Post Aleart"
            labelPlacement="end"
          /> */}
        </div>
      </div>
    </div>
  )
}
