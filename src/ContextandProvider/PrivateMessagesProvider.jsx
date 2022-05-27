import merge from "lodash.merge";
import { useState } from "react";
import PrivateMessagesContext from "./PrivateMessagesContext";
const PrivateMessagesProvider = ({ children }) => {
  const setPrivateMessages = (message) => {
    updatePrivateMessages((prevState) => {
      return {
        ...prevState,
        privateMessages: [...message],
      };
    });
  };

  const PrivateMessagesState = {
    privateMessages: [],
    setPrivateMessages,
  };
  const [privateMessages, updatePrivateMessages] =
    useState(PrivateMessagesState);
  return (
    <PrivateMessagesContext.Provider value={privateMessages}>
      {children}
    </PrivateMessagesContext.Provider>
  );
};
export default PrivateMessagesProvider;
