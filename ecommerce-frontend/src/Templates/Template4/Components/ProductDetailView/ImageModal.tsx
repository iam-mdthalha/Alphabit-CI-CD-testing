import { useEffect } from "react";

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onChangeImage: (index: number) => void;
}

const ImageModal = ({
  images,
  currentIndex,
  onClose,
  onChangeImage,
}: ImageModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onChangeImage((currentIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight")
        onChangeImage((currentIndex + 1) % images.length);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onChangeImage, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-white text-2xl hover:text-gray-300"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <button
          onClick={() =>
            onChangeImage((currentIndex - 1 + images.length) % images.length)
          }
          className="absolute left-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white"
        >
          &larr;
        </button>

        <img
          src={images[currentIndex]}
          alt="Full view"
          className="max-h-[80vh] max-w-full object-contain"
          
        />

        <button
          onClick={() => onChangeImage((currentIndex + 1) % images.length)}
          className="absolute right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white"
        >
          &rarr;
        </button>
      </div>

      <div className="p-4 overflow-x-auto bg-gray-900">
        <div className="flex gap-2 justify-center">
          {images.map((src, index) => (
            <div
              key={`thumb-${index}`}
              className={`flex-shrink-0 w-16 h-16 cursor-pointer border-2 transition-all ${
                currentIndex === index
                  ? "border-blue-500 scale-105"
                  : "border-transparent hover:border-white"
              }`}
              onClick={() => onChangeImage(index)}
            >
              <img
                src={src}
                alt={`Thumb ${index + 1}`}
                className="w-full h-full object-cover"
                
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
