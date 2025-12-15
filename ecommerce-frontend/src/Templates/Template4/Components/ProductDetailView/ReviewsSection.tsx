import React, { useState } from "react";

interface Review {
  rating: number;
  comment: string;
  author: string;
}

const ReviewsSection: React.FC = () => {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [reviews, setReviews] = useState<Review[]>([
    {
      rating: 5,
      comment: "Absolutely loved this cozy romance—felt like autumn in a book.",
      author: "Ava R.",
    },
    {
      rating: 4,
      comment: "Great small-town setting, charming characters.",
      author: "Tyler P.",
    },
  ]);

  const handleReviewSubmit = () => {
    if (userReview && userRating) {
      setReviews([
        { rating: userRating, comment: userReview, author: "Guest" },
        ...reviews,
      ]);
      setUserReview("");
      setUserRating(0);
    }
  };

  return (
    <section className="w-full max-w-3xl bg-vintageBg shadow-lg rounded-2xl p-6 my-8">
      <h2 className="text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-6">
        Rate the Book
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex flex-col items-center min-w-[100px]">
          <div className="text-3xl font-bold text-green-800">3.49</div>
          <div className="flex text-yellow-500 mb-1 mt-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n}>
                <svg width={28} height={28} fill="currentColor">
                  <polygon points="14,2 18,10 27,11 20,17 22,26 14,21 6,26 8,17 1,11 10,10" />
                </svg>
              </span>
            ))}
          </div>
          <span className="text-base text-green-500">42 Ratings</span>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-1">
          {[5, 4, 3, 2, 1].map((star, idx) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{star}</span>
              <div className="bg-green-500 h-3 rounded w-full relative">
                <div
                  className="bg-green-600 h-3 rounded absolute top-0 left-0"
                  style={{ width: [70, 60, 32, 18, 29][idx] + "%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-vintageBg rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-4 my-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
          alt="Reader avatar"
          className="w-12 h-12 rounded-full self-start"
        />
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-lg text-vintageText font-melodramaRegular">
              What readers are saying about this book
            </span>
            <span className="ml-2 text-sm text-black-700">
              Summarized by{" "}
              <a href="#" className="underline text-green-600">
                Moore Market AI
              </a>
            </span>
          </div>
          <p className="text-sm md:text-lg text-justify text-black-500">
            Moore Market Books readers generally appreciate this book for its
            cozy, small-town romance set against a fall backdrop...
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-12 max-w-3xl">
        <input
          type="text"
          placeholder="Write a review..."
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
          className="w-full sm:w-auto flex-grow border border-vintageText bg-transparent rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-vintageText focus:ring-opacity-50"
        />
        <button
          onClick={handleReviewSubmit}
          className="bg-vintageText text-vintageBg rounded-lg font-semibold px-6 py-3 hover:bg-opacity-90 transition-colors whitespace-nowrap"
        >
          Submit
        </button>
      </div>
      <div>
        {reviews.map((review, i) => (
          <div
            key={i}
            className="mb-6 p-4 rounded-lg border border-vintage-200 bg-vintageBg/60 shadow"
          >
            <div className="flex items-center mb-2 ">
              {[...Array(review.rating)].map((_, idx) => (
                <span key={idx} className="text-yellow-500 text-2xl">
                  ★
                </span>
              ))}
            </div>
            <p className="text-black-500 text-lg font-">{review.comment}</p>
            <p className="text-sm text-black-500 mt-1 font-">
              - {review.author}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
