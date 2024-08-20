import axios from 'axios';

const singleRetailorProperty = async (myurl, setSelectedRetailor2) => {
  const options = {
    method: "GET",
    url: "https://us-real-estate-listings.p.rapidapi.com/v2/property",
    params: {
      property_url: myurl,
    },
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKeyRealstate,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHostRealState,
    },
  };

  try {
    const response = await axios.request(options);
    console.log("asdasda", response);
    console.log(response.data.data);
    const newData = response.data.data;
    setSelectedRetailor2(newData);
  } catch (error) {
    console.error(error);
  }
};

export default singleRetailorProperty;
