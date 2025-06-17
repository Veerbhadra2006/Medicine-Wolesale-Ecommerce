import React, { useEffect, useRef, useState } from 'react';
import axios from '../utils/Axios';
import SummaryApi, { baseURL } from '../common/SummaryApi';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const sliderRef = useRef(null);
  const currentIndexRef = useRef(0); // Track current scroll index

  useEffect(() => {
  axios.get(baseURL + SummaryApi.getAllBanners.url)
    .then(res => {
      // ✅ Filter only banners of type 'top'
      const topBanners = res.data.filter(b => b.type === 'top');
      setBanners(topBanners);
    })
    .catch(err => console.error('Error fetching banners:', err));
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current || banners.length === 0) return;

      const container = sliderRef.current;
      const bannerWidth = container.firstChild?.offsetWidth || 0;
      const gap = 16; // matching Tailwind gap-4 => 1rem = 16px
      const scrollAmount = bannerWidth + gap;

      currentIndexRef.current =
        (currentIndexRef.current + 1) % banners.length;

      container.scrollTo({
        left: currentIndexRef.current * scrollAmount,
        behavior: 'smooth',
      });
    }, 3000); // scroll every 3 seconds

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners?.length) {
    return (
      <div className="w-full max-w-screen-xl mx-auto bg-blue-100 h-40 rounded-xl animate-pulse mb-4" />
    );
  }

  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-full max-w-screen-xl px-4">
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar"
        >
          {banners.map(b => (
            <a
              href={b.link_url}
              key={b._id}
              className="flex-shrink-0 w-72 md:w-80 lg:w-96"
            >
              <img
                src={b.image_url}
                alt={b.title || 'Banner'}
                className="w-full h-45 md:h-50 object-cover rounded-xl shadow-md"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
