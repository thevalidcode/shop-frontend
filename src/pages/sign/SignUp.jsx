import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [userRegisterInfo, setUserRegisterInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    password1: "",
    password2: "",
  });

  const [error, setError] = useState("");

  function handleInfoChange(e) {
    setUserRegisterInfo({
      ...userRegisterInfo,
      [e.target.name]: e.target.value,
    });
  }

  const navigate = useNavigate();
  // function redirected() {useEffect(() => {
  //   navigate("/");
  // }, [])};
  let newError = {};
  function handleRegisterInfoSubmit(e) {
    e.preventDefault();
    // let errorPanel = document.querySelector(".errorpanel");

    // const { firstname, lastname, email, phone_no, password1, password2 } =
    //   userRegisterInfo;

    // validation logic
    // if (firstname || lastname === "") {
    //   newError.name = "Namespace cannot be empty.";
    // } else if (phone_no !== `^\d+$`) {
    //   newError.phone_no = "Phone Number should be numbers only.";
    // } else if (password1 !== password2) {
    //   newError.password = "Passwords do not match";
    // } else if (email == "") {
    //   newError.email = "Email is required";
    // }
    setError(newError);
    // // errorPanel.textContent = error;
    // console.log(error);

    if (Object.keys(error).length === 0) {
      console.log({ ...userRegisterInfo });
      navigate("/");
    }
  }

  return (
    <div className='container mx-auto bg-gray-500 w-1/4 rounded items-center p-4'>
      {/* <div className='errorpanel bg-red-300'></div> */}
      <form
        action=''
        className='grid items-center px-2 capitalize'
        onSubmit={handleRegisterInfoSubmit}
      >
        <label htmlFor='firstname'>first name</label>
        <input
          className='px-2 py-1'
          style={{ outline: "none" }}
          type='text'
          name='firstname'
          id='firstname'
          onChange={handleInfoChange}
          value={userRegisterInfo.firstname}
        />
        <label htmlFor='lastname'>last name</label>
        <input
          className='px-2 py-1'
          style={{ outline: "none" }}
          type='text'
          name='lastname'
          id='lastname'
          onChange={handleInfoChange}
          value={userRegisterInfo.lastname}
        />
        <label htmlFor='email'>e-mail</label>
        <input
          className='px-2 py-1'
          style={{ outline: "none" }}
          type='email'
          name='email'
          id='email'
          onChange={handleInfoChange}
          value={userRegisterInfo.email}
        />
        <label htmlFor='phone_no'>phone number</label>
        <input
          className='px-2 py-1'
          style={{ outline: "none" }}
          type='text'
          name='phone_no'
          id='phone_no'
          onChange={handleInfoChange}
          value={userRegisterInfo.phone_no}
        />
        <label htmlFor='password1'>password</label>
        <input
          className='px-2 py-1'
          style={{ outline: "none" }}
          type='password'
          name='password1'
          id='password1'
          onChange={handleInfoChange}
          value={userRegisterInfo.password1}
        />
        <label htmlFor='password2'>confirm password</label>
        <input
          className='px-2 py-1'
          style={{ outline: "none" }}
          type='password'
          name='password2'
          id='password2'
          onChange={handleInfoChange}
          value={userRegisterInfo.password2}
        />
        <button
          className='w-full h-12 mt-6 px-6 font-semibold rounded-md bg-black text-white '
          type='submit'
          onClick={(e) => handleRegisterInfoSubmit(e)}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default SignUp;
