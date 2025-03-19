import { useEffect } from "react";
import landImg from "/src/assets/landing-page.jpg";
import { NavLink, useNavigate } from "react-router-dom";
let userType = localStorage.getItem("userType");

function Hero() {
  const popularBrands = [
    {
      svg: (
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-15 rounded-lg border-r-[0.5px] pr-3"
        >
          <title>Nike</title>
          <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
        </svg>
      ),
    },
    {
      svg: (
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-15 rounded-lg border-r-[0.5px]"
        >
          <title>LG</title>
          <path d="M14.522 14.078h3.27v1.33h-4.847v-6.83h1.577v5.5zm6.74-1.274h1.284v1.195c-.236.09-.698.18-1.137.18-1.42 0-1.893-.721-1.893-2.186 0-1.398.45-2.221 1.869-2.221.791 0 1.24.248 1.612.722l.982-.903c-.6-.855-1.646-1.114-2.629-1.114-2.208 0-3.368 1.205-3.368 3.504 0 2.288 1.047 3.528 3.358 3.528 1.06 0 2.096-.27 2.66-.665V11.53h-2.739v1.274zM5.291 6.709a5.29 5.29 0 1 1 0 10.582 5.291 5.291 0 1 1 0-10.582m3.16 8.457a4.445 4.445 0 0 0 1.31-3.161v-.242l-.22.001H6.596v.494h2.662l-.001.015a3.985 3.985 0 0 1-3.965 3.708 3.95 3.95 0 0 1-2.811-1.165 3.952 3.952 0 0 1-1.164-2.811c0-1.061.414-2.059 1.164-2.81a3.951 3.951 0 0 1 2.81-1.164l.252.003v-.495l-.251-.003a4.475 4.475 0 0 0-4.47 4.469c0 1.194.465 2.316 1.309 3.161a4.444 4.444 0 0 0 3.16 1.31 4.444 4.444 0 0 0 3.162-1.31m-2.91-1.297V9.644H5.04v4.72h1.556v-.495H5.543zm-1.265-3.552a.676.676 0 1 0-.675.674.676.676 0 0 0 .675-.674" />
        </svg>
      ),
    },
    {
      svg: (
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-15 rounded-lg border-r-[0.5px]"
        >
          <title>PlayStation Portable</title>
          <path d="M0 9.93v.296h7.182v1.626H.001v2.217h.295v-1.921h7.182V9.93zm11.29 0v3.844H7.478v.296h4.124v-3.844h3.813V9.93zm5.233 0v.296h7.182v1.626h-7.182v2.217h.296v-1.921H24V9.93z" />
        </svg>
      ),
    },
    {
      svg: (
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-15 rounded-lg border-r-[0.5px]"
        >
          <title>Apple TV</title>
          <path d="M20.57 17.735h-1.815l-3.34-9.203h1.633l2.02 5.987c.075.231.273.9.586 2.012l.297-.997.33-1.006 2.094-6.004H24zm-5.344-.066a5.76 5.76 0 0 1-1.55.207c-1.23 0-1.84-.693-1.84-2.087V9.646h-1.063V8.532h1.121V7.081l1.476-.602v2.062h1.707v1.113H13.38v5.805c0 .446.074.75.214.932.14.182.396.264.75.264.207 0 .495-.041.883-.115zm-7.29-5.343c.017 1.764 1.55 2.358 1.567 2.366-.017.042-.248.842-.808 1.658-.487.71-.99 1.418-1.79 1.435-.783.016-1.03-.462-1.93-.462-.89 0-1.17.445-1.913.478-.758.025-1.344-.775-1.838-1.484-.998-1.451-1.765-4.098-.734-5.88.51-.89 1.426-1.451 2.416-1.46.75-.016 1.468.512 1.93.512.461 0 1.327-.627 2.234-.536.38.016 1.452.157 2.136 1.154-.058.033-1.278.743-1.27 2.219M6.468 7.988c.404-.495.685-1.18.61-1.864-.585.025-1.294.388-1.723.883-.38.437-.71 1.138-.619 1.806.652.05 1.328-.338 1.732-.825Z" />
        </svg>
      ),
    },

    {
      svg: (
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-15 rounded-lg border-r-[0.5px]"
        >
          <title>Jordan</title>
          <path d="M13.55 2.194v-.075c0-.35.113-.663.338-.938.225-.275.512-.412.862-.412s.663.112.938.337.425.525.45.9c.025.375-.088.688-.338.938s-.55.375-.9.375l-.225.075.075.112-.075.413-.15 1.2c.05.05.075.1.075.15l-.15.75c-.05.1-.1.175-.15.225l-.075.3a22.59 22.59 0 01-.45 1.575v.15c-.05.25-.087.45-.112.6-.025.15-.113.4-.263.75-.1.2-.1.525 0 .975l.075.075c0 .15.063.325.188.525s.187.375.187.525c.05 1-.025 1.85-.225 2.55l.15.45c.6.3.775.625.525.975l.375.15c.6.3 1.025.562 1.275.787.25.225.5.463.75.713.2.05.35.125.45.225l.225.075c1.05.7 2.1 1.55 3.15 2.55l.3.225v.075l-.075.15.225.15h.075c.15.1.25.15.3.15h.075c.05 0 .1-.025.15-.075l.15-.075c.1-.1.2-.175.3-.225h.3c.05 0 .05.025 0 .075l-.3.15-.375.45h.525l.525.075c.15-.05.275-.1.375-.15l.375-.225c.15-.05.3 0 .45.15h.075c.05.05.025.125-.075.225l-.9.825c-.25.2-.475.325-.675.375l-.975.675c-.05.05-.1.05-.15 0l-.225-.3-.15-.3-.188-.263-.225-.3-.187-.225-.15-.187-.3-.225c-.1 0-.2-.025-.3-.075l-.975-.75c-.15 0-.325-.075-.525-.225-.75-.65-1.25-1.05-1.5-1.2l-.45-.3-.9-.15c-.3-.05-.7-.2-1.2-.45l-.6-.3c-.4-.2-.675-.3-.825-.3l-.3-.15c-.2-.05-.35-.1-.45-.15l-.15-.15c-.1 0-.2.025-.3.075l-1.5.75-1.875.825c-.5.4-.975.725-1.425.975l-.825.375-1.275.9c-.1.1-.2.1-.3 0l-.15.15c-.15.05-.25.075-.3.075l-.3.15v.15H3.2l-.15.225c-.1.2-.2.312-.3.337-.1.025-.162.063-.187.113a.434.434 0 01-.075.112l-.15.15-.225.15-.338-.037-.45.075-.3.075c-.25.05-.45.012-.6-.113-.15-.125-.275-.312-.375-.562-.1-.15-.05-.275.15-.375l.075-.075c.05-.05.125-.075.225-.075h.45l.6-.225.3-.075c0-.1.025-.175.075-.225.05-.05.125-.075.225-.075v-.075a.666.666 0 01-.075-.3c-.05-.1-.063-.175-.037-.225.025-.05.05-.075.075-.075h.037l.075.225c.05.25.125.325.225.225l.075-.15c.05-.1.125-.15.225-.15l.15.15.15-.15-.075-.075c0-.05.025-.075.075-.075l.3-.3c.25-.3.55-.575.9-.825.7-.55 1.45-.975 2.25-1.275.25-.25.525-.375.825-.375.2-.35.5-.725.9-1.125.35-.25.6-.425.75-.525.1-.2.225-.3.375-.3h.075l.15-.15c.1-.05.175-.1.225-.15v-.375c0-.25.025-.45.075-.6.05-.15.175-.225.375-.225l.3-.3c-.1-.2-.15-.425-.15-.675h-.075c-.1-.15-.15-.3-.15-.45-.15-.25-.25-.45-.3-.6H9.65c-.05.15-.175.25-.375.3l-.075.15c-.2.35-.375.612-.525.787-.15.175-.425.388-.825.638-.25.25-.425.525-.525.825-.05.15-.05.3 0 .45l-.075.15h.075c0 .1.025.15.075.15h.075c.1.05.15.112.15.187s-.075.1-.225.075a.606.606 0 01-.337-.15c-.075-.075-.138-.112-.188-.112l-.225.225c-.1.15-.2.212-.3.187-.1-.025-.125-.062-.075-.112l.075-.075c.05-.1.05-.15 0-.15l-.6.15c-.05.05-.112.05-.187 0s-.063-.1.037-.15l.375-.15c0-.05-.025-.075-.075-.075-.2.1-.4.125-.6.075l-.375-.075-.075-.075c0-.05.025-.075.075-.075.2.05.45.025.75-.075l.525-.225.6-.675.075-.15c.2-.4.413-.763.638-1.088a3.68 3.68 0 01.712-.787l.075-.3c.1-.2.2-.375.3-.525.1-.15.225-.35.375-.6l.225-.3c.2-.3.425-.45.675-.45l.225-.225c.05-.05.075-.125.075-.225l.15-.15-.075-.075c-.3-.25-.45-.475-.45-.675-.05-.35.063-.65.338-.9s.55-.363.825-.338c.275.025.487.113.637.263l.15.15c.05 0 .075.025.075.075l.3.15v.225c.1.1.15.175.15.225.1-.15.25-.325.45-.525l.375-1.2c0-.2.05-.4.15-.6l.15-.225v-.15l.225-.9h.15l.225-.9a.933.933 0 000-.525l-.3-.75-.15-.6z" />
        </svg>
      ),
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    userType = localStorage.getItem("userType");
    if (userType === "buyer") {
      navigate("/shop");
    } else if (userType === "seller") {
      navigate("/seller-dashboard");
    }
  }, [navigate]);

  const handleSelection = (role) => {
    localStorage.setItem("userType", role);
    navigate(role === "buyer" ? "/shop" : "/seller-dashboard");
  };
  return (
    <>
      <div className="grid h-[calc(100vh-110px)] bg-amber-50/50 md:grid-cols-2">
        {/* <div>
          <h2 className="mx-10 text-4xl leading-12 font-bold opacity-85 md:mx-50 lg:mx-100">
            Shop everything you need online from the{" "}
            <span className="from-validGreen to-validGreen me-2 bg-gradient-to-r via-gray-50 bg-clip-text font-black text-transparent uppercase">
              Nigerian
            </span>
            businesses you love
            <span className="from-validGreen ms-1 bg-gradient-to-r via-green-500 to-green-300 bg-clip-text text-transparent"></span>
          </h2>
          <p className="text-gray-400">At the cheapest price...</p>
          <div className="grid gap-2 md:grid-cols-2">
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
        </div> */}
        <div className="h-full ps-10 pt-10 text-green-900 md:ps-20 md:pt-30">
          <div className="text-4xl font-semibold md:text-4xl lg:text-6xl">
            <h1 className="">Find What You Need</h1>
            <h1 className="ps-3 md:ps-7">Sell What You Have</h1>
          </div>
          <p className="mt-5 text-lg text-gray-500 md:mt-2">
            A platform designed for buyers who love convenience and sellers who
            want to grow. Start exploring now!
          </p>
          <div className="mt-5 flex gap-5">
            <NavLink
              className="flex items-center gap-2 rounded-lg bg-green-950 px-5 py-2 text-lg text-amber-50"
              onClick={() => handleSelection("buyer")}
              to="/shop"
            >
              <i class="bx bx-cart"></i> Browse Products
            </NavLink>
            <NavLink
              className="flex items-center gap-2 rounded-lg border-2 bg-amber-50 px-5 py-2 text-lg text-green-950"
              onClick={() => handleSelection("seller")}
              to="/seller-dashboard"
            >
              <i class="bx bx-dollar"></i> Start Selling
            </NavLink>
          </div>
          <div className="fixed bottom-0 md:static">
            <h4 className="mt-10 mb-2 text-lg font-semibold">
              Popular brands on Valid Shop
            </h4>
            <div className="flex gap-10">
              {popularBrands.map((popularBrand) => popularBrand.svg)}
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            className="mt-2 h-full rounded-lg object-cover"
            src={landImg}
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default Hero;
