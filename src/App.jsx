import {
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import RootLayout from "./layouts/RootLayout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import NotFound from "./components/NotFound";
import ProductsDetails from "./components/ProductDetail/ProductsDetails";
import HomeLayout from "./layouts/HomeLayout";
import Cart from "./components/cart";
import DashboardHome from "./Dashboard/home";
import DashboardLayout from "./layouts/DashboardLayout";
import { SidebarUi } from "./Dashboard/ui/aceternity/sidebarUi";
import UserProfile from "./Dashboard/components/UserAccount/Profile";
import { Dashboard } from "./Dashboard/components/dashboard";
import Settings from "./Dashboard/Pages/Settings";
import { useEffect } from "react";
import SettingsLayout from "./layouts/SettingsLayout";
import { Branding } from "./Dashboard/components/UserAccount/Branding";
import { Toaster } from "@/components/ui/sonner";
import Transactions from "./Dashboard/Pages/Transactions";
import Orders from "./Dashboard/Pages/Orders";
import AddProducts from "./Dashboard/Pages/AddProducts";
import ProductsList from "./Dashboard/components/AddProductsandList/ProductsList";

function App() {
  useEffect(() => {
    const savedColor = localStorage.getItem("themeColor");
    if (savedColor) {
      document.documentElement.style.setProperty(
        "--color-validGreen",
        savedColor,
      );
    }
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<RootLayout />}>
          <Route path="contact" element={<Contact />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/product/:slug/:productId"
            element={<ProductsDetails />}
          />
        </Route>

        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="transactions" element={<Transactions />}></Route>
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="add-product" element={<AddProducts />} />
        </Route>

        <Route path="/dashboard/settings" element={<SettingsLayout />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="branding" element={<Branding />} />
        </Route>

        {/* <Route>
          <Route path="dashboard" element={<DashboardHome />} />
        </Route> */}
      </Route>,
    ),
  );

  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
