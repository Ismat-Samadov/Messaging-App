import ConversationForm from "./ConversationForm";
import ConversationHeader from "./ConversationHeader";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_DOMAIN } from "../utils/API_DOMAIN";
import Messages from "./Messages";
import { useNewMessageRender } from "../context/NewMessageRenderProvider";
import AccessDenied from "../page/ErrorPages/AccessDenied";

export default function Conversation({ conversation_id }) {
  const [conversationDetails, setConversationDetails] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState();
  const [messages, setMessages] = useState();
  const messageContainerRef = useRef(null);
  const { newMessageRender } = useNewMessageRender();
  // re-fetch everytime the conversation_id changes.

  useEffect(() => {
    const getConversation = async () => {
      try {
        setErrors();
        setIsLoading(true);
        const response = await axios.get(
          `${API_DOMAIN}/conversation/${conversation_id}`,
        );
        return setConversationDetails(response.data);
      } catch (err) {
        console.log(err);
        return setErrors("Conversation not found");
      } finally {
        return setIsLoading(false);
      }
    };
    getConversation();
  }, [conversation_id]);

  // ForceRerender as dependicies why:
  // ConversationForm on Submit, will increment setForceRerender
  // So every time the user sends a message, it will refetch messages.
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(
          `${API_DOMAIN}/conversation/${conversation_id}/message`,
        );

        setMessages(response.data);
        return;
      } catch (err) {
        return setErrors("Conversation not found");
      }
    };
    getMessages();
  }, [conversation_id, newMessageRender]);

  // Scroll to the bottom of the page.
  // messages as dependicies so everytime there's a new message
  // it will go to the bottom.
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (errors) {
    return <AccessDenied />;
  }
  console.log(errors);
  return (
    <div className="flex h-full flex-col lg:h-full">
      <header>
        <ConversationHeader conversationDetails={conversationDetails} />
      </header>
      <div
        className="background-message flex-1 overflow-auto p-2"
        ref={messageContainerRef}
      >
        <Messages
          conversation_id={conversation_id}
          conversationDetails={conversationDetails}
          messages={messages}
        />
      </div>
      <div>
        <ConversationForm conversation_id={conversation_id} />
      </div>
    </div>
  );
}
