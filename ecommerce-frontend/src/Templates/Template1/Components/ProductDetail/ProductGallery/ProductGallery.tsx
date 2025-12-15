import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ProductDetailDTO } from "Types/ProductDetailDTO";
import { getImage } from "Utilities/ImageConverter";
import { useEffect, useState } from "react";

type Props = {
  productDetail: ProductDetailDTO;
};

const ProductGallery = ({ productDetail }: Props) => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const images: Array<string> = productDetail.imagePaths;
  const mainImage: string = productDetail.productWrapper.imagePath;

  const allImages = images.length > 0 ? [...images, mainImage] : [mainImage];
  const [activeImage, setActiveImage] = useState(allImages[0]);

  useEffect(() => {
    setActiveImage(mainImage);
  }, [mainImage]);

  // return (
  //     <>
  //         <Flex direction={'column'} gap={5}>
  //             {
  //                 allImages.length > 0 &&
  //                 allImages.map((imageString, i) => {
  //                     return (
  //                         <div key={i} style={{ border: imageString === activeImage ? '2px solid var(--mantine-color-secondary-filled)' : 'none' }}>
  //                             <Image w={90} h={120} src={imageString && getImage(imageString)} onClick={() => { setActiveImage(imageString) }} />
  //                         </div>
  //                     );
  //                 })}
  //         </Flex>
  //         <div>
  //             <img className="w-[400px]" src={(activeImage && getImage(activeImage)) ?? undefined} />
  //         </div>
  //     </>

  // );

  return (
    <div className="lg:col-span-3 lg:row-end-1">
      <div className="lg:flex lg:items-start">
        <div className="lg:order-2 lg:ml-5 w-full">
          <div className="max-w-full overflow-hidden border-solid border-[2px] rounded-lg bg-primary-400">
            <img
              width="auto"
              height="auto"
              className="h-full w-full max-w-full object-cover"
              src={(activeImage && getImage(activeImage)) ?? undefined}
              alt=""
            />
          </div>
        </div>

        <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
          <div className="flex flex-row items-start lg:flex-col">
            {allImages.length > 0 &&
              allImages.map((imageString, i) => {
                return (
                  <button
                    key={i}
                    type="button"
                    className={
                      imageString === activeImage
                        ? "flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center"
                        : "flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg text-center"
                    }
                    onClick={() => {
                      setActiveImage(imageString);
                    }}
                  >
                    <img
                      width="auto"
                      height="auto"
                      className="h-full w-full object-cover object-top"
                      src={(imageString && getImage(imageString)) ?? undefined}
                      alt=""
                    />
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
