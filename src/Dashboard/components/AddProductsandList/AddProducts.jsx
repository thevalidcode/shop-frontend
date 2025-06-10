import React, { useEffect, useState } from "react";

const AddProductsComponent = () => {
  const [genderState, setGenderState] = useState("");
  const [sizeSelected, setSizeSelected] = useState([]);
  const [basePricing, setBasePricing] = useState("");

  const handleSizeSelect = (size) => {
    if (sizeSelected.includes(size)) {
      setSizeSelected(sizeSelected.filter((s) => s !== size));
    } else setSizeSelected([...sizeSelected, size]);
  };

  useEffect(() => {
    console.log(sizeSelected);
  }, [sizeSelected]);

  const sizes = ["XS", "S", "M"];
  const genders = ["Men", "Women", "Unisex"];

  const handleSelectedGender = (selectedGender) => {
    setGenderState(selectedGender);
    console.log(selectedGender);
  };
  return (
    <>
      <>
        <div className="px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xl">
              <i className="bx bx-store"></i>
              <p className="">Add New Product</p>
            </div>

            <div className="flex gap-2">
              <a
                href="#"
                className="border-validGreen/10 flex items-center gap-1 rounded border-2 px-5 py-2"
              >
                <i className="bx bx-notepad"></i>
                Save Draft
              </a>
              <a
                href="#"
                className="border-validGreen/10 flex items-center gap-1 rounded border-2 px-5 py-2"
              >
                <i className="bx bx-check"></i>
                Publish Product
              </a>
            </div>
          </div>
          {/*  */}

          <div className="mt-2 flex">
            <div className="flex-2">
              <div className="rounded-md p-3 shadow">
                <h2 className="text-xl font-medium">General Information</h2>

                {/* Post Fields */}
                <div className="">
                  <div className="mt-2">
                    <label htmlFor="productNameLabel" className="w-full">
                      <p className="mb-1 text-lg font-medium">Product Name</p>
                      <input
                        type="text"
                        id="productNameLabel"
                        placeholder="Hydrating Face Cream"
                        className="focus:border-validGreen/10 mb-2 w-full rounded bg-white px-2 py-2 outline-0 focus:border-3"
                      />
                    </label>
                  </div>

                  {/* Product Description */}
                  <div className="mt-2">
                    <label htmlFor="productDescriptionLabel" className="w-full">
                      <p className="mb-1 text-lg font-medium">
                        Product Description
                      </p>
                      <textarea
                        name=""
                        id="productDescriptionLabel"
                        className="focus:border-validGreen/10 mb-2 h-50 w-full rounded bg-white px-2 py-2 outline-0 focus:border-3"
                      ></textarea>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <h1 className="text-lg font-semibold">Size</h1>
                    <p className="text-sm text-gray-400">Pick available size</p>
                    <div className="flex justify-between gap-3 uppercase">
                      {sizes.map((size, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSizeSelect(size)}
                          className={`h-10 w-10 rounded transition-all duration-300 ${sizeSelected.includes(size) ? "bg-validGreen text-white" : "bg-white"} `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/*  */}
                  <div>
                    <h1 className="text-lg font-semibold">Gender</h1>
                    <p className="text-sm text-gray-400">
                      Pick available gender
                    </p>
                    <div className="flex justify-between gap-3 uppercase">
                      <div c>
                        {genders.map((gender, idx) => (
                          <label htmlFor={gender}>
                            <input
                              type="radio"
                              key={idx}
                              name="gender"
                              id={gender}
                              value={gender}
                              onChange={(e) =>
                                handleSelectedGender(e.target.value)
                              }
                              checked={genderState === gender}
                            />
                            <span className="capitalize"> {gender} </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*  */}
              <div className="mt-10 rounded-md p-3 shadow">
                <h2 className="mb-2 text-lg font-medium">Pricing and Stock</h2>

                <div className="flex flex-col gap-5">
                  <div className="flex justify-between gap-5">
                    <div className="w-full">
                      <label htmlFor="basePricingLabel">Base Pricing</label>
                      <input
                        type="text"
                        id="basePricingLabel"
                        value={basePricing}
                        placeholder="₦6,726"
                        onChange={(e) => setBasePricing(e.target.value)}
                        className="w-full rounded-md bg-gray-200 px-4 py-2"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="">Stock</label>
                      <input
                        type="text"
                        value={basePricing}
                        placeholder="₦6,726"
                        onChange={(e) => setBasePricing(e.target.value)}
                        className="w-full rounded-md bg-gray-200 px-4 py-2"
                      />
                    </div>
                  </div>
                  {/*  */}
                  <div className="flex justify-between gap-5">
                    <div className="w-full">
                      <label htmlFor="basePricingLabel">Discount</label>
                      <input
                        type="text"
                        id="basePricingLabel"
                        value={basePricing}
                        placeholder="₦6,726"
                        onChange={(e) => setBasePricing(e.target.value)}
                        className="w-full rounded-md bg-gray-200 px-4 py-2"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="">Stock</label>
                      <input
                        type="text"
                        value={basePricing}
                        placeholder="₦6,726"
                        onChange={(e) => setBasePricing(e.target.value)}
                        className="w-full rounded-md bg-gray-200 px-4 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      </>
    </>
  );
};

export default AddProductsComponent;
