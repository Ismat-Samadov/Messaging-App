import { Link, NavLink } from "react-router-dom";
import { DateTime } from "luxon";
import DefaultImage from "./DefaultImage";
import { useAuth } from "../context/authProvider";
import ConversationCardLastMessageisRead from "./ConversationCardLastMessageIsRead";

export default function ConversationCard({
  conversation,
  setClickCardReRender,
}) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // // use users time zone to format the date of comment
  const formattedDate = DateTime.fromISO(conversation.lastMessage.timestamp)
    .setZone(userTimeZone)
    .toLocaleString(DateTime.DATETIME_SHORT);

  const { user } = useAuth();

  const linkStyle =
    "relative flex flex-row gap-3 px-4 py-2 hover:bg-stone-100 h-[85px]  dark:hover:bg-zinc-800 border-b border-gray-300 dark:border-neutral-700";
  const activeLinkStyle =
    "relative flex flex-row gap-3 px-4 py-2 dark:bg-neutral-800 h-[85px] bg-gray-100  border-b border-gray-300 dark:border-neutral-700";

  function handleClick() {
    setClickCardReRender((prevRender) => prevRender + 1);
    return;
  }

  return (
    user && (
      <NavLink
        onClick={handleClick}
        to={`/conversation/${conversation.conversation_id}`}
        className={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
      >
        {conversation.participant.profile_pic_src ? (
          <img
            className=" h-[60px] w-[60px] rounded-full border-2 border-gray-200  object-cover object-center"
            src={conversation.participant.profile_pic_src}
            alt=""
          />
        ) : (
          <DefaultImage size="[60px]" />
        )}
        <div className="flex w-full flex-col  ">
          <div className="flex flex-row justify-between">
            <p
              className={`text-lg ${conversation.lastMessage.sender._id !== user._id && conversation.lastMessage.isRead === false && "font-bold"}`}
            >
              {conversation.participant.username}
            </p>
            <p className=" p-2 text-xs text-gray-500">{formattedDate}</p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-row items-center gap-1">
              <ConversationCardLastMessageisRead
                conversation={conversation}
                userId={user._id}
              />
            </div>
          </div>
        </div>
      </NavLink>
    )
  );
}
