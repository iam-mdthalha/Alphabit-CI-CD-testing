// const images: string[] = [
//     "/template3/Products/Shoe1/Detail/shoe_detail_1.webp",
//     "/template3/Products/Shoe1/Detail/shoe_detail_2.webp",
//     "/template3/Products/Shoe1/Detail/shoe_detail_3.webp",
//     "/template3/Products/Shoe1/Detail/shoe_detail_4.webp",
//     "/template3/Products/Shoe1/Detail/shoe_detail_5.webp"
// ];

import { getImage } from "Utilities/ImageConverter";

type ProductImagesProps = {
  images: string[];
};

const ProductImages = ({ images }: ProductImagesProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {images.map((src, index) => (
        <img
          width="auto"
          height="auto"
          key={index}
          src={getImage(src) ?? undefined}
          alt={`Product view ${index + 1}`}
          className="w-full object-cover"
        />
      ))}
    </div>
  );
};

export default ProductImages;
