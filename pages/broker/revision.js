import React, { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useFormik } from "formik";
import axios from "../../utils/axios";
import { useRouter } from "next/router";
import axios2 from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LayoutBroker from "../../components/Layout/LayoutBroker";

// import { AiOutlineSetting } from "react-icons/ai";
// import { AiOutlineArrowRight } from "react-icons/ai";

const Revision = ({ responseData }) => {
  const User = useSelector((state) => state.User);
  const [newRegenerate, setNewRegenerate] = useState(null);
  console.log("My Data", responseData);
  const router = useRouter();
  const createInitialValues = {
    comment: "",
    broker_phone: "",
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
  console.log("allPData", allPData);
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

  //   console.log("Property Info",retailorInfo)
  //   const bedroomDetails = details
  //     .filter(detail => detail.category === "Bedrooms")
  //     .map(detail => detail.text);
  //   const bathroomDetails = details
  //     .filter(detail => detail.category === "Bathrooms")
  //     .map(detail => detail.text);

  // console.log(bedroomDetails);
  const handleButtonClick = async() => {
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
        router.push("/broker/order-history");
      }
    } catch (error) {
      toast.dismiss(loading);
      setIsLoading(false);
    }
  };
  console.log("User?.UserData?.profile?.full_name", User);

  return (
    <LayoutBroker active="dashboard">
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
          <div className="bg-white shadow-lg p-6 rounded-3xl w-[870px]">
            <p className="text-[18px] font-medium">
              Your order is completed. Please make sure all information is correct.
            </p>
            <p className="text-[#667085] text-sm mb-4">
              You can modify wrong information by clicking on the field.
            </p>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex border rounded-3xl text-center gap-[] justify-evenly">
                <div>
                  <p className="text-[14px]">Bedroom</p>
                  <p className="text-[14px] text-[#98CFB2]">
                    {retailorInfo?.data?.description?.beds ||
                      allPData?.bedrooms}
                  </p>
                </div>
                <div>
                  <p className="text-[14px]">Bathroom</p>
                  <p className="text-[14px] text-[#98CFB2]">
                    {retailorInfo?.data?.description?.baths ||
                      allPData?.bathrooms}
                  </p>
                </div>
                <div>
                  <p className="text-[14px]">Square feet</p>
                  <p className="text-[14px] text-[#98CFB2]">
                    {retailorInfo?.data?.description?.sqft ||
                      allPData?.livingArea}{" "}
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
              <p className="text-[18px] mt-4">Here is the narration script.</p>
              <p className="text-[12px] text-[#667085]">
                Please note this script is auto-generated by AI and reviewed by our team to make sure no errors appear. You can edit or add something before submitting.
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
                className="bg-[#98CFB2] shadow-xl text-white px-4 py-2 rounded-lg mt-4 text-[14px]"
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
          <div className="flex gap-[850px] mt-5">
            <div className="flex items-center justify-start text-[#667085]"></div>
            <button
              className="flex items-center bg-[#98CFB2] text-white px-4 py-3 rounded-lg shadow-lg text-sm focus:outline-none focus:ring focus:ring-blue-300"
              type="button"
              onClick={handleButtonClick}
            >
              Confirm & Submit Order
              <span className="ml-2">
                <ArrowForwardIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </LayoutBroker>
  );
};

export default Revision;
