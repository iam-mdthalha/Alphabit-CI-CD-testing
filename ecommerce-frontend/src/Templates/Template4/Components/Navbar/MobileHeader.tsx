import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "State/store";
import { selectWishlistCount } from "State/WishlistSlice/WishlistSlice";
import { useDispatch } from "react-redux";
import { logout } from "State/AuthSlice/LoginSlice";
import { setLoggedIn } from "State/StateEvents";

import { useGetAllCategoriesQuery } from "Services/Admin/CategoryAdminApiSlice";
import { useGetAdminSubClassesQuery } from "Services/Admin/SubClassApiSlice";
import { useGetAllAuthorsQuery } from "Services/Admin/AuthorApiSlice";
import { useGetAllAcademicsQuery } from "Services/Admin/AcademicApiSlice";
import { useGetAllLanguagesQuery } from "Services/Admin/LanguageApiSlice";
import { useGetAllMerchandisesQuery } from "Services/Admin/MerchandiseApiSlice";
import SearchBar from "Templates/Template4/Components/Navbar/SearchBar";

interface MobileHeaderProps {
  brandName: string;
  onCartOpen?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  brandName,
  onCartOpen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [submenu, setSubmenu] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { token } = useSelector((state: RootState) => state.login);
  const { isLoggedIn } = useSelector((state: RootState) => state.stateevents);
  const cartList = useSelector((state: RootState) => state.cart.cartList);
  const wishlistCount = useSelector(selectWishlistCount);

