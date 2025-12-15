"use client";

import { useState } from "react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    reviewTitle: "",
    body: "",
    customerImage: null as File | null,
    recommend: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({ ...prevData, customerImage: file }));
  };

  const handleRecommendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, recommend: e.target.checked }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white p-4 md:p-12 rounded-xl w-[90vw] md:w-[50vw] max-h-[80vh] overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-start border-b mb-4">
          <h1 className="text-xl font-medium mb-4">Write a review</h1>
          <button onClick={onClose} className="text-3xl">
            &times;
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name (Shown publicly like John Smith) *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Name"
              className="w-full border p-2 text-xs rounded mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="w-full border p-2 text-xs rounded mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium">
              Rating*
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              placeholder="Enter your rating (1-5)"
              className="w-full border p-2 text-xs rounded mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="reviewTitle" className="block text-sm font-medium">
              Review Title
            </label>
            <input
              type="text"
              id="reviewTitle"
              name="reviewTitle"
              value={formData.reviewTitle}
              onChange={handleChange}
              placeholder="Give your review a title"
              className="w-full border p-2 text-xs rounded mt-1"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium">
              Body of Review*
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Write your comments here"
              rows={4}
              className="w-full border p-2 text-xs rounded mt-1"
              required
            />
          </div>

          <div>
            <label
              htmlFor="customerImage"
              className="block text-sm font-medium"
            >
              Customer Image
            </label>
            <div className="border rounded-lg p-4 mt-2">
              <input
                type="file"
                id="customerImage"
                name="customerImage"
                onChange={handleFileChange}
                className="w-full mt-1 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recommend"
              name="recommend"
              checked={formData.recommend}
              onChange={handleRecommendChange}
              className="mr-2"
            />
            <label htmlFor="recommend" className="text-sm">
              Would you recommend this product?
            </label>
          </div>

          <button
            type="submit"
            className="w-full uppercase tracking-widest bg-black text-white border border-black text-xs font-semibold px-8 py-4 transition-all duration-300 ease-in-out hover:text-black hover:bg-transparent relative overflow-hidden group"
          >
            <span className="relative z-10">Submit Review</span>
            <span className="absolute inset-0 bg-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
