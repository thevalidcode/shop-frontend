import { productsData } from "../../Products/ProductsCategoriesData";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="mx-5 mt-5 mb-10">
        <h1 className="font-orbitron mb-2 text-3xl font-bold">
          Explore categories
        </h1>
        <div className="scrollbar-hide flex w-full gap-5 overflow-x-auto">
          {productsData.map((productData) => (
            <div key={productData.id} className="relative shrink-0">
              <img
                className="h-100 w-100 rounded-xl object-cover"
                src={productData.img}
                alt={productData.name + " Image"}
              />
              <div className="from-validGreen/80 absolute bottom-0 w-full rounded-xl bg-gradient-to-t ps-5 pt-50 pb-5">
                <h1 className="font-orbitron text-3xl font-black text-white">
                  {productData.name}
                </h1>
                <p className="mb-2 text-gray-50"> {productData.description} </p>

                <NavLink
                  onClick={() => navigate("/")}
                  to={"/categories" + productData.slug}
                  className="flex w-fit items-center gap-2 rounded-md bg-white px-2 py-2 text-sm font-medium text-gray-800"
                >
                  Explore <i className="bx bx-right-arrow-alt text-xl"></i>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
