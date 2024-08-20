import Image from "next/image";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "../../../../utils/axios";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1400 },
    items: 5,
    slidesToSlide: 2, // optional, default to 1.
  },
  lg: {
    breakpoint: { max: 1400, min: 1024 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  lgmobile: {
    breakpoint: { max: 767, min: 500 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 500, min: 200 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};
const ActiveListingsList = ({ setHaveData }) => {
  //get all listings
  const User = useSelector((state) => state.User?.UserData);
  const Price = useSelector((state) => state.Price);
  const router = useRouter();

  console.log("user", User);

  const [totalPages, setTotalPages] = useState(0);
  const [allListData, setAllListData] = useState([]);
  const [allListData2, setAllListData2] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isManual, setIsManual] = useState(false);
  console.log("All-list data", allListData);
  console.log("All-list-data2", allListData2);

  useEffect(() => {
    if (User?.zuid) {
      listData();
    }
  }, [currentPage, User]);

  useEffect(() => {
    if (User?.realtor_profile_url) {
      realStateListData();
    }
  }, [User]);

  useEffect(() => {
    if (allListData?.length > 0 || allListData2?.length > 0) {
      setHaveData(false);
    }
  }, [allListData, allListData2]);

  const listData = async () => {
    const options = {
      method: "GET",
      url: "https://zillow-com1.p.rapidapi.com/agentActiveListings",
      params: {
        zuid: User?.zuid,
        page: currentPage.toString(),
      },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKey,
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHost,
      },
    };

    try {
      const response = await axios.request(options);
      //console.log("response asdasd", response);
      const totalPages = Math.ceil(response?.data?.listing_count / 10);
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
          const uniqueListings = prevListData?.filter(
            (listing) => !newListingIds?.includes(listing?.zpid)
          );
          console.log("uniqueListings", uniqueListings);
          return [...uniqueListings, ...response.data.listings];
        } else {
          // Handle the case where response, response.data, or response.data.listings is undefined
          // For example, you could return prevListData or an empty array
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

  const realStateListData = async () => {
    const options = {
      method: "GET",
      url: "https://us-real-estate-listings.p.rapidapi.com/agent/listings",
      params: {
        profile_url: User?.realtor_profile_url,
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
      //console.log("combinedResults", combinedResults);
      setAllListData2(combinedResults);
    } catch (error) {
      console.error("Retailor", error);
    }
  };
  //Uset type from session storage
  const userType = sessionStorage.getItem("type");
  //Manual listing functon
  const handleManual = () => {
    setAllListData([]);
    setAllListData2([]);
    // setIsManual(true);
    router.push(`/process/placeOrder?IsManualSelect=${true}`)
  };

  return (
    <>
      {allListData?.length > 0 && (
        <div className="mt-10">
          <div class="flex items-center">
            <h2 class="w-full text-lg md:text-xl lg:text-2xl font-bold text-black block">
              Active Listings
            </h2>

            <div style={{ whiteSpace: "nowrap" }}>
              <Button
                variant="contained"
                className="bg-primary2 hover:bg-primary font-bold capitalize text-white"
                onClick={handleManual}
              >
                Dont see your property? click here
              </Button>
            </div>
          </div>

          <div className=" bg-white p-5 rounded-xl mt-5">
            <div className="w-full flex flex-col  justify-between items-center gap-5"></div>
            <div className="w-full  ">
              <Carousel
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={3000}
                swipeable={true}
                draggable={true}
                showDots={true}
                infinite={true}
                partialVisible={false}
                containerClass="h-fit pb-10"
                dotListClassName="custom-dot-list-style"
                customLeftArrow={<span className=""></span>}
                customRightArrow={<span></span>}
              >
                {allListData?.length > 0 &&
                  allListData?.map((item, index) => {
                    return (
                      <div
                        className="flex items-center h-full mx-0 lg:mx-5"
                        key={index}
                      >
                        <Card item={item} />
                      </div>
                    );
                  })}
              </Carousel>
            </div>
          </div>
        </div>
      )}

      {allListData2?.length > 0 && (
        <div className="mt-10">
          <div class="flex items-center">
            <h2 class="w-full text-lg md:text-xl lg:text-2xl font-bold text-black block">
              Active Listings
            </h2>
            {/* {!allListData2?.length > 0 &&
              allListData?.length >
                0( */}
            <div style={{ whiteSpace: "nowrap" }}>
              <Button
                variant="contained"
                className="bg-primary2 hover:bg-primary font-bold capitalize text-white"
                onClick={handleManual}
              >
                Dont see your property? click here
              </Button>
            </div>

            {/* )} */}
          </div>
          <div className=" bg-white p-5 rounded-xl mt-5">
            <div className="w-full flex flex-col  justify-between items-center gap-5"></div>
            <div className="w-full  ">
              <Carousel
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={3000}
                swipeable={true}
                draggable={true}
                showDots={true}
                infinite={true}
                partialVisible={false}
                containerClass="h-fit pb-10"
                dotListClassName="custom-dot-list-style"
                customLeftArrow={<span className=""></span>}
                customRightArrow={<span></span>}
              >
                {allListData2?.length > 0 &&
                  allListData2?.map((item, index) => {
                    return (
                      <div
                        className="flex items-center h-full mx-0 lg:mx-5"
                        key={index}
                      >
                        <Card item={item} />
                      </div>
                    );
                  })}
              </Carousel>
            </div>
          </div>
        </div>
      )}
      {isManual && (
        <>
          <div className="my-10 p-5 bg-white rounded-xl text-center">
            <p className="my-3 capitalize lg:text-2xl md:text-xl text-lg font-bold text-center">
              Create your Order By clicking the button below:
            </p>
            <iframe
              className="w-full aspect-video lg:w-1/2 mx-auto my-5  "
              src="https://www.youtube.com/embed/TZBa13i2UvQ"
            ></iframe>
            <Link
              href={`/broker/new_order?manual=${1}`}
              className="flex justify-center"
            >
              <Button
                className=" w-full lg:w-1/2 lg:text-lg bg-primary2 hover:bg-primary text-white font-bold lg:py-2"
                variant="contained"
              >
                Convert property to video ${Price?.PriceData?.amount} &nbsp;
                {Price?.PriceData?.amount < 69 && (
                  <span className="line-through text-red-700 text-2xl">69</span>
                )}
              </Button>
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default ActiveListingsList;
