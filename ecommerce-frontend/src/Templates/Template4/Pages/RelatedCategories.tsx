import React from "react";
import { BookOpen, Award, Bookmark, Layers, HelpCircle } from "lucide-react";

const RelatedCategories: React.FC = () => {
  const links = [
    { label: "7 Reasons You Should Give Short Story Collections a Try", icon: BookOpen },
    { label: "Accessible Classics", icon: Bookmark },
    { label: "Booker Prize Winners", icon: Award },
    { label: "Narrative Nonfiction Books", icon: Layers },
    { label: "What Do All the Book Awards Mean? (And Why Should Readers Care?)", icon: HelpCircle },
  ];

  return (
    <div className="bg-vintageBg  py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center md:items-start">
        
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-vintageText font-cardoRegular">
            Explore similar categories and collections on <span className="text-vintageText">Moore Market</span>
          </h2>

          <ul className="space-y-4">
            {links.map(({ label, icon: Icon }, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <Icon className="text-vintageText w-5 h-5 " />
                <a href="#" className="text-vintageText hover:underline text-lg font-medium">
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-gray-700 font-cardoRegular">
            Do you have general fiction or literary fiction books you no longer want? 
            Learn how you can{" "}
            <a href="#" className="text-vintageText hover:underline font-bold">
              sell your used general fiction books
            </a>{" "}
            to other readers on PangBooks!
          </p>
        </div>


        <div className="flex-shrink-0">
          <div className="rounded-2xl  shadow-lg overflow-hidden">
            <img
              src="/template4/Historic.jpg"
              alt="Book Cover"
              className="w-64 h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedCategories;
