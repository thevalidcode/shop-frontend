import { GlobalState } from "../context/Context";

function Search() {
  const { search, handleSearch, handleSearchSubmit } = GlobalState();

  return (
    <div>
      <form action='' className='flex gap-2' onSubmit={handleSearchSubmit}>
        <div className='form flex w-full justify-center gap-2'>
          <input
            type='text'
            value={search}
            className='w-5/6 rounded'
            onChange={handleSearch}
          />
          <button
            className='px-6 font-semibold rounded-md bg-black text-white'
            type='submit'
            onClick={handleSearchSubmit}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default Search;
