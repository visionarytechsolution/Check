import React from "react";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button } from "@mui/material";
import ActionOptions from "./ActionOptions";

import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import axios from "../../../utils/axios";
import { useRouter } from "next/router";

export default function VideoTable({ setStatus, profiles }) {
  const [cookie, setCookie] = useCookies(["token", "type"]);
  const [Cookie, , removeCookie] = useCookies(["token", "type"]);
  const router = useRouter();

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
        sessionStorage.setItem("url", "/admin/client-list");

        sessionStorage.setItem("token", data?.token);
        sessionStorage.setItem("type", data?.type);

        removeCookie("token", { path: "/" });
        removeCookie("type", { path: "/" });

        if (data?.type == "BROKER") {
          router.push("/process/property");
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
  console.log("Data", profiles?.results?.data);

  return (
    <div className="mt-10 overflow-auto">
      <div className="bg-white rounded-t-xl overflow-hidden  min-w-[1200px] p-5">
        <table className="table-auto w-full text-sm ">
          <thead className="border-b">
            <tr>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">
                Client
              </th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-left ">
                Date
              </th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-center ">
                Language
              </th>

              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-center ">
                Status
              </th>
              <th className="lg:text-lg md:text-base text-sm font-bold p-4 text-center ">
                Login as
              </th>
              {/* <th className="w-20 lg:text-lg md:text-base text-sm font-bold p-4 text-left ">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody>
            {profiles?.results?.data?.length > 0 &&
              profiles?.results?.data?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 lg:gap-4 items-center">
                      <img
                        src={item?.profile?.profile_pic || "/noimage.png"}
                        alt="Logo"
                        width={60}
                        height={60}
                        className="object-contain rounded-full overflow-hidden h-16 w-16"
                        onError={(event) => {
                          event.target.src = "/noimage.png";
                        }}
                      />

                      <div className="text-sm ">
                        <p className="font-bold">{item?.profile?.full_name}</p>
                        <p className="">{item?.profile?.email}</p>
                        {item?.zuid && (
                          <p className="text-xs text-primary">{item?.zuid}</p>
                        )}
                        {item?.realtor_profile_url && (
                          <p className="text-xs text-amber-400">
                            {item?.realtor_profile_url}
                          </p>
                        )}
                       
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{datetest(item?.created_at)}</td>
                  <td className="font-bold px-4 py-2 capitalize text-center">
                    {item?.language ? item?.language : "English"}
                  </td>

                  <td className="px-4 py-2">
                    <p className="bg-primary px-3 py-2 rounded-xl w-fit text-white mx-auto">
                      Active
                    </p>
                  </td>
                  <td className="px-4 py-2">
                    <div className="w-fit mx-auto">
                      <Button
                        onClick={() => {
                          Gologin(item?.profile?.username);
                        }}
                        variant="outlined"
                        className="capitalize text-primary rounded-xl px-3  hover:bg-primary border-2 border-primary hover:text-white"
                      >
                        Login as broker
                      </Button>
                    </div>
                  </td>
                  {/* <td className="px-4 py-2">
                    <ActionOptions />
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
