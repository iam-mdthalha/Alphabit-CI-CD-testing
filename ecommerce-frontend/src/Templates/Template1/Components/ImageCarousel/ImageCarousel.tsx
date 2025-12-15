import { Carousel } from "flowbite-react";
import { BannerDTO } from "Interface/Client/Banners/Banner.interface";
import { getImage } from "Utilities/ImageConverter";

type Props = {
  banners: Array<BannerDTO>;
};

const ImageCarousel = ({ banners }: Props) => {
  // const autoPlay = useRef(Autoplay({delay: 3000}));
  // const navigate = useNavigate();
  // const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  // return (
  //     <Carousel
  //         bg='var(--mantine-carousel-arrow-color)'
  //         classNames={carouselClasses}
  //         loop
  //         plugins={[autoPlay.current]}
  //         onMouseEnter={autoPlay.current.stop}
  //         onMouseLeave={autoPlay.current.reset}
  //         w={isMobile ? '390px' : '1250px'}
  //         h={isMobile ? '200px' : '265px'}
  //     >
  //         {
  //             banners.map((banner: Banner, i) => {
  //                 return <Carousel.Slide key={i}><Image fit='cover' h={isMobile ? '200px' : '265px'} onClick={() => { navigate('/shop?page=1'); }} key={i} src={getImage(banner.bannerImage)} alt="" /></Carousel.Slide>
  //             })
  //         }

  //     </Carousel>
  // );

  return (
    <div>
      <Carousel className="w-[90vw] md:w-[70vw] lg:w-[80vw] h-32 md:h-48">
        {banners.map((banner, i) => {
          return (
            <img
              key={i}
              src={getImage(banner.image) ?? undefined}
              alt="..."
              width="auto"
              height="auto"
            />
          );
        })}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
