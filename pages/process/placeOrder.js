import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LayoutBroker from "../../components/Layout/LayoutBroker";
import listData from "../../pages/broker/new_order_Functions/listData";
import realStateListData from "../../pages/broker/new_order_Functions/realStateListData";
import axios from "../../utils/axios";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import singleRetailorProperty from "../broker/new_order_Functions/singleRetailorProperty";
import getFirstPhotoRetailor from "../broker/new_order_Functions/getFirstPhotoRetailor";

const placeOrder = () => {
  const [selectedOption, setSelectedOption] = useState("option1");
  const [allListData, setAllListData] = useState([]);
  const User = useSelector((state) => state.User);
  const router = useRouter();
  const [retailorData, setRetailorData] = useState([]);
  const [count, setCount] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const retailorPropertyID = router.query.retailor;
  const [addressSelect, setAddressSelect] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [firstphoto, setFirstphoto] = useState(null);
  const [selectedRetailor, setSelectedRetailor] = useState(null);
  const [selectedRetailor2, setSelectedRetailor2] = useState(null);
  const Price = useSelector((state) => state.Price);
  const [payData, setPayData] = useState(false);
  const [realtorAddress, setRealtorAddress] = useState(null);
  const [realtorImage, setRealtorImage] = useState();
  const [myurl, setMyUrl] = useState("");
  const [urlType, setUrlType] = useState("zillow");
  const [retailorUrlPattern, setRetailorUrlPattern] = useState(null);
  const [singleZillowData, setSingleZillowData] = useState();
  const [manualSelect, setManualSelect] = useState(false);
  const [isSearchable, setIsSearchable] = useState(false);
  console.log("User", User);
  console.log("retailorPropertyID", retailorPropertyID);
  useEffect(() => {
    if (User?.UserData?.realtor_profile_url) {
      realStateListData(User, setRetailorData);
    }
  }, []);
  console.log("retailorData", retailorData);
  console.log("allListData", allListData);
  const [zipAddress, setZipAddress] = useState(null);
  const [rtAddress, setRtAddress] = useState(null);

  // Get user data
  useEffect(() => {
    if (User?.UserData?.zuid) {
      listData(
        setCount,
        setTotalPages,
        setCurrentPage,
        setAllListData,
        router,
        currentPage,
        User
      );
    }
  }, [currentPage, User]);

  useEffect(() => {
    const selectedValue = router.query.id;
    const selectedAddress = allListData.find(
      (data) => data?.zpid === parseInt(selectedValue)
    );
    if (selectedAddress?.zpid) {
      setSelectedAddress(selectedAddress);
      setAddressSelect(selectedAddress?.zpid);
      if (firstphoto == null) {
        getImage(selectedAddress?.zpid);
      }
    }
  }, [allListData, router.query.id]);

  useEffect(() => {
    const matchingItem =
      retailorData?.length > 0 &&
      retailorData.find((item) => item.permalink === retailorPropertyID);
    if (matchingItem) {
      setSelectedRetailor(matchingItem);
    }
  }, [retailorData, retailorPropertyID]);

  const getImage = async (zpid) => {
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
    } catch (error) {
      setFirstphoto(null);
      console.error(error);
    }
  };

  //Formik start
  const createInitialValues = {
    client_name: "",
    ai_gender: "",
    subtitle: null,
    language: "",
    url: "",
    assistant: null,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [submittedValues, setSubmittedvalues] = useState(null);
  const formik = useFormik({
    initialValues: createInitialValues,
    onSubmit: async (values) => {
      setSubmittedvalues(values);
      createOrder(values);
    },
    enableReinitialize: true,
  });

  const createOrder = async (values) => {
    //   console.log("addressSelect", addressSelect);
    // console.log("rtAddress", rtAddress);
    if (
      !addressSelect &&
      !rtAddress &&
      !selectedRetailor2?.location?.address?.line
    ) {
      return toast.error("Please Select Address");
    }
    if (User?.UserData?.is_demo == true) {
      createOrder2({ values });
    } else if (User?.UserData?.profile?.payment_info !== null) {
      const addressInfo = {
        address: {
          line1: selectedRetailor?.location?.address?.line,
          state: selectedRetailor?.location?.address?.state,
          postcode: selectedRetailor?.location?.address?.postal_code,
          city: selectedRetailor?.location?.address?.city,
        },
      };
      const primaryPhotoUrl = {
        photo: selectedRetailor?.primary_photo?.href,
      };
      setRealtorImage(primaryPhotoUrl);
      setRealtorAddress(addressInfo);
      const customizedUrl = selectedRetailor2?.href.split(
        "https://www.realtor.com/realestateandhomes-detail/"
      );
      const extractedValue = customizedUrl?.[1];
      router.push({
        pathname: "/process/payment",
        query: {
          summary: 1,
          subtitle: values?.subtitle,
          assistant_type: values?.ai_gender,
          video_language: values?.language,
          assistant: values?.assistant,
          zipAddress: zipAddress || addressSelect,
          rtAddress: rtAddress || retailorUrlPattern,
          line:
            selectedRetailor2?.location?.address?.line ||
            selectedAddress?.address?.line1,
          state:
            selectedRetailor2?.location?.address?.state ||
            selectedAddress?.address?.stateOrProvince,
          postCode:
            selectedRetailor2?.location?.address?.postal_code ||
            selectedAddress?.address?.postalCode,
          city:
            selectedRetailor2?.location?.address?.city ||
            selectedAddress?.address?.city,
          image: selectedAddress?.primary_photo_url || firstphoto,
          url: urlType == "zillow" ? singleZillowData?.url : extractedValue,
          zipData: singleZillowData?.zpid,
        },
      });

      sessionStorage.setItem("realtorAddress", JSON.stringify(realtorAddress));
      sessionStorage.setItem("realtorImage", JSON.stringify(primaryPhotoUrl));
      sessionStorage.setItem(
        "bed",
        JSON.stringify(
          selectedRetailor2?.description?.beds || singleZillowData?.bedrooms
        )
      );
      sessionStorage.setItem(
        "bath",
        JSON.stringify(
          selectedRetailor2?.description?.baths || singleZillowData?.bathrooms
        )
      );
      sessionStorage.setItem(
        "sqfit",
        JSON.stringify(
          selectedRetailor2?.description?.sqft ||
            singleZillowData?.livingAreaValue
        )
      );
    } else {
      const addressInfo = {
        address: {
          line1: selectedRetailor?.location?.address?.line,
          state: selectedRetailor?.location?.address?.state,
          postcode: selectedRetailor?.location?.address?.postal_code,
          city: selectedRetailor?.location?.address?.city,
        },
      };
      const primaryPhotoUrl = {
        photo: selectedRetailor?.primary_photo?.href,
      };
      setRealtorImage(primaryPhotoUrl);
      setRealtorAddress(addressInfo);
      createPayInt(values);
    }
  };
  const createPayInt = async ({ values }) => {
    const loading = toast.loading("Please wait a moment.");
    try {
      const res = await axios.post(`/api/order/payment_create/`);
      setPayData(res?.data);
      sessionStorage.setItem(
        "bed",
        JSON.stringify(
          selectedRetailor2?.description?.beds || singleZillowData?.bedrooms
        )
      );
      sessionStorage.setItem(
        "bath",
        JSON.stringify(
          selectedRetailor2?.description?.baths || singleZillowData?.bathrooms
        )
      );
      sessionStorage.setItem(
        "sqfit",
        JSON.stringify(
          selectedRetailor2?.description?.sqft ||
            singleZillowData?.livingAreaValue
        )
      );
      const customizedUrl = selectedRetailor2?.href.split(
        "https://www.realtor.com/realestateandhomes-detail/"
      );
      const extractedValue = customizedUrl?.[1];
      router.push({
        pathname: "/process/payment",
        query: {
          cs: res?.data?.clientSecret,
          pk: res?.data?.publishable_key,
          zipAddress: zipAddress || addressSelect,
          rtAddress: rtAddress || retailorUrlPattern,
          subtitle: formik.values?.subtitle,
          assistant_type: formik.values?.ai_gender,
          video_language: formik.values?.language,
          assistant: formik.values?.assistant,
          line:
            selectedRetailor2?.location?.address?.line ||
            selectedAddress?.address?.line1,
          state:
            selectedRetailor2?.location?.address?.state ||
            selectedAddress?.address?.stateOrProvince,
          postCode:
            selectedRetailor2?.location?.address?.postal_code ||
            selectedAddress?.address?.postalCode,
          city:
            selectedRetailor2?.location?.address?.city ||
            selectedAddress?.address?.city,
          image: selectedAddress?.primary_photo_url || firstphoto,
          url: urlType == "zillow" ? singleZillowData?.url : extractedValue,
          zipData: singleZillowData?.zpid,
        },
      });
      toast.dismiss(loading);
    } catch {
      toast.dismiss(loading);
    }
  };
  console.log("formik.values", formik.values);
  const [isManual, setIsManual] = useState(false);
  const handleManual = () => {
    console.log("hit the function");
    setIsManual(true);
  };
  const [isProperty, setIsProperty] = useState(false);
  const handleProperty = () => {
    console.log("hit the function");
    setIsProperty(true);
  };

  const [isSingleProperty, setIsSingleProperty] = useState(false);
  //Get Single Property
  const getSingleDetails = async () => {
    setIsSearchable(true);
    setManualSelect(false);
    const extractNumberFromUrl = (myurl) => {
      const regex = /\/(\d+)_zpid/;
      const match = myurl.match(regex);
      return match ? match[1] : null;
    };
    const number = extractNumberFromUrl(myurl);
    const options = {
      method: "GET",
      url: "https://zillow-com1.p.rapidapi.com/property",
      params: { zpid: number },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKey,
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHost,
      },
    };

    try {
      const response = await axios.request(options);
      console.log("Response->Data", response?.data);
      if (response?.data?.zpid) {
        const data2 = {
          address: {
            line1: response?.data?.address?.streetAddress,
            line2: "null",
            stateOrProvince: response?.data?.address?.state,
            postalCode: response?.data?.address?.zipcode,
            city: response?.data?.address?.city,
          },
          primary_photo_url: response?.data?.imgSrc,
          zpid: response?.data?.zpid,
          listing_url: response?.data?.url,
        };
        setSingleZillowData(response?.data);
        setIsSingleProperty(true);
        setIsProperty(false);
        const datalist = allListData;
        datalist[datalist.length] = data2;
        setAllListData(datalist);
        setSelectedAddress(data2);
        setAddressSelect(data2?.zpid);
        getImage(data2?.zpid);
        toast.success("Property Found. ");
      } else {
        toast.error("Property Not Found . Please use corrent url.");
      }
    } catch (error) {
      toast.error("Property Not Found. ");
      console.error(error);
    }
  };

  const getSingleDetails2 = async () => {
    setIsSearchable(true);
    setManualSelect(false);
    setIsSingleProperty(true);
    setIsProperty(false);
    singleRetailorProperty(myurl, setSelectedRetailor2);
  };

  useEffect(() => {
    if (selectedRetailor?.permalink) {
      getFirstPhotoRetailor(selectedRetailor, setFirstphoto);
    }
    if (selectedRetailor2) {
      const pattern = myurl.match(/\/([^/?]+)(?=\?|$)/);
      const extractedPattern = pattern ? pattern[1] : "";
      console.log("myurl", myurl);
      setRetailorUrlPattern(extractedPattern);
      getFirstPhotoRetailor(extractedPattern, selectedRetailor, setFirstphoto);
    }
  }, [selectedRetailor, selectedRetailor2]);
  console.log("selectedRetailor", selectedRetailor);
  console.log("Selected retailor2", selectedRetailor2);
  console.log("selectedAddress", selectedAddress);
  console.log("firstphoto", firstphoto);
  //Dropdown values
  console.log("addressSelect", addressSelect);
  console.log("rtAddress", rtAddress);
  console.log("singleZillowData", singleZillowData);
  // const customizedUrl = selectedRetailor2?.href.split("https://www.realtor.com/realestateandhomes-detail/");
  // console.log("customizedUrl",customizedUrl)

  const queryParams = new URLSearchParams(window.location.search);
  // const IsManualSelect = queryParams.get("IsManualSelect");

  useEffect(() => {
    const IsManualSelect = queryParams.get("IsManualSelect");
    if (!isSearchable && IsManualSelect == "true") {
      setManualSelect(true);
    }
  }, [queryParams]);

  console.log("manualSelect", manualSelect);
  console.log("myUrl", myurl);
  console.log("singleZillowData", singleZillowData);
  return (
    <LayoutBroker active="process">
      <div className="bg-gray-100 h-screen items-center justify-center">
        <div className="mt-5">
          <div className="flex flex-col justify-center items-center">
            <div className="text-center mb-4">
              <h1 className="text-xl lg:text-3xl font-bold mb-2">
                Place an order now
              </h1>
              <p className="text-sm lg:text-base text-[#6F6C90] lg:flex lg:flex-wrap">
                Our services come with a 100% Satisfaction Guarantee. If the
                video does not meet the quality standards of our demo video,
                even after some revisions, we will provide a full refund.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4 lg:px-20 mt-4 lg:mt-8 mb-4 lg:mb-8">
              <div className="sm:col-span-1 md:col-span-2 lg:col-span-2 ml-0 md:ml-0 lg:ml-5">
                <div className="bg-white shadow-lg p-3 rounded-3xl">
                  <div className="pl-8">
                    <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
                      <li className="mb-6 lg:mb-10 lg:ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white">
                          <svg
                            className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                        </span>
                        <h3 className="font-medium leading-tight text-base lg:text-lg">
                          Watch demo template video
                        </h3>
                        <p className="text-xs lg:text-sm">
                          Please watch an example of the video we are creating
                          for our client
                        </p>
                      </li>
                      <li className="mb-6 lg:mb-10 lg:ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white">
                          <svg
                            className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                        </span>
                        <h3 className="font-medium leading-tight text-base lg:text-lg">
                          Place an order now
                        </h3>
                        <p className="text-xs lg:text-sm">
                          Let's turn your property listing into a captivating
                          interactive video
                        </p>
                      </li>
                      <li className="mb-6 lg:mb-10 lg:ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white">
                          <svg
                            className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                        </span>
                        <h3 className="font-medium leading-tight text-base lg:text-lg">
                          Payment process
                        </h3>
                        <p className="text-xs lg:text-sm">
                          Process the payment through our secure merchant
                        </p>
                      </li>
                      <li className="lg:ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white">
                          <svg
                            className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 20"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                        </span>
                        <h3 className="font-medium leading-tight text-base lg:text-lg">
                          Revision of your order
                        </h3>
                        <p className="text-xs lg:text-sm">
                          Please confirm all information is correct
                        </p>
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="bg-[#98CFB2] ml-0 shadow-lg p-3 rounded-xl mt-2">
                  <div className="text-base lg:text-lg font-bold pl-4 text-white">
                    You have questions?
                  </div>
                  <div className="text-base lg:text-lg font-bold pl-4 text-white">
                    Talk with our Agents.
                  </div>
                  <div className="mt-3 ml-2">
                    <a
                      className="bg-white px-3 pl-4 py-2 mt-5 rounded-lg transition duration-300 text-sm "
                      href="https://calendly.com/jmartin-realvision/realvision-media-demo?month=2023-09"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book a 10 minutes call
                    </a>
                  </div>
                </div>
              </div>
              {/* Stepper End */}
              {/* Form start from here */}
              <form onSubmit={formik.handleSubmit}>
                <div className="col-span-4 bg-white shadow-lg px-4 lg:px-6 rounded-3xl w-full lg:w-[870px]">
                  {!manualSelect &&
                    ((!isProperty && allListData?.length > 0) ||
                      retailorData?.length > 0) && (
                      <h1 className="text-lg pt-5 lg:text-xl font-semibold text-center">
                        Your Active Listing
                      </h1>
                    )}
                  {isProperty && (
                    <div>
                      <h1 className="text-lg pt-5 lg:text-xl font-semibold">
                        Please copy paste the url of your listing property
                      </h1>
                      <h1 className="text-sm">
                        Please choose the providor where your listing property
                        is published
                      </h1>
                    </div>
                  )}
                  {/* IFram */}
                  {!isSingleProperty && !isProperty && isManual && (
                    <div className="my-5 p-2 bg-white w-full">
                      <p className="my-3 text-2xl lg:text-2xl font-bold text-center">
                        Create Your Order by Clicking the Button Below:
                      </p>
                      <div className="mx-auto my-5">
                        <iframe
                          className="w-full h-96 rounded-lg"
                          src="https://www.youtube.com/embed/TZBa13i2UvQ"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="flex justify-center">
                        <Button
                          className="w-full lg:w-1/2 lg:text-lg bg-primary2 hover:bg-primary text-white font-bold py-3 lg:py-2 rounded-lg"
                          variant="contained"
                          onClick={handleProperty}
                        >
                          Convert Property to Video ${Price?.PriceData?.amount}{" "}
                          &nbsp;
                          {Price?.PriceData?.amount < 69 && (
                            <span className="line-through text-red-700 text-2xl">
                              69
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Iframe End */}
                  {/* Zillow or Retailor */}
                  {allListData?.length === 0 &&
                    retailorData?.length === 0 &&
                    !isSingleProperty && (
                      <div className=" p-2 bg-white w-full mx-auto">
                        <div className="rounded-2xl p-5 bg-[#98CFB2] mt-2 lg:mt-10 w-full lg:w-full">
                          <h2 className="lg:text-2xl md:text-xl text-lg font-bold text-center text-white mb-5">
                            Please choose where the property is currently
                            published?
                          </h2>
                          <div className="flex md:flex-row flex-col items-center md:justify-center gap-5">
                            <div
                              className={`${
                                urlType == "zillow" &&
                                "bg-white/40 h-32 lg:h-32 flex items-center p-2 rounded-xl"
                              }`}
                            >
                              <Image
                                src="/select2.png"
                                className={`object-contain w-fit cursor-pointer`}
                                width={180}
                                height={100}
                                onClick={() => {
                                  setUrlType("zillow");
                                }}
                              />
                            </div>
                            <div
                              className={`${
                                urlType === "retailor" &&
                                "bg-white/40 h-32 lg:h-32 flex items-center p-2 rounded-xl"
                              }`}
                            >
                              <Image
                                src="/select1.png"
                                width={180}
                                height={100}
                                onClick={() => {
                                  setUrlType("retailor");
                                }}
                                className={`object-contain w-fit cursor-pointer ${
                                  urlType == "retailor " &&
                                  "bg-white p-2 rounded-xl"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="rounded-xl bg-primary p-5 mt-2 w-full">
                          <h3 className="lg:text-2xl font-bold md:text-xl text-lg text-center text-white">
                            Please provide the URL of your property listing.
                          </h3>
                          <div>
                            <div className="flex bg-white md:flex-row flex-col md:gap-2 gap-4 rounded-md overflow-hidden p-1 mt-3">
                              <input
                                type="text"
                                placeholder={
                                  urlType === "zillow"
                                    ? "Exp: https://www.zillow.com/homedetails/address/114970977_zpid/"
                                    : `Exp: https://www.realtor.com/realestateandhomes-detail/1050-Brickell-Ave-Apt-620_Miami_FL_33131_M63523-57366?from=srp-list-card`
                                }
                                className="focus:outline-none w-full px-3"
                                onChange={(e) => {
                                  setMyUrl(e.target.value);
                                }}
                              />
                              <Button
                                variant="contained"
                                className="capitalize bg-primary2 hover:bg-primary text-white"
                                onClick={() => {
                                  if (urlType === "zillow") {
                                    getSingleDetails();
                                  } else {
                                    getSingleDetails2();
                                  }
                                }}
                              >
                                <SearchIcon />
                                Search
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  {/* Manual */}
                  {manualSelect === true && (
                    <div className=" p-2 bg-white w-full mx-auto">
                      <div className="rounded-2xl p-5 bg-[#98CFB2] mt-2 lg:mt-10 w-full lg:w-full">
                        <h2 className="lg:text-2xl md:text-xl text-lg font-bold text-center text-white mb-5">
                          Please choose where the property is currently
                          published?
                        </h2>
                        <div className="flex md:flex-row flex-col items-center md:justify-center gap-5">
                          <div
                            className={`${
                              urlType == "zillow" &&
                              "bg-white/40 h-32 lg:h-32 flex items-center p-2 rounded-xl"
                            }`}
                          >
                            <Image
                              src="/select2.png"
                              className={`object-contain w-fit cursor-pointer`}
                              width={180}
                              height={100}
                              onClick={() => {
                                setUrlType("zillow");
                              }}
                            />
                          </div>
                          <div
                            className={`${
                              urlType === "retailor" &&
                              "bg-white/40 h-32 lg:h-32 flex items-center p-2 rounded-xl"
                            }`}
                          >
                            <Image
                              src="/select1.png"
                              width={180}
                              height={100}
                              onClick={() => {
                                setUrlType("retailor");
                              }}
                              className={`object-contain w-fit cursor-pointer ${
                                urlType == "retailor " &&
                                "bg-white p-2 rounded-xl"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl bg-primary p-5 mt-2 w-full">
                        <h3 className="lg:text-2xl font-bold md:text-xl text-lg text-center text-white">
                          Please choose where the property is published
                        </h3>
                        <div>
                          <div className="flex bg-white md:flex-row flex-col md:gap-2 gap-4 rounded-md overflow-hidden p-1 mt-3">
                            <input
                              type="text"
                              placeholder={
                                urlType === "zillow"
                                  ? "Exp: https://www.zillow.com/homedetails/address/114970977_zpid/"
                                  : `Exp: https://www.realtor.com/realestateandhomes-detail/1050-Brickell-Ave-Apt-620_Miami_FL_33131_M63523-57366?from=srp-list-card`
                              }
                              className="focus:outline-none w-full px-3"
                              onChange={(e) => {
                                setMyUrl(e.target.value);
                              }}
                            />
                            <Button
                              variant="contained"
                              className="capitalize bg-primary2 hover:bg-primary text-white"
                              onClick={() => {
                                if (urlType === "zillow") {
                                  getSingleDetails();
                                } else {
                                  getSingleDetails2();
                                }
                              }}
                            >
                              <SearchIcon />
                              Search
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Zillow or Retailor End */}

                  <div className="flex flex-col lg:flex-row gap-4">
                    <div>
                      {/* jony comment */}
                      {/* {!isManual &&
                        allListData?.length === 0 &&
                        retailorData?.length === 0 && (
                          <div>
                            <p
                              variant="contained"
                              className="bg-light mt-2 text-black"
                            >
                              Dont see your property?{" "}
                              <a
                                style={{ color: "blue", cursor: "pointer" }}
                                onClick={handleManual}
                              >
                                click here
                              </a>
                            </p>
                          </div>
                        )} */}
                      {/* Select Address Start */}
                      {!manualSelect &&
                        !isProperty &&
                        allListData?.length > 0 &&
                        !retailorPropertyID && (
                          <div>
                            <FormControl
                              fullWidth
                              size="small"
                              className="bg-white rounded  mt-4"
                            >
                              <InputLabel
                                id="demo-select-small-label"
                                style={{ color: "black" }}
                              >
                                Select Address
                              </InputLabel>
                              <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={addressSelect}
                                onChange={(e) => {
                                  const selectedValue = e.target.value;
                                  const selectedAddress = allListData.find(
                                    (data) => data?.zpid === selectedValue
                                  );
                                  setSelectedAddress(selectedAddress);
                                  setAddressSelect(selectedValue);
                                  setFirstphoto(null);
                                  getImage(e.target.value);
                                  setZipAddress(e.target.value);
                                }}
                                MenuProps={{
                                  disablePortal: true,
                                }}
                              >
                                {allListData?.map((data, index) => (
                                  <MenuItem value={data?.zpid} key={index}>
                                    {data?.address?.line1}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <p className="mt-2">
                              You don't see your property in the menu?
                              <a
                                href="#"
                                className="text-blue-600"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent the default link behavior
                                  // router.back(); // Navigate back to the previous page
                                  setManualSelect(true);
                                }}
                              >
                                Click here
                              </a>
                            </p>
                          </div>
                        )}
                      {!myurl && !manualSelect && retailorData?.length > 0 && (
                        <div>
                          <FormControl
                            fullWidth
                            size="small"
                            className="bg-white rounded  mt-4"
                          >
                            <InputLabel
                              id="demo-select-small-label"
                              style={{ color: "black" }}
                            >
                              Select Address
                            </InputLabel>
                            <Select
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              value={
                                selectedRetailor?.permalink ||
                                retailorPropertyID
                              }
                              onChange={(e) => {
                                console.log("Hit here");
                                setRtAddress(e.target.value);
                                const matchingItem =
                                  retailorData?.length > 0 &&
                                  retailorData.find(
                                    (item) => item.permalink === e.target.value
                                  );
                                if (matchingItem) {
                                  setSelectedRetailor(matchingItem);
                                }
                              }}
                              MenuProps={{
                                disablePortal: true,
                              }}
                            >
                              {retailorData?.length > 0 &&
                                retailorData?.map((data, index) => (
                                  <MenuItem value={data?.permalink} key={index}>
                                    {data?.location?.address?.line}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                          <p className="mt-2">
                            You don't see your property in the menu?
                            <a
                              href="#"
                              className="text-blue-600"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent the default link behavior
                                // router.back(); // Navigate back to the previous page
                                setManualSelect(true);
                              }}
                            >
                              Click here
                            </a>
                          </p>
                        </div>
                      )}
                      {!manualSelect &&
                        urlType == "retailor" &&
                        isSingleProperty && (
                          <div>
                            <FormControl
                              fullWidth
                              size="small"
                              className="bg-white rounded  mt-4"
                            >
                              <InputLabel
                                id="demo-select-small-label"
                                style={{ color: "black" }}
                              >
                                Select Address
                              </InputLabel>
                              <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={
                                  selectedRetailor2?.location?.address?.line ||
                                  ""
                                }
                                onChange={(e) => {
                                  console.log("Hit here");
                                  setRtAddress(e.target.value);
                                  const matchingItem =
                                    retailorData?.length > 0 &&
                                    retailorData.find(
                                      (item) =>
                                        item.permalink === e.target.value
                                    );
                                  if (matchingItem) {
                                    setSelectedRetailor(matchingItem);
                                  }
                                }}
                                MenuProps={{
                                  disablePortal: true,
                                }}
                              >
                                {retailorData?.length > 0 ? (
                                  retailorData?.map((data, index) => (
                                    <MenuItem
                                      value={data?.permalink}
                                      key={index}
                                    >
                                      {data?.location?.address?.line}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem
                                    value={
                                      selectedRetailor2?.location?.address
                                        ?.line || ""
                                    }
                                    key={1}
                                  >
                                    {selectedRetailor2?.location?.address?.line}
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                            <p className="mt-2">
                              You don't see your property in the menu?
                              <a
                                href="#"
                                className="text-blue-600"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent the default link behavior
                                  // router.back(); // Navigate back to the previous page
                                  setManualSelect(true);
                                }}
                              >
                                Click here
                              </a>
                            </p>
                          </div>
                        )}
                      {/* Select Address End */}
                    </div>
                    {/* View Photo */}
                    <div className="lg:w-1/2 mt-4 lg:mt-0">
                      {!manualSelect &&
                        !isProperty &&
                        (firstphoto ||
                          selectedRetailor?.primary_photo?.href) && (
                          <img
                            src={
                              firstphoto ||
                              selectedRetailor?.primary_photo?.href
                            }
                            alt=""
                            className="object-contain w-[250px] mx-auto my-5  "
                          />
                        )}
                    </div>
                    {/* View Photo End */}
                  </div>
                  {/* Radio Button Start */}
                  {!manualSelect &&
                    (allListData?.length > 0 ||
                      retailorData?.length > 0 ||
                      isSingleProperty) && (
                      <div className="mt-5 overflow-hidden w-full lg:w-1/2 flex flex-col gap-4 rounded-xl p-5 g:p-10">
                        <div>
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Please choose your assistant gender.
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="ai_gender"
                              value={formik.values.ai_gender}
                              onChange={formik.handleChange}
                              // onBlur={handleBlur}
                            >
                              <FormControlLabel
                                value="female"
                                control={<Radio />}
                                label="Female"
                              />
                              <FormControlLabel
                                value="male"
                                control={<Radio />}
                                label="Male"
                              />
                            </RadioGroup>
                          </FormControl>
                          {formik.errors.ai_gender && touched.ai_gender && (
                            <div className="text-xs text-red-500 mt-1">
                              {formik.errors.ai_gender}
                            </div>
                          )}
                        </div>

                        <div>
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Show assistant in video.
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="assistant"
                              value={formik.values.assistant}
                              onChange={formik.handleChange}
                              // onBlur={handleBlur}
                            >
                              <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label="No (Voice Only)"
                              />
                            </RadioGroup>
                          </FormControl>
                          {formik.errors.assistant && touched.assistant && (
                            <div className="text-xs text-red-500 mt-1">
                              {formik.errors.assistant}
                            </div>
                          )}
                        </div>

                        <div>
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Do you want Subtitle ?
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="subtitle"
                              value={formik.values.subtitle}
                              onChange={formik.handleChange}
                              // onBlur={handleBlur}
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio />}
                                label="No"
                              />
                            </RadioGroup>
                          </FormControl>
                          {formik.errors.subtitle && touched.subtitle && (
                            <div className="text-xs text-red-500 mt-1">
                              {formik.errors.subtitle}
                            </div>
                          )}
                        </div>

                        <div>
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Select Video Language?
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="language"
                              value={formik.values.language}
                              onChange={formik.handleChange}
                              // onBlur={handleBlur}
                            >
                              <FormControlLabel
                                value="english"
                                control={<Radio />}
                                label="English"
                              />
                              <FormControlLabel
                                value="french"
                                control={<Radio />}
                                label="French"
                              />
                            </RadioGroup>
                          </FormControl>
                          {formik.errors.language && touched.language && (
                            <div className="text-xs text-red-500 mt-1">
                              {formik.errors.language}
                            </div>
                          )}
                        </div>

                        <Button
                          disabled={isLoading}
                          variant="contained"
                          type="submit"
                          className="bg-primary hover:bg-primary2 capitalize py-2 text-white font-bold lg:text-lg"
                        >
                          Continue
                        </Button>
                      </div>
                    )}
                  {/* Radio Button End */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutBroker>
  );
};

export default placeOrder;
