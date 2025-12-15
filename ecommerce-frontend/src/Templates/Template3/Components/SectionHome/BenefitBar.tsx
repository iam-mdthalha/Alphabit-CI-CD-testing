const BenefitBar = () => {
  const benefits = [
    {
      // icon: <Truck className="w-8 h-8 mb-2" />,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-truck-icon lucide-truck"
        >
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      ),
      title: "Free Shipping",
      subtitle: "Free Shipping on US orders",
    },
    {
      // icon: <Undo2 className="w-8 h-8 mb-2" />,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-undo-icon lucide-undo"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      ),
      title: "Hassle-free Returns",
      subtitle: "30-day Return Policy",
    },
    {
      // icon: <Gem className="w-8 h-8 mb-2" />,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-gem-icon lucide-gem"
        >
          <path d="M10.5 3 8 9l4 13 4-13-2.5-6" />
          <path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z" />
          <path d="M2 9h20" />
        </svg>
      ),
      title: "High Quality Materials",
      subtitle: "100% full grain calf skin leathers",
    },
    {
      // icon: <Heart className="w-8 h-8 mb-2" />,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-heart-icon lucide-heart"
        >
          <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
        </svg>
      ),
      title: "Crafted with Integrity",
      subtitle: "Artisan-made & Integrity guarantee",
    },
  ];

  return (
    <div className="w-full flex justify-center items-center py-10 px-4 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl text-center">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-sm text-gray-700"
          >
            {benefit.icon}
            <p className="font-semibold">{benefit.title}</p>
            <p className="text-gray-500 text-xs">{benefit.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitBar;
