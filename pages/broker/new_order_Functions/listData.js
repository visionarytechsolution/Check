import axios from 'axios';

const listData = async (setCount, setTotalPages, setCurrentPage, setAllListData, router, currentPage, User) => {
  const options = {
    method: "GET",
    url: "https://zillow-com1.p.rapidapi.com/agentActiveListings",
    params: {
      zuid: User?.UserData?.zuid,
      page: currentPage.toString(),
    },
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKey,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHost,
    },
  };

  try {
    const response = await axios.request(options);
    setCount(response?.data?.listing_count);
    const totalPages = Math.ceil(response.data.listing_count / 10);
    setTotalPages(totalPages);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAllListData((prevListData) => {
      if (
        response &&
        response.data &&
        Array.isArray(response.data.listings)
      ) {
        const newListingIds = response.data.listings.map(
          (listing) => listing.zpid
        );
        const uniqueListings = prevListData.filter(
          (listing) => !newListingIds.includes(listing.zpid)
        );
        const selectedAddress = uniqueListings.find(
          (data) => data?.zpid === router.query.id
        );
        return [...uniqueListings, ...response.data.listings];
      } else {
        return prevListData;
      }
    });

    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  } catch (error) {
    console.error(error);
  }
};

export default listData;
