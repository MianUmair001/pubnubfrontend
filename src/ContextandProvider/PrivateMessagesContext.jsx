import { createContext } from "react";

const PrivateMessagesContext = createContext({
  privateMessages: [],
  setPrivateMessages: (newMessage) => {},
});
export default PrivateMessagesContext;
