import React, { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useFormik } from "formik";
import axios from "../../utils/axios";
import { useRouter } from "next/router";
import axios2 from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LayoutBroker from "../../components/Layout/LayoutBroker";

const Revision = ({ responseData }) => {
  console.log("response--Data", responseData);
  const User = useSelector((state) => state.User);
  const [newRegenerate, setNewRegenerate] = useState(null);
  //   console.log("My Data", responseData)
  const router = useRouter();
  const createInitialValues = {
    comment: "",
    broker_phone: User?.UserData?.profile?.phone_number || "",
  };
  const updateInitialValues = {
    comment: newRegenerate ? newRegenerate : responseData?.property_details,
    broker_phone: User?.UserData?.profile?.phone_number || "",
  };
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: responseData?.property_details
      ? updateInitialValues
      : createInitialValues,
    onSubmit: async (values) => {
      console.log("Submitted values", values);
      setIsLoading(true);
      try {
        const res = await axios.put(
          `/api/order/regenerate_ai/${responseData?._id}/`
        );
        const { status, data } = res;
        if (status === 200) {
          console.log("---data", data);
          // property_details
          setNewRegenerate(data?.property_details);

          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    },
    enableReinitialize: true,
  });
  const handleButtonClick = async () => {
    const formData = new FormData();
    formData.append("phone_number", formik.values?.broker_phone);
    formData.append("property_details", formik.values?.comment);
    const loading = toast.loading("Please wait a moment...");
    try {
      const res = await axios.put(
        `/api/order/edit_order/${responseData?._id}/`,
        formData
      );
      const { status, data } = res;
      if (status === 200) {
        setIsLoading(false);
        toast.dismiss(loading);
        toast.success("Order Created");
        router.push(`/broker/order-history?drawer=${false}`);
      }
    } catch (error) {
      toast.dismiss(loading);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (responseData?.url) {
      getRetailorPropertyInformation();
    }
  }, [responseData?.url]);
  const [retailorInfo, setRetailorInfo] = useState();
  const getRetailorPropertyInformation = async () => {
    const options = {
      method: "GET",
      url: "https://us-real-estate-listings.p.rapidapi.com/v2/property",
      params: {
        property_url: `https://www.realtor.com/realestateandhomes-detail/${responseData?.url}`,
      },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKeyRealstate,
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHostRealState,
      },
    };

    try {
      const response = await axios2.request(options);
      setRetailorInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (responseData?.zpid) {
      allDatanow();
    }
  }, [responseData?.zpid]);

  const [allPData, setAllPData] = useState(null);
  const allDatanow = async () => {
    const options = {
      method: "GET",
      url: "https://zillow-com1.p.rapidapi.com/property",
      params: { zpid: responseData?.zpid },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKey,
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHost,
      },
    };
    try {
      const response = await axios2.request(options);

      setAllPData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // {retailorInfo?.data?.description?.beds ||
  //   allPData?.bedrooms}
  console.log("retailorInfo", retailorInfo);
  console.log("allPData", allPData);
  // sessionStorage.setItem("bed", JSON.stringify(selectedRetailor2?.description?.beds));
  // sessionStorage.setItem("bath", JSON.stringify(selectedRetailor2?.description?.bath));
  // sessionStorage.setItem("sqfit", JSON.stringify(selectedRetailor2?.description?.sqft));
  const bed = sessionStorage?.getItem("bed");
  const bath = sessionStorage?.getItem("bath");
  const sqfit = sessionStorage?.getItem("sqfit");
  return (
    <LayoutBroker active="process">
      <div className="bg-[#f5fcfa]">
        <div className="flex flex-col h-screen justify-center items-center">
          <div className="text-center mb-4">
            <h1 className="text-[46px]  font-semibold">
              Revision of your order
            </h1>
            <p className="text-[18px] text-[#6F6C90]">
              Please confirm all information are correct before submitting, the{" "}
            </p>
            <p className="text-[18px] text-[#6F6C90]">
              task to one of our video editors.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 px-4 lg:px-20">
            <div className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-2 ml-2 sm:ml-0">
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
                        Please watch an example of the video we are creating for
                        our client
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
            <div className="col-span-4 bg-white shadow-lg px-4 sm:px-6 rounded-3xl w-full sm:w-auto lg:w-[870px]">
              <div>
                <p className="text-[18px] font-medium">
                  Your order is completed. Please make sure all information are
                  correct.
                </p>
                <p className="text-[#667085] text-sm mb-4">
                  You can modify wrong information by clicking on the field.
                </p>
                <form onSubmit={formik.handleSubmit}>
                  <div className="flex flex-col sm:flex-row border rounded-3xl text-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 justify-center sm:justify-evenly">
                    <div>
                      <p className="text-[14px]">Bedroom</p>
                      <p className="text-[14px] text-[#98CFB2]">
                        {retailorInfo?.data?.description?.beds ||
                          allPData?.bedrooms ||
                          bed}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px]">Bathroom</p>
                      <p className="text-[14px] text-[#98CFB2]">
                        {retailorInfo?.data?.description?.baths ||
                          allPData?.bathrooms ||
                          bath}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px]">Square feet</p>
                      <p className="text-[14px] text-[#98CFB2]">
                        {retailorInfo?.data?.description?.sqft ||
                          retailorInfo?.data?.description?.lot_sqft ||
                          allPData?.livingArea ||
                          sqfit}{" "}
                        sqft
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px]">Property Price</p>
                      <p className="text-[#98CFB2] text-[14px]">
                        {allPData?.price || "$399,500"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px]">Broker name</p>
                      <p className="text-[#98CFB2] text-[14px]">
                        {User?.UserData?.profile?.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px]">Broker Phone</p>
                      <input
                        type="text"
                        id="broker_phone"
                        value={formik.values.broker_phone}
                        onChange={formik.handleChange}
                        className="text-[#98CFB2] text-[14px] border-b border-[#98CFB2] outline-none ml-2 w-28"
                      />
                    </div>
                  </div>
                  <p className="text-[18px] mt-4">
                    Here is the naration script.
                  </p>
                  <p className="text-[12px] text-[#667085]">
                    Please note this script is auto generated by AI and reviewed
                    by our team to make sure no error appear, you can edit or
                    add something before submiting.
                  </p>

                  <textarea
                    id="comment"
                    name="comment"
                    className="w-full p-2 mt-2 border rounded"
                    placeholder="Write your comment here..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.comment}
                    style={{ height: "200px" }}
                  />
                  <button
                    className="bg-[#98CFB2] shadow-xl text-white px-4 py-2 rounded-lg mt-4 text-[14px] mb-2"
                    type="submit"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      "RE-GENERATE SCRIPT"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* <div className="flex gap-[1050px] mt-4"> */}
          <div className="flex flex-col sm:flex-row  lg:gap-[1050px] sm:gap-4 mt-4">
            <div className="flex items-center justify-start text-[#667085]"></div>
            <button
              className="flex items-center bg-[#98CFB2] text-white px-4 py-3 rounded-lg shadow-lg text-sm focus:outline-none focus:ring focus:ring-blue-300 ml-32"
              type="submit"
              onClick={handleButtonClick}
            >
              Confirm & Submit Order
            </button>
          </div>
        </div>
      </div>
    </LayoutBroker>
  );
};

export default Revision;
