import { Client } from "@twilio/conversations";

var QuickBlox = require("quickblox/quickblox.min");
var axios = require("axios");

export const getSession = async () => {
  var check = await QuickBlox.service.getSession();
  await QuickBlox.getSession(function (error, session) {
    if (error) {
      // console.log("I am get Session Error", error);
    } else {
      // console.log("I am getSession", session);
      return session;
    }
  });
};
export const signUp = async ({ login, password, username }) => {
  console.log("I am in SignUp");

  return new Promise(async (resolve, reject) => {
    const data = await axios.post("https://chatapppub.herokuapp.com/register", {
      username: username,
      email: login,
      password,
    });
    // console.log("I am signUpReturnData", data);

    QuickBlox.users.create(
      {
        login: username,
        password: password,
        full_name: username,
      },
      function (error, result) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          // console.log("I am SignupResponse", result);
          resolve(result);
        }
      }
    );
  });
};
const assignParticipantToRoom = async (roomId, userId) => {
  // console.log("I am in assignParticipantToRoom", roomId, userId);
  try {
    const assignUser = await axios.post(
      `https://chatapppub.herokuapp.com/room/${roomId}/users/${userId}`
    );
    console.log("I am assignUser", assignUser);
  } catch (error) {
    console.log({ error });
  }
};
export const login = async ({ login, password, full_name }) => {
  try {
    // console.log("I am in Login");

    return new Promise(async (resolve, reject) => {
      const data = await axios.post(
        "https://chatapppub.herokuapp.com/login",
        {
          email: login,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("I am loginReturnData", data);
      localStorage.setItem('token',data.data.token);
      localStorage.setItem('conversationToken',data.data.twilioConvToken);
      localStorage.setItem('syncToken',data.data.twilioSyncToken);
      
      
      if (data?.status === 200) {
        // console.log("In If");

        // QuickBlox.login(
        //   { login: login.split("@")[0], password },
        //   function (error, result) {
        //     if (error) {
        //       console.log({ error });
        //       reject(error);
        //     } else {
        //       // console.log("I am LoginResponse", result);
        //       resolve(result);
        //     }
        //   }
        // );
        assignParticipantToRoom(
          "CH57fb8c35f1cf4ff7a4f73057e97343b4",
          data.data._id
        );
          resolve(data);
        // connectTwilio(data.data.twilioToken);
      } else {
        throw new Error("Invalid Credentials");
      }
    });
  } catch (error) {
    console.log({ error });
  }
};
export const retriveUsers = () => {
  var params = {
    // filter: {
    //   field: "created_at",
    //   param: "between",
    //   value: "2022-01-01, 2021-05-06",
    // },
    order: {
      field: "created_at",
      sort: "asc",
    },
    page: 1,
    per_page: 50,
  };

  return new Promise((resolve, reject) => {
    QuickBlox.users.listUsers(params, function (error, result) {
      if (error) {
        console.log("I am Retrive User Error", error);
        reject(error);
      } else {
        // console.log("I am retriveUsersLatest", result);
        resolve(result);
      }
    });
  });
};
export const createPublicChatDialog = (name) => {
  var params = {
    type: 1,
    name,
  };
  QuickBlox.chat.dialog.create(params, function (error, dialog) {
    if (error) {
      console.log("I am DialogError", error);
    } else {
      console.log("I am dialog", dialog);
    }
  });
};
export const getUserById = () => {
  var searchParams = {
    filter: { field: "id", param: "in", value: [134405889] },
  };
  return new Promise((resolve, reject) => {
    QuickBlox.users.listUsers(searchParams, function (error, result) {
      if (error) {
        console.log("I am GetUserByIdError", error);
        reject(error);
      } else {
        console.log("I am GetUserById", result);
        resolve(result);
      }
    });
  });
};
export const getUserNameById = (id) => {
  var searchParams = {
    filter: { field: "id", param: "in", value: [id] },
  };
  var userName = "";
  return new Promise((resolve, reject) => {
    QuickBlox.users.listUsers(searchParams, function (error, result) {
      if (error) {
        console.log("I am GetUserByIdError", error);
        reject(error);
      } else {
        userName = result.items[0].user.login;
        console.log("I am GetUserNameById", userName);
        resolve(userName);
      }
    });
  });
};
export const logout = () => {
  QuickBlox.logout(function (error) {
    // callback function
  });
  
};

export const retrivePublicDialogList = () => {
  let params = {
    type: {
      in: [1],
    },
    created_at: {
      lt: Date.now() / 1000,
    },
    sort_desc: "created_at",
    // skip: 90,
    limit: 10,
  };
  return new Promise((resolve, reject) => {
    QuickBlox.chat.dialog.list(params, function (error, dialogs) {
      if (error) {
        console.log("I am DialogError", error);
        reject(error);
      } else {
        // console.log("I am allDialog", dialogs);
        resolve(dialogs);
      }
    });
  });
};
export const getGroupDialog = () => {
  let params = {
    type: {
      in: [2],
    },
  };
  return new Promise((resolve, reject) => {
    QuickBlox.chat.dialog.list(params, function (error, dialogs) {
      if (error) {
        console.log("I am DialogError", error);
        reject(error);
      } else {
        // console.log("I am allDialog", dialogs);
        resolve(dialogs);
      }
    });
  });
};
const sendRecivedMessageData = (userId, message) => {
  return { userId, message };
};
export const sendPrivateMessage = (text, opponentId, userId) => {
  console.log(typeof opponentId);
  opponentId = parseInt(opponentId);
  userId = parseInt(userId);
  var message = {
    type: "chat",
    body: text,
    markable: 1,
    extension: {
      save_to_history: 1,
      send_to_chat: 1,
      senderId: userId,
      receiverId: opponentId,
    },
  };
  try {
    message.id = QuickBlox.chat.send(opponentId, message);
    console.log("I am MessageSentPrivate", message.id, message);
  } catch (e) {
    if (e.name === "ChatNotConnectedError") {
      console.log("Chat Errror in send PrivateMessage");
    }
  }
};
export const sendMessage = (text, dialogId) => {
  console.log("I am Text and Dialog ID in Send Message", text, dialogId);
  console.log("DialogIdType", typeof dialogId);
  var message = {
    type: "groupchat",
    body: text,
    extension: {
      save_to_history: 1,
      dialog_id: dialogId,
    },
    markable: 1,
  };

  var dialogJid = QuickBlox.chat.helpers.getRoomJidFromDialogId(dialogId);
  try {
    message.id = QuickBlox.chat.send(dialogJid, message);
    console.log("I am sent messageId", message.id);
  } catch (error) {
    console.log("I am SendMessageError", { error });
    if (error.name === "ChatNotConnectedError") {
      console.log("ChatNotConnectedError");
    }
  }
};
export const getAllMessages = (dialogId) => {
  // console.log("DialogId in All Messages", dialogId);
  var params = {
    chat_dialog_id: dialogId,
    sort_desc: "date_sent",
    limit: 100,
    skip: 0,
  };
  return new Promise((resolve, reject) => {
    QuickBlox.chat.message.list(params, function (error, messages) {
      if (error) {
        reject(error);
      } else {
        // console.log("We are all previous Messages", { messages });
        resolve(messages);
      }
    });
  });
};
export const getPrivatemessages = () => {
  try {
    // console.log("DialogId in All Messages");
    var params = {
      sort_desc: "date_sent",
      limit: 100,
      skip: 0,
    };
    return new Promise((resolve, reject) => {
      QuickBlox.chat.message.list(params, function (error, messages) {
        if (error) {
          // reject(error);
        } else {
          // console.log("We are all previous Messages getPrivatemessages ", {
          //   messages,
          // });
          resolve(messages);
        }
      });
    });
  } catch (error) {
    console.log({ error });
  }
};

export const deleteDialog = (dialogId) => {
  QuickBlox.chat.dialog.delete([dialogId], { force: 1 }, function (error) {});
};

export const deleteAllDialog = async (type) => {
  const check = await retrivePublicDialogList();
  // console.log("I am in DeleteAll", check);
  check.items.map((check1) => {
    QuickBlox.chat.dialog.delete(
      [check1._id],
      { force: 1 },
      function (error) {}
    );
  });
};

export const joinDialog = (dialogId) => {
  var dialogJid = QuickBlox.chat.helpers.getRoomJidFromDialogId(dialogId);
  try {
    QuickBlox.chat.muc.join(dialogJid, function (error, result) {
      if (error) {
        console.log("I am JoinDialogError", error);
      } else {
        // console.log("I am Join Dialog Result", result);
      }
    });
  } catch (e) {
    if (e.name === "ChatNotConnectedError") {
      // not connected to chat
    }
  }
};

export const createGroupDialog = (name, userList) => {
  var params = {
    type: 2,
    occupants_ids: userList,
    name: name,
  };

  QuickBlox.chat.dialog.create(params, function (error, dialog) {
    if (error) {
      console.log("I am DialogError", error);
    } else {
      // console.log("I am GroupChatDialog", dialog);
    }
  });
};

export const adduserToContactList = (userId) => {
  userId = parseInt(userId);
  try {
    QuickBlox.chat.roster.add(userId, function () {
      // console.log("User Added to the Contact List");
    });
  } catch (e) {
    if (e.name === "ChatNotConnectedError") {
      // not connected to chat
    }
  }
};

export const RecievedRequest = (userId) => {
  // console.log("Contact Request Recieved", userId);
};

export const getContactList = () => {
  try {
    QuickBlox.chat.roster.get(function (contactlist) {
      // console.log("I am ContactList", contactlist);
    });
  } catch (e) {
    if (e.name === "ChatNotConnectedError") {
      // not connected to chat
    }
  }
};
//// Video Call
// var session = null;
// export const createVideoCallSession = (calleesIds) => {
//   var sessionType = QuickBlox.webrtc.CallType.VIDEO; // AUDIO is also possible
//   var additionalOptions = {};

//   session = QuickBlox.webrtc.createNewSession(
//     calleesIds,
//     sessionType,
//     null,
//     additionalOptions
//   );
//   console.log("I am VideoSession", session);
// };
// export const accessUserPrivileges = () => {
//   var mediaParams = {
//     audio: true,
//     video: true,
//     options: {
//       muted: true,
//       mirror: true,
//     },
//     elemId: "localVideoElement",
//   };
//   console.log("session in access", session);
//   try {
//     session.getUserMedia(mediaParams, function (error, stream) {
//       if (error) {
//         console.log("I am accessUserPrivilegesError", { error });
//       } else {
//         //run call function here
//         console.log("I am accessUserPrivilegesStream", stream);
//         session.attachMediaStream("localVideoElement", stream);
//       }
//     });
//   } catch (error) {
//     console.log("I am accessUserPrivilegesError", { error });
//   }
// };

// export const MakeCall = () => {
//   var extension = {};
//   session.call(extension, function (error) {
//     console.log("ErrorinMakeCall", error);
//   });
// };

// export const acceptCall = () => {
//   var extension = {};
//   session.accept(extension);
// };

// export const rejectCall = () => {
//   var extension = {};
//   session.reject(extension);
// };

// export const EndCall = () => {
//   var extension = {};
//   session.stop(extension);
// };
