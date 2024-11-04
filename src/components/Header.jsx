import { Link } from "react-router-dom";
import Logo from "../bit components/Logo";
import Search from "../bit components/Search";

function Header() {
  return (
    <>
      <header className='container mx-auto m-4 p-4 bg-gray-400 rounded'>
        <nav className='flex justify-between '>
          <Logo />
          <div>
            <ul className='hidden lg:flex capitalize justify-between w-1/3 gap-4'>
              <li>services</li>
              <li>products</li>
              <li style={{ cursor: "pointer" }}>
                <svg
                  id='sea'
                  xmlns='http://www.w3.org/2000/svg'
                  width='20px'
                  viewBox='0 0 512 512'
                  onClick={() => {
                    let formsearch = document.querySelector(".formsearch");
                    formsearch.classList.toggle("hidden");
                  }}
                >
                  <path d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z' />
                </svg>
              </li>
            </ul>
            <div className='lg:hidden uppercase'>
              <div
                className='hambug'
                onClick={document
                  .querySelector(".nav")
                  .classList.toggle("hidden")}
              >
                <div className='ham'></div>
                <div className='ham'></div>
              </div>
              <ul
                className='nav grid absolute lg:hidden capitalize justify-between w-1/3 gap-2'
                style={{
                  top: "80px",
                  left: "35%",
                  backgroundColor: "GrayText",
                  borderRadius: "0.25rem",
                  placeContent: "center",
                }}
              >
                <li>services</li>
                <li>products</li>
                <li style={{ cursor: "pointer" }}>
                  <svg
                    id='sea'
                    xmlns='http://www.w3.org/2000/svg'
                    width='20px'
                    viewBox='0 0 512 512'
                    onClick={() => {
                      let formsearch = document.querySelector(".formsearch");
                      formsearch.classList.toggle("hidden");
                      document.querySelector(".nav").classList.toggle("hidden");
                    }}
                  >
                    <path d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z' />
                  </svg>
                </li>
              </ul>
            </div>
          </div>
          <div className=''>
            <Link
              to={"/login"}
              // className='w-full h-12 mt-6 px-6 py-4 font-semibold rounded-md bg-black text-white '
            >
              Sign In
            </Link>
          </div>
        </nav>
        <div className='hidden formsearch'>
          <Search />
        </div>
      </header>
    </>
  );
}

export default Header;
