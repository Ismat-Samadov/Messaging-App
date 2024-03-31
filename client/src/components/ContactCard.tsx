import { LatestMessage } from "@/context/ChatProvider";
import { SelectedChatContext } from "@/context/SelectedChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useContext } from "react";
export type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
};

type ContactCardProps = {
  usr: User;
  latestMessage?: LatestMessage;
  chatId: string;
};

export default function ContactCard({
  usr,
  latestMessage,
  chatId,
}: ContactCardProps) {
  const { setSelectedChat, selectedChat } = useContext(SelectedChatContext);
  return (
    <div
      className={`flex gap-4 items-center px-4 py-4 cursor-pointer transition-all border-2 rounded-md border-gray-800 hover:bg-blue-600 hover:bg-opacity-30 ${selectedChat === chatId ? "bg-gray-900" : "bg-gray-800"}`}
      onClick={() => {
        setSelectedChat(chatId);
      }}
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
        <div className="font-bold text-lg">{usr?.fullName}</div>
        <div>
          {latestMessage && (
            <div className="text-sm">
              {latestMessage.content.length >= 50 ? (
                <>{latestMessage.content.substring(0, 50)}...</>
              ) : (
                latestMessage.content
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
