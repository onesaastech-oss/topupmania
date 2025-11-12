"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useBanners } from "../context/BannerContext";

// Fallback slides in case API fails
const fallbackSlides = [
  { bg: "/images/1.jpg"}, 
  { bg: "/images/2.jpg"}, 
  { bg: "/images/3.jpg"} 
];

export default function HeroSlider() {
  const { getPrimaryBanners, loading } = useBanners();
  
  const primaryBanners = getPrimaryBanners();
  const banners = primaryBanners.length > 0 ? primaryBanners : fallbackSlides;

  const options = {
    type: "loop",
    autoplay: true,
    interval: 5000,
    arrows: false,
    pagination: false,
    gap: "5rem",
    perPage: 1,
  };

  if (loading) {
    return (
      <div className="w-full" style={{ paddingTop: '2px' }}>
        <div className="animate-pulse">
          <div className="h-[180px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] w-[95%] mx-auto bg-gray-300 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ paddingTop: '2px' }}>
      <Splide options={options}>
        {banners.map((banner, index) => (
          <SplideSlide key={banner.id || index}>
            {/* Card */}
            <div
              className={`
                relative rounded-3xl overflow-hidden shadow-lg mx-auto
                h-[180px] w-[95%] max-w-[1500px]  /* Mobile first */
                sm:h-[250px] sm:w-[90%]           /* Small screens */
                md:h-[300px] md:w-[85%]           /* Medium screens */
                lg:h-[350px] lg:w-[100%]           /* Large screens */
                xl:h-[400px] xl:w-[100%]           /* Extra large screens */
              `}
              style={{
                backgroundImage: `url(${banner.image || banner.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay gradient - only show if banner has title */}
              {banner.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/50"></div>
              )}
              
              {/* Banner title */}
              {banner.title && (
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-lg font-semibold">
                    {banner.title}
                  </h3>
                </div>
              )}

              {/* Clickable link if URL exists */}
              {banner.url && (
                <a 
                  href={banner.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`Visit ${banner.title || 'banner'}`}
                />
              )}
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}


