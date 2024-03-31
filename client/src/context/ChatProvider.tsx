import { User } from "@/components/ContactCard";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type LatestMessage = {
  _id: string;
  sender: User;
  content: string;
  chatId: string;
};

export type ChatType = {
  _id: string;
  users: User[];
  latestMessage?: LatestMessage;
};

export type ChatContextInterface = {
  chat: ChatType[];
  setChat: Dispatch<SetStateAction<ChatType[]>>;
};

const defaultState = {
  chat: [
    {
      _id: "",
      users: [],
      latestMessage: undefined,
    },
  ],
  setChat: () => {},
} as ChatContextInterface;

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatContext = createContext(defaultState);

const ChatProvider = ({ children }: ChatProviderProps) => {
  const [chat, setChat] = useState<ChatType[]>(defaultState.chat);

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
