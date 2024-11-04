import { Link } from "react-router-dom";

function Login() {
  return (
    <div className='container mx-auto bg-gray-500 w-1/4 rounded items-center p-4'>
      <form action='' className='grid items-center px-2 capitalize'>
        <label htmlFor=''>username</label>
        <div style={{ height: "10px" }}></div>
        <input type='text' />
        <div style={{ height: "10px" }}></div>
        <label htmlFor=''>password</label>
        <div style={{ height: "10px" }}></div>
        <input type='text' />
        <div style={{ height: "6px" }}></div>
        <div style={{ height: "10px" }}></div>
        <button
          className='w-full h-12 mt-6 px-6 font-semibold rounded-md bg-black text-white'
          type='submit'
        >
          Log In
        </button>
      </form>
      <br />
      <hr />
      <br />
      <p>
        New User?
        <Link
          style={{ textDecoration: "underline", paddingLeft: "10px" }}
          to={"/register"}
        >
          Sign Up now!!!
        </Link>
      </p>
    </div>
  );
}

export default Login;
