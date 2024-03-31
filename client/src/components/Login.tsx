import axios, { isAxiosError } from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Label } from "@radix-ui/react-label";
import Spinner from "./Spinner";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { username, password } = formData;
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post("/users/login", {
        username,
        password,
      });
      localStorage.setItem("accessToken", data.token);
      axios.defaults.headers.common["Authorization"] =
        `${localStorage.getItem("accessToken")}`;
      navigate("/home");
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Oh uh, Something went wrong",
          description: error?.response?.data.msg,
        });
      } else console.error(error);
    }
    setIsLoading(false);
  };

  const loginAsGuest = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.post("/users/login", {
        username: "guest",
        password: "guest123",
      });
      localStorage.setItem("accessToken", data.token);
      axios.defaults.headers.common["Authorization"] =
        `${localStorage.getItem("accessToken")}`;
      navigate("/home");
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Oh uh, Something went wrong",
          description: error?.response?.data.msg,
        });
      } else console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <>
      <div className="bg-gray-950 h-screen flex justify-center items-center text-slate-100">
        <div className="bg-slate-950 border-slate-600 border-2 rounded-md flex flex-col items-center p-8 w-[40%]">
          <div className="my-4 font-bold text-3xl">Login</div>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <Label htmlFor="username" className="text-slate-200 mb-1">
                Username*
              </Label>
              <Input
                placeholder="Username"
                name="username"
                type="text"
                value={username}
                onChange={handleChange}
                className="border-slate-600"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="password" className="text-slate-200 mb-1">
                Password*
              </Label>
              <Input
                placeholder="Password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                className="border-slate-600"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button className="m-2">
                {isLoading ? <Spinner /> : <div>Submit</div>}
              </Button>
              <Link className="text-indigo-900" to="/register">
                Register?
              </Link>
            </div>
            <div className="self-center" onClick={loginAsGuest}>
              Or{" "}
              <span className="cursor-pointer text-blue-400 hover:text-slate-400">
                Login as guest user
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
