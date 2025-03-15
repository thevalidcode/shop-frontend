import {
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/home/Navbar";
import RootLayout from "./layouts/RootLayout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
