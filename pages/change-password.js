import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
import axios from "../utils/axioswithPublic";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Typography from "@mui/material/Typography";

export default function Index() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };

  const initialValues = {};

  const validationSchema = Yup.object().shape({
    otp: Yup.string().required("OTP is required"),
    mypassword: Yup.string().required("Password is required"),
    mypassword2: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("mypassword")], "Passwords must match"),
  });

  const SaveOasswird = async (values) => {
    setIsloading(true);
    try {
      const res = await axios.post(
        `/api/recovery-account/reset-password-send-token/`,
        {
          password_reset_token: router.query.token,
          password_reset_OTP: values.otp,
          new_password: values.mypassword,
        }
      );
      setIsloading(false);
      const { status, data } = res;
      if (status === 202) {
        toast.success(data?.message);
        router.push("/");
      }
      //console.log("sent otp response", res);
    } catch (err) {
      setIsloading(false);
      //console.log(err);
      toast.error("The OTP you sent may be expired or not valid.");
    }
  };

  return (
    <>
      <Head>
        <title>Change Password - RealVision</title>
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

      <div className="flex min-h-screen">
        <div className="lg:w-1/2 lg:block hidden h-full overflow-hidden">
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

        <div className="lg:w-1/2 w-full lg:p-20 md:p-10 p-5 min-h-screen flex justify-center items-center">
          <div className="w-full md:w-2/3 lg:w-full h-fit">
            <h1 className="font-display font-bold lg:text-4xl md:text-2xl text-xl text-[#242424] text-center">
              Change Password
            </h1>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => SaveOasswird(values)}
            >
              <Form>
                <div className="flex flex-col gap-4 items-center mt-10 lg:mt-20">
                  <Field
                    as={TextField}
                    name="otp"
                    label="OTP"
                    variant="standard"
                    className="w-full lg:w-4/5 xl:w-3/5"
                  />
                  <ErrorMessage
                    name="otp"
                    component={Typography}
                    variant="body2"
                    className="text-red-500 text-sm"
                  />

                  <FormControl
                    variant="standard"
                    className="w-full lg:w-4/5 xl:w-3/5"
                  >
                    <InputLabel htmlFor="standard-adornment-password">
                      Password
                    </InputLabel>
                    <Field
                      as={Input}
                      name="mypassword"
                      id="standard-adornment-password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <ErrorMessage
                      name="mypassword"
                      component={Typography}
                      variant="body2"
                      className="text-red-500 text-sm w-full"
                    />
                  </FormControl>

                  <div className="w-full lg:w-4/5 xl:w-3/5">
                    <FormControl variant="standard" className="w-full">
                      <InputLabel htmlFor="standard-adornment-password">
                        Confirm Password
                      </InputLabel>
                      <Field
                        as={Input}
                        name="mypassword2"
                        id="standard-adornment-password"
                        type={showPassword2 ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword2}
                              onMouseDown={handleMouseDownPassword2}
                            >
                              {showPassword2 ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <ErrorMessage
                        name="mypassword2"
                        component={Typography}
                        variant="body2"
                        className="text-red-500 text-sm mt-3"
                      />
                    </FormControl>
                  </div>

                  <div className="flex justify-between w-full lg:w-4/5 xl:w-3/5 mt-3">
                    <Button
                      disabled={isloading}
                      type="submit"
                      variant="contained"
                      className="bg-primary2 shadow-none text-white font-bold hover:bg-primary rounded-full py-3 w-full"
                    >
                      Reset Password
                    </Button>
                  </div>
                </div>
              </Form>
            </Formik>

            <p className="text-center mt-10">
              <Link className="underline hover:text-red-500" href="/">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
