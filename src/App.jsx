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
import UserProfile from "./Dashboard/components/profile";
import { Dashboard } from "./Dashboard/components/dashboard";
import ColorSwitch from "./Dashboard/components/colorSwitcher";

function App() {
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

        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="color-switch" element={<ColorSwitch />} />
        </Route>

        {/* <Route>
          <Route path="dashboard" element={<DashboardHome />} />
        </Route> */}
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
