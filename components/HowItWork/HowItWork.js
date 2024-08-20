import React, { useState } from "react";




const HowItWork = ({ handleClose, data }) => {
  // const router = useRouter();
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // const handleNextClick = () => {
  //   if (currentImageIndex < images.length - 1) {
  //     setCurrentImageIndex(currentImageIndex + 1);
  //   } else {
  //     if (data?.type == "BROKER") {
  //       router.push("/broker/dashboard");
  //     }
  //     if (data?.type == "FREELANCER") {
  //       router.push("/editor/dashboard");
  //     }
  //     if (data?.isAdmin == true) {
  //       router.push("/admin/dashboard");
  //     }
  //     handleClose();
  //   }
  // };

  return (
    <>
    <div className="my-10 p-5 bg-white rounded-xl">
      <p className="my-3 capitalize lg:text-2xl md:text-xl text-lg font-bold text-center">
        Create your Order By clicking the button below:
      </p>
      <iframe
        className="w-full aspect-video lg:w-1/2 mx-auto my-5  "
        src="https://www.youtube.com/embed/TZBa13i2UvQ"
      ></iframe>
      <Link href="/broker/new_order" className="flex justify-center">
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
  );
};

export default HowItWork;
