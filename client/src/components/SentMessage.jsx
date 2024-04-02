import formatDate from "../utils/formatDate";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";

export default function SentMessage({ message }) {
  const formattedDate = formatDate(message.timestamp);

  /*
    Fun fact that I hope I never forget just because I dont want to deal 
    with it again. The problem I had was BIG TEXTS were wrapping as they should,
    but BIG WORDS were not wrapping at all, causing the text to overflow the 
    message box.


    This was the previous (the error prone) structure:

    <div className="flex max-w-[80%] flex-col gap-1 self-end">
      <p className="self-end rounded-l-3xl rounded-tr-3xl break-words bg-rose-500 px-4 py-1  text-white ">
        {message.content}
      </p>
      <p className="self-end text-xs opacity-35">{formattedDate}</p>
    </div>

    And even tho 'break-words' were suppose to make the word break and allow to
    wrap. IT WASN'T WORKING!!!! Why? Because of self-end which makes 0 sense to me.
  */

  return (
    <div className="flex max-w-[80%] flex-col  gap-1 self-end">
      <p className=" break-words rounded-l-3xl rounded-tr-3xl  bg-rose-500 px-4 py-1  text-white ">
        {message.content}
      </p>
      <div className="flex flex-row gap-1 self-end">
        <p className="text-xs opacity-35">{formattedDate}</p>
        {message.isRead ? (
          <IoCheckmarkDone className="text-xl text-sky-500" />
        ) : (
          <IoCheckmark className="text-gray-400" />
        )}
      </div>
    </div>
  );
}
