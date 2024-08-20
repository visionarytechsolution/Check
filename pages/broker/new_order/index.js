import OrderSummery from "@/components/Checkout/OrderSummery";
import Stripe from "@/components/Checkout/Stripe";
import withAuth from "@/hoc/withAuth";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import { Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import WatchaDemoNow from "../../../components/Broker/WatchaDemoNow";
import LayoutBroker from "../../../components/Layout/LayoutBroker";
import axios from "../../../utils/axios";
import Image from "next/image";
import listData from "../new_order_Functions/listData";
import singleRetailorProperty from "../new_order_Functions/singleRetailorProperty";
import realStateListData from "../new_order_Functions/realStateListData";
import getFirstPhotoRetailor from "../new_order_Functions/getFirstPhotoRetailor";
import Revision from "../revision";
export default withAuth(Dashboard);
function Dashboard() {
  const User = useSelector((state) => state.User);
  const [addressSelect, setAddressSelect] = useState("");
  const [allListData, setAllListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [payData, setPayData] = useState(false);
  const [count, setCount] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [urlType, setUrlType] = useState("zillow");
  const Price = useSelector((state) => state.Price);
  const [myurl, setMyUrl] = useState("");
  const [isRevision, setIsRevision] = useState(false);

  //Retailor states
  const [selectedRetailor, setSelectedRetailor] = useState(null);
  const [selectedRetailor2, setSelectedRetailor2] = useState(null);
  const [retailorUrlPattern, setRetailorUrlPattern] = useState(null);
  const router = useRouter();
  const retailorPropertyID = router.query.retailor;
  console.log("retailorPropertyID", retailorPropertyID);
  console.log("Api----->Response", selectedRetailor2);
  console.log("Check condition", User?.UserData?.zuid, count);
  console.log("retailorPropertyID", retailorPropertyID);
  console.log("selectedAddress", selectedAddress);

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

  const [temp, setTemp] = useState(null);
  const [realtorAddress, setRealtorAddress] = useState(null);
  const [realtorImage, setRealtorImage] = useState();
  const [responseData, setResponseData] = useState(null);
  console.log("selectedRetailor2", selectedRetailor2);
  console.log("selectedRetailor", selectedRetailor);
  const createOrder = async (values) => {
    if (User?.UserData?.is_demo == true) {
      // return console.log("Here 1")
      createOrder2({ values });
    } else if (User?.UserData?.profile?.payment_info !== null) {
      // return console.log("Here 2")
      const addressInfo = {
        address: {
          line1:
            selectedRetailor2?.location?.address?.line ||
            selectedRetailor?.location?.address?.line,
          state:
            selectedRetailor2?.location?.address?.state ||
            selectedRetailor?.location?.address?.state,
          postcode:
            selectedRetailor2?.location?.address?.postal_code ||
            selectedRetailor?.location?.address?.postal_code,
          city:
            selectedRetailor2?.location?.address?.city ||
            selectedRetailor?.location?.address?.city,
        },
      };
      const primaryPhotoUrl = {
        photo: selectedRetailor?.primary_photo?.href,
      };
      setRealtorImage(primaryPhotoUrl);

      setRealtorAddress(addressInfo);
      setShowModal2(true);
    } else {
      // return console.log("Here 3")
      const addressInfo = {
        address: {
          line1:
            selectedRetailor2?.location?.address?.line ||
            selectedRetailor?.location?.address?.line,
          state:
            selectedRetailor2?.location?.address?.state ||
            selectedRetailor?.location?.address?.state,
          postcode:
            selectedRetailor2?.location?.address?.postal_code ||
            selectedRetailor?.location?.address?.postal_code,
          city:
            selectedRetailor2?.location?.address?.city ||
            selectedRetailor?.location?.address?.city,
        },
      };
      const primaryPhotoUrl = {
        photo: selectedRetailor?.primary_photo?.href,
      };
      setRealtorImage(primaryPhotoUrl);
      setRealtorAddress(addressInfo);
      createPayInt();
    }
  };

  const createPayInt = async () => {
    const loading = toast.loading("Please wait a moment.");
    try {
      const res = await axios.post(`/api/order/payment_create/`);
      setPayData(res?.data);
      setShowModal(true);
      toast.dismiss(loading);
    } catch {
      toast.dismiss(loading);
    }
  };

  const createPayInt2 = async () => {
    try {
      const res = await axios.post(`/api/order/payment_create/`);
    } catch (err) {}
  };

  const savePayInfo = async () => {
    try {
      const res = await axios.put(`/api/order/save_payment/`);
    } catch (err) {}
  };

  const createOrder2 = async ({ data2, values }) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("subtitle", values?.subtitle ?? temp?.subtitle);

    if (selectedAddress?.listing_url || retailorUrlPattern) {
      formData.append(
        "url",
        selectedAddress?.listing_url || retailorUrlPattern
      );
    }

    formData.append("assistant_type", values?.ai_gender ?? temp?.ai_gender);
    formData.append("video_language", values?.language ?? temp?.language);
    formData.append("assistant", values?.assistant ?? temp?.assistant);

    if (selectedAddress?.zpid) {
      formData.append("zpid", selectedAddress.zpid);
    }

    if (
      selectedRetailor?.permalink ||
      selectedRetailor2?.permalink ||
      retailorUrlPattern
    ) {
      formData.append(
        "url",
        selectedRetailor?.permalink ||
          selectedRetailor2?.permalink ||
          retailorUrlPattern
      );
    }

    const primaryPhotoUrl =
      firstphoto ||
      selectedAddress?.primary_photo_url ||
      selectedRetailor?.primary_photo?.href;

    if (primaryPhotoUrl) {
      formData.append("primary_photo_url", primaryPhotoUrl);
    }

    formData.append(
      "line1",
      selectedAddress?.address?.line1 ??
        (selectedRetailor?.location?.address?.line ||
          selectedRetailor2?.location?.address?.line)
    );

    // selectedRetailor2?.location?.address?.line,selectedRetailor2?.location?.address?.state, selectedRetailor2?.location?.address?.postal_code,selectedRetailor2?.location?.address?.city

    formData.append("line2", selectedAddress?.address?.line2 ?? "");
    formData.append(
      "state",
      selectedAddress?.address?.stateOrProvince ??
        (selectedRetailor?.location?.address?.state ||
          selectedRetailor2?.location?.address?.state)
    );
    formData.append(
      "postalCode",
      selectedAddress?.address?.postalCode ??
        (selectedRetailor?.location?.address?.postal_code ||
          selectedRetailor2?.location?.address?.postal_code)
    );
    formData.append(
      "city",
      selectedAddress?.address?.city ??
        (selectedRetailor?.location?.address?.city ||
          selectedRetailor2?.location?.address?.city)
    );

    if (data2) {
      formData.append("payment_method_id", data2?.payment_method);
      formData.append("payment_intent_id", data2?.id);
      formData.append("payment_type", data2.payment_method_types?.[0]);
    }

    const loading = toast.loading("Please wait a moment...");
    try {
      const res = await axios.post(`/api/order/order_create/`, formData);
      const { status, data } = res;
      if (status === 200) {
        setIsLoading(false);
        toast.dismiss(loading);
        // toast.success("order created");
        setIsRevision(true);
        console.log("response --->data", data);
        setResponseData(data);
        // router.push("/broker/revision");
      }
    } catch (error) {
      toast.dismiss(loading);
      setIsLoading(false);
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data)
      ) {
        const errors = error.response.data;
        errors.forEach((error) => {
          toast.error(error.error);
        });
      } else {
        toast.error(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : "Something went wrong please try again"
        );
      }
    }
  };
  console.log("All-list Data", allListData);
  const [firstphoto, setFirstphoto] = useState(null);
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
      console.log("response", response);
    } catch (error) {
      setFirstphoto(null);
      console.error(error);
    }
  };
  const getSingleDetails = async () => {
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
    singleRetailorProperty(myurl, setSelectedRetailor2);
  };
  const [retailorData, setRetailorData] = useState([]);
  useEffect(() => {
    if (User?.UserData?.realtor_profile_url) {
      realStateListData(User, setRetailorData);
    }
  }, []);

  useEffect(() => {
    const matchingItem =
      retailorData?.length > 0 &&
      retailorData.find((item) => item.permalink === retailorPropertyID);

    if (matchingItem) {
      setSelectedRetailor(matchingItem);
    }
  }, [retailorData, retailorPropertyID]);

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
  const queryParams = new URLSearchParams(window.location.search);
  const manualProperty = queryParams.get("manual");
  const activeListingID = queryParams.get("id");
  const realtorActiveListingID = queryParams.get("retailor");
  console.log("manualProperty", manualProperty); // This line was missing "manualProperty"
  console.log("activeListingID", activeListingID); // This line was missing "manualProperty"
  console.log("realtorActiveListingID", realtorActiveListingID); // This line was missing "manualProperty"
  console.log("realtorAddress", realtorAddress);

  return (
    <>
      {isRevision ? (
        <Revision responseData={responseData}></Revision>
      ) : (
        <div>
          <Head>
            <title>Dashboard - RealVision</title>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-NB69L1J8JY"
            ></script>{" "}
            <script>
              {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '253613074265740');
            fbq('track', 'PageView');
          `}
            </script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=253613074265740&ev=PageView&noscript=1"
              />
            </noscript>
            <script
              async
              defer
              src="https://tools.luckyorange.com/core/lo.js?site-id=3c1f694c"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NB69L1J8JY');
            `,
              }}
            />
            <script
              defer
              src="//app.leadfox.co/js/api/leadfox.js"
              data-key="31177e82f5fc2d8cd289b06ad7dd3a2e"
            />
          </Head>
          <div>
            <LayoutBroker active="dashboard">
              <div className="m-5 lg:m-10  p-5 bg-white">
                <Link href="/broker/dashboard">
                  <Button variant="outlined">Back</Button>
                </Link>

                <h1 className="font-bold  lg:text-3xl md:text-2xl text-xl text-center py-5">
                  Convert Your Property Listing into a video presentation
                </h1>
                <WatchaDemoNow />
                <Formik
                  initialValues={{
                    client_name: "",
                    ai_gender: "",
                    subtitle: null,
                    language: "",
                    url: "",
                    assistant: null,
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.ai_gender) {
                      errors.ai_gender = "Required";
                    }
                    if (!values.subtitle) {
                      errors.subtitle = "Required";
                    }
                    if (!values.language) {
                      errors.language = "Required";
                    }
                    if (!values.assistant) {
                      errors.assistant = "Required";
                    }
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    setTemp(values);
                    createOrder(values);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <form
                      onSubmit={handleSubmit}
                      className="flex items-center flex-col"
                    >
                      {!(activeListingID || realtorActiveListingID) && (
                        <>
                          {!manualProperty &&
                          !retailorPropertyID &&
                          (User?.UserData?.zuid === null ||
                            User?.UserData?.zuid === "") ? (
                            <div className="rounded-2xl p-5 bg-[#98CFB2]  mt-5 lg:mt-10 w-full lg:w-1/2">
                              <h2 className="lg:text-2xl md:text-xl text-lg font-bold text-center text-white mb-5">
                                Please choose where the property is currently
                                published ?
                              </h2>
                              <div className="flex md:flex-row flex-col items-center md:justify-center  gap-5">
                                <div
                                  className={`${
                                    urlType == "zillow" &&
                                    "bg-white/40 h-32 lg:h-40 flex items-center   p-2 rounded-xl"
                                  }`}
                                >
                                  <Image
                                    src="/select2.png"
                                    className={`object-contain w-fit cursor-pointer }`}
                                    width={180}
                                    height={100}
                                    onClick={() => {
                                      setUrlType("zillow");
                                    }}
                                  />
                                </div>
                                <div
                                  className={` ${
                                    urlType === "retailor" &&
                                    "bg-white/40 h-32 lg:h-40 flex items-center   p-2 rounded-xl"
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
                          ) : (
                            <div className="rounded-2xl p-5 bg-[#98CFB2]  mt-5 lg:mt-10 w-full lg:w-1/2">
                              <h2 className="lg:text-2xl md:text-xl text-lg font-bold text-center text-white mb-5">
                                Please choose where the property is currently
                                published ?
                              </h2>
                              <div className="flex md:flex-row flex-col items-center md:justify-center  gap-5">
                                <div
                                  className={`${
                                    urlType == "zillow" &&
                                    "bg-white/40 h-32 lg:h-40 flex items-center   p-2 rounded-xl"
                                  }`}
                                >
                                  <Image
                                    src="/select2.png"
                                    className={`object-contain w-fit cursor-pointer }`}
                                    width={180}
                                    height={100}
                                    onClick={() => {
                                      setUrlType("zillow");
                                    }}
                                  />
                                </div>
                                <div
                                  className={` ${
                                    urlType === "retailor" &&
                                    "bg-white/40 h-32 lg:h-40 flex items-center   p-2 rounded-xl"
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
                          )}
                        </>
                      )}

                      {!manualProperty && (
                        <div className="rounded-xl bg-primary p-5 mt-10 lg:w-1/2 lg:p-10 w-full">
                          <h3 className="lg:text-2xl font-bold md:text-xl text-lg text-center text-white">
                            {!retailorPropertyID &&
                            (User?.UserData?.zuid == null ||
                              User?.UserData?.zuid == "" ||
                              count == 0)
                              ? "Please choose where the property is published"
                              : " Please choose the property you want to create a video"}
                          </h3>

                          <div>
                            {(firstphoto ||
                              selectedRetailor?.primary_photo?.href) && (
                              <img
                                src={
                                  firstphoto ||
                                  selectedRetailor?.primary_photo?.href
                                }
                                alt=""
                                className="object-contain w-full mx-auto my-5  "
                              />
                            )}

                            {!retailorPropertyID &&
                              (User?.UserData?.zuid == null ||
                                User?.UserData?.zuid == "" ||
                                count == 0) && (
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
                              )}

                            {allListData?.length > 0 && !retailorPropertyID && (
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
                                      router.back(); // Navigate back to the previous page
                                    }}
                                  >
                                    Click here
                                  </a>
                                </p>
                              </div>
                            )}

                            {retailorData?.length > 0 && !router?.query?.id && (
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
                                    {retailorData?.length > 0 &&
                                      retailorData?.map((data, index) => (
                                        <MenuItem
                                          value={data?.permalink}
                                          key={index}
                                        >
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
                                      router.back(); // Navigate back to the previous page
                                    }}
                                  >
                                    Click here
                                  </a>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {manualProperty && (
                        <div className="rounded-xl bg-primary p-5 mt-10 lg:w-1/2 lg:p-10 w-full">
                          <h3 className="lg:text-2xl font-bold md:text-xl text-lg text-center text-white">
                            Please choose where the property is published
                          </h3>

                          <div>
                            {(firstphoto ||
                              selectedRetailor?.primary_photo?.href) && (
                              <img
                                src={
                                  firstphoto ||
                                  selectedRetailor?.primary_photo?.href
                                }
                                alt=""
                                className="object-contain w-full mx-auto my-5  "
                              />
                            )}

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
                      )}

                      {/* Break */}

                      {(addressSelect !== "" ||
                        selectedRetailor ||
                        selectedRetailor2) && (
                        <div className="mt-10 border overflow-hidden w-full lg:w-1/2 flex flex-col gap-4 rounded-xl p-5 g:p-10">
                          <div>
                            <FormControl>
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                Please choose your assistant gender.
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="ai_gender"
                                value={values.ai_gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                            {errors.ai_gender && touched.ai_gender && (
                              <div className="text-xs text-red-500 mt-1">
                                {errors.ai_gender}
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
                                value={values.assistant}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                            {errors.assistant && touched.assistant && (
                              <div className="text-xs text-red-500 mt-1">
                                {errors.assistant}
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
                                value={values.subtitle}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                            {errors.subtitle && touched.subtitle && (
                              <div className="text-xs text-red-500 mt-1">
                                {errors.subtitle}
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
                                value={values.language}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                            {errors.language && touched.language && (
                              <div className="text-xs text-red-500 mt-1">
                                {errors.language}
                              </div>
                            )}
                          </div>

                          <Button
                            disabled={isLoading}
                            variant="contained"
                            type="submit"
                            className="bg-primary hover:bg-primary2 capitalize py-2 text-white font-bold lg:text-lg"
                          >
                            Place Order Now for ${Price?.PriceData?.amount}
                          </Button>
                        </div>
                      )}
                    </form>
                  )}
                </Formik>
              </div>
            </LayoutBroker>
          </div>

          <Modal
            open={showModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 max-h-[90vh] overflow-auto -translate-y-1/2 p-5 lg:p-10 rounded-lg lg:min-w-1/3 md:w-1/2 w-[90vw] bg-white">
              <IconButton
                className="absolute top-0 right-0"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <CloseIcon />
              </IconButton>
              <Stripe
                firstphoto={firstphoto}
                realtorImage={realtorImage}
                payData={payData}
                createOrder2={createOrder2}
                savePayInfo={savePayInfo}
                selectedAddress={
                  selectedRetailor2?.location?.address?.city ||
                  selectedRetailor?.location?.address?.city
                    ? realtorAddress
                    : selectedAddress
                }
              />
            </div>
          </Modal>

          <Modal
            open={showModal2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 max-h-[90vh] overflow-auto -translate-y-1/2 p-5 lg:p-10 rounded-lg lg:min-w-1/3 md:w-1/2 w-[90vw] bg-white">
              <IconButton
                className="absolute top-0 right-0"
                onClick={() => {
                  setShowModal2(false);
                }}
              >
                <CloseIcon />
              </IconButton>
              <div>
                <p className="font-bold ">
                  {" "}
                  Do you want to use the last card you have used ?
                </p>
                <div className="text-sm p-3 rounded-xl border border-primary mt-3">
                  <p>
                    **** **** ****{" "}
                    {User?.UserData?.profile?.payment_info?.last4}
                  </p>
                  <p>
                    EXP:
                    {User?.UserData?.profile?.payment_info?.exp_month}/
                    {User?.UserData?.profile?.payment_info?.exp_year}
                  </p>
                </div>

                <p className="mt-3 text-xs text-red-500">
                  NB:Anytime you can remove your last card from settings.
                </p>

                <OrderSummery
                  selectedAddress={
                    selectedRetailor2?.location?.address?.city ||
                    selectedRetailor?.location?.address?.city
                      ? realtorAddress
                      : selectedAddress
                  }
                  firstphoto={firstphoto}
                  realtorImage={realtorImage}
                />
                <Button
                  onClick={async () => {
                    createPayInt2();
                    createOrder2({ values: temp });
                  }}
                  disabled={isLoading}
                  variant="contained"
                  className="mt-5 bg-primary2 hover:bg-primary text-white font-bold w-full"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}
