import React, { useState } from "react";

const PriceRangeFilter = () => {
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const handlePriceFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceFrom(e.target.value);
  };

  const handlePriceToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceTo(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs">
        Price From:
        <br />
        <input
          type="number"
          value={priceFrom}
          onChange={handlePriceFromChange}
          placeholder="Min Price"
          className="text-xs"
        />
      </label>
      <label className="text-xs">
        Price To:
        <br />
        <input
          type="number"
          value={priceTo}
          onChange={handlePriceToChange}
          placeholder="Max Price"
          className="text-xs"
        />
      </label>
    </div>
  );
};

export default PriceRangeFilter;
