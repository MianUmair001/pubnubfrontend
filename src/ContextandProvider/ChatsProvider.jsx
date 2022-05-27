import React, { useState } from "react";
import ChatsContext from "./Chatscontext";

const ChatsProvider = ({ children }) => {
  const chatsState = {
    publicChatMessages: [],
    privateChatMessages: [],
    groupChatMessages: [],
  };
  const [chats, setChats] = useState(chatsState);
  const updatePublicChatMessages = (message) => {
    setChats((prevState) => {
      return {
        ...prevState,
        publicChatMessages: [...prevState.publicChatMessages, ...message],
      };
    });
  };
  const updatePrivateChatMessages = (message) => {
    setChats((prevState) => {
      return {
        ...prevState,
        privateChatMessages: [...prevState.privateChatMessages, ...message],
      };
    });
  };
  const updateGroupChatMessages = (message) => {
    setChats((prevState) => {
      return {
        ...prevState,
        groupChatMessages: [...prevState.groupChatMessages, ...message],
      };
    });
  };

  return (
    <ChatsContext.Provider
      value={{
        chats,
        updatePublicChatMessages,
        updatePrivateChatMessages,
        updateGroupChatMessages,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};

export default ChatsProvider;
