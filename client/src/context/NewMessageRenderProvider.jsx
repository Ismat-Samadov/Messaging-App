import { createContext, useContext, useMemo, useState } from "react";

const NewMessageContext = createContext();
/*
  This provider facilitates forced re-renders across various components.
  When the conversation form submits a message, `newMessageRender` increments.
  The useEffect hooks in Conversation and MessagePageConversation components
  fetch conversations and messages within conversations.
  They depend on `newMessageRender`, ensuring re-fetching upon changes.
*/
export default function NewMessageRenderProvider({ children }) {
  const [newMessageRender, setNewMessageRender] = useState(0);

  const contextValue = useMemo(() => {
    return {
      newMessageRender,
      setNewMessageRender,
    };
  });

  return (
    <NewMessageContext.Provider value={contextValue}>
      {children}
    </NewMessageContext.Provider>
  );
}

export function useNewMessageRender() {
  return useContext(NewMessageContext);
}
