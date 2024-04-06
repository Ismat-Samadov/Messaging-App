import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";
import { IoNotificationsCircle } from "react-icons/io5";

export default function ConversationCardlastMessageisRead({
  userId,
  conversation,
}) {
  const lastMessageSmaller = conversation.lastMessage.content.slice(0, 30);

  // If the last message was sent by the user
  if (conversation.lastMessage.sender._id === userId) {
    if (conversation.lastMessage.isRead === false) {
      return (
        <>
          <IoCheckmark className="text-md text-gray-500" />
          <p className="max-w-[150px] break-words text-sm text-gray-500 lg:max-w-none">
            {lastMessageSmaller}...
          </p>
        </>
      );
    }
    return (
      <>
        <IoCheckmarkDone className="text-lg text-sky-500" />
        <p className="text-sm text-gray-500">{lastMessageSmaller}...</p>
      </>
    );
  }

  // If the message was sent by the other conversation participant
  if (conversation.lastMessage.sender._id !== userId) {
    if (conversation.lastMessage.isRead === false) {
      return (
        <div className="flex flex-row items-center gap-1">
          <IoNotificationsCircle className=" text-2xl text-rose-500" />

          <p className="text-sm font-bold ">{lastMessageSmaller}...</p>
        </div>
      );
    }
    return <p className="text-sm text-gray-500">{lastMessageSmaller}...</p>;
  }
}
