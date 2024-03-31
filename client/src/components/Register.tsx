import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios, { isAxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import Spinner from "./Spinner";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confPassword: "",
  });
  const [avatar, setAvatar] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const { fullName, username, email, password, confPassword } = formData;

  const { toast } = useToast();
  const navigate = useNavigate();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName || !username || !email || !password) {
      toast({
        variant: "destructive",
        title: "All fields are required",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/users/register",
        {
          fullName,
          username,
          email,
          password,
          avatar,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      localStorage.setItem("accessToken", data.token);
      axios.defaults.headers.common["Authorization"] =
        `${localStorage.getItem("accessToken")}`;
      navigate("/");
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
    const checkUser = async () => {
      try {
        await axios.get("/users");
        navigate("/home");
      } catch (error) {
        console.error(error);
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <>
      <div className="bg-gray-950 h-screen flex justify-center items-center text-slate-100">
        <div className="border-slate-600 bg-slate-950 border-2 rounded-md flex flex-col items-center p-8 w-[40%]">
          <div className="my-4 font-bold text-3xl">Create a new account</div>
          <form onSubmit={submitHandler} className="flex flex-col space-y-4">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input
                  placeholder="Full Name"
                  name="fullName"
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={changeHandler}
                  className="border-slate-600"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="username">Username*</Label>
                <Input
                  placeholder="Username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={changeHandler}
                  className="border-slate-600"
                />
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="email">Email*</Label>
                <Input
                  placeholder="Email"
                  name="email"
                  type="text"
                  value={email}
                  onChange={changeHandler}
                  className="border-slate-600"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input
                  placeholder="Profile Picture"
                  name="avatar"
                  type="file"
                  onChange={(e) =>
                    setAvatar(e.target.files ? e.target.files[0] : undefined)
                  }
                  className="border-slate-600"
                />
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="password">Password*</Label>
                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={changeHandler}
                  className="border-slate-600"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="confPassword">Confirm Password*</Label>
                <Input
                  placeholder="Confirm Password"
                  name="confPassword"
                  type="password"
                  value={confPassword}
                  onChange={changeHandler}
                  className="border-slate-600"
                />
              </div>
            </div>
            <div>
              <Button className="m-2">
                {isLoading ? <Spinner /> : <div>Submit</div>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
