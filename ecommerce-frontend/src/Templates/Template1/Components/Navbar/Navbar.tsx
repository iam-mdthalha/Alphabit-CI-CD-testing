// import './Navbar.css'
import logo from "Assets/logo.png";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button, Popover, em } from "@mantine/core";
import { useMediaQuery, useWindowScroll } from "@mantine/hooks";
import { IconPower, IconUserCircle } from "@tabler/icons-react";
import { Badge } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useCustomerQuery } from "Services/CustomerApiSlice";
import { logout } from "State/AuthSlice/LoginSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import { Category } from "Types/Category";
import { toTitleCase } from "Utilities/ToTitleCase";

type Props = {
  brandName: string;
  categories: Array<Category>;
};

const Navbar = ({ brandName, categories }: Props) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [searchOffset, setSearchOffset] = useState("all");

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const cartList = useSelector((state: RootState) => state.cart.cartList);

  const { token } = useSelector((state: RootState) => state.login);
  const { isLoggedIn } = useSelector((state: RootState) => state.stateevents);
  const dispatch: AppDispatch = useDispatch();

  const [scroll, scrollTo] = useWindowScroll();

  const location = useLocation();

  const { isLoading } = useCustomerQuery(
    undefined,
    {
      skip: token === null || token === "" || !isLoggedIn,
    }
  );

  return (
    <div
      className="px-4"
      style={{
        position: "sticky",
        top: 0,
        backgroundColor: "var(--mantine-color-white)",
        zIndex: 5,
        boxShadow:
          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      }}
    >
      <div className="flex flex-wrap justify-around items-center gap-4 py-4">
        <Link
          to="/"
          style={{ textDecoration: "none" }}
          className="order-1 sm:order-none"
        >
          <div className="flex gap-x-5 justify-center items-center">
            <img
              className="h-10 sm:h-12"
              src={logo}
              alt=""
              width="auto"
              height="auto"
            />
            <p className="inline-block bg-gradient-to-r from -secondary-800 to-primary-800 font-bold text-2xl text-transparent bg-clip-text">
              {brandName}
            </p>
          </div>
        </Link>

        {/* <Input
                    visibleFrom='sm'
                    placeholder='Search for Products, Brand, and more'
                    value={searchValue}
                    size='md'
                    w='700px'
                    onChange={e => setSearchValue(e.currentTarget.value)}
                    leftSectionPointerEvents='all'
                    leftSectionWidth={151}
                    pl={10}
                    leftSection={
                        <>
                            <select className={classes.categorySelect} onChange={(e) => setSearchOffset(e.target.value)}>
                                <option value="all">All Categories</option>
                                {
                                    categories.map((category, i) => {
                                        return <option key={i} value={category.id}>{category.category}</option>
                                    })
                                }
                            </select>
                        </>

                    }
                    rightSectionPointerEvents='all'
                    rightSectionWidth={150}
                    rightSection={
                        <>
                            <CloseButton
                                w={50}
                                aria-label="Clear input"
                                onClick={() => setSearchValue('')}
                                style={{ clipPath: searchValue ? 'circle(100%)' : 'circle(0)' }}
                            />
                            <Button
                                color='var(--mantine-color-secondary-filled)'
                                size='md'
                                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                w={100}
                                onClick={() => {
                                    if (searchValue) {
                                        navigate(`/s?search=${searchValue}&offset=${searchOffset}&page=1`);
                                    }
                                }}
                            >Search</Button>
                        </>
                    }
                /> */}

        <div className="w-full sm:w-1/2 order-3 sm:order-none">
          <div className="flex">
            <select
              onChange={(e) => setSearchOffset(e.target.value)}
              className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            >
              <option
                value="all"
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                All Categories
              </option>
              {categories.map((category, i) => {
                return (
                  <option
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    key={i}
                    value={category.categoryCode}
                  >
                    {toTitleCase(category.categoryName)}
                  </option>
                );
              })}
            </select>
            <div className="relative w-full">
              <input
                type="search"
                onChange={(e) => setSearchValue(e.currentTarget.value)}
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary-500"
                placeholder="Search for Products, Brand, and More"
                required
              />
              <button
                onClick={() => {
                  if (searchValue) {
                    navigate(
                      `/s?search=${searchValue}&offset=${searchOffset}&page=1`
                    );
                  }
                }}
                className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-primary-700 rounded-e-lg border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-x-14 relative order-2 sm:order-none">
          <div>
            <Link to="/cart">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 27C11.5523 27 12 26.5523 12 26C12 25.4477 11.5523 25 11 25C10.4477 25 10 25.4477 10 26C10 26.5523 10.4477 27 11 27Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25 27C25.5523 27 26 26.5523 26 26C26 25.4477 25.5523 25 25 25C24.4477 25 24 25.4477 24 26C24 26.5523 24.4477 27 25 27Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 5H7L10 22H26"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 16.6667H25.59C25.7056 16.6667 25.8177 16.6267 25.9072 16.5535C25.9966 16.4802 26.0579 16.3782 26.0806 16.2648L27.8806 7.26479C27.8951 7.19222 27.8934 7.11733 27.8755 7.04552C27.8575 6.97371 27.8239 6.90678 27.7769 6.84956C27.73 6.79234 27.6709 6.74625 27.604 6.71462C27.5371 6.68299 27.464 6.66661 27.39 6.66666H8"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Badge
              className="absolute top-0 left-6 rounded-lg"
              size="xs"
              color="red"
            >
              {cartList.length}
            </Badge>
          </div>

          {isLoading || token ? (
            <Popover position="bottom" withArrow shadow="md">
              <Popover.Target>
                <IconUserCircle size={35} stroke={1.5} />
              </Popover.Target>
              <Popover.Dropdown>
                <Button
                  leftSection={<IconPower />}
                  color="var(--mantine-color-red-filled)"
                  onClick={() => {
                    dispatch(logout());
                    dispatch(setLoggedIn(false));
                    window.location.reload();
                  }}
                >
                  Logout
                </Button>
              </Popover.Dropdown>
            </Popover>
          ) : location.pathname !== "/login" ? (
            <Button
              variant="outline"
              visibleFrom="sm"
              onClick={() => {
                scrollTo({ y: 0 });
                navigate("/login");
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outline"
              visibleFrom="sm"
              onClick={() => {
                scrollTo({ y: 0 });
                navigate("/register");
              }}
            >
              Register
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
