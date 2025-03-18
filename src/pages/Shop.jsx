import { useNavigate } from "react-router-dom";

const Shop = () => {
  const navigate = useNavigate();

  const returnHome = () => {
    localStorage.removeItem("userType");
    navigate("/");
  };
  return (
    <>
      <div>Shop</div>
      <button onClick={() => returnHome()}>Hello</button>
    </>
  );
};

export default Shop;
