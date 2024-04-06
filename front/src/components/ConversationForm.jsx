import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { API_DOMAIN } from "../utils/API_DOMAIN";
import { useState } from "react";
import { useNewMessageRender } from "../context/NewMessageRenderProvider";

export default function ConversationForm({ conversation_id }) {
  const [content, setContent] = useState("");
  const { newMessageRender, setNewMessageRender } = useNewMessageRender();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_DOMAIN}/conversation/${conversation_id}/message`,
        { content: content },
        {},
      );
      setContent("");
      setNewMessageRender((prevMessage) => {
        return prevMessage + 1;
      });
      return console.log(response);
    } catch (err) {
      return console.log(err);
    }
  }

  return (
    <div className="flex w-full flex-row items-center gap-4  bg-white p-2 pl-5 dark:bg-neutral-900 lg:bg-gray-100 lg:dark:bg-neutral-800 ">
      <FaPlus />
      <form
        className="flex w-full  flex-1 flex-row gap-2"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="content"
          placeholder="Type your message.."
          className=" w-full bg-transparent p-2 placeholder:text-black dark:placeholder:text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-rose-700  p-2 text-center text-lg text-white"
        >
          <IoSend className=" -rotate-45" />
        </button>
      </form>
    </div>
  );
}
