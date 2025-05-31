import axios from "axios";
import React, { useEffect, useState } from "react";
import { QuickBranding } from "./Branding";

const UserProfile = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Nigeria");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries")
      .then((res) => {
        setCountries(res.data.data.map((c) => c.country));
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/states", {
          country: selectedCountry,
        })
        .then((res) => {
          setStates(res.data.data.states.map((s) => s.name));
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      setCities([]); // Reset cities when country or state changes
      axios
        .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
          country: selectedCountry,
          state: selectedState,
        })
        .then((res) => {
          console.log(res.data.data); // Debug output
          setCities(res.data.data);
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  }, [selectedCountry, selectedState]); //

  const pageTitle = "Profile";

  useEffect(() => {
    document.title = ` ${pageTitle} - ValidSoop `;
  }, [pageTitle]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-5">
        <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row">
          <div className="flex w-full flex-2 flex-col gap-5">
            {/* General Information Div */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="">
                <h2 className="text-lg">General Information</h2>
                <p className="text-sm leading-3 text-gray-600">
                  Manage your account details
                </p>
              </div>
              <div>
                {/* Form */}
                {/* First and Last Name */}
                <div className="mt-5 flex items-center gap-4">
                  <label htmlFor="firstNameLabel" className="w-full">
                    <h3>First Name</h3>
                    <input
                      type="text"
                      name=""
                      id="firstNameLabel"
                      placeholder="First Name"
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    />
                  </label>
                  <label htmlFor="lastNameLabel" className="w-full">
                    <h3>Last Name</h3>
                    <input
                      type="text"
                      name=""
                      id="lastNameLabel"
                      placeholder="Last Name"
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    />
                  </label>
                </div>
                {/* Countries and Cities */}
                <div className="mt-5 flex items-center gap-4">
                  <label htmlFor="countryLabel" className="w-full">
                    <h3>Country</h3>
                    <select
                      name=""
                      id="countryLabel"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    >
                      {countries && countries.length > 0
                        ? countries.map((c, i) => (
                            <option key={i} value={c}>
                              {c}
                            </option>
                          ))
                        : "No countries available"}
                    </select>
                  </label>
                  <label htmlFor="stateLabel" className="w-full">
                    <h3>State</h3>
                    <select
                      name=""
                      id="stateLabel"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    >
                      {states && states.length > 0
                        ? states.map((s, i) => (
                            <option key={i} value={s}>
                              {s}
                            </option>
                          ))
                        : "No countries available"}
                    </select>
                  </label>
                </div>
                {/* Cities and Zip Code */}
                <div className="mt-5 flex items-center gap-4">
                  <label htmlFor="cityLabel" className="w-full">
                    <h3>Cities</h3>
                    <select
                      name=""
                      id="cityLabel"
                      // value={selectedCountry}
                      // onChange={(e) => setSelectedCountry(e.target.value)}
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    >
                      {cities && cities.length > 0
                        ? cities.map((c, i) => (
                            <option key={i} value={c}>
                              {c}
                            </option>
                          ))
                        : "No countries available"}
                    </select>
                  </label>
                  <label htmlFor="stateLabel" className="w-full">
                    <label htmlFor="zipCodeLabel" className="w-full">
                      <h3>Zip Code</h3>
                      <input
                        type="text"
                        name=""
                        id="zipCodeLabel"
                        placeholder="Zip Code"
                        className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                      />
                    </label>
                  </label>
                </div>
                {/* Email and Phone Number */}
                <div className="mt-5 flex items-center gap-4">
                  <label htmlFor="emailLabel" className="w-full">
                    <h3>Email</h3>
                    <input
                      type="email"
                      name=""
                      id="emailLabel"
                      placeholder="Email"
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    />
                  </label>
                  <label htmlFor="numberLabel" className="w-full">
                    <h3>Number</h3>

                    <input
                      type="tel"
                      name=""
                      id="numberLabel"
                      placeholder="Number"
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    />
                  </label>
                </div>
                {/* Save Button */}
                <div className="flex w-full justify-end">
                  <button className="bg-validGreen mt-5 cursor-pointer rounded px-4 py-2 text-gray-50">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Password Div  */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="">
                <h2 className="text-lg">Password Information</h2>
              </div>

              {/* Form */}
              <div className="mt-5">
                <div className="flex gap-4">
                  <label htmlFor="currentPassword" className="w-full">
                    <h2>Current Password</h2>
                    <input
                      type="password"
                      name=""
                      id="currentPassword"
                      placeholder="Current Password"
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    />
                  </label>
                  <label htmlFor="newPassword" className="w-full">
                    <h2>New Password</h2>
                    <input
                      type="password"
                      name=""
                      id="newPassword"
                      placeholder="New Password"
                      className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
                    />
                  </label>
                </div>

                <div className="mt-5">
                  <h1>Password Requirements</h1>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>
                      Special Character: Include at least 1 special character
                      (e.g. !@#$%^&*).
                    </li>
                    <li>Minimum Length: At least 8 characters.</li>
                    <li>
                      Uppercase Letter: Include at least 1 uppercase (A-Z).
                    </li>
                    <li>
                      Lowercase Letter: Include at least 1 lowercase (a-z).
                    </li>
                    <li>Number: Must contain at least 1 number (0-9).</li>
                  </ul>
                  {/* Save Button */}
                  <div className="flex w-full justify-end">
                    <button className="bg-validGreen mt-5 cursor-pointer rounded px-4 py-2 text-gray-50">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  */}

          <div className="flex flex-1 flex-col gap-5">
            {/* Profile card */}
            <div className="flex gap-3 rounded-lg bg-white p-6 shadow-md">
              <div>
                <img
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt=""
                  className="h-15 w-15 rounded-full object-cover"
                />
              </div>

              <div>
                <h2 className="">John Doe</h2>
                <p className="text-gray-400">Store name: Walmart</p>
                <p className="mt-3 font-medium">Change Avatar</p>
              </div>
            </div>
            {/* Quick branding */}
            <div className="gap-3 rounded-lg bg-white p-6 shadow-md">
              <p className="text-lg">Quick Branding</p>

              <div className="mt-5">
                <p>Change Theme</p>
                <QuickBranding />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
