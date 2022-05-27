import React, { useState } from "react";
import ChatsContext from "./Chatscontext";
import DialogsContext from "./Dialogscontext";

const DialogsProvider = ({ children }) => {
  const DialogState = {
    publicDialogList: [],
    PrivateDialogList: [],
    GroupDialogList: [],
  };
  const [dialogs, setDialogs] = useState(DialogState);
  const updatePublicDialogList = (dialoglist) => {
    setDialogs((prevState) => {
      return {
        ...prevState,
        publicDialogList: [...dialoglist],
      };
    });
  };
  const updatePrivateDialogList = (message) => {
    setDialogs((prevState) => {
      return {
        ...prevState,
        PrivateDialogList: [...prevState.PrivateDialogList, ...message],
      };
    });
  };
  const updateGroupDialogList = (dialoglist) => {
    setDialogs((prevState) => {
      return {
        ...prevState,
        GroupDialogList: [...dialoglist],
      };
    });
  };

  return (
    <DialogsContext.Provider
      value={{
        dialogs,
        updatePublicDialogList,
        updatePrivateDialogList,
        updateGroupDialogList,
      }}
    >
      {children}
    </DialogsContext.Provider>
  );
};

export default DialogsProvider;
