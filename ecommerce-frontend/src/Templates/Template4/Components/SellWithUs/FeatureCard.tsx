import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => {
  return (
    <div className="bg-[#316337] p-6 rounded-xl shadow hover:shadow-xl transition">
      <div className="flex justify-center mb-4 text-vintageBg">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center text-vintageBg">
        {title}
      </h3>
      <p className="text-vintageBg text-center">{desc}</p>
    </div>
  );
};

export default FeatureCard;
