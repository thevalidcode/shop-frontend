import "./App.css";

import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";

function App() {
  /* const [count, setCount] = useState(0) */

  return (
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

export default App;
