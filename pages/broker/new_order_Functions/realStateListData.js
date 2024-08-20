import axios from 'axios';
import { toast } from 'react-toastify';

const realStateListData = async (User, setRetailorData, myurl) => {
  const options = {
    method: "GET",
    url: "https://us-real-estate-listings.p.rapidapi.com/agent/listings",
    params: {
      profile_url: User?.UserData?.realtor_profile_url || myurl,
    },
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKeyRealstate,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHostRealState,
    },
  };

  try {
    const response = await axios.request(options);
    const list = response?.data?.listings?.data;
    const { openHouses, forRent, forSale, forSold } = list;
    const combinedResults = [
      ...(openHouses.results ? Object.values(openHouses.results) : []),
      ...(forRent.results ? Object.values(forRent.results) : []),
      ...(forSale.results ? Object.values(forSale.results) : []),
      ...(forSold?.results ? Object.values(forSold.results) : []),
    ];
    setRetailorData(combinedResults);
  } catch (error) {
    console.error("Retailor", error);
    toast.error("Invalid property URL.",{toastId:5});
  }
};

export default realStateListData;
