const FilterSortBar = () => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 mb-4 gap-3 sm:gap-0">
            {/* Filters Section */}
            <div className="text-sm flex flex-wrap items-center gap-2">
                <span className="bg-gray-200 px-2 py-1 rounded">In stock</span>
                <button className="underline text-blue-500 text-sm">Clear all</button>
            </div>

            {/* Sort Section */}
            <div className="text-sm flex flex-wrap items-center gap-2">
                <span>1 product</span>
                <span className="hidden sm:inline">|</span>
                <span>Sort by</span>
                <select className="border p-1 rounded text-sm">
                    <option>Featured</option>
                    <option>Price (Low to High)</option>
                    <option>Price (High to Low)</option>
                </select>
            </div>
        </div>
    );
};

export default FilterSortBar;