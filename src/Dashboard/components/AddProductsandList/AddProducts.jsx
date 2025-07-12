import React, { useEffect, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useTablet } from "@/Dashboard/utils/UseBreakPoint";

const AddProductsComponent = () => {
  const [genderState, setGenderState] = useState("");
  const [sizeSelected, setSizeSelected] = useState([]);
  const [basePricing, setBasePricing] = useState("");
  const isTablet = useTablet();

  const handleSizeSelect = (size) => {
    if (sizeSelected.includes(size)) {
      setSizeSelected(sizeSelected.filter((s) => s !== size));
    } else setSizeSelected([...sizeSelected, size]);
  };

  const [files, setFiles] = useState([]);
  const handleFileUpload = (files) => {
    setFiles((prev) => [...prev, ...files]);
    console.log(files);
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
          <div className="flex flex-col items-start justify-between gap-y-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-1 text-xl">
              <i className="bx bx-store"></i>
              <p className="">Add New Product</p>
            </div>

            <div className="flex gap-2">
              <a
                href="#"
                className="border-validGreen/10 hover:bg-validGreen flex items-center gap-1 rounded border-2 px-5 py-2 transition-all duration-500 hover:text-white"
              >
                <i className="bx bx-notepad"></i>
                Save Draft
              </a>
              <a
                href="#"
                className="border-validGreen/10 hover:bg-validGreen flex items-center gap-1 rounded border-2 px-5 py-2 transition-all duration-500 hover:text-white"
              >
                <i className="bx bx-check"></i>
                Publish Product
              </a>
            </div>
          </div>
          {/*  */}

          <div
            className={`mt-2 flex gap-5 ${isTablet ? "flex-col" : "flex-row"}`}
          >
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
            {/* Other side */}
            <div className="flex flex-1 flex-col gap-y-5">
              <div className="mx-auto min-h-96 w-full max-w-4xl rounded-lg border border-dashed border-neutral-200 bg-white shadow">
                <FileUpload onChange={handleFileUpload} />

                <div className="flex justify-start gap-3 overflow-scroll">
                  {files &&
                    [...files]
                      .reverse()
                      .map((file, idx) => (
                        <img
                          src={URL.createObjectURL(file)}
                          key={idx}
                          alt=""
                          className="mx-auto mt-3 h-30 w-30 rounded-md border-2 object-cover object-top shadow"
                        />
                      ))}
                </div>
              </div>
              {/* */}
              <div className="mx-auto w-full max-w-4xl rounded-lg border border-dashed border-neutral-200 px-3 py-6 shadow">
                <h2 className="text-lg font-semibold">Category</h2>
                <p className="mt-3 font-medium">Product Category</p>
                <select
                  name=""
                  id=""
                  className="w-full rounded-md bg-gray-200 py-2 outline-none"
                >
                  <option value="" className="hidden">
                    Select a category
                  </option>
                  <option value="">CAT 1</option>
                  <option value="">CAT 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default AddProductsComponent;
