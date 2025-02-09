import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const ImageCarousel = () => {
  const images = [
    { src: "https://assets-portal-cms.olx.com.br/1576x300_Banner_da_Home_f93da65cf7.webp", url: "" },
    { src: "https://assets-portal-cms.olx.com.br/Carrossel_Web_1576x300_63f3a9b615.webp", url: "" },
    { src: "https://assets-portal-cms.olx.com.br/1576x300_c01e57b4ff.webp", url: "" },
  ];

  return (
    <Swiper
     style={{ width: '80%', borderRadius: "15px", zIndex: "10" }} 
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }} // Change delay to set switch time
      loop={true}   
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <a href={image.url} target="_blank" rel="noopener noreferrer">
            <img src={image.src} alt={`Slide ${index + 1}`} className="w-full h-auto" />
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
