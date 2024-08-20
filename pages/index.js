import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import googlesvg from "../assests/google.svg";
import facebooksvg from "../assests/facebook.svg";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import { Formik } from "formik";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import axios from "../utils/axioswithPublic";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
// import axios2 from "axios"
import withPublic from "@/hoc/withPublic";
import Modal from "@mui/material/Modal";
import HowItWork from "@/components/HowItWork/HowItWork";

function Index() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("");
  const [open, setOpen] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = () => {
    event.preventDefault();
  };

  const [isLoading, setIsLoading] = React.useState(false);
  const [cookie, setCookie] = useCookies(["token", "type"]);
  const [type, setType] = useState();

  const logingoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      //console.log(tokenResponse);
      await signinFuncitonGoogle(tokenResponse.access_token);
    },
  });

  const signinFuncitonGoogle = async (values) => {
    setIsLoading(true);
    //console.log("i am the data for sign in", values);

    const loading = toast.loading("Please wait a moment...");
    try {
      const res = await axios.post(`api/auth/google_authentication/`, {
        access_token: values,
      });
      const { status, data } = res;
      //console.log("submit data ", res);
      if (status === 200) {
        setIsLoading(false);
        toast.dismiss(loading);
        toast.success("Logged in successfully.");

        sessionStorage.setItem("token", data?.access_token);
        sessionStorage.setItem("type", data?.type);

        if (values.remember == true) {
          setCookie("token", data?.token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
          setCookie("type", data?.type, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
        }

        if (data?.type == "BROKER") {
          router.push("/broker/dashboard");
        }
        if (data?.type == "ADMIN") {
          router.push("/admin/dashboard");
        }
        if (data?.type == "FREELANCER") {
          router.push("/editor/dashboard");
        }
      }
    } catch (error) {
      setIsLoading(false);
      const { status, data } = error?.response;
      toast.dismiss(loading);

      if (data?.username[0]?.length) {
        toast.error(data?.username[0]);
      }

      if (data?.email[0]?.length) {
        toast.error(data?.email[0]);
      }

      //console.log("error from submit", error);
    }
  };

  const signinFunciton = async (values) => {
    setIsLoading(true);
    //console.log("i am the data for sign in", values);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    const loading = toast.loading("Please wait a moment...");
    try {
      const res = await axios.post(`/api/auth/login/`, formData);
      const { status, data } = res;
      //console.log("submit data ", res);
      toast.dismiss(loading);

      if (status === 200) {
        setIsLoading(false);
        toast.success("Logged in successfully.");

        sessionStorage.setItem("token", data?.token);

        if (data?.type == "UNSPECIFIED") {
          sessionStorage.setItem("type", "ADMIN");
        } else {
          sessionStorage.setItem("type", data?.type);
        }

        if (values.remember == true) {
          setCookie("token", data?.token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
          if (data?.isAdmin == true) {
            setCookie("type", "ADMIN", {
              path: "/",
              maxAge: 60 * 60 * 24 * 7, // 1 week
            });
          } else {
            setCookie("type", data?.type, {
              path: "/",
              maxAge: 60 * 60 * 24 * 7, // 1 week
            });
          }
        }
        ipaddresssubmit(data?.token);
        setType(data);
        // router.push("/process/property")
        if (data?.type == "BROKER") {
          router.push("/process/property");
        }
        if (data?.type == "UNSPECIFIED") {
          router.push("/admin/dashboard");
        }
        if (data?.type == "FREELANCER") {
          router.push("/editor/dashboard");
        }
      }
    } catch (error) {
      //console.log(error);
      toast.dismiss(loading);
      setIsLoading(false);
      toast.error(error?.response?.data?.detail);
    }
  };

  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIpAddress();
  }, []);

  const ipaddresssubmit = async (token) => {
    const formData = new FormData();
    formData.append("ip", ipAddress);

    try {
      const res = await axios.post(`/api/auth/post_ip/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //console.log("ip res", res);

      const { status } = res;
      if (status === 200) {
        // Handle successful response
      }
    } catch (err) {
      //console.log("ip res", err);
      // Handle error
    }
  };

  //console.log("ipAddress", ipAddress);
  //Modal Function
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>Login - RealVision</title>
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

      <div className="flex min-h-screen ">
        <div className="lg:w-1/2  lg:block hidden h-full overflow-hidden">
          <Image
            placeholder="blur"
            src="/login.png"
            alt="Logo"
            className="object-cover h-screen w-full"
            blurDataURL="/blur.png"
            width={1000}
            height={800}
          />
        </div>

        <div className="lg:w-1/2 justify-center w-full lg:p-20 md:p-10 p-5 min-h-screen flex md:items-center">
          <div className="w-full md:w-2/3 lg:w-full h-fit">
            <Image
              placeholder="blur"
              src="/logo.png"
              width={500}
              height={500}
              alt="Picture of the author"
              blurDataURL="/blur.png"
              className="mx-auto  p-5 md:h-32 mb-5  h-24 object-contain"
            />

            <h1 className="font-display font-bold lg:text-4xl md:text-2xl text-xl text-[#242424]  text-center mt-16 md:mt-0">
              Welcome back to
            </h1>
            <h2 className="font-display mt-2 font-bold lg:text-4xl md:text-2xl text-xl text-[#242424]  text-center">
              RealVision Media
            </h2>
            <Formik
              initialValues={{ email: "", password: "", remember: "false" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
                    values.email
                  )
                ) {
                  errors.email = "Invalid email.";
                }

                if (!values.password) {
                  errors.password = "Password is required";
                }

                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                signinFunciton(values);
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
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4 items-center mt-10 lg:mt-20">
                    <TextField
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="standard-basic"
                      label="Email"
                      variant="standard"
                      className="w-full lg:w-4/5 xl:w-3/5"
                      error={errors.email && touched.email}
                      helperText={errors.email}
                    />

                    <FormControl
                      variant="standard"
                      className="w-full lg:w-4/5 xl:w-3/5"
                      helperText={errors.password} // Make sure errors.password is not empty
                      error={errors.password && touched.password}
                    >
                      <InputLabel htmlFor="standard-adornment-password">
                        Password
                      </InputLabel>
                      <Input
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        id="standard-adornment-password"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {errors.password &&
                        touched.password &&
                        errors.password && (
                          <FormHelperText>{errors.password}</FormHelperText>
                        )}
                    </FormControl>

                    <div className="flex justify-between w-full lg:w-4/5 xl:w-3/5 mt-10">
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              values.remember = e.target.checked;
                            }}
                          />
                        }
                        label="Remember me"
                      />

                      <Button
                        disabled={isLoading}
                        type="submit"
                        variant="contained"
                        className="bg-primary2 text-white  shadow-none font-bold hover:bg-primary rounded-full py-3 w-1/2"
                      >
                        LOGIN
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>

            <p className="text-center mt-10">
              Password lost?&nbsp;
              <Link
                className="underline hover:text-red-500"
                href="/recover_password"
              >
                Recover password
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* <div>
        <Modal
          open={open}
          // onClose={handleClose}
          className="w-full h-40"
          aria-labelledby="full-screen-modal-title"
          aria-describedby="full-screen-modal-description"
        >
          <HowItWork handleClose={handleClose} data={type}></HowItWork>
        </Modal>
      </div> */}
    </>
  );
}

export default withPublic(Index);