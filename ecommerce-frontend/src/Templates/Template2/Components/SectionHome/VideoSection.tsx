import CustomButton from "../../../../Components/StyleComponent/CustomButton";

const VideoSection = () => {
  return (
    <div className="relative w-full h-auto mt-16">
      <div
        className="Slideshow__ImageContainer Image--contrast hidden-phone"
        style={{
          backgroundImage:
            "url(//hamercop.com/cdn/shop/files/output-onlinepngtools_1x1.png.jpg?v=1654238184)",
        }}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://cdn.shopify.com/videos/c/o/v/2112952ca1164ad694d9ad3779788a26.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <CustomButton>Shop Now</CustomButton>
      </div>
    </div>
  );
};

export default VideoSection;