  const PLANT = process.env.REACT_APP_PLANT;

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: subClassesData } = useGetAdminSubClassesQuery();
  const { data: authorsData, isLoading: authorsLoading } =
    useGetAllAuthorsQuery({ plant: PLANT });
  const { data: languagesData } = useGetAllLanguagesQuery({ plant: PLANT });
  const { data: academicsData } = useGetAllAcademicsQuery({ plant: PLANT });
  const { data: merchandisesData } = useGetAllMerchandisesQuery({
    plant: PLANT,
  });

  const totalQuantity = cartList.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const mappedCategories =
    categoriesData?.map((cat) => {
      const subs =
        subClassesData?.results
          ?.filter((sub) => sub.categoryCode === cat.categoryCode)
          ?.map((sub) => ({
            name: sub.subClassName,
            code: sub.subClassCode,
          })) || [];

      return {
        name: cat.categoryName,
        code: cat.categoryCode,
        subs,
      };
    }) || [];

  const authors = authorsData?.map((author) => author.author) || [];
  const languages = languagesData?.map((lang) => lang.language) || [];
  const academics = academicsData?.map((aca) => aca.academic) || [];
  const merchandises =
    merchandisesData?.map((merch) => merch.merchandise) || [];

  const menuItems = [
    { name: "Category", path: "/collections" },
    { name: "Author", path: "/authors" },
    { name: "Language", path: "/language" },
    { name: "Academic", path: "/academic" },
    { name: "Merchandise", path: "/merchandise" },
    { name: "New Arrival", path: "/new-collections" },
    { name: "Bestsellers", path: "/top-sellers?page=1" },
    { name: "Offers", path: "/offers" },
    { name: "Sell Your Book", path: "/sell-with-us" },
    { name: "Track Order", path: "/track-order" },
    { name: "Store Locator", path: "/store-locator" },
  ];

  const handleNavigation = (path: string) => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });
    navigate(path);
    setIsMenuOpen(false);
    setSubmenu(null);
    setSelectedCategory(null);
    setIsSearchOpen(false);
  };

  const handleCategoryClick = (categoryName: string, hasSubs: boolean) => {
    if (hasSubs) {
      setSelectedCategory(categoryName);
    } else {
      handleNavigation(
        `/category/${categoryName.toLowerCase().replace(/\s+/g, "-")}`
      );
    }
  };

  const handleSubcategoryClick = (
    categoryName: string,
    subcategoryCode: string
  ) => {
    handleNavigation(
      `/category/${categoryName
        .toLowerCase()
        .replace(/\s+/g, "-")}/${subcategoryCode}`
    );
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      setSubmenu(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setLoggedIn(false));

    window.scrollTo({ top: 0, behavior: "auto" });
    window.location.reload();
  };

  const handleMiniCartOpen = () => {
    console.log("Cart clicked, calling onCartOpen:", onCartOpen);
    window.scrollTo({ top: 0, behavior: "auto" });
    if (onCartOpen) {
      onCartOpen();
    } else {
      console.error("onCartOpen is undefined!");
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      setIsSearchOpen(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setIsMenuOpen(false);
    }
  }, [isSearchOpen]);

  const renderSubmenuContent = () => {
    switch (submenu) {
      case "Category":
        if (!selectedCategory) {
          return mappedCategories.map((category, idx) => (
            <button
              key={idx}
              className="w-full text-left px-4 py-3 rounded-xl text-dark font-medium hover:bg-vintageText hover:bg-opacity-10 transition-all duration-200 flex justify-between items-center group"
              onClick={() =>
                handleCategoryClick(category.name, category.subs.length > 0)
              }
            >
              <span className="font-gilroyRegular font-semibold tracking-wider">
                {category.name}
              </span>
              {category.subs.length > 0 && (
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
                  className="transform group-hover:translate-x-1 transition-transform"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </button>
          ));
        } else {
          const category = mappedCategories.find(
            (c) => c.name === selectedCategory
          );
          return (
            <>
              <button
                className="w-full text-left px-4 py-3 rounded-xl text-vintageText font-medium hover:bg-vintageText hover:bg-opacity-10 transition-all duration-200 flex items-center mb-2"
                onClick={() => setSelectedCategory(null)}
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
                  className="mr-2"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Categories
              </button>

              <button
                className="w-full text-left px-4 py-3 rounded-xl text-dark font-semibold hover:bg-vintageText hover:bg-opacity-10 transition-all duration-200 border-b border-gray-200 mb-2"
                onClick={() =>
                  handleNavigation(
                    `/category/${selectedCategory
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
              >
                All {selectedCategory}
              </button>

              {category?.subs.map((sub, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-6 py-3 text-dark hover:bg-vintageText hover:bg-opacity-5 transition-all duration-200 font-gilroyRegular"
                  onClick={() =>
                    handleSubcategoryClick(selectedCategory, sub.code)
                  }
                >
                  {sub.name}
                </button>
              ))}
            </>
          );
        }

      case "Author":
        if (authorsLoading) {
          return (
            <div className="px-4 py-3 text-dark text-center">
              <p className="font-gilroyRegular">Loading authors...</p>
            </div>
          );
        }
        return (
          <>
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-dark font-semibold hover:bg-vintageText hover:bg-opacity-10 transition-all duration-200 border-b border-gray-200 mb-2"
              onClick={() => handleNavigation("/authors")}
            >
              All Authors
            </button>
            {authors.map((author, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-3 text-dark hover:bg-vintageText hover:bg-opacity-5 transition-all duration-200 font-gilroyRegular"
               onClick={() => handleNavigation(`/books-listing?author=${encodeURIComponent(author)}`)
            }

              >
                {author}
              </button>
            ))}
          </>
        );

      case "Language":
        return (
          <>
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-dark font-semibold hover:bg-vintageText hover:bg-opacity-10 transition-all duration-200 border-b border-gray-200 mb-2"
              onClick={() => handleNavigation("/language")}
            >
              All Languages
            </button>
            {languages.map((language, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-3 text-dark hover:bg-vintageText hover:bg-opacity-5 transition-all duration-200 font-gilroyRegular"
                onClick={() =>
                  handleNavigation(
                    `/language/${language.toLowerCase().replace(/\s+/g, "-")}`
                  )
                }
              >
                {language}
              </button>
            ))}
          </>
        );

      case "Academic":
        return (
          <>
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-dark font-semibold hover:bg-vintageText hover:bg-opacity-10 transition-all duration-200 border-b border-gray-200 mb-2"
              onClick={() => handleNavigation("/academic")}
            >
              All Academics
            </button>
            {academics.map((academic, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-3 text-dark hover:bg-vintageText hover:bg-opacity-5 transition-all duration-200 font-gilroyRegular"
                onClick={() =>
                  handleNavigation(
                    `/academic/${academic.toLowerCase().replace(/\s+/g, "-")}`
                  )
                }
              >
                {academic}
              </button>
            ))}
          </>
        );

      case "Merchandise":
        return (
          <>
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-dark font-semibold hover:bg-vintageText hover:bg-opacity-10 transition-all duration-200 border-b border-gray-200 mb-2"
              onClick={() => handleNavigation("/merchandise")}
            >
              All Merchandise
            </button>
            {merchandises.map((merchandise, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-3 text-dark hover:bg-vintageText hover:bg-opacity-5 transition-all duration-200 font-gilroyRegular"
                onClick={() =>
                  handleNavigation(
                    `/merchandise/${merchandise
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
              >
                {merchandise}
              </button>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 md:hidden bg-vintageBg px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-vintageText hover:bg-vintageText hover:bg-opacity-10 rounded-lg transition-all duration-200"
              aria-label="Open menu"
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
                className="transform transition-transform duration-300 hover:rotate-90"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-vintageText hover:bg-vintageText hover:bg-opacity-10 rounded-lg transition-all duration-200"
              aria-label="Search"
            >
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
                className="transform transition-transform duration-300 hover:scale-110"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          <Link
            to="/"
            className="flex-1 flex justify-center"
            onClick={() => {
              window.history.scrollRestoration = "manual";
              window.scrollTo({ top: 0, behavior: "auto" });
            }}
          >
            <h1 className="text-xl text-vintageText font-melodramaRegular tracking-wider font-bold">
              {brandName}
            </h1>
          </Link>

          <div className="flex items-center space-x-2">
            {token && isLoggedIn && (
              <div className="relative p-2 text-vintageText hover:bg-vintageText hover:bg-opacity-10 rounded-lg transition-all duration-200">
                <button
                  onClick={() => handleNavigation("/wishlist")}
                  className="flex items-center"
                  aria-label="Wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill={wishlistCount > 0 ? "#dc2626" : "none"}
                    stroke={wishlistCount > 0 ? "#dc2626" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transform transition-transform duration-300 hover:scale-110"
                  >
                    <path d="M19 14c1.49-1.46 2-3.45 2-5A5 5 0 0 0 16 4c-1.54 0-3.04.77-4 2-.96-1.23-2.46-2-4-2a5 5 0 0 0-5 5c0 1.55.51 3.54 2 5l7 7Z" />
                  </svg>
                </button>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
            )}

            {token && isLoggedIn && (
              <button
                onClick={handleLogout}
                className="p-2 text-vintageText hover:bg-vintageText hover:bg-opacity-10 rounded-lg transition-all duration-200"
                aria-label="Logout"
              >
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
                  className="transform transition-transform duration-300 hover:scale-110"
                >
                  <path d="m16 17 5-5-5-5" />
                  <path d="M21 12H9" />
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                </svg>
              </button>
            )}

            {(!token || !isLoggedIn) && (
              <button
                onClick={() => handleNavigation("/login")}
                className="p-2 text-vintageText hover:bg-vintageText hover:bg-opacity-10 rounded-lg transition-all duration-200"
                aria-label="Login"
              >
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
                  className="transform transition-transform duration-300 hover:scale-110"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            )}

            <div className="relative">
              <button
                onClick={handleMiniCartOpen}
                className="p-2 text-vintageText hover:bg-vintageText hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center"
                aria-label="Cart"
              >
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
                  className="transform transition-transform duration-300 hover:scale-110"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </button>
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          className={`mt-3 overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <SearchBar />
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-full md:w-80 bg-vintageBg shadow-xl z-50 transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-vintageText border-opacity-20">
          <h2 className="text-vintageText font-cardoBold text-xl uppercase tracking-wider">
            Menu
          </h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-dark hover:bg-vintageText hover:bg-opacity-10 rounded-full transition-all duration-300 hover:rotate-90"
            aria-label="Close menu"
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
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {(submenu || selectedCategory) && (
            <button
              onClick={handleBack}
              className="mb-4 text-sm text-vintageText hover:underline flex items-center font-gilroyRegular p-2 rounded-lg hover:bg-vintageText hover:bg-opacity-5 transition-all duration-200"
            >
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
                className="mr-2 transform transition-transform duration-300 hover:-translate-x-1"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to {selectedCategory ? "Categories" : "Menu"}
            </button>
          )}

          <div className="flex flex-col gap-2">
            {!submenu && !selectedCategory ? (
              menuItems.map((item, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-4 py-3 rounded-xl text-dark font-medium tracking-wide hover:bg-vintageText hover:bg-opacity-10 transition-all duration-300 font-gilroyRegular flex justify-between items-center group hover:translate-x-2"
                  onClick={() => {
                    if (
                      [
                        "Category",
                        "Author",
                        "Language",
                        "Academic",
                        "Merchandise",
                      ].includes(item.name)
                    ) {
                      setSubmenu(item.name);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                >
                  <span className="font-semibold">{item.name}</span>
                  {[
                    "Category",
                    "Author",
                    "Language",
                    "Academic",
                    "Merchandise",
                  ].includes(item.name) && (
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
                      className="transform group-hover:translate-x-1 transition-transform"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="animate-fadeIn">{renderSubmenuContent()}</div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MobileHeader;
