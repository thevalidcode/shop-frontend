import { createContext, useContext, useState } from "react";

const ValidContext = createContext(null);

// eslint-disable-next-line react/prop-types
function ValidProvider({ children }) {
  // parameter entered
  let [search, setSearch] = useState("");

  // parameters for quering the links
  let [searchParam, setSearchParam] = useState();

  // sets the parameter from the form
  let handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  // handles searchs submit
  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearchParam(search);
    setSearch("");
    document.querySelector(".formsearch").classList.toggle("hidden");
  }

  console.log(search);
  return (
    <ValidContext.Provider
      value={{
        search,
        setSearch,
        handleSearch,
        searchParam,
        setSearchParam,
        handleSearchSubmit,
      }}
    >
      {children}
    </ValidContext.Provider>
  );
}

function GlobalState() {
  const context = useContext(ValidContext);
  if (context === undefined) throw new Error("wrong placement accessing");
  return context;
}

export { ValidContext, ValidProvider, GlobalState };
