import React, { useEffect, useState } from "react";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Avatar from "@mui/material/Avatar";

import { useCookies } from "react-cookie";
import axios from "../../../utils/axios";
import axios2 from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import JSZip from "jszip";

export default function TaskDetails({
  setTempData,
  setShowDetails,
  tempData,
  setPage,
  settrigger,
}) {
  const router = useRouter();
  const [cookie, setCookie] = useCookies(["token", "type"]);
  const [retailorInfo, setRetailorInfo] = useState();

  const datetest = (date) => {
    const dateStr = date;
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(dateStr));

    return <p>{formattedDate}</p>;
  };
  const [isLoading, setIsLoading] = useState(false);
  console.log("tempData", tempData);

  //download images
  const downloadImages = async () => {
    const loading = toast.loading("Please wait a moment.");
    const options = {
      method: "GET",
      url: "https://zillow-com1.p.rapidapi.com/images",
      params: { zpid: tempData?.zpid },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKey,
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHost,
      },
    };

    try {
      const response = await axios.request(options);
      toast.dismiss(loading);

      if (response?.data?.images?.length > 0) {
        downloadImagesNow(response?.data?.images);
      } else {
        toast.error("No image found !");
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(loading);
      toast.error("No image found !");
    }
  };

  const downloadImagesNow = async (imageUrls) => {
    const zip = new JSZip();
    const requests = imageUrls.map(async (url, index) => {
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(`image${index + 1}.jpg`, blob);
    });

    await Promise.all(requests);

    zip
      .generateAsync({ type: "blob" })
      .then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "images.zip";
        link.click();
        toast.success("Download started!");
      })
      .catch(() => {
        toast.error("Failed to start download.");
      });
  };

  //login as

  const [Cookie, , removeCookie] = useCookies(["token", "type"]);

  const Gologin = async (username) => {
    const loading = toast.loading("Loggin in.");

    const formData = new FormData();
    formData.append("username", username);

    try {
      const res = await axios.post(`/api/auth/admin_login/`, formData);
      const { status, data } = res;

      if (status === 200) {
        toast.dismiss(loading);
        toast.success("Logged in successfully.");

        const Type1 = sessionStorage.getItem("type");
        const Token2 = sessionStorage.getItem("token");

        sessionStorage.setItem("token1", Token2);
        sessionStorage.setItem("type1", Type1);
        sessionStorage.setItem("url", "/admin/all-orders");

        sessionStorage.setItem("token", data?.token);
        sessionStorage.setItem("type", data?.type);

        removeCookie("token", { path: "/" });
        removeCookie("type", { path: "/" });

        if (data?.type == "BROKER") {
          router.push("/broker/dashboard");
        }
        if (data?.type == "FREELANCER") {
          router.push("/editor/dashboard");
        }
        if (data?.isAdmin == true) {
          router.push("/admin/dashboard");
        }
      }
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error?.response?.data?.detail);
    }
  };

  const [allPData, setAllPData] = useState(null);
  const allDatanow = async () => {
    const options = {
      method: "GET",
      url: "https://zillow-com1.p.rapidapi.com/property",
      params: { zpid: tempData.zpid },
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

  useEffect(() => {
    allDatanow();
  }, [tempData]);

  const handleDownload = (imageUrl) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "image.jpg";
        link.click();
        URL.revokeObjectURL(blobURL);
      });
  };

  useEffect(() => {
    if (tempData?.url) {
      getRetailorPropertyInformation();
    }
  }, [tempData?.url]);

  const getRetailorPropertyInformation = async () => {
    const options = {
      method: "GET",
      url: "https://us-real-estate-listings.p.rapidapi.com/v2/property",
      params: {
        property_url: `https://www.realtor.com/realestateandhomes-detail/${tempData?.url}`,
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

  async function getImageLinks(data) {
    const originalUrl = tempData?.url;
    const modifiedUrl = originalUrl.replace("/homedetails/", "homedetails/");
    const options = {
      method: "GET",
      url: tempData?.url.includes("_zpid")
        ? "https://zillow-com1.p.rapidapi.com/images"
        : "https://us-real-estate-listings.p.rapidapi.com/propertyPhotos",
      params: {
        ...(tempData?.url.includes("_zpid")
          ? { zpid: tempData?.zpid }
          : {
              property_url: `https://www.realtor.com/realestateandhomes-detail/${tempData?.url}`,
            }),
      },

      headers: {
        "X-RapidAPI-Key": tempData?.url.includes("_zpid")
          ? process.env.NEXT_PUBLIC_XRapidAPIKey
          : process.env.NEXT_PUBLIC_XRapidAPIKeyRealstate,
        "X-RapidAPI-Host": tempData?.url.includes("_zpid")
          ? process.env.NEXT_PUBLIC_XRapidAPIHost
          : process.env.NEXT_PUBLIC_XRapidAPIHostRealState,
      },
    };

    try {
      const response = await axios2.request(options);

      console.log("response", response);
      let imageLinksText = "";

      if (tempData?.url?.includes("_zpid")) {
        imageLinksText = response.data.images.join("\n");
      } else {
        const imageLinks =
          response?.data?.photos?.map((item) => ({
            url: item.href,
          })) || [];

        imageLinksText = imageLinks.map((link) => link.url).join("\n");
      }

      const blob = new Blob([imageLinksText], { type: "text/plain" });

      // Create a temporary link element and trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "image_links.txt";
      downloadLink.click();
    } catch (error) {
      console.error(error);
    }
  }
  console.log("retailorInfo ", retailorInfo);
  console.log("allPData",allPData)
  return (
    <div>
      <Button
        onClick={() => {
          setShowDetails(false);
          setTempData(null);
          scrollTo(0, 0);
        }}
        variant="outlined"
      >
        Back
      </Button>
      <h5 className="text-lg md:text-xl lg:text-2xl font-bold mt-5">
        Task Details
      </h5>

      <div className="mt-10 rounded-xl p-5 bg-white flex gap-3  md:gap-6 flex-wrap md:flex-row flex-col md:justify-between md:items-center">
        <div className="flex flex-col ">
          <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
            Posted
          </p>
          <p className="md:text-sm text-xs text-gray-600">
            {datetest(tempData?.created_at)}
          </p>
        </div>

        <div className="flex flex-col ">
          <p className="w-fit  ">Comission</p>
          <p className=" md:text-base text-sm  text-gray-600 font-bold">
            <span className=" text-primary text-lg ">$</span>&nbsp;
            {tempData?.order_commission ? tempData?.order_commission : "0"}
          </p>
        </div>

        <div className="flex flex-col ">
          <p className="w-fit  ">Order&nbsp;Type</p>
          <p className=" md:text-base text-sm  text-gray-600 font-bold">
            {tempData?.order_type}
          </p>
        </div>
        <div className="flex flex-col ">
          <p className="w-fit  ">Address</p>
          <p className=" md:text-base text-sm  text-gray-600 font-bold  gap-1">
            <FmdGoodIcon className="text-primary" />
            {tempData?.address}
          </p>
        </div>

        <Button
          onClick={() => {
            if (retailorInfo) {
              getImageLinks(retailorInfo?.data?.photos);
            } else {
              downloadImages();
            }
          }}
          className="h-fit w-fit text-primary rounded-full capitalize shadow-none"
          variant="outlined"
        >
          Collect&nbsp;Images
        </Button>
      </div>

      <div className="mt-10 rounded-xl p-5 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allPData?.bedrooms && (
          <div className="flex flex-col ">
            <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
              Bedrooms
            </p>
            <p className="md:text-sm text-xs text-gray-600">
              {allPData?.bedrooms}
            </p>
          </div>
        )}

        {allPData?.bathrooms && (
          <div className="flex flex-col ">
            <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
              Bathrooms
            </p>
            <p className="md:text-sm text-xs text-gray-600">
              {allPData?.bathrooms}
            </p>
          </div>
        )}

        {(allPData?.homeType ||
          retailorInfo?.data?.description?.type) && (
            <div className="flex flex-col">
              <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
                Home Type
              </p>
              <p className="md:text-sm text-xs text-gray-600">
                {allPData?.homeType?.replace("", " ") ||
                  retailorInfo?.data?.description?.type}
              </p>
            </div>
          )}

        {(allPData?.livingArea ||
          retailorInfo?.data?.description?.sqft) && (
            <div className="flex flex-col ">
              <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
                Square feet
              </p>
              <p className="md:text-sm text-xs text-gray-600">
                {allPData?.livingArea} {allPData?.livingAreaUnits}{" "}
                {retailorInfo?.data?.description?.sqft}{" "}
                {retailorInfo?.data?.description?.unit}
              </p>
            </div>
          )}

        {(allPData?.price ||
          retailorInfo?.data?.list_price) && (
            <div className="flex flex-col ">
              <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
                Property Price
              </p>
              <p className="md:text-sm text-xs text-gray-600">
                ${allPData?.price}{" "}
                {retailorInfo?.data?.list_price}
              </p>
            </div>
          )}

        {tempData?.order_sender?.profile?.full_name && (
          <div className="flex flex-col ">
            <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
              Broker Name
            </p>
            <p className="md:text-sm text-xs text-gray-600">
              {tempData?.order_sender?.profile?.full_name}
            </p>
          </div>
        )}

        {tempData?.order_sender?.profile?.phone_number && (
          <div className="flex flex-col ">
            <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
              Broker Phone
            </p>
            <p className="md:text-sm text-xs text-gray-600">
              {tempData?.order_sender?.profile?.phone_number}
            </p>
          </div>
        )}

        <div className="flex flex-col">
          <p className="w-fit  md:text-base text-sm text-gray-700 font-semibold">
            Broker Picture
          </p>

          <Button
            variant="contained"
            className="capitalize md:text-sm text-xs text-gray-600 w-fit"
            onClick={() =>
              handleDownload(tempData?.order_sender?.profile?.profile_pic)
            }
          >
            Download
          </Button>
        </div>
        {retailorInfo?.data?.details?.map((item, index) => {
          return (
            <div className="flex flex-col" key={index}>
              <p className=" md:text-base text-sm text-gray-700 font-semibold">
                {item?.category}
              </p>
              <p className="md:text-sm text-xs text-gray-600">
                {item?.text?.map(
                  (text, innerIndex) =>
                    innerIndex < 3 && (
                      <p key={innerIndex}>
                        {text}
                        {text?.length <= innerIndex + 1 ? "," : ""}
                      </p>
                    )
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <h4 className="text-center w-full">
              Here is the script for the video
            </h4>
          </AccordionSummary>
          <AccordionDetails className="bg-gray-50 p-10">
            <Typography>{tempData?.property_details}</Typography>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="mt-5 flex flex-wrap gap-y-3 gap-x-20 bg-white rounded-xl p-5">
        <FormControl disabled>
          <p>AI Assistant (Gender)</p>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="ai_gender"
            value={tempData?.assistant_type}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>

        <FormControl disabled>
          <p> Show assistant in video.</p>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="ai_gender"
            value={tempData?.assistant}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="No (Voice Only)"
            />
          </RadioGroup>
        </FormControl>

        <FormControl disabled>
          <p>Subtitle</p>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="subtitle"
            value={tempData?.apply_subtitle}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        <FormControl disabled>
          <p>Video Language</p>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="language"
            value={tempData?.video_language}
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
      </div>

      <div className="mt-10 bg-white p-5 rounded-xl gap-4 lg:gap-10 grid grid-cols-1 lg:grid-cols-2">
        <div className="lg:shadow-md lg:p-5">
          <img
            className=" p-2 lg:w-20 object-contain lg:h-20 w-16 h-16"
            alt={tempData?.order_sender?.profile?.email}
            src={tempData?.order_sender?.profile?.profile_pic || `/noimage.png`}
          />

          <p className="font-bold mt-2 text-primary">Order Sender</p>

          <div className="text-sm ">
            <p>Email: {tempData?.order_sender?.profile?.email}</p>
            {<p>Name: {tempData?.order_sender?.profile?.full_name}</p>}
            {<p>Address: {tempData?.order_sender?.profile?.address}</p>}
            {<p>Number: {tempData?.order_sender?.profile?.phone_number}</p>}
            <p>Username: {tempData?.order_sender?.profile?.username}</p>
            <Button
              onClick={() => {
                Gologin(tempData?.order_sender?.profile?.username);
              }}
              variant="contained bg-primary text-white hover:bg-primary2 font-bold mt-5"
            >
              Login as
            </Button>
          </div>
        </div>

        <div className="lg:shadow-md lg:p-5">
          <img
            className=" p-2 lg:w-20 object-contain lg:h-20 w-16 h-16"
            alt={tempData?.order_receiver?.profile?.email}
            src={
              tempData?.order_receiver?.profile?.profile_pic || `/noimage.png`
            }
          />

          <p className="font-bold mt-2 text-primary">Order Receiver</p>

          <div className="text-sm ">
            <p>Email: {tempData?.order_receiver?.profile?.email}</p>
            {<p>Name: {tempData?.order_receiver?.profile?.full_name}</p>}
            {/* {<p>Address: {tempData?.order_receiver?.profile?.address}</p>}
            {<p>Number: {tempData?.order_receiver?.profile?.phone_number}</p>} */}
            <p>Username: {tempData?.order_receiver?.profile?.username}</p>
            <Button
              onClick={() => {
                Gologin(tempData?.order_receiver?.profile?.username);
              }}
              variant="contained bg-primary text-white hover:bg-primary2 font-bold mt-5"
            >
              Login as
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 ">
        <h5 className=" md:text-base  font-bold ">Some quality advice :</h5>
        <p className="mt-5 text-gray-600">
          1. Replay the paragraph multiple times to ensure correct pronunciation
          without any voice glitches.
        </p>
        <p className=" text-gray-600">
          2. If the assistant has difficulty pronouncing numbers or specific
          words, you can manually add the pronunciation.
        </p>
        <p className=" text-gray-600">
          3. We recommend using Synthesia for the avatar assistant video and a
          green background for the script. For better control and quality
          transition effects, we suggest using Filmora for video editing.
        </p>

        <p className="mt-10 text-gray-600">
          <span className="text-red-600 font-bold">Important</span> : Do not
          exceed 60 seconds for this video.
        </p>
        <p className=" text-gray-600">
          <span className="text-red-600 font-bold">Important</span> :Make sure
          to synchronize the assistant&apos;s voice with the corresponding house
          image room.
        </p>
      </div>
    </div>
  );
}
