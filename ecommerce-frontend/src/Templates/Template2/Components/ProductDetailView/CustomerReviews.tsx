"use client";

import { useState } from "react";
import ReviewModal from "Templates/Template2/Components/ProductDetailView/ReviewModal";

const reviews = [
  {
    name: "John Doe",
    rating: 5,
    date: "December 31, 2024",
    comment: "Fits Perfectly True to size. Material feels luxurious.",
  },
  {
    name: "Jane Smith",
    rating: 4,
    date: "December 30, 2024",
    comment: "Great shirt, but slightly larger than expected.",
  },
  {
    name: "Mike Johnson",
    rating: 5,
    date: "December 29, 2024",
    comment: "Excellent quality and very comfortable.",
  },
  {
    name: "Emily Brown",
    rating: 3,
    date: "December 28, 2024",
    comment: "Nice shirt, but the color was a bit off from what I expected.",
  },
  {
    name: "Chris Wilson",
    rating: 5,
    date: "December 27, 2024",
    comment: "Perfect fit and great style. Highly recommend!",
  },
  {
    name: "Sarah Lee",
    rating: 4,
    date: "December 26, 2024",
    comment: "Good quality shirt, but took longer than expected to arrive.",
  },
  {
    name: "Tom Harris",
    rating: 5,
    date: "December 25, 2024",
    comment: "Absolutely love this shirt! Will be buying more.",
  },
  {
    name: "Lisa Chen",
    rating: 4,
    date: "December 24, 2024",
    comment: "Nice material and fit, but wrinkles easily.",
  },
  {
    name: "David Kim",
    rating: 5,
    date: "December 23, 2024",
    comment: "Great shirt for both casual and semi-formal occasions.",
  },
  {
    name: "Rachel Green",
    rating: 4,
    date: "December 22, 2024",
    comment: "Good value for money. Comfortable to wear all day.",
  },
];

const CustomerReviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const reviewsPerPage = 6;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <div className="mt-12 w-full md:w-[80vw] mx-auto pb-12">
      <h2 className="text-2xl font-bold text-center uppercase border-b pb-4 mb-6">
        Customer Reviews
      </h2>
      <div className="flex flex-col gap-8">
        {currentReviews.map((review, index) => (
          <div key={index}>
            <h3 className="font-semibold">{review.name}</h3>
            <div className="flex items-center my-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "text-black-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-xs text-gray-600">{review.date}</span>
            </div>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-6">
        <button
          className="mx-2 px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &#60;
        </button>
        <span className="mx-4 text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="mx-2 px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          &#62;
        </button>
      </div>
      <div className="w-full flex justify-center items-center mt-12">
        <button className="uppercase tracking-widest bg-black text-white border border-black text-xs font-semibold px-8 py-4 transition-all duration-300 ease-in-out hover:border-blue-500 hover:bg-blue-500 relative overflow-hidden group">
          <span className="relative z-10" onClick={() => setIsReviewOpen(true)}>
            Write A Review
          </span>
          <span className="absolute inset-0 bg-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
        </button>
      </div>

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </div>
  );
};

export default CustomerReviews;
