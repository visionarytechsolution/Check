import axios from 'axios';

const getImage = async (zpid, setFirstphoto) => {
  const options = {
    method: "GET",
    url: "https://zillow-com1.p.rapidapi.com/images",
    params: { zpid: zpid },
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKey,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHost,
    },
  };

  try {
    const response = await axios.request(options);
    setFirstphoto(response.data.images[0]);
    console.log("response",response)
  } catch (error) {
    setFirstphoto(null);
    console.error(error);
  }
};

export default getImage;
