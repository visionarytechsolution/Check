import { Button, IconButton } from '@mui/material'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { MuiFileInput } from 'mui-file-input'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from '../../../utils/axios'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'

const validationSchema = Yup.object().shape({
  video: Yup.mixed()
    .test('fileType', 'Video must be a .mp4 file', value => {
      if (value) {
        return value.type === 'video/mp4'
      }
      return true
    })
    .test('fileSize', 'Video size must not exceed 250MB', value => {
      if (value) {
        return value.size <= 250 * 1024 * 1024 // Convert MB to bytes
      }
      return true
    }),
})

export default function ModalForSubmit({ handleClose, item, settrigger }) {
  const [isLoading, setIsLoading] = useState(false)
  const [progresss, setProgresss] = useState(0)
  //submit video
  const SubmitWork = async values => {
    setIsLoading(true)

    const formData = new FormData()

    formData.append('video_file', values.video)

    try {
      const response = await axios.put(
        `/api/order_delivery/review_order_delivery/${item?.order?._id}/`,
        formData,
        {
          onUploadProgress: progressEvent => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            setProgresss(progress)
            //console.log("Upload progress: " + progress + "%");
            // You can update a progress state variable or perform other actions here
          },
        },
      )
      //console.log("response from accept", response);
      setIsLoading(false)

      const { status, data } = response
      if (status == 200) {
        // toast.success(data?.message);
        toast.success('Submitted Successfully')
        settrigger(Math.floor(Math.random() * 9000000) + 1000000)
        handleClose()
      }
    } catch (error) {
      setIsLoading(false)

      //console.log("error from upload video", error);
    }
  }

  const formik = useFormik({
    initialValues: {
      video: null,
    },
    validationSchema,
    onSubmit: values => {
      //console.log("Form Values:", values);
      SubmitWork(values)
    },
  })

  return (
    <>
      <div className="absolute top-1/2 left-1/2 rounded-xl overflow-hidden -translate-x-1/2 -translate-y-1/2 lg:w-[50vw] w-[90vw] bg-white">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-between px-5 py-2 items-center bg-primary">
            <span className="text-white font-bold">Upload&nbsp;Video</span>
            <IconButton>
              <CloseIcon className="text-white" onClick={handleClose} />
            </IconButton>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <MuiFileInput
              id="video"
              name="video"
              inputProps={{
                accept: '.mp4',
              }}
              value={formik.values.video}
              onChange={newValue => {
                formik.setFieldValue('video', newValue)
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.video && Boolean(formik.errors.video)}
              helperText={formik.touched.video && formik.errors.video}
              className="w-full"
              label="Upload Video"
              size="small"
            />

            <Button disabled={isLoading} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="h-screen w-screen fixed flex flex-col justify-center items-center z-40 bg-black/70">
          <CircularProgress />
          <small className="mt-3 text-white font-bold">Uploading {progresss}%</small>
        </div>
      )}
    </>
  )
}
