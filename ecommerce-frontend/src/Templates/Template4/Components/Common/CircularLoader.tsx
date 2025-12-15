const CircularLoader = () => {
  return (
    <div className="w-full h-[40vh] md:h-[80vh] bg-vintageBg relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPgo8cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSIjRkZGIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCA2TDYgME0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMjY2MzgiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      <div className="w-12 h-12 border-4 border-vintageText border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default CircularLoader;
