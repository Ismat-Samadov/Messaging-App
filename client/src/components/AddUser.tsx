import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useContext, useEffect, useState } from "react";
import { User } from "./ContactCard";
import axios, { isAxiosError } from "axios";
import { ChatContext, ChatType } from "@/context/ChatProvider";
import Spinner from "./Spinner";

export default function AddUser() {
  const [users, setUsers] = useState<User[]>();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { chat, setChat } = useContext(ChatContext);

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/users/all`);
      setUsers(data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
      } else console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (search) {
        const { data } = await axios.get(`/users/all?search=${search}`);
        setUsers(data);
      } else {
        const { data } = await axios.get(`/users/all`);
        setUsers(data);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
      } else console.error(error);
    }
    setIsLoading(false);
  };

  const accessChat = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post<ChatType>("/chat/", {
        userId: (e.target as HTMLDivElement).id,
      });
      const exists = chat.some((item) => item._id === data._id);
      if (!exists) {
        setChat([...chat, data]);
      }
      setOpen(false);
      setSearch("");
      setUsers([]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Find users to chat with</DialogDescription>

          <div className="max-h-[50vh] flex flex-col">
            <form className="flex gap-2" onSubmit={submitHandler}>
              <Input
                type="text"
                placeholder="username"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button>Search</Button>
            </form>
            <div className="mt-4 overflow-y-auto">
              {!isLoading ? (
                <>
                  {users && users.length > 0 ? (
                    <>
                      {users.map((usr) => (
                        <div
                          className={`flex items-center px-2 py-2 cursor-pointer transition-all rounded-md border-slate-300 border-2 mt-2 hover:bg-gray-300`}
                          key={usr._id}
                          id={usr._id}
                          onClick={accessChat}
                        >
                          <div className="h-12 w-12">
                            <Avatar className="">
                              <AvatarImage
                                src={usr?.avatar}
                                className="rounded-full object-cover"
                                alt={`${usr?.fullName}'s Avatar`}
                              />
                              <AvatarFallback className="bg-gray-300 text-gray-500 rounded-full">
                                {usr?.fullName[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="ml-4">
                            <div className="font-bold text-lg">
                              {usr?.fullName}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>No Users Found</div>
                  )}
                </>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
