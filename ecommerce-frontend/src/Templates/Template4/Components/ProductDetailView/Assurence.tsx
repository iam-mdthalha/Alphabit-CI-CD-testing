import { CheckCircle, BookOpen, Percent, Search } from "lucide-react";

const highlights = [
  {
    icon: <BookOpen className="h-6 w-6 text-gray-700" />,
    title: "100% Genuine books",
    link: "#",
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-gray-700" />,
    title: "Maximum Quality assured",
    link: "#",
  },
  {
    icon: <Search className="h-6 w-6 text-gray-700" />,
    title: "Get what you see",
    link: "#",
  },
  {
    icon: <Percent className="h-6 w-6 text-gray-700" />,
    title: "Honest discounts",
    link: "#",
  },
];

export default function AssuredHighlights() {
  return (
    <div className="rounded-md shadow-sm mt-10 font-melodramaRegular px-6 lg:px-16 xl:px-24">
      <h2 className="text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular pt-4">
        Moore market Assured
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-6 bg-[#E8CC94] rounded-md hover:shadow transition"
          >
            {item.icon}
            <div>
              <p className="text-sm  text-gray-800 font-semibold">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
