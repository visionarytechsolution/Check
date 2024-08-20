import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LayoutBroker from "../../components/Layout/LayoutBroker";

const property = () => {
  const Price = useSelector((state) => state.Price);
  const User = useSelector((state) => state.User);
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/process/placeOrder");
  };

  return (
    <LayoutBroker active="process">
      <div className="bg-[#f5fcfa] pt-2">
        <div className="flex flex-col h-screen justify-center items-center">
          <div className="text-center mb-2">
            <h1 className="text-[34px] lg:text-[40px] font-bold">
              Hi,{User?.UserData?.profile?.full_name}
            </h1>
            <p className="text-[12px] lg:text-[16px] text-[#6F6C90]">
              Follow these 4 easy steps to create your first video in 2 minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4 lg:px-20">
            <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
              <div className="bg-white ml-0 lg:ml-5 shadow-lg p-3 rounded-3xl">
                <div className="pl-8">
                  <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li className="mb-10 ml-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white ">
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
                      <h3 className="font-medium leading-tight">
                        Watch demo template video
                      </h3>
                      <p className="text-xs">
                        Please watch an example of video we are creating for our
                        client
                      </p>
                    </li>
                    <li className="mb-10 ml-6">
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
                      <h3 className="font-medium leading-tight">
                        Place an order now
                      </h3>
                      <p className="text-xs">
                        Let turn your property listing into a captivating
                        interactive video
                      </p>
                    </li>
                    <li className="mb-10 ml-6">
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
                      <h3 className="font-medium leading-tight">
                        Payment process
                      </h3>
                      <p className="text-xs">
                        Process the payment trought our secure merchant
                      </p>
                    </li>
                    <li className="ml-6">
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
                      <h3 className="font-medium leading-tight">
                        Revision of your code
                      </h3>
                      <p className="text-xs">
                        Please confirm all information are correct
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="bg-[#98CFB2] shadow-lg p-3 rounded-xl mt-2 ml-5">
                <div className="text-l font-bold pl-4 text-white">
                  You have questions?
                </div>
                <div className="text-l font-bold pl-4 text-white">
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

            {/* Right Side - Video */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-4">
              <div className="bg-white shadow-lg p-6 rounded-3xl">
                <p className="text-2xl lg:text-3xl font-semibold mb-2">
                  Property video demonstration
                </p>
                <p className="text-gray-600 mb-4">
                  We offer two different versions of the video, one with an
                  actor or actress, or only with a voice-over. You can also
                  choose the gender of the voice and actor, and use subtitles or
                  not for social networks.
                </p>
                <div className="flex items-center justify-center">
                  <iframe
                    className="w-full aspect-video lg:w-1/2 mx-auto my-2"
                    src="https://www.youtube.com/embed/TZBa13i2UvQ"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className="flex py-6 lg:py-9 bg-[#98CFB2] border w-full lg:w-[1261px] my-10 rounded-xl justify-between items-center">
            <h1 className="ml-3 lg:ml-5 xl:ml-96 font-bold text-lg lg:text-xl xl:text-2xl">
              You ❤️ Our Work?
            </h1>
            <button
              className="flex items-center bg-white px-3 lg:px-4 py-2 lg:py-3 rounded-lg shadow-lg text-sm lg:text-base font-bold focus:outline-none focus:ring focus:ring-blue-300 mr-2 lg:mr-3 xl:mr-5"
              type="submit"
              onClick={handleButtonClick}
            >
              Convert property to video ${Price?.PriceData?.amount} &nbsp;
              {Price?.PriceData?.amount < 69 && (
                <span className="line-through text-red-700">69</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </LayoutBroker>
  );
};

export default property;
