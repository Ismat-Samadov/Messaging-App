import axios from "axios";
import { useEffect, useState } from "react";
import { API_DOMAIN } from "../utils/API_DOMAIN";
import glassesKissSvg from "../assets/reshot-icon-glasses-kiss-YUSND43AHW.svg";
import { SlOptions } from "react-icons/sl";
import { GoPencil } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { IoIosCheckbox } from "react-icons/io";
import { FaRegBellSlash } from "react-icons/fa6";
import { BsExclamationCircle } from "react-icons/bs";
import ConversationDetailsOptions from "./ConversationDetailsOptions";
import { Link } from "react-router-dom";
import LoadingDots from "./LoadingDots";
import DefaultImage from "./DefaultImage";

export default function ConversationDetails({ conversation_id }) {
  const [conversationDetails, setConversationDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getConversation = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_DOMAIN}/conversation/${conversation_id}`,
        );

        setConversationDetails(response.data);
        return;
      } catch (err) {
        return;
      } finally {
        setIsLoading(false);
      }
    };
    getConversation();
  }, [conversation_id]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  return (
    conversationDetails && (
      <div className="flex h-full w-full flex-col">
        <div className="relative flex  w-full flex-col items-center justify-center gap-2 p-4 py-8 ">
          {conversationDetails.participant[0].profile_pic_src ? (
            <Link to={`/users/${conversationDetails.participant[0]._id}`}>
              <img
                src={conversationDetails.participant[0].profile_pic_src}
                alt=""
                className="h-[90px] w-[90px] rounded-full border-2 border-gray-300  object-cover object-center"
              />
            </Link>
          ) : (
            <Link to={`/users/${conversationDetails.participant[0]._id}`}>
              <DefaultImage size="[90px]" />
            </Link>
          )}
          <p>{conversationDetails.participant[0].first_name}</p>
          <p className="opacity-50">
            @{conversationDetails.participant[0].username}
          </p>
          <SlOptions className=" absolute right-2 top-2 cursor-not-allowed" />
        </div>
        <div className="flex flex-col gap-4 border-y border-gray-400 p-4  py-6">
          <h2 className="uppercase">Options</h2>
          <ConversationDetailsOptions icon={<GoPencil />} name="Nickname" />
          <ConversationDetailsOptions icon={<FiSearch />} name="Search" />
        </div>
        <div className="flex flex-col gap-4 p-4 py-6">
          <h2 className=" uppercase">Settings</h2>
          <ConversationDetailsOptions
            icon={<IoIosCheckbox />}
            name="Notifications"
          />

          <ConversationDetailsOptions
            icon={<FaRegBellSlash />}
            name="Mute"
            subName="You won't be notified with messages."
          />
          <ConversationDetailsOptions
            icon={<BsExclamationCircle />}
            name="Report"
            subName="Is something wrong? Report conversation."
          />
        </div>
      </div>
    )
  );
}
