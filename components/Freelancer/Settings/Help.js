import { Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import axios from '../../../utils/axios'
import { toast } from 'react-toastify'

export default function Help() {
  const initialValues = {
    subject: '',
    description: '',
    file: null,
  }

  const uploadQuery = async values => {
    const loading = toast.loading('Please wait a moment.')

    const formData = new FormData()

    //console.log(values.subject,values.description)

    formData.append('subject', values.subject)
    formData.append('description', values.description)
    if (values.file?.size > 0) {
      formData.append('help_file', values.file)
    }

    try {
      const res = await axios.post(`/api/notification/help_mail/`, FormData)
      toast.dismiss(loading)
      if (res?.status == 200) {
        toast.success('Enquery Stored Successfully.')
      }
      //console.log("response",res);
    } catch (error) {
      toast.dismiss(loading)
      //console.log("error",error)
      toast.error(error?.response?.data?.detail)
    }
  }

  const onSubmit = (values, { resetForm }) => {
    uploadQuery(values) // Log the form values
    resetForm() // Reset the form after submitting
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate: values => {
      const errors = {}

      // Add your validation logic here

      return errors
    },
  })

  return (
    <div>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold">
        Feel free to contact us at anytime.
      </h5>

      <form onSubmit={formik.handleSubmit}>
        <div className="mt-10 rounded-xl bg-white  lg:p-10 p-5 flex flex-col gap-4">
          <TextField
            id="subject"
            name="subject"
            label="Subject"
            required
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.subject}
            error={formik.touched.subject && formik.errors.subject}
            helperText={formik.touched.subject && formik.errors.subject}
          />

          <TextField
            id="description"
            name="description"
            label="Description"
            required
            multiline
            rows={4}
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            error={formik.touched.description && formik.errors.description}
            helperText={formik.touched.description && formik.errors.description}
          />

          <div className="flex flex-col gap-2 border p-2 rounded border-gray-300">
            <input
              type="file"
              accept="image/*"
              id="file"
              name="file"
              onChange={event => formik.setFieldValue('file', event.target.files[0])}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="capitalize bg-primary2 rounded-2xl hover:bg-primary text-white lg:text-lg md:text-base   w-full  lg:w-80  font-bold"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
