import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type SelectedChatContextType = {
  selectedChat: string;
  setSelectedChat: Dispatch<SetStateAction<string>>;
};

const defaultState = {
  selectedChat: "",
  setSelectedChat: () => {},
} as SelectedChatContextType;

type SelectedChatProfiderProps = {
  children: ReactNode;
};

export const SelectedChatContext = createContext(defaultState);

const SelectedChatProvider = ({ children }: SelectedChatProfiderProps) => {
  const [selectedChat, setSelectedChat] = useState<string>(
    defaultState.selectedChat,
  );

  return (
    <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {children}
    </SelectedChatContext.Provider>
  );
};

export const SelectedChatState = () => {
  return useContext(SelectedChatContext);
};

export default SelectedChatProvider;
