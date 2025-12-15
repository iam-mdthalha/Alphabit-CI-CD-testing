import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "Context/SearchContext";
import useDebounce from "hooks/useDebounce";

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(inputValue, 500);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (searchTerm !== inputValue) {
      setInputValue(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("search");
    if (urlSearch && decodeURIComponent(urlSearch) !== searchTerm) {
      const decodedSearch = decodeURIComponent(urlSearch);
      setSearchTerm(decodedSearch);
      setInputValue(decodedSearch);
    }
  }, [location.search, searchTerm, setSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm !== searchTerm) {
      setSearchTerm(debouncedSearchTerm);
      navigate(
        `/books-listing?search=${encodeURIComponent(debouncedSearchTerm)}`
      );
    }
    if (!debouncedSearchTerm && searchTerm) {
      setSearchTerm("");
      navigate("/books-listing");
    }
  }, [debouncedSearchTerm]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setSearchTerm(inputValue.trim());
      navigate(
        `/books-listing?search=${encodeURIComponent(inputValue.trim())}`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search by ISBN, Book Name, or Author Name"
        className="w-full bg-vintageBg text-black placeholder:text-gray-700 border border-gray-700 border-opacity-50 rounded-xl px-2 lg:px-5 py-2 lg:py-3 focus:outline-none focus:ring-0"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {/* <div
        className="absolute right-2 top-0 h-full flex items-center text-gray-700 text-opacity-50 cursor-pointer hover:text-vintageText transition-colors"
        onClick={handleSubmit}
        tabIndex={0}
        role="button"
        aria-label="Search"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleSubmit();
        }}
      >
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
          className="lucide lucide-search"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </div> */}
    </div>
  );
};

export default SearchBar;
