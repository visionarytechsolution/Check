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
  videoTitle: Yup.string().required('Video Title is required'),

  video: Yup.mixed().test('fileType', 'Video must be a .mp4 file', value => {
    if (value) {
      return value && value.type === 'video/mp4'
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
    formData.append('video_title', values.videoTitle)
    if (values?.subtitle !== null) {
      formData.append('subtitle', values.subtitle)
    }
    formData.append('video_file', values.video)

    try {
      const response = await axios.put(
        `/api/order_delivery/order_delivery/${item?._id}/`,
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
        toast.success(data?.message)
        settrigger(Math.floor(Math.random() * 9000000) + 1000000)
        handleClose()
      }
    } catch (error) {
      error?.response?.data?.forEach(error => {
        toast.error(error.error)
      })
      setIsLoading(false)

      //console.log("error from upload video", error);
    }
  }

  const formik = useFormik({
    initialValues: {
      videoTitle: '',
      subtitle: null,
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
            <TextField
              size="small"
              id="videoTitle"
              name="videoTitle"
              label="Video Title"
              variant="outlined"
              value={formik.values.videoTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.videoTitle && Boolean(formik.errors.videoTitle)}
              helperText={formik.touched.videoTitle && formik.errors.videoTitle}
            />

            <MuiFileInput
              id="subtitle"
              name="subtitle"
              value={formik.values.subtitle}
              onChange={newValue => {
                formik.setFieldValue('subtitle', newValue)
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.subtitle && Boolean(formik.errors.subtitle)}
              helperText={formik.touched.subtitle && formik.errors.subtitle}
              inputProps={{
                accept: '.srt',
              }}
              className="w-full"
              label="Upload Subtitle"
              size="small"
            />

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
