import axios from "axios";
import { useEffect, useState } from "react";
import { API_DOMAIN } from "../utils/API_DOMAIN";
import { useNewMessageRender } from "../context/NewMessageRenderProvider";
import ConversationCard from "../components/ConversationCard";
import LoadingSpinner from "./LoadingSpinner";

export default function MessagePageConversations() {
  const [conversations, setConversations] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState();
  const [clickCardReRender, setClickCardReRender] = useState(0);
  /*
    clickCardReRender, wil refetch the conversations when a card is clicked.
    In order get if the lastMessage was read or not.
  */

  const { newMessageRender } = useNewMessageRender();

  useEffect(() => {
    const userConversations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_DOMAIN}/conversation`);
        setConversations(response.data.allUserConversations);
        return;
      } catch (err) {
        setErrors(err.response.data.errors);
      } finally {
        setIsLoading(false);
      }
    };
    userConversations();
  }, [newMessageRender, clickCardReRender]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col ">
      {conversations &&
        conversations.map((conversation) => (
          <ConversationCard
            key={conversation.participant._id}
            conversation={conversation}
            setClickCardReRender={setClickCardReRender}
          />
        ))}
    </div>
  );
}
