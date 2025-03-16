import { NavLink } from "react-router-dom";

function Hero() {
  return (
    <>
      <div className="mt-15 flex flex-col items-center justify-center text-center">
        <h2 className="mx-10 text-4xl leading-12 font-bold opacity-85 md:mx-50 lg:mx-100">
          Shop everything you need online from the{" "}
          <span className="from-validGreen to-validGreen me-2 bg-gradient-to-r via-gray-50 bg-clip-text font-black text-transparent uppercase">
            Nigerian
          </span>
          businesses you love
          <span className="from-validGreen ms-1 bg-gradient-to-r via-green-500 to-green-300 bg-clip-text text-transparent"></span>
        </h2>
        <p className="text-gray-400">At the cheapest price...</p>
        <button className="bg-validGreen mt-5 flex items-center rounded-lg px-3 py-1 font-medium text-gray-50">
          Join Valid Shop as a seller <i class="bx bx-right-arrow-alt"></i>
        </button>
        <NavLink
          to="#"
          className="rounded border-b-2 border-green-800 pt-5 text-[15px]"
        >
          Shop all products
        </NavLink>
      </div>
    </>
  );
}

export default Hero;
