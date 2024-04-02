import axios from "axios";
import { useState } from "react";
import { API_DOMAIN } from "../../utils/API_DOMAIN";
import { useAuth } from "../../context/authProvider";
import { Link, useNavigate } from "react-router-dom";
import smirkSvg from "../../assets/reshot-icon-smirk-ZGPUEXQHNB.svg";
import socialLifeSvg from "../../assets/social-life.svg";
import animatedText2 from "../../assets/animated-text2.gif";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigation = useNavigate();

  const { setToken } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_DOMAIN}/login`, {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        setErrors();
        // First setErrors no undefined, otherwise would persists.
        setIsSuccess(true);
        // setTimeout of two seconds so the success message can be displayed.
        // Only then set the token and then navigation.
        // First set setIsSucess to true, otherwise this route(login) would not be accessible. (not authenticated users ONLY)
        // First set the token then navigate, otherwise a refresh would be necessary.
        setTimeout(() => {
          setToken(response.data.token);
          navigation("/", { replace: true });
        }, [2000]);

        return;
      }
    } catch (err) {
      return setErrors(err.response.data.errors);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen font-roboto xl:grid xl:grid-cols-2">
      <div className="hidden flex-col items-center justify-center bg-gradient-to-b from-rose-500 to-rose-900 xl:flex">
        <img
          src={animatedText2}
          alt="animated text gif"
          className="h-[100px]"
        />
        <img
          src={socialLifeSvg}
          alt="people socializing ilustration"
          className="xl:w-[80%]"
        />
      </div>
      <div className="flex h-full flex-col justify-evenly p-6 xl:px-20 ">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Hi, Welcome Back!</h1>
            <p className="opacity-50">We've missed you!</p>
          </div>
          <img src={smirkSvg} alt="smirk emoji" className="h-14 " />
        </div>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="username" className=" font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="input-default"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className=" font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-default"
            />
            {/* build this in future */}
            <Link
              to="/"
              className="primary-text-color mt-2 self-end font-medium"
            >
              Forgot password
            </Link>
          </div>
          <div className="relative h-3">
            {errors && (
              <li className="absolute text-sm text-red-500">{errors}</li>
            )}
            {isSuccess && (
              <p className="text-sm font-medium text-emerald-500">
                You've successfully logged in, you will be redirected...
              </p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="button-default primary-bg-color mt-10 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Login"}
          </button>
        </form>
        <div className="flex flex-col gap-1.5">
          <p className="text-center">
            Don't have an account?{" "}
            <Link
              className="primary-text-color font-semibold underline"
              to="/sign-up"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
