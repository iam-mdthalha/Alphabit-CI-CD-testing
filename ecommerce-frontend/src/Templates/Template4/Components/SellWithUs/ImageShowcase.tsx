import React from "react";

const ImageShowcase: React.FC = () => {
  return (
    <div className="order-1 lg:order-2 relative rounded-2xl overflow-hidden shadow-2xl">
      <img
        src="/template4/Books.jpg"
        alt="Books showcase"
        className="w-full h-[420px] object-cover rounded-2xl"
      />
      <div className="absolute -bottom-4 -left-4 hidden md:block w-24 h-24 bg-vintageBg rounded-xl opacity-20"></div>
      <div className="absolute -top-4 -right-4 hidden md:block w-20 h-20 bg-vintageBg rounded-xl opacity-20"></div>
    </div>
  );
};

export default ImageShowcase;
