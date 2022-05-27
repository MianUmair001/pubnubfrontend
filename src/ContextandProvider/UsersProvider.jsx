import React, { useState } from "react";
import ChatsContext from "./Chatscontext";
import UsersContext from "./UserContext";

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const updateUsers = (users) => {
    setUsers((prevState) => {
      return [...users];
    });
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        updateUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;
