import { useAuth } from "../context/authProvider";
import RecievedMessage from "./RecievedMessage";
import SentMessage from "./SentMessage";

export default function Messages({ messages, conversationDetails }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8 py-2">
      {messages &&
        user &&
        messages.allMessages.map((message) =>
          message.sender !== user._id ? (
            <RecievedMessage
              key={message._id}
              conversationDetails={conversationDetails}
              message={message}
            />
          ) : (
            <SentMessage message={message} key={message._id} />
          ),
        )}
    </div>
  );
}
