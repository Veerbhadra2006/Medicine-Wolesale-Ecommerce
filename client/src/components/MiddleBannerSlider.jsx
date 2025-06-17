import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from '../utils/Axios';
import SummaryApi, { baseURL } from '../common/SummaryApi';

const responsive = {
  allScreen: {
    breakpoint: { max: 1920, min: 0 },
    items: 1,
  },
};

const MiddleBannerSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(baseURL + SummaryApi.getAllBanners.url);
        const middleBanners = res.data.filter(b => b.type === 'middle');
        setBanners(middleBanners);
      } catch (err) {
        console.error('Error fetching middle banners:', err);
      }
    };

    fetchBanners();
  }, []);

  if (!banners.length) {
    return (
      <div className="w-full max-w-screen-xl mx-auto bg-gray-200 h-52 rounded-xl animate-pulse mb-4" />
    );
  }

  return (
    <section className="my-10 relative max-w-screen-xl mx-auto px-4">
      <Carousel
        swipeable
        draggable
        responsive={responsive}
        arrows={false}
        infinite
        autoPlay
        autoPlaySpeed={5000}
        showDots={true}
        dotListClass="custom-dot-list-style"
      >
        {banners.map((item, i) => (
          <div className="w-full rounded-xl overflow-hidden h-[180px] md:h-[240px] lg:h-[500px]" key={i}>
            <img
              src={item.image_url}
              alt={`middle-banner-${i}`}
              className="w-full h-full object-fill rounded-xl"
            />
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default MiddleBannerSlider;
