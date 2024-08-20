import React from 'react'

export async function dateConverter(datedata) {
  const dateString = datedata
  const date = new Date(dateString)

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  const formattedDate = date.toLocaleString('en-US', options)
  //console.log(formattedDate);
  return formattedDate
}
