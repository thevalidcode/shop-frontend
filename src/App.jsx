/* import "./App.css"; */

import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/sign/Login";
import SignUp from "./pages/sign/SignUp";

function App() {
  /* const [count, setCount] = useState(0) */

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<></>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
