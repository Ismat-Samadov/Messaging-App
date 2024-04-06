import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_DOMAIN } from "../../utils/API_DOMAIN";
import girlPhoneImg from "../../assets/girl-phone.svg";
import animatedText from "../../assets/animated-text.gif";

export default function SignUp() {
  const [first_name, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const navigation = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_DOMAIN}/users`,
        {
          first_name,
          username,
          email,
          password,
          password_confirmation,
        },
        {},
      );

      // This prevents errors from persisting, for example:
      // If the user attempts to create an account with an existing username,
      // and then modifies it to a non-existing one.
      // By setting 'errors' to 'undefined', any existing errors are cleared.
      setErrors();
      setIsSuccess(response.data.message + ", you will be redirected...");
      // After sucessfully create account and setIsSucess message,
      // Redirect user to login route.
      setTimeout(() => {
        navigation("/login", { replace: true });
      }, [2000]);
      return;
    } catch (err) {
      setErrors(err.response.data.errors);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className=" font-roboto xl:grid xl:grid-cols-2">
      <div className=" relative hidden flex-col items-center justify-center bg-gradient-to-b from-rose-500 to-rose-900 xl:flex">
        <img
          className="w-[150px] xl:mr-[200px] 2xl:w-[250px]"
          src={animatedText}
          alt="animated text gif"
        />
        <img
          src={girlPhoneImg}
          className="w-[500px] 2xl:w-[700px]"
          alt="girl of phone photo"
        />
      </div>
      <div className="flex h-screen flex-col justify-around p-6 xl:col-start-2 xl:rounded-l-[100px]">
        <div className="flex flex-col gap-1.5">
          <h1 className="primary-text-color text-xl font-semibold xl:text-3xl ">
            Create Account
          </h1>
          <p className=" text-gray-400">Connect with your friends today!</p>
        </div>
        <form onSubmit={handleSubmit} className="flex  flex-col gap-3 ">
          <div className="flex flex-col">
            <label htmlFor="first_name" className=" font-medium">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              className="input-default"
              placeholder="Your first name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className=" font-medium">
              Username
            </label>
            <input
              type="username"
              name="username"
              className="input-default "
              placeholder="Your username address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className=" font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="input-default"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className=" font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input-default"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password_confirmation" className=" font-medium">
              Password Confirmation
            </label>
            <input
              type="password"
              name="password_confirmation"
              id=""
              className="input-default"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <div>
            {errors
              ? errors.map((error) => (
                  <li className="text-sm text-red-500" key={error.msg}>
                    {error.msg}
                  </li>
                ))
              : isSuccess && (
                  <p className=" text-sm font-medium text-emerald-500">
                    {isSuccess}
                  </p>
                )}
          </div>
        </form>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className=" button-default primary-bg-color text-white"
          >
            {isLoading ? "Please wait ..." : "Sign Up"}
          </button>
          <p className="text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="primary-text-color font-semibold underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
