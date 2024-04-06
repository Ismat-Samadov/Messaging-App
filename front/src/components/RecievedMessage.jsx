import formatDate from "../utils/formatDate";
import DefaultImage from "./DefaultImage";

export default function RecievedMessage({ conversationDetails, message }) {
  const formattedDate = formatDate(message.timestamp);

  return (
    <div className="flex flex-row gap-3">
      {conversationDetails &&
      conversationDetails.participant[0].profile_pic_src ? (
        <img
          src={conversationDetails.participant[0].profile_pic_src}
          alt=""
          className="h-[45px] w-[45px] rounded-full border border-gray-300  object-cover object-center"
        />
      ) : (
        <DefaultImage size="[45px]" />
      )}
      <div className="flex max-w-[80%] flex-col gap-1 " key={message._id}>
        <p className="break-words rounded-r-3xl rounded-bl-3xl bg-black px-4 py-1 text-white dark:bg-white dark:text-black">
          {message.content}
        </p>
        <p className="self-start text-xs opacity-35">{formattedDate}</p>
      </div>
    </div>
  );
}
