import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const allBlogs = [
  {
    id: 1,
    title: "Start Your Book Collection",
    date: "June 15, 2025",
    content: "Simple tips to begin collecting vintage books.",
    fullContent:
      "Starting a book collection can be overwhelming, but it doesn't have to be. Begin with genres you love and look for books in good condition. Set a budget and focus on quality over quantity. Visit local bookstores, estate sales, and online marketplaces. Remember, every great collection starts with a single book that speaks to you.",
    category: "Collecting",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    title: "Best Classic Books to Own",
    date: "May 28, 2025",
    content: "Five timeless novels every reader should have.",
    fullContent:
      "Classic literature never goes out of style. Consider adding these essentials to your collection: 'To Kill a Mockingbird' for its powerful social commentary, '1984' for its dystopian vision, 'Pride and Prejudice' for timeless romance, 'The Great Gatsby' for American literature, and 'One Hundred Years of Solitude' for magical realism. These books have shaped literature and continue to inspire readers worldwide.",
    category: "Literature",
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Keep Your Books Safe",
    date: "April 12, 2025",
    content: "Easy ways to protect your precious books.",
    fullContent:
      "Proper book care extends their lifespan significantly. Store books upright on shelves, away from direct sunlight and humidity. Use bookends to prevent leaning. Clean gently with a soft brush, never use water on pages. Keep books at room temperature and ensure good air circulation. For valuable books, consider archival-quality storage boxes.",
    category: "Care",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    title: "Amazing Book Find",
    date: "March 30, 2025",
    content: "We discovered a rare first edition in our store!",
    fullContent:
      "Last month, we discovered a first edition of 'The Catcher in the Rye' hidden among a collection donation. The book was in remarkable condition, complete with its original dust jacket. This find reminded us why we love what we do - you never know what literary treasures might be waiting to be discovered on our shelves.",
    category: "Discovery",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    title: "Build Your Home Library",
    date: "February 18, 2025",
    content: "Create a personal library that reflects you.",
    fullContent:
      "A personal library is more than just books on shelves - it's a reflection of your interests and journey. Start by categorizing your books in a way that makes sense to you. Mix old favorites with new discoveries. Don't forget to include books that challenge your thinking. Your library should be a comfortable space that invites reading and exploration.",
    category: "Organization",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    title: "Book Binding Through Time",
    date: "January 5, 2025",
    content: "How books were made throughout history.",
    fullContent:
      "Book binding has evolved dramatically over centuries. Ancient books were scrolls, then came codices with wooden covers. Medieval monks created illuminated manuscripts with elaborate bindings. The printing press revolutionized book production, making books more accessible. Today's binding techniques balance durability with cost-effectiveness, but handcrafted bindings remain treasured art forms.",
    category: "History",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 7,
    title: "Reading Nooks Ideas",
    date: "December 20, 2024",
    content: "Create the perfect space for reading.",
    fullContent:
      "A cozy reading nook transforms your reading experience. Find a quiet corner with good natural light. Add a comfortable chair or cushions, a small side table for your tea or coffee, and adequate lighting for evening reading. Include a soft throw blanket and keep your current reads within reach. Personal touches like plants or artwork make the space uniquely yours.",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 8,
    title: "Gift Books for Everyone",
    date: "November 15, 2024",
    content: "Perfect book gifts for any occasion.",
    fullContent:
      "Books make thoughtful gifts that last forever. For fiction lovers, consider bestselling novels or classic literature. Non-fiction enthusiasts enjoy biographies, self-help, or hobby books. Children love picture books and adventure stories. Coffee table books work well for casual readers. When in doubt, a beautiful edition of a beloved classic is always appreciated.",
    category: "Gifts",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 9,
    title: "Speed Reading Tips",
    date: "October 28, 2024",
    content: "Read more books in less time.",
    fullContent:
      "Speed reading can help you consume more books efficiently. Start by eliminating subvocalization - the voice in your head while reading. Use your finger or a pointer to guide your eyes. Practice reading in chunks rather than word by word. Skip words like 'the' and 'and' when possible. Remember, comprehension is more important than speed, so find your optimal balance.",
    category: "Reading Tips",
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 10,
    title: "Book Club Success",
    date: "September 12, 2024",
    content: "Tips for running a great book club.",
    fullContent:
      "A successful book club brings readers together for meaningful discussions. Choose books that spark conversation and vary genres to keep things interesting. Set a realistic reading schedule and stick to it. Prepare discussion questions in advance. Create a welcoming environment where everyone feels comfortable sharing their thoughts. Most importantly, keep the focus on fun and friendship through literature.",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 11,
    title: "Digital vs Physical Books",
    date: "August 25, 2024",
    content: "The pros and cons of each format.",
    fullContent:
      "Both digital and physical books have their place in modern reading. E-books offer convenience, portability, and instant access to thousands of titles. They're great for travel and have adjustable text size. Physical books provide a tactile experience, no screen fatigue, and look beautiful on shelves. Many readers enjoy both formats for different situations and preferences.",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 12,
    title: "Author Spotlight Series",
    date: "July 30, 2024",
    content: "Discovering new and classic authors.",
    fullContent:
      "Every month, we highlight authors who deserve more recognition alongside established favorites. This month features emerging voices in contemporary fiction, poets who are reshaping modern verse, and rediscovered classics from underrepresented writers. Expanding your reading to include diverse authors enriches your perspective and introduces you to incredible stories you might otherwise miss.",
    category: "Authors",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
];

interface Blog {
  id: number;
  title: string;
  date: string;
  content: string;
  fullContent: string;
  category: string;
  image: string;
}

const Blogs: React.FC = () => {
  const [visibleBlogs, setVisibleBlogs] = useState<number>(6);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const loadMoreBlogs = () => {
    setVisibleBlogs((prev) => Math.min(prev + 6, allBlogs.length));
  };

  const openBlog = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const closeBlog = () => {
    setSelectedBlog(null);
  };

  React.useEffect(() => {
    import("aos").then((AOS) => {
      AOS.init({ once: true, duration: 800 });
    });
  }, []);

  return (
    <div
      className="min-h-screen bg-vintageBg px-4 py-12 md:px-8 lg:px-16"
      style={{ fontFamily: "gilroyRegular, sans-serif" }}
    >
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-4">
            Our Blogs
          </h1>
          <p
            className="text-sm md:text-lg text-vintageText max-w-4xl mx-auto"
            style={{ fontFamily: "gilroyRegular, sans-serif" }}
          >
            Discover the latest stories, tips, and insights from the world of
            books at Moore Market Private Limited
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBlogs.slice(0, visibleBlogs).map((blog) => (
            <div
              key={blog.id}
              className="bg-[#326638] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ fontFamily: "gilroyRegular, sans-serif" }}
              data-aos="fade-up"
              data-aos-delay={blog.id * 100}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div
                  className="text-sm text-vintageBg mb-2"
                  style={{ fontFamily: "gilroyRegular, sans-serif" }}
                >
                  {blog.date}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-3">
                  {blog.title}
                </h2>
                <p
                  className="mb-4 text-vintageBg leading-relaxed text-sm md:text-lg text-justify"
                  style={{ fontFamily: "gilroyRegular, sans-serif" }}
                >
                  {blog.content}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className="inline-block bg-vintageBg text-black text-xs px-3 py-1 rounded-full"
                    style={{ fontFamily: "gilroyRegular, sans-serif" }}
                  >
                    {blog.category}
                  </span>

                  <button
                    onClick={() => openBlog(blog)}
                    className="text-vintageBg font-medium transition-colors flex items-center group"
                    style={{ fontFamily: "gilroyRegular, sans-serif" }}
                  >
                    Read More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleBlogs < allBlogs.length && (
          <div className="text-center mt-16">
            <button
              onClick={loadMoreBlogs}
              className="px-8 py-3 bg-[#3a7a41] text-white font-medium rounded-lg hover:bg-[#3a7a41] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ fontFamily: "gilroyRegular, sans-serif" }}
            >
              Load More Articles ({allBlogs.length - visibleBlogs} remaining)
            </button>
          </div>
        )}
      </div>

      {selectedBlog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          data-aos="fade-in"
        >
          <div
            className="bg-[#326638] rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
            style={{ fontFamily: "gilroyRegular, sans-serif" }}
          >
            <div className="relative">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={closeBlog}
                className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
                style={{ fontFamily: "gilroyRegular, sans-serif" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="mb-4">
                <span
                  className="inline-block bg-vintageBg text-black text-sm font-semibold px-3 py-1 rounded-full mb-2"
                  style={{ fontFamily: "gilroyRegular, sans-serif" }}
                >
                  {selectedBlog.category}
                </span>

                <div
                  className="text-sm text-vintageBg mb-2"
                  style={{ fontFamily: "gilroyRegular, sans-serif" }}
                >
                  {selectedBlog.date}
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-6">
                {selectedBlog.title}
              </h2>

              <p
                className="text-vintageBg leading-relaxed text-sm md:text-lg text-justify"
                style={{ fontFamily: "gilroyRegular, sans-serif" }}
              >
                {selectedBlog.fullContent}
              </p>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={closeBlog}
                  className="px-6 py-2 bg-vintageBg text-black rounded-lg transition-colors"
                  style={{ fontFamily: "gilroyRegular, sans-serif" }}
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
