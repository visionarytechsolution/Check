import Stripe from "@/components/Checkout/Stripe";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LayoutBroker from "../../components/Layout/LayoutBroker";
import OrderSummery from "../../components/Checkout/OrderSummery";
import axios from "../../utils/axios";
import listData from "../../pages/broker/new_order_Functions/listData";
import realStateListData from "../../pages/broker/new_order_Functions/realStateListData";
import { Button } from "@mui/material";
import Revision from "./revision";

const payment = () => {
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
  const queryParams = new URLSearchParams(window.location.search);
  const zipAddress = queryParams.get("zipAddress");
  useEffect(() => {
    if (User?.UserData?.zuid) {
      console.log("Here");
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
  const [realtorImage, setRealtorImage] = useState();
  const savePayInfo = async () => {
    try {
      const res = await axios.put(`/api/order/save_payment/`);
    } catch (err) {}
  };

  const [retailorData, setRetailorData] = useState([]);
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
  //Get Zillow image
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

  const rtAddress = queryParams.get("rtAddress");
  const retailorURL = queryParams.get("retailorURL");
  console.log("retailorURL", retailorURL);
  console.log("router", router.query);
  //Get Retailor List
  useEffect(() => {
    if (User?.UserData?.realtor_profile_url) {
      console.log("Here");
      realStateListData(User, setRetailorData);
    }
  }, [User?.UserData?.realtor_profile_url]);
  console.log("Retailor->Data", retailorData);

  const handleButtonClick = () => {
    router.push("/process/revision");
  };
  //Get Data from url
  const cs = queryParams.get("cs");
  const pk = queryParams.get("pk");
  const ai_gender = queryParams.get("ai_gender");
  const language = queryParams.get("language");
  const assistant = queryParams.get("assistant");
  const isSummary = queryParams.get("summary");

  const subtitle = queryParams.get("subtitle");
  const assistant_type = queryParams.get("assistant_type");
  const video_language = queryParams.get("video_language");
  const line = queryParams.get("line");
  const state = queryParams.get("line");
  const postCode = queryParams.get("line");
  const city = queryParams.get("line");
  const image = queryParams.get("image");
  const url = queryParams.get("url");
  const zipData = queryParams.get("zipData");
  console.log("isSummary", isSummary);
  const tempData = {
    assistant: assistant,
    subtitle: subtitle,
    assistant_type: assistant_type,
    video_language: video_language,
  };

  //Customize retailor Data
  const retailorItem =
    retailorData?.length > 0 &&
    retailorData.find((item) => item.permalink === rtAddress);
  //Customize Zillow Data
  const zillowItem =
    allListData?.length > 0 &&
    allListData.find((data) => data?.zpid === Number(zipAddress));

  console.log("zillowItem", zillowItem);

  // customize address
  const addressInfo = {
    address: {
      line1: retailorItem?.location?.address?.line
        ? retailorItem?.location?.address?.line
        : zillowItem?.address?.line1 || line,
      state: retailorItem?.location?.address?.state
        ? retailorItem?.location?.address?.state
        : zillowItem?.address?.stateOrProvince || state,
      postcode: retailorItem?.location?.address?.postal_code
        ? retailorItem?.location?.address?.postal_code
        : zillowItem?.address?.postalCode || postCode,
      city: retailorItem?.location?.address?.city
        ? retailorItem?.location?.address?.city
        : zillowItem?.address?.city || city,
    },
  };
  //Customize Image
  const imageInfo = zillowItem?.primary_photo_url
    ? zillowItem?.primary_photo_url
    : retailorItem?.primary_photo?.href || image;
  // Order Response State
  const [responseData, setResponseData] = useState(null);
  const createOrder2 = async ({ data, values }) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("subtitle", subtitle);
    formData.append(
      "url",
      retailorItem?.permalink || zillowItem?.listing_url || url
    );
    formData.append("assistant_type", assistant_type);
    formData.append("video_language", video_language);
    formData.append("assistant", assistant);
    if (zillowItem?.zpid) {
      formData.append("zpid", zillowItem?.zpid);
    } else if (zipData) {
      formData.append("zpid", zipData);
    }
    formData.append("primary_photo_url", imageInfo);
    formData.append(
      "line1",
      retailorItem?.location?.address?.line ||
        zillowItem?.address?.line1 ||
        line
    );
    formData.append("line2", zillowItem?.address?.line2);
    formData.append(
      "state",
      retailorItem?.location?.address?.state ||
        zillowItem?.address?.stateOrProvince ||
        state
    );
    formData.append(
      "postalCode",
      retailorItem?.location?.address?.postal_code ||
        zillowItem?.address?.postalCode ||
        postCode
    );
    formData.append(
      "city",
      retailorItem?.location?.address?.city || zillowItem?.address?.city || city
    );
    if (data) {
      formData.append("payment_method_id", data?.payment_method);
      formData.append("payment_intent_id", data?.id);
      formData.append("payment_type", data.payment_method_types?.[0]);
    }
    const loading = toast.loading("Please wait a moment...");
    try {
      const res = await axios.post(`/api/order/order_create/`, formData);
      const { status, data } = res;
      if (status === 200) {
        setIsLoading(false);
        toast.dismiss(loading);
        setResponseData(data);
        console.log("Response--Data", data);
        setIsRevision(true);
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
      }
    }
  };

  const createPayInt2 = async () => {
    try {
      const res = await axios.post(`/api/order/payment_create/`);
    } catch (err) {}
  };
  console.log("resposeDat", responseData);
  console.log("allListData", allListData);
  return (
    <>
      {isRevision ? (
        <Revision responseData={responseData}></Revision>
      ) : (
        <LayoutBroker active="process">
          <div className="h-screen items-center justify-center">
            <div className="text-center mb-4">
              <h1 className="text-[34px] font-bold mb-4">Payment Process</h1>
              <p className="text-[18px] text-[#6F6C90]">
                Please fill out all fields to process yor payment. Your video
                will be ready in 3{" "}
              </p>
              <p className="text-[18px] text-[#6F6C90]">
                hours or less, as one of our video editors will vegin working on
                it.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4 lg:px-20">
              <div className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-2 ml-2 sm:ml-0 md:ml-5">
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
              <div className="col-span-4 bg-white shadow-lg px-4 sm:px-6 rounded-3xl w-full sm:w-[100%] md:w-[50%] lg:w-[870px]">
                <div className="flex justify-center">
                  {isSummary == 1 ? (
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
                        selectedAddress={addressInfo}
                        firstphoto={imageInfo}
                        realtorImage={imageInfo}
                      />
                      <Button
                        onClick={async () => {
                          createPayInt2();
                          createOrder2({ values: tempData });
                        }}
                        disabled={isLoading}
                        variant="contained"
                        className="mt-5 bg-primary2 hover:bg-primary text-white font-bold w-full"
                      >
                        Confirm
                      </Button>
                    </div>
                  ) : (
                    <Stripe
                      firstphoto={firstphoto || imageInfo}
                      realtorImage={realtorImage || imageInfo}
                      payData={payData}
                      cs={cs}
                      pk={pk}
                      createOrder2={createOrder2}
                      savePayInfo={savePayInfo}
                      selectedAddress={
                        selectedRetailor2?.location?.address?.city ||
                        selectedRetailor?.location?.address?.city
                          ? realtorAddress
                          : selectedAddress || addressInfo
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            {/* <div className="flex gap-[1200px] mt-4">
          <div className="flex items-center justify-start text-[#667085]"></div>
          <button
            className="flex items-center bg-[#98CFB2] text-white px-4 py-3 rounded-lg shadow-lg text-sm focus:outline-none focus:ring focus:ring-blue-300 ml-32"
            type="submit"
            onClick={handleButtonClick}
          >
            Continue
          </button>
        </div> */}
          </div>
        </LayoutBroker>
      )}
    </>
  );
};

export default payment;
