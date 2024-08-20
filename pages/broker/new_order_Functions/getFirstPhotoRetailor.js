import axios from 'axios';

const getFirstPhotoRetailor = async (extractedPattern, selectedRetailor, setFirstphoto) => {
  const options = {
    method: "GET",

    url: "https://us-real-estate-listings.p.rapidapi.com/propertyPhotos",
    params: {
      property_url: `https://www.realtor.com/realestateandhomes-detail/${
        extractedPattern || selectedRetailor?.permalink
      }`,
    },
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKeyRealstate,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHostRealState,
    },
  };

  try {
    const response = await axios.request(options);
    console.log("photo response ", response);
    setFirstphoto(response?.data?.photos[0]?.href);
  } catch (error) {
    console.error("photo response", error);
  }
};

export default getFirstPhotoRetailor;
