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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="shop" element={<Shop />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/product/:slug/:productId" element={<ProductsDetails />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
