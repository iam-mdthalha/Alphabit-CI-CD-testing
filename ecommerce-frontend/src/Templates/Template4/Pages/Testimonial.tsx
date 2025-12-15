import React from "react";
import { Star, ArrowRight, BookOpen } from "lucide-react";

interface Book {
  title: string;
  cover: string;
}

interface Testimonial {
  name: string;
  rating: number;
  text: string;
  size: string;
  book?: Book;
}

interface TestimonialCardProps {
  name: string;
  rating: number;
  text: string;
  book?: Book;
  large?: boolean;
}

interface TopBook {
  title: string;
  author: string;
  rating: number;
  sales: string;
  cover: string;
  badge: string;
}

const TestimonialsWithBooks = () => {
  const testimonials: Testimonial[] = [
    {
      name: "John Smith",
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed dolor eiusmod.",
      size: "small",
    },
    {
      name: "Lucas Gray",
      rating: 5,
      book: { title: "Fragments Unseen", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center" },
      text: "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed dolor eiusmod.",
      size: "large",
    },
    {
      name: "Emma Bennett",
      rating: 5,
      book: { title: "Beyond Tomorrow", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center" },
      text: "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed dolor eiusmod.",
      size: "large",
    },
    {
      name: "Sarah Jones",
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed dolor eiusmod.",
      size: "small",
    },
    {
      name: "Jessica Love",
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed dolor eiusmod.",
      size: "small",
    },
    {
      name: "Michael Smith",
      rating: 5,
      book: { title: "Echoes of Light", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center" },
      text: "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed dolor eiusmod.",
      size: "large",
    },
  ];

  const topBooks: TopBook[] = [
    {
      title: "The Midnight Garden",
      author: "Sarah Mitchell",
      rating: 4.9,
      sales: "50k+ sold",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
      badge: "Bestseller"
    },
    {
      title: "Whispers of Time",
      author: "David Chen",
      rating: 4.8,
      sales: "35k+ sold",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
      badge: "Bestseller"
    },
       {
      title: "Death Note",
      author: "Inzamam",
      rating: 4.8,
      sales: "35k+ sold",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
      badge: "Bestseller"
    }
  ];

  return (
    <div className="w-full py-12 bg-amber-50">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Top Books Section */}
        <div data-aos="fade-right" className="flex-1">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-melodramaRegular font-bold text-gray-800 inline-block relative mb-4">
              Top Books
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800" />
            </h2>
          </div>

          <div   className="flex flex-col gap-6 justify-center items-center">
            {topBooks.map((book, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 w-full max-w-md hover:shadow-lg transition-shadow duration-300 h-[140px] flex gap-4">
                {/* Book Cover - Left Side */}
                <div className="w-20 h-full bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Info - Right Side */}
                <div className="flex flex-col flex-1">
                  {/* Badge and Rating */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                      {book.badge}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star size={14} fill="gold" className="mr-1" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                  </div>

                  {/* Book Details */}
                  <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1 font-gilroyRegular">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-1 font-gilroyRegular">by {book.author}</p>
                  <p className="text-gray-500 text-xs mt-auto">{book.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div data-aos="fade-left" className="flex-1">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-melodramaRegular font-bold text-gray-800 inline-block relative">
              What the readers say
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800" />
            </h2>
          </div>

          <div className="flex justify-center gap-4">
            <div className="flex flex-col gap-4">
              <TestimonialCard {...testimonials[0]} />
              <TestimonialCard {...testimonials[1]} large />
            </div>

            <div className="flex flex-col gap-4">
              <TestimonialCard {...testimonials[2]} large />
              <TestimonialCard {...testimonials[3]} />
            </div>

            <div className="flex flex-col gap-4">
              <TestimonialCard {...testimonials[4]} />
              <TestimonialCard {...testimonials[5]} large />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ name, rating, text, book, large }: TestimonialCardProps) => {
  return (
    <div
      className={`rounded-xl shadow-sm p-5 w-[280px] bg-white flex flex-col  font-gilroyRegular hover:shadow-md transition-shadow duration-200 ${
        large ? "min-h-[320px]" : "min-h-[100px]"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={`https://i.pravatar.cc/40?u=${name}`}
          alt={name}
          className="w-10 h-10 font-gilroyRegular rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-base">{name}</h3>
          <div className="flex items-center text-sm text-yellow-500">
            <Star size={14} fill="gold" className="mr-1" />
            {rating}/5
          </div>
        </div>
      </div>

      {book && (
        <div className="mb-3">
          <div className="w-full bg-gray-100 rounded-lg border overflow-hidden">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-40 object-cover"
            />
          </div>
          <h4 className="mt-2 font-semibold text-base font-gilroyRegular">{book.title}</h4>
        </div>
      )}

      <p className="text-sm text-gray-600 leading-snug font-gilroyRegular">
        {text}
      </p>
    </div>
  );
};

export default TestimonialsWithBooks;