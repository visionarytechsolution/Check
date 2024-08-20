import React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

export default function PromoSlider() {
  const links = [
    'https://www.youtube.com/embed/TZBa13i2UvQ',
    'https://www.youtube.com/embed/5WghCo-wJ5Q',
    'https://www.youtube.com/embed/NW3DsS4XAHQ',
  ]
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1400 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    lg: {
      breakpoint: { max: 1400, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    lgmobile: {
      breakpoint: { max: 767, min: 500 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 500, min: 200 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  }
  return (
    <div className="my-10">
      <h3 className="lg:text-2xl md:text-xl text-lg font-bold ">Watch Our Demo</h3>
      <div className="p-5 bg-white rounded-2xl mt-5">
        <Carousel
          responsive={responsive}
          autoPlay={false}
          autoPlaySpeed={3000}
          swipeable={true}
          draggable={true}
          showDots={true}
          infinite={true}
          partialVisible={false}
          containerClass="h-fit pb-10"
          dotListClassName="custom-dot-list-style"
          customLeftArrow={<span className=""></span>}
          customRightArrow={<span></span>}
        >
          {links?.length > 0 &&
            links?.map((item, index) => {
              return (
                <div className="flex items-center h-full mx-0 lg:mx-2 pt-3" key={index}>
                  <iframe
                    src={item}
                    title="Video Player"
                    width="100%"
                    height="100%"
                    className="aspect-video rounded"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              )
            })}
        </Carousel>
      </div>
    </div>
  )
}
