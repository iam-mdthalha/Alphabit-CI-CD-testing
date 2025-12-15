import React from "react";

const EmptyCartRedirect: React.FC = () => (
  <div className="container mx-auto px-4 py-8 bg-gray-50 bg-opacity-50 min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Redirecting to cart...</p>
    </div>
  </div>
);

export default EmptyCartRedirect;
