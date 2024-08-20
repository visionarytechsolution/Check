import { useSelector } from 'react-redux'

export default function OrderSummery({ selectedAddress, firstphoto,realtorImage }) {
  const Price = useSelector(state => state.Price)
  console.log('idot ', firstphoto)
  console.log("selectedAddress",selectedAddress)
  const address = sessionStorage.getItem("realtorAddress");
  const image = sessionStorage.getItem("realtorImage");
  console.log("image",image);
  console.log("address",address)
  return (
    <div className="mt-5">
      <p className="lg:text-xl md:text-lg text-base border-b pb-2">Summery</p>

      <div className="mt-3 flex gap-4 md:flex-row flex-col md:justify-between md:items-center">
        <img
          className="rounded-lg w-20 h-20"
          src={firstphoto || selectedAddress?.primary_photo_url || realtorImage?.photo || image?.photo}
        />

        <div className="flex flex-col md:max-w-[40%]">
          <span className="text-gray-700 lg:text-lg">Teaser Video</span>
          <p className="text-gray-700 ">
            <span className="font-semibold"> Address:&nbsp;</span>
            <span className="text-sm text-gray-500">
              {[
                selectedAddress?.address?.line1 ? selectedAddress.address.line1 : '',
                selectedAddress?.address?.line2 ? selectedAddress.address.line2 : '',
                selectedAddress?.address?.city ? selectedAddress.address.city : '',
                selectedAddress?.address?.postcode ? selectedAddress.address.postcode : '',
              ]
                .filter(item => item !== '')
                .join(', ')}
            </span>
          </p>
        </div>

        <div>
          <p className=" w-fit">
            Price:<span className="font-bold lg:text-lg">${Price?.PriceData?.amount}</span>
          </p>
          <p className=" w-fit">
            Quantity:<span className="font-bold lg:text-lg">x 1</span>
          </p>
        </div>
      </div>
    </div>
  )
}
