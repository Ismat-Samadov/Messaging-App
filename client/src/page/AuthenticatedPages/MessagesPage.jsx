import { useAuth } from "../../context/authProvider";
import Followings from "../../components/Followings";
import MessagesPageHeader from "../../components/MessagesPageHeader";
import MessagePageConversations from "../../components/MessagePageConversations";

export default function MessagesPage() {
  const { user } = useAuth();

  return (
    <div className="w-full ">
      {user && (
        <div>
          <div>
            <MessagesPageHeader />
          </div>
          <div className="mt-4 border-b border-gray-300 p-4 dark:border-neutral-700">
            <Followings />
          </div>
          <div className="flex flex-col ">
            <h1 className="p-4 py-3 text-lg font-semibold">Messages</h1>
            <MessagePageConversations />
          </div>
        </div>
      )}
    </div>
  );
}
