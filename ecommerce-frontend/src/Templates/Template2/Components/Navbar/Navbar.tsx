"use client";

import { useWindowScroll } from "@mantine/hooks";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetListOfCategoriesQuery } from "Services/CategoryApiSlice";
import { useCustomerQuery } from "Services/CustomerApiSlice";
import { logout } from "State/AuthSlice/LoginSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import { toTitleCase } from "Utilities/ToTitleCase";
import classes from "./Navbar.module.css";

type Props = {
  brandName: string;
};

type MenuLink = {
  label: string;
  href: string;
  subMenu?: { label: string; href: string }[];
  title?: string;
};

const primaryMenuLinks: Record<string, MenuLink> = {
  shop: {
    label: "Collections",
    href: "/collections",
  },
  newArrival: { label: "Top Seller", href: "/top-sellers?page=1" },
  // sale: { label: "Sale", href: "/sale", title: "Sale" },
};

const Navbar = ({ brandName }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { data: categories } = useGetListOfCategoriesQuery();
  const [scroll, scrollTo] = useWindowScroll();
  const { token } = useSelector((state: RootState) => state.login);
  const { isLoggedIn } = useSelector((state: RootState) => state.stateevents);
  const dispatch: AppDispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.cartList);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchInputValue, setSearchInputValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isLoading } = useCustomerQuery(undefined, {
    skip: token === null || token === "" || !isLoggedIn,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Add this useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownContainer = document.querySelector(
        ".relative > div:last-child"
      );
      const categoryButton = document.querySelector(".relative > button");

      if (
        isCategoryDropdownOpen &&
        dropdownContainer &&
        categoryButton &&
        !dropdownContainer.contains(event.target as Node) &&
        !categoryButton.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    // Use click event instead of mousedown
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const handleSearch = () => {
    if (searchInputValue.trim()) {
      navigate(
        `/s?search=${searchInputValue.trim()}&category=${selectedCategory}&page=1`
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <>
      <div
        className={`${classes.navbar} w-full flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-16 py-3 font-montserrat tracking-widest font-semibold z-50 bg-black text-white`}
      >
        <div className="flex items-center flex-1">
          <div className="text-xs md:text-xl tracking-wide font-nunito font-bold text-center">
            <a href="/" className="flex items-center">
              {brandName}
            </a>
          </div>

          <div className="hidden lg:flex items-center ml-8 space-x-6 xl:space-x-8">
            <div className="relative group">
              <p className={`${classes.menuItem} cursor-pointer py-4 group`}>
                <a
                  href={primaryMenuLinks.shop.href}
                  className="uppercase text-xs"
                >
                  {primaryMenuLinks.shop.label}
                </a>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </p>
              <div className="z-50 absolute left-0 min-w-60 hidden bg-black text-white group-hover:block shadow-lg">
                <ul className="space-y-2 px-6 py-4">
                  <li className="uppercase text-xs font-normal hover:font-bold transition-all duration-300">
                    <Link to="/shop/">All</Link>
                  </li>
                  {categories ? (
                    categories.map((category, i) => {
                      return (
                        <li key={i}>
                          <Link to={`/shop/${category.categoryCode}?page=1`}>
                            <p className="uppercase text-xs font-normal hover:font-bold transition-all duration-300">
                              {toTitleCase(category.categoryName)}
                            </p>
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <p className="text-center uppercase text-xs font-normal text-gray-400">
                      No Categories found
                    </p>
                  )}
                </ul>
              </div>
            </div>

            {Object.keys(primaryMenuLinks).map((key) => {
              const link =
                primaryMenuLinks[key as keyof typeof primaryMenuLinks];

              if (key !== "shop") {
                return (
                  <p
                    className={`${classes.menuItem} cursor-pointer group relative py-4`}
                    key={key}
                  >
                    <a href={link.href} className="uppercase text-xs">
                      {link.label}
                    </a>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="flex-1 flex justify-center px-2 md:px-4">
          <div
            className={`relative w-full md:max-w-md flex items-center transition-all duration-300 ${
              isSearchFocused ? "ring-2 ring-yellow-400" : ""
            }`}
          >
            <div className="relative">
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="bg-gray-200 text-black text-xs px-3 py-2 rounded-l-sm border border-gray-300 hover:bg-gray-300 transition-colors duration-300 h-full flex items-center uppercase"
              >
                {selectedCategory === "all"
                  ? "All"
                  : categories?.find((c) => c.categoryCode === selectedCategory)
                      ?.categoryName || "All"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white text-black shadow-lg rounded-sm z-50 max-h-60 overflow-y-auto uppercase">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                    onClick={() => handleCategorySelect("all")}
                  >
                    All Categories
                  </div>
                  {categories?.map((category) => (
                    <div
                      key={category.categoryCode}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                      onClick={() =>
                        handleCategorySelect(category.categoryCode)
                      }
                    >
                      {toTitleCase(category.categoryName)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-white text-black text-xs px-4 py-2 border-t border-b border-gray-300 focus:outline-none focus:border-yellow-400 transition-colors duration-300"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />

            {searchInputValue && (
              <div
                className="absolute right-10 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setSearchInputValue("")}
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
                  className="lucide lucide-x-icon lucide-x text-gray-500 hover:text-black transition-colors"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
            )}

            <button
              className="bg-yellow-400 text-black px-3 py-2 rounded-r-sm hover:bg-yellow-500 transition-colors duration-300 h-full flex items-center"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end flex-1 space-x-4 md:space-x-6">
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <div className="relative group">
              {isLoading || token ? (
                <span
                  className="uppercase text-xs cursor-pointer"
                  onClick={() => {
                    dispatch(logout());
                    dispatch(setLoggedIn(false));
                    window.location.reload();
                  }}
                >
                  Logout
                </span>
              ) : location.pathname !== "/login" ? (
                <span
                  className="uppercase text-xs cursor-pointer"
                  onClick={() => {
                    scrollTo({ y: 0 });
                    navigate("/login");
                  }}
                >
                  Login
                </span>
              ) : (
                <span
                  className="uppercase text-xs cursor-pointer"
                  onClick={() => {
                    scrollTo({ y: 0 });
                    navigate("/register");
                  }}
                >
                  Register
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </div>

            {isLoading || token ? (
              <div className="relative group">
                <span
                  className="uppercase text-xs cursor-pointer"
                  onClick={() => {
                    scrollTo({ y: 0 });
                    navigate("/order-summary");
                  }}
                >
                  Orders
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </div>
            ) : null}

            <div className="relative group">
              <Link to="/track-order" className="uppercase text-xs">
                Track Order
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </div>

            <div className="relative group">
              <Link to="/cart" className="uppercase text-xs">
                Cart ({cartList.length})
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-white cursor-pointer flex items-center justify-center h-8 w-8"
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
                className="lucide lucide-menu"
              >
                <path d="M4 12h16" />
                <path d="M4 18h16" />
                <path d="M4 6h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`w-full fixed inset-0 z-50 lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
        <nav
          className={`w-full fixed inset-y-0 left-0 bg-[#1C1B1B] transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
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
                className="lucide lucide-x-icon lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-2">
            <div className="">
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                className="flex justify-between items-center w-full text-left border-b border-gray-600 text-white px-4 py-5 uppercase text-xs tracking-widest font-semibold"
              >
                {primaryMenuLinks.shop.label}
                {isShopOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-minus-icon lucide-minus"
                  >
                    <path d="M5 12h14" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-plus-icon lucide-plus"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                )}
              </button>
              {isShopOpen && (
                <div className="">
                  <Link
                    to="/shop/"
                    onClick={() => setIsMenuOpen(false)}
                    className="border-b border-gray-600 block text-white px-8 py-5 uppercase text-xs tracking-widest font-semibold"
                  >
                    All
                  </Link>
                  {categories ? (
                    categories.map((category) => (
                      <Link
                        key={category.categoryCode}
                        to={`/shop/${category.categoryCode}?page=1`}
                        className="border-b border-gray-600 block text-white px-8 py-5 uppercase text-xs tracking-widest font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {toTitleCase(category.categoryName)}
                      </Link>
                    ))
                  ) : (
                    <p className="border-b border-gray-600 text-white px-8 py-5 uppercase text-xs tracking-widest font-normal text-gray-400">
                      No categories found
                    </p>
                  )}
                </div>
              )}
            </div>
            <Link
              to={primaryMenuLinks.newArrival.href}
              className="block text-white px-4 py-5 border-b border-gray-600 uppercase text-xs tracking-widest font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              {primaryMenuLinks.newArrival.label}
            </Link>
            {(isLoading || token) && (
              <Link
                to="/order-summary"
                className="block text-white px-4 py-5 border-b border-gray-600 uppercase text-xs tracking-widest font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
            )}
            <Link
              to="/track-order"
              className="block text-white px-4 py-5 border-b border-gray-600 uppercase text-xs tracking-widest font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Track Order
            </Link>
            {isLoading || token ? (
              <Link
                to="#"
                className="block text-white px-4 py-5 uppercase text-xs tracking-widest font-semibold cursor-pointer border-b border-gray-600"
                onClick={() => {
                  dispatch(logout());
                  dispatch(setLoggedIn(false));
                  setIsMenuOpen(false);
                  window.location.reload();
                }}
              >
                Logout
              </Link>
            ) : location.pathname !== "/login" ? (
              <Link
                to="/login"
                className="block text-white px-4 py-5 uppercase text-xs tracking-widest font-semibold cursor-pointer border-b border-gray-600"
                onClick={() => {
                  scrollTo({ y: 0 });
                  setIsMenuOpen(false);
                }}
              >
                Login
              </Link>
            ) : (
              <Link
                to="/register"
                className="block text-white px-4 py-5 uppercase text-xs tracking-widest font-semibold cursor-pointer border-b border-gray-600"
                onClick={() => {
                  scrollTo({ y: 0 });
                  setIsMenuOpen(false);
                }}
              >
                Register
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
