import axios from "axios";
import { API_DOMAIN } from "../utils/API_DOMAIN";
import { useAuth } from "../context/authProvider";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SendOrStartConversationButton({ visitedUser }) {
  const [errors, setErrors] = useState();
  const { user } = useAuth();
  const navigation = useNavigate();

  // If there's an ongoing conversation between the logged in user and the visited user,
  // clicking on the button will navigate the user to the existing conversation route.
  // Otherwise, if there is no conversation between both users, create one with a message saying
  // who created it. (The API requires a message to start a conversation).
  // Await the post request and navigate to conversation route using the response.data.conversation_id.
  async function handleSendOrStartConversation() {
    if (visitedUser.existsConversation) {
      navigation(`/conversation/${visitedUser.existsConversation}`);
      return;
    } else {
      try {
        const response = await axios.post(
          `${API_DOMAIN}/conversation/${visitedUser.user._id}`,
          { content: `${user.first_name} started a conversation` },
        );

        navigation(`/conversation/${response.data.conversation_id}`);
        return;
      } catch (err) {
        return setErrors("We apolagise, somethig went wrong.");
      }
    }
  }

  return (
    <>
      <button
        onClick={handleSendOrStartConversation}
        className="flex w-[200px] flex-row items-center justify-center gap-4 rounded-lg bg-green-600 px-2 py-2 font-semibold text-white"
        disabled={errors}
      >
        {errors
          ? errors
          : visitedUser.existsConversation
            ? "Send Message"
            : "Start Conversation"}
        <IoSend className="-rotate-45" />
      </button>
    </>
  );
}
