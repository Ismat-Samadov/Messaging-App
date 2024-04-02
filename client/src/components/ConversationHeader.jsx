import glassesKissSvg from "../assets/reshot-icon-glasses-kiss-YUSND43AHW.svg";
import { Link } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import DefaultImage from "./DefaultImage";

export default function ConversationHeader({ conversationDetails }) {
  return (
    <div className="flex h-full flex-row gap-2 bg-gray-100 dark:bg-neutral-800 lg:h-[85px]">
      {conversationDetails && (
        <>
          <Link
            to={`/users/${conversationDetails.participant[0]._id}`}
            className="flex flex-row items-center gap-2 p-2"
          >
            {conversationDetails.participant[0].profile_pic_src ? (
              <img
                src={conversationDetails.participant[0].profile_pic_src}
                className="h-[60px] w-[60px] rounded-full border border-gray-300  object-cover object-center"
              />
            ) : (
              <DefaultImage size="[60px]" />
            )}
            <div className="flex flex-col justify-evenly">
              <h1>{conversationDetails.participant[0].first_name}</h1>
              <p>@{conversationDetails.participant[0].username}</p>
            </div>
          </Link>
          <button className="item-center ml-auto cursor-not-allowed self-center pr-2">
            <SlOptionsVertical />
          </button>
        </>
      )}
    </div>
  );
}
