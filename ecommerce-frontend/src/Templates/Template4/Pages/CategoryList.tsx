import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export interface Category {
  id: string; 
  name: string;
  image: string | null;
  subcategories?: { id: string; name: string; image?: string }[];
}

export const categories: Category[] = [
  {
    id: "crime-thriller-mystery",
    name: "Crime, Thriller & Mystery",
    image: null,
    subcategories: [
      {
        id: "detective",
        name: "Detective/Psychological",
        image: "/template4/Detective.jpg",
      },
    ],
  },
  {
    id: "science-fiction-fantasy",
    name: "Science Fiction & Fantasy",
    image: null,
    subcategories: [
      {
        id: "space-opera",
        name: "Space Opera/Epic Fantasy",
        image: "/template4/Books.jpg",
      },
    ],
  },
  {
    id: "historical-fiction",
    name: "Historical Fiction",
    image: null,
    subcategories: [
      {
        id: "historical-fiction",
        name: "Historical Fiction",
        image: "/template4/historic.jpg",
      },
    ],
  },
  {
    id: "romance",
    name: "Romance",
    image: null,
    subcategories: [
      {
        id: "romance",
        name: "Romance",
        image: "/template4/Romantic.jpg",
      },
    ],
  },
  {
    id: "literature-fiction",
    name: "Literature & Fiction",
    image: null,
    subcategories: [
      {
        id: "literature-fiction",
        name: "Literature & Fiction",
        image: "/template4/Literacture.jpg",
      },
    ],
  },
];

interface AnimatedTextProps {
  text: string;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, delay = 0 }) => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showUnderline, setShowUnderline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleLetters(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            setTimeout(() => setShowUnderline(true), 100);
            return prev;
          }
          return prev + 1;
        });
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <div className="relative">
      <span className="font-melodrama font-extrabold text-4xl md:text-5xl text-white/50 text-center drop-shadow-lg px-4">
        {text.split('').map((letter, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-300 ${
              index < visibleLetters 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-8'
            }`}
            style={{
              transitionDelay: `${index * 20}ms`
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </span>
      <div 
        className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-[2px] bg-white/60 transition-all duration-500 ${
          showUnderline ? 'w-3/4 opacity-100' : 'w-0 opacity-0'
        }`}
      />
    </div>
  );
};

const CategoryList: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const currentCategory = categories.find((cat) => cat.id === category);

  const isSubcategoryView = !!currentCategory?.subcategories;

  return (
    <div className="w-full py-6 font-gilroy">
      {isSubcategoryView ? (
        <div className="flex flex-col gap-6 px-6">
          {currentCategory!.subcategories!.map((sub, index) => (
            <Link
              key={sub.id}
              to={`/category/${currentCategory!.id}/${sub.id}`}
              className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group"
            >
              {sub.image && (
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="absolute inset-0 w-full h-full object-contain opacity-50 bg-black"
                />
              )}

              <div className="absolute inset-0 bg-black/70 transition-colors duration-300"></div>

              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <AnimatedText text={sub.name} delay={index * 300} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center px-6 sm:px-12 lg:px-20">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="flex flex-col items-center gap-3 group"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-24 h-24 rounded-full object-cover shadow-md group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-100 shadow-md group-hover:bg-green-200 group-hover:scale-105 transition-all">
                  <span className="text-lg font-semibold text-green-700 font-gilroy">
                    {cat.name[0]}
                  </span>
                </div>
              )}
              <span className="text-base font-medium text-center truncate w-28 group-hover:text-green-700 transition-colors font-melodrama">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
