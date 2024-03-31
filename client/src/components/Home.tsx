import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contacts from "./Contacts";
import Chat from "./Chat";
import { ChatContext, ChatType } from "@/context/ChatProvider";
import { User } from "./ContactCard";
import SelectedChatProvider from "@/context/SelectedChatProvider";
import Spinner from "./Spinner";

export default function Home() {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { setChat } = useContext(ChatContext);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/users");
        setUser(data);
      } catch (error) {
        localStorage.clear();
        console.error(error);
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get<ChatType[]>("/chat");
        setChat(data);
      } catch (error) {
        console.error("error while fetching chats: ", error);
      }
      setIsLoading(false);
    };
    fetchChats();
  }, [setChat, user?._id]);

  return (
    <SelectedChatProvider>
      <div className="bg-gray-900 h-screen w-screen justify-center flex text-slate-200 overflow-y-auto">
        {!isLoading ? (
          <>
            {user ? (
              <>
                <Contacts user={user} />
                <Chat user={user} />
              </>
            ) : (
              <div>getting user</div>
            )}
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </SelectedChatProvider>
  );
}
