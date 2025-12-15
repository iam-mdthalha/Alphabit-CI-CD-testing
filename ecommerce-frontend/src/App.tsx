import AOS from "aos";
import "aos/dist/aos.css";
import { Navigate } from "react-router-dom";

import "@mantine/carousel/styles.css";
import {
  createTheme,
  CSSVariablesResolver,
  MantineProvider,
  MantineTheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminLayout from "Components/Admin/AdminLayout";
import Footer from "Components/Footer/Footer";
import NavbarWrapper from "Components/Navbar/NavbarWrapper";
import AdminDashboard from "Pages/Admin/AdminDashboard";
import AdminLogin from "Pages/Admin/AdminLogin";
import AdminTemplates from "Pages/Admin/AdminTemplates";
import AnonymousPlaceOrderView from "Pages/AnonymousPlaceOrderView";
import CartView from "Pages/CartView";
import Login from "Pages/Login";

import AboutUs from "Pages/AboutUs";
import Academics from "Pages/Academics";
import Blogs from "Pages/Blogs";
import CancellationsAndRefunds from "Pages/CancellationsAndRefunds";
import CollectionsView from "Pages/CollectionsView";
import ContactUs from "Pages/ContactUs";
import Faqs from "Pages/Faqs";
import Language from "Pages/Language";
import NewCollectionView from "Pages/NewCollectionView";
import OrderPlaced from "Pages/OrderPlaced";
import OrderSummary from "Pages/OrderSummary";
import PlaceOrderView from "Pages/PlaceOrderView";
import PrivacyPolicy from "Pages/PrivacyPolicy";
import ProductDetailView from "Pages/ProductDetailView";
import Register from "Pages/Register";
import ReturnPolicyView from "Pages/ReturnPolicyView";
import SaleView from "Pages/SaleView";
import SearchView from "Pages/SearchView";
import SectionHome from "Pages/SectionHome";
import SectionView from "Pages/SectionView";
import ShippingPolicy from "Pages/ShippingPolicy";
import ShopCategoryView from "Pages/ShopCategoryView";
import ShopSubCategoryView from "Pages/ShopSubCategoryView";
import StoreLocator from "Pages/StoreLocator";
import TermsAndConditions from "Pages/TermsAndConditions";
import TopSellerView from "Pages/TopSellerView";
import WholeSale from "Pages/WholeSale";
// import AdminBanner from "P~ages/Admin/AdminBanner";
import AdminReports from "Pages/Admin/AdminReports";
// import AdminSections from "Pages/Admin/AdminSectionsOld";
import AdminAcademic from "Pages/Admin/AdminAcademic";
import AdminAuthor from "Pages/Admin/AdminAuthor";
import AdminLanguage from "Pages/Admin/AdminLanguage";
import AdminMerchandise from "Pages/Admin/AdminMerchandise";
import AdminAnalytic from "Pages/Admin/AdminAnalytic";
import AdminSections from "Pages/Admin/AdminSections";
import AdminSellBooks from "Pages/Admin/AdminSellBooks";
import AdminSettings from "Pages/Admin/AdminSettings";
import AdminProductBrand from "Pages/Admin/Product/AdminBrand";
import AdminProductCategory from "Pages/Admin/Product/AdminCategory";
import AdminProductCollar from "Pages/Admin/Product/AdminCollar";
import AdminProductColor from "Pages/Admin/Product/AdminColor";
import AdminProductFabric from "Pages/Admin/Product/AdminFabric";
import AdminProductModel from "Pages/Admin/Product/AdminModel";
import AdminProductOccasion from "Pages/Admin/Product/AdminOccasion";
import AdminProductPattern from "Pages/Admin/Product/AdminPattern";
import AdminProduct from "Pages/Admin/Product/AdminProduct";
import AdminProductGroup from "Pages/Admin/Product/AdminProductGroup";
import AdminProductSubClass from "Pages/Admin/Product/AdminSubClass";
// import AdminProductProduct from "Pages/Admin/Product/AdminProductOld";
import AdminLogout from "Components/Admin/AdminLogout";
import AdminRouteGuard from "Components/Admin/AdminRouteGuard";
import FloatingWhatsapp from "Components/Common/FloatingWhatsapp";
import { Templates } from "Enums/Templates";
import { CustomerDTO } from "Interface/Client/Customer/customer.interface";
import AcademicView from "Pages/AcademicView";
import AdminBanner from "Pages/Admin/AdminBanner";
import AdminLoyaltyPoints from "Pages/Admin/AdminLoyaltyPoints";
import AdminProductSize from "Pages/Admin/Product/AdminSize";
import AdminProductSleeve from "Pages/Admin/Product/AdminSleeve";
import AdminProductSubCategory from "Pages/Admin/Product/AdminSubcategory";
import AdminPromotionBrand from "Pages/Admin/Promotion/AdminBrand";
import AdminPromotionCategory from "Pages/Admin/Promotion/AdminCategory";
import AdminPromotionProduct from "Pages/Admin/Promotion/AdminProduct";
import AdminHistory from "Pages/Admin/OtherDetails/AdminHistory";
import AdminHistoryAdd from "Pages/Admin/OtherDetails/AdminHistoryAdd";
import AdminHistoryEdit from "Pages/Admin/OtherDetails/AdminHistoryEdit";
import AdminEvents from "Pages/Admin/OtherDetails/AdminEvents";
import AdminEventsAdd from "Pages/Admin/OtherDetails/AdminEventsAdd";
import AdminEventsEdit from "Pages/Admin/OtherDetails/AdminEventsEdit";
import AdminEventsView from "Pages/Admin/OtherDetails/AdminEventsView";
import AdminGlossary from "Pages/Admin/OtherDetails/AdminGlossary";
import AdminGlossaryAdd from "Pages/Admin/OtherDetails/AdminGlossaryAdd";
import AdminGlossaryEdit from "Pages/Admin/OtherDetails/AdminGlossaryEdit";

import Author from "Pages/Author";
import AuthorsView from "Pages/AuthorsView";
import InvoicePreview from "Pages/InvoicePreview";
import LanguageView from "Pages/LanguageView";
import MerchandiseView from "Pages/MerchandiseView";
import Merchandise from "Pages/Merchendise";
import OTPLogin from "Pages/OTPLogin";
import Offers from "Pages/Offers";
import ResetPassword from "Pages/ResetPassword";
import TrackOrder from "Pages/TrackOrder";
import BooksListing from "Pages/BooksListing";
import { useLazyGetCustomerCartQuery } from "Services/CartApiSlice";
import { useLazyCustomerQuery } from "Services/CustomerApiSlice";
import { setCredentials } from "State/AuthSlice/LoginSlice";
import { setCartCount } from "State/CartSlice/CartSlice";
import { useDocumentTitle } from "State/Hooks/useDocumentTitle";
import { useFavicon } from "State/Hooks/useFavicon";
import { setTemplate } from "State/TemplateSlice/TemplateSlice";
import { AppDispatch, RootState } from "State/store";
import Books from "Pages/Books";
import SellWithUs from "Pages/SellWithUs";
import ResetyourPassword from "Pages/ResetPassword";
import { getBrandName } from "Utilities/templateUtils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "Templates/Template4/Components/Common/ScrollToTop";
import { ECOMLoyaltyPointsPath } from "routes/routes.constant";
import "./App.css";
import { SearchProvider } from "Context/SearchContext";
import WishlistView from "Pages/WishlistView";
import HistoryLanding from "Pages/HistoryLanding";
import HistoryTimeline from "Pages/HistoryTimeline";
import HistoryDetail from "Pages/HistoryDetail";
import Events from "Pages/Events";
import Glossary from "Pages/Glossary";
import GlossaryDetail from "Pages/GlossaryDetail";

interface LayoutProps {
  children: React.ReactNode;
  brandName: string;
}

const theme = createTheme({
  primaryColor: "primary",
  black: "#101720",
  colors: {
    secondary: [
      "#ffe9e9",
      "#ffd3d2",
      "#f8a5a4",
      "#f17472",
      "#ec4b49",
      "#e9312e",
      "#e9221f",
      "#cf1413",
      "#b90b10",
      "#a20009",
    ],
    primary: [
      "#fff7e1",
      "#fdedce",
      "#f7d9a1",
      "#f2c471",
      "#edb247",
      "#eba62c",
      "#eaa11c",
      "#d08c0d",
      "#b97b04",
      "#a16a00",
    ],
    "login-background": [
      "#fdebfe",
      "#f7d2fa",
      "#f1a2f7",
      "#eb6ff5",
      "#e646f2",
      "#e330f1",
      "#e226f2",
      "#c81cd7",
      "#b315c0",
      "#9b06a7",
    ],
  },
  fontSizes: {
    xxl: "1.6rem",
  },
  other: {
    carouselArrowColor: "white",
    sectionWidth: "calc(400px * 0.975)",
    sectionHeight: "calc(480px * 0.975)",
  },
});

const cssVariablesResolver: CSSVariablesResolver = (theme: MantineTheme) => ({
  variables: {
    "--mantine-carousel-arrow-color": theme.other.carouselArrowColor,
    "--section-width": theme.other.sectionWidth,
    "--section-height": theme.other.sectionHeight,
  },
  light: {},
  dark: {},
});

const Layout: React.FC<LayoutProps> = ({ children, brandName }) => (
  <>
    <NavbarWrapper brandName={brandName} />
    {children}
    <FloatingWhatsapp />
    <Footer brandName={brandName} />
  </>
);

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { cartList } = useSelector((state: RootState) => state.cart);
  const { userInfo, token } = useSelector((state: RootState) => state.login);
  const [user, setUser] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { isLoggedIn } = useSelector((state: RootState) => state.stateevents);
  const { selected } = useSelector((state: RootState) => state.template);

  const brandName = getBrandName(selected);

  const [customer, { isLoading: customerLoading, error: customerError }] =
    useLazyCustomerQuery();

  const [customerData, setCustomerData] = useState<CustomerDTO>();

  // const {
  //   data: customer,
  //   error,
  //   isLoading,
  // } = useCustomerQuery(undefined, {
  //   skip: token === null || token === "" || !isLoggedIn,
  // });

  const [getCustomerCart] = useLazyGetCustomerCartQuery();

  useDocumentTitle(`${brandName}`);
  useFavicon(selected);
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      if (selected === Templates.TEMP2) {
        link.href = `${process.env.PUBLIC_URL}/favicon.ico`;
      } else {
        link.href = `${process.env.PUBLIC_URL}/favicon.ico`;
      }
    }
  }, [selected]);

  useEffect(() => {
  const updateVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  updateVh();
  window.addEventListener("resize", updateVh);

  return () => window.removeEventListener("resize", updateVh);
}, []);


  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true, // whether animation runs once or every time you scroll up/down
    });
  }, []);
  useEffect(() => {
    const savedTemplate =
      Templates[
        localStorage.getItem("selectedTemplate") as keyof typeof Templates
      ];
    if (savedTemplate) {
      dispatch(setTemplate(savedTemplate));
      setSelectedTemplate(savedTemplate);
    }
  }, [dispatch]);

  // useEffect(() => {
  //   if (!localStorage.getItem("isCartFetched")) {
  //     const fetchCart = async () => {
  //       try {
  //         let cartResponse: Array<CartResponse> = await getCustomerCart().unwrap();
  //         if (cartResponse) {
  //           let cartInfo = new Array<Cart>();
  //           cartResponse.forEach((cartItem, i) => {
  //             let { discountPrice_, discountPer_, isByValue_ } =
  //               calculatePromotions(cartItem.promotions, cartItem.price);
  //             cartInfo.push({
  //               productId: cartItem.productId,
  //               quantity: cartItem.quantity,
  //               availableQuantity: cartItem.availableQuantity,
  //               ecomUnitPrice: cartItem.price,
  //               discount: discountPrice_,
  //             });
  //           });
  //           localStorage.setItem("isCartFetched", "true");

  //           // dispatch(putToCart(cartInfo));
  //           dispatch(appendToCart(cartInfo));

  //         }
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     };
  //     fetchCart();

  //   }
  // }, [getCustomerCart, customer]);

  const getCustomerApi = async () => {
    try {
      const response = await customer().unwrap();
      if (response.statusCode === 200) {
        setCustomerData(response.results);
        const userInfo = {
          fullName: response.results.fullName,
          custNo: response.results.customerNo,
          email: response.results.email,
          mobileNumber: response.results.mobileNo,
        };
        setUser(userInfo);
        dispatch(
          setCredentials({
            userInfo,
            userToken: localStorage.getItem("userToken"),
          })
        );
        dispatch(setCartCount(response.results.cartCount));
      }
    } catch (err: any) {
      console.error(err);
      // notifications.show({
      //   title: "Error",
      //   message: err.data.message,
      //   color: "red",
      // });
    }
  };

  useEffect(() => {
    if (token && isLoggedIn) {
      getCustomerApi();
    }
  }, [dispatch, cartList, customer]);

  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
    >
      <SearchProvider>
        <div style={{ backgroundColor: "white" }}>
          <MantineProvider
            theme={theme}
            cssVariablesResolver={cssVariablesResolver}
          >
      <Notifications
        position={window.innerWidth < 768 ? "top-center" : "bottom-center"}
        zIndex={9999}
        containerWidth={window.innerWidth < 768 ? 320 : 400}
      />


            <BrowserRouter>
              {/* ScrollToTop added so every route change scrolls to top */}
              <ScrollToTop />
              <Routes>
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* ALL ADMIN DASHBOARD ROUTES */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRouteGuard>
                      <AdminLayout
                        title="Home"
                        description="Admin dashboard home page"
                      >
                        <Routes>
                          <Route path="/" element={<AdminDashboard />} />
                          <Route
                            path="/templates"
                            element={<AdminTemplates />}
                          />
                          <Route path="/banner" element={<AdminBanner />} />
                          <Route
                            path={ECOMLoyaltyPointsPath}
                            element={<AdminLoyaltyPoints />}
                          />
                          <Route path="/sections" element={<AdminSections />} />
                          <Route path="/product" element={<AdminProduct />} />
                          <Route
                            path="/product-group"
                            element={<AdminProductGroup />}
                          />
                          <Route
                            path="/product-category"
                            element={<AdminProductCategory />}
                          />
                          <Route
                            path="/product-subcategory"
                            element={<AdminProductSubCategory />}
                          />
                          <Route
                            path="/product-subclass"
                            element={<AdminProductSubClass />}
                          />
                          <Route
                            path="/product-brand"
                            element={<AdminProductBrand />}
                          />
                          <Route
                            path="/product-model"
                            element={<AdminProductModel />}
                          />
                          <Route
                            path="/product-size"
                            element={<AdminProductSize />}
                          />
                          <Route
                            path="/product-sleeve"
                            element={<AdminProductSleeve />}
                          />
                          <Route
                            path="/product-color"
                            element={<AdminProductColor />}
                          />
                          <Route
                            path="/product-fabric"
                            element={<AdminProductFabric />}
                          />
                          <Route
                            path="/product-occasion"
                            element={<AdminProductOccasion />}
                          />
                          <Route
                            path="/product-collar"
                            element={<AdminProductCollar />}
                          />
                          <Route
                            path="/product-pattern"
                            element={<AdminProductPattern />}
                          />
                          <Route
                            path="/product-promotion"
                            element={<AdminPromotionProduct />}
                          />
                          <Route
                            path="/category-promotion"
                            element={<AdminPromotionCategory />}
                          />
                          <Route
                            path="/brand-promotion"
                            element={<AdminPromotionBrand />}
                          />
                          <Route path="/author" element={<AdminAuthor />} />
                          <Route path="/academic" element={<AdminAcademic />} />
                          <Route path="/language" element={<AdminLanguage />} />
                          <Route
                            path="/merchandise"
                            element={<AdminMerchandise />}
                          />
                          <Route
                            path="/sell-books"
                            element={<AdminSellBooks />}
                          />
                          <Route path="/reports" element={<AdminReports />} />
                          <Route path="/analytic" element={<AdminAnalytic />} />
                          <Route
                            path="/other-details/history"
                            element={<AdminHistory />}
                          />
                          <Route
                            path="/other-details/history/add"
                            element={<AdminHistoryAdd />}
                          />

                          <Route path="/other-details/history/edit"element={<AdminHistoryEdit />}/>
                          <Route path="/other-details/events" element={<AdminEvents />} />
                          <Route path="/other-details/events/add"element={<AdminEventsAdd />}/>
                          <Route path="other-details/events/edit/:id" element={<AdminEventsEdit />} />
                          <Route path="other-details/events/view/:id" element={<AdminEventsView />} />
                          <Route path="other-details/glossary" element={<AdminGlossary />} />
                          <Route path="other-details/glossary/add" element={<AdminGlossaryAdd />} />
                          <Route path="other-details/glossary/edit/:id" element={<AdminGlossaryEdit />} />

                          <Route path="/settings" element={<AdminSettings />} />
                          <Route
                            path="/admin-logout"
                            element={<AdminLogout />}
                          />
                        </Routes>
                      </AdminLayout>
                    </AdminRouteGuard>
                  }
                />

                {/* ROUTES */}
                <Route
                  path="/*"
                  element={
                    <Layout brandName={brandName}>
                      <Routes>
                        <Route path="/" element={<SectionHome />} />

                        <Route path="/history" element={<HistoryLanding />} />
                        <Route
                          path="/history-timeline"
                          element={<HistoryTimeline />}
                        />
                        <Route
                          path="/history/:id"
                          element={<HistoryDetail />}
                        />
                        <Route
                          path="/:productId"
                          element={<ProductDetailView />}
                        />
                        <Route path="/wishlist" element={<WishlistView />} />
                        <Route
                          path="/:productId"
                          element={<ProductDetailView />}
                        />
                        <Route path="/wishlist" element={<WishlistView />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/glossary" element={<Glossary />} />
                        <Route
                          path="/glossary/:id"
                          element={<GlossaryDetail />}
                        />

                        {/* TEST REMOVE */}
                        {/* <Route path="/productId" element={<ProductDetailView />} /> */}

                        <Route
                          path="/new-collections"
                          element={<NewCollectionView />}
                        />
                        <Route
                          path="/top-sellers"
                          element={<TopSellerView />}
                        />
                        <Route path="/cart" element={<CartView />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/otp-login" element={<OTPLogin />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/checkout" element={<PlaceOrderView />} />
                        <Route
                          path="/order-summary"
                          element={<OrderSummary />}
                        />
                        <Route
                          path="/invoice-preview/:doNo"
                          element={<InvoicePreview />}
                        />
                        <Route
                          path="/anonymous-checkout"
                          element={<AnonymousPlaceOrderView />}
                        />
                        <Route
                          path="/order-placed/:orderId"
                          element={<OrderPlaced />}
                        />
                        <Route path="/track-order" element={<TrackOrder />} />
                        <Route path="/sec" element={<SectionView />}>
                          <Route path=":section" element={<SectionView />} />
                        </Route>
                        <Route path="/s" element={<SearchView />} />
                        <Route path="/shop" element={<ShopCategoryView />}>
                          <Route
                            path=":category"
                            element={<ShopCategoryView />}
                          />
                        </Route>
                        <Route
                          path="/category/:category"
                          element={<ShopCategoryView />}
                        />
                        <Route
                          path="/category/:category/:subcategory"
                          element={<ShopSubCategoryView />}
                        />
                        <Route path="/sale" element={<SaleView />} />
                        <Route
                          path="/return-policy"
                          element={<ReturnPolicyView />}
                        />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/Sell-with-us" element={<SellWithUs />} />
                        <Route path="/wholesale" element={<WholeSale />} />
                        <Route path="/faq" element={<Faqs />} />
                        <Route
                          path="/collections"
                          element={<CollectionsView />}
                        />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route
                          path="/terms-and-conditions"
                          element={<TermsAndConditions />}
                        />
                        <Route
                          path="/privacy-policy"
                          element={<PrivacyPolicy />}
                        />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route
                          path="/cancellation-and-refund-policy"
                          element={<CancellationsAndRefunds />}
                        />
                        <Route
                          path="/shipping-policy"
                          element={<ShippingPolicy />}
                        />
                        {/* Updated: Conditional /reset-password route based on selected template */}
                        {selected === Templates.TEMP4 ? (
                          <Route
                            path="/reset-password"
                            element={<ResetyourPassword />}
                          />
                        ) : (
                          <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                          />
                        )}
                        <Route
                          path="/store-locator"
                          element={<StoreLocator />}
                        />
                        <Route
                          path="/books-listing"
                          element={<BooksListing />}
                        />
                        <Route path="/authors" element={<AuthorsView />} />
                        <Route path="/language" element={<LanguageView />} />
                        <Route path="/academic" element={<AcademicView />} />
                        <Route
                          path="/merchandise"
                          element={<MerchandiseView />}
                        />
                        <Route
                          path="/new-collections"
                          element={
                            <Navigate
                              to="/books-listing?type=new-collection"
                              replace
                            />
                          }
                        />
                        <Route
                          path="/top-sellers"
                          element={<TopSellerView />}
                        />
                        <Route path="/offers" element={<Offers />} />

                        <Route path="/books" element={<Books />} />
                        {/* <Route path="/author/:author" element={<Author />} /> */}
                        <Route
                          path="/language/:language"
                          element={<Language />}
                        />
                        <Route
                          path="/academic/:academic"
                          element={<Academics />}
                        />
                        <Route
                          path="/merchandise/:merchandise"
                          element={<Merchandise />}
                        />
                      </Routes>
                    </Layout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </MantineProvider>
        </div>
      </SearchProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
