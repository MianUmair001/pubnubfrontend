import React, { useContext, useEffect, useState } from "react";
// import  {AccessToken} from "twilio";
import axios from "axios";
import TwilioContext from "./TwilioContext.jsx";
import {
  Client as ConversationsClient,
  Conversation,
} from "@twilio/conversations";
import UsersContext from "./UserContext.jsx";
import { Client as SyncClient } from "twilio-sync";
import { set } from "quickblox/src/qbConfig";
// var SyncClient = require('twilio-sync');

var globalConversationsClient, globalSyncClient;

const TwilioProvider = ({ children }) => {
  const [syncList, setSyncList] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [conversationsClient, setConversationsClient] = useState(null);
  const [localUser, setLocalUser] = useState();
  const [onlineUsers, setOnlineUsers] = useState();
  const { updateUsers } = useContext(UsersContext);
  const twilioStateInitial = {
    name: "",
    loggedIn: false,
    conversationToken: null,
    syncToken: null,
    conversationConnectionStatus: null,
    syncConnectionStatus: null,
    conversationsReady: false,
    conversations: [],
    selectedConversationSid: null,
    newMessage: "",
  };
  const [twilioState, setTwilioState] = useState(twilioStateInitial);

  useEffect(() => {
    getSubscribedConversations();
  }, []);

  // useEffect(() => {
  //   console.log("TwilioProvider useEffect");
  //   if (localStorage.getItem("username") !== null) {
  //     console.log("in usernameIf");
  //     setTwilioState({
  //       ...twilioState,
  //       loggedIn: true,
  //       name: localStorage.getItem("username"),
  //     });
  //     getToken();
  //   }
  //   if (twilioState.loggedIn === true) {
  //     getToken();
  //     setTwilioState({  ...twilioState,statusString: "Fetching credentials…" });
  //   }
  // }, [twilioState.loggedIn]);
  const getToken = async () => {
    const myToken = localStorage.getItem("twilioConvToken");
    // console.log("myToken", myToken);
    setTwilioState({ ...twilioState, conversationToken: myToken });
    // initConversations();
  };
  function registerEventHandlers() {
    // console.log("Registering event handlers", globalConversationsClient);
    // console.log("TwilioProvider registerEventHandlers");
    var user = globalConversationsClient.user;

    // Register User updated event handler
    user.on("updated", function (event) {
      // console.log("Userupdated:", event);
      handleUserUpdate(event.user, event.updateReasons);
    });
    // console.log("UserEventObj", user);
  }

  // function to handle User updates
  function handleUserUpdate(user, updateReasons) {
    // loop over each reason and check for reachability change
    // console.log("inReachablility", user, updateReasons);
    updateReasons.forEach(function (reason) {
      if (reason === "reachabilityOnline") {
        //do something
        // console.log("Userisonline", user);
      }
    });
  }

  const getSubscribedConversations = async () => {
    try {
      //   console.log("checkClient", globalConversationsClient);
      // const data = await globalConversationsClient.getSubscribedUsers();
      // console.log("sUBSCRIBEDuSER", data);

      const convData =
        await window.globalConversationsClient?.getSubscribedConversations();
      // console.log("sUBSCRIBEDCONV", convData);
      if(convData.items.lenght>0){
        setTwilioState({ ...twilioState, conversations: convData?.items });
      }
    } catch (error) {
      // console.log("error", { error });
    }
  };

  const initConversations = async (token) => {
    try {
      setTwilioState({ ...twilioState, token: token });

      if (token !== null) {
        // var result = await ConversationsClient.create(
        //   token
        // );
        var result = new ConversationsClient(token);
        globalConversationsClient = result;
        setConversationsClient(result);
        window.globalConversationsClient = result;
        // console.log("ConversationsClient", result);
        const { data } = await axios.get("https://chatapppub.herokuapp.com/onlineUsers");
        // console.log("SadyUsers", data);
        // const ourusers=await axios.get
        updateUsers(data);
        // console.log("GlobalConversationsClient", globalConversationsClient);
        getSubscribedConversations();

        setTwilioState({
          ...twilioState,
          conversationConnectionStatus: "Connecting to Twilio…",
        });
        globalConversationsClient.on("connectionStateChanged", (state) => {
          if (state === "connecting") {
            console.log("Connecting to Twilio…");
            setTwilioState({
              ...twilioState,
              conversationConnectionStatus: "Connecting to Twilio…",
              status: "default",
            });
          }

          if (state === "connected") {
            // console.log("Connected to Twilio!");
            setTwilioState({
              ...twilioState,
              conversationConnectionStatus: "You are connected.",
              status: "success",
            });
          }
          if (state === "disconnecting") {
            // console.log("Disconnecting from Twilio…");
            setTwilioState({
              ...twilioState,
              conversationConnectionStatus: "Disconnecting from Twilio…",
              conversationsReady: false,
              status: "default",
            });
          }

          if (state === "disconnected") {
            // console.log("Disconnected from Twilio!");
            setTwilioState({
              ...twilioState,
              conversationConnectionStatus: "You are disconnected.",
              status: "danger",
            });
          }

          if (state === "denied") {
            // console.log("Connection denied.");
            setTwilioState({
              ...twilioState,
              conversationConnectionStatus: "Failed to connect.",
              conversationsReady: false,
              status: "error",
            });
          }
        });
        // globalConversationsClient.on("conversationJoined", (conversation) => {
        //   console.log("Conversationjoined:", conversation);
        //   setTwilioState({
        //     ...twilioState,
        //     conversations: [...twilioState.conversations, conversation],
        //   });
        // });
        // globalConversationsClient.on("conversationLeft", (thisConversation) => {
        //   setTwilioState({
        //     ...twilioState,
        //     conversations: [
        //       ...twilioState.conversations.filter(
        //         (it) => it !== thisConversation
        //       ),
        //     ],
        //   });
        // });
        globalConversationsClient.on("messageAdded", (message) => {});
        registerEventHandlers();
      }
    } catch (error) {
      console.log("InitTwilioError", { error });
    }
  };
  const initTwilioSync = async (token) => {
    try {
      setTwilioState({ ...twilioState, token: token });
      if (token !== null) {
        var syncClient = new SyncClient(token);
        syncClient
          .list("online-users")
          .then(async (synclist) => {
            setSyncList(synclist);
            window.syncList = synclist;
            console.log("synclist", synclist);
            synclist.on("itemAdded", async (event) => {
              // console.log("itemAdded", event);
              if (!event.isLocal) {
                // console.log("InLocalEvent", onlineUsers);

                // setOnlineUsers([...onlineUsers, event.item]);
                var onlineusers = await synclist.getItems();
                setOnlineUsers(onlineusers);
                // console.log("onlineUsers", onlineUsers);
              }
            });
            synclist.on("itemRemoved", async (event) => {
              // console.log("itemRemoved", event);
              // setOnlineUsers(
              //   onlineUsers?.filter((p) => p.index !== event.index)
              // );
              var onlineusers = await synclist.getItems();
              setOnlineUsers(onlineusers);
              // console.log("onlineUsers", onlineUsers);
            });
            var items = await synclist.getItems();
            // console.log("LIstItemsj", items);
            if (
              items.items.some((item) => {
                if (
                  item.descriptor.data.name === localStorage.getItem("email")
                ) {
                  return true;
                }
                return false;
              }) === false
            ) {
              console.log("OCheckingb");
              var localuser = await synclist.push({
                name: localStorage.getItem("email"),
              });
              setLocalUser(localuser);
              localStorage.setItem("localuserIndex", localuser.index);
              // console.log("localUserafterd", localuser);
            }
            var onlineusers = await synclist.getItems();
            setOnlineUsers(onlineusers);
            // console.log("onlineUsers", onlineUsers);
          })
          .catch((error) => {
            console.log("error", error);
          });
        globalSyncClient = syncClient;
        setConversationsClient(syncClient);
        window.globalSyncClient = syncClient;
        // console.log("SyncCleint", syncClient);
        const { data } = await axios.get("https://chatapppub.herokuapp.com/onlineUsers");
        // console.log("SadyUsers", data);
        // const ourusers=await axios.get
        updateUsers(data);
        // console.log("GlobalSyncClient", globalSyncClient);

        setTwilioState({
          ...twilioState,
          syncConnectionStatus: "Connecting to Twilio…",
        });
        globalSyncClient.on("connectionStateChanged", (state) => {
          if (state === "connecting") {
            // console.log("Connecting to Twilio… Sync");
            setTwilioState({
              ...twilioState,
              syncConnectionStatus: "Connecting to Twilio…Sync",
              status: "default",
            });
          }

          if (state === "connected") {
            // console.log("Connected to Twilio!");
            setTwilioState({
              ...twilioState,
              syncConnectionStatus: "You are connected Sync.",
              status: "success",
            });
          }
          if (state === "disconnecting") {
            // console.log("Disconnecting from Twilio…");
            setTwilioState({
              ...twilioState,
              syncConnectionStatus: "Disconnecting from Twilio… Sync",
              conversationsReady: false,
              status: "default",
            });
          }

          if (state === "disconnected") {
            // console.log("Disconnected from Twilio!");
            setTwilioState({
              ...twilioState,
              syncConnectionStatus: "You are disconnected.Sync",
              status: "danger",
            });
          }

          if (state === "denied") {
            // console.log("Connection denied.");
            setTwilioState({
              ...twilioState,
              syncConnectionStatus: "Failed to connect.Sync",
              conversationsReady: false,
              status: "error",
            });
          }
        });
        // globalSyncClient.on("conversationJoined", (conversation) => {
        //   console.log("Conversationjoined:", conversation);
        //   setTwilioState({
        //     ...twilioState,
        //     conversations: [...twilioState.conversations, conversation],
        //   });
        // });
        // globalSyncClient.on("conversationLeft", (thisConversation) => {
        //   setTwilioState({
        //     ...twilioState,
        //     conversations: [
        //       ...twilioState.conversations.filter(
        //         (it) => it !== thisConversation
        //       ),
        //     ],
        //   });
        // });
      }
    } catch (error) {
      // console.log({ error });
    }
  };
  const removeUserFromList = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("localUser", localUser);
        const items = await window.syncList.getItems();
        // console.log("itemsinRemove", items);
        var checkItems = items?.items?.filter(
          (item) => item.descriptor.data.name === localStorage.getItem("email")
        );
        // console.log("checkItems", checkItems[0].index);
        window.syncList
          .remove(checkItems[0].index)
          .then((list) => {
            list.close();
            // console.log("Delete Ho gya ", list);
            resolve(true);
          })
          .catch((err) => {
            // console.log("err", err);
          });
      } catch (error) {
        // console.log({ error });
        reject(error);
      }
    });
  };
  const addParticipent = async (conversationSid, UserEmail) => {
    try {
      // console.log("AddParticipant", conversationSid, UserEmail);
      // console.log(
      //   "AllConversationsInAddParticipant",
      //   twilioState.conversations
      // );
      getSubscribedConversations();
      const requiredConvo = twilioState.conversations.filter(
        (conversation) => conversation.sid === conversationSid
      );
      // console.log("AddParticipent", UserEmail);
      const addParticipentResult = await requiredConvo[0].add(UserEmail);
      // console.log("addParticipentResult", addParticipentResult);
    } catch (error) {
      console.log({ error });
    }
  };
  const removeParticipent = async (conversationSid, UserEmail) => {
    try {
      // console.log("RemoveParticipant", conversationSid, UserEmail);
      getSubscribedConversations();
      const requiredConvo = twilioState.conversations.filter(
        (conversation) => conversation.sid === conversationSid
      );
      const addParticipentResult = await requiredConvo[0].removeParticipant(
        UserEmail
      );
      // console.log("removeParticipant", addParticipentResult);
    } catch (error) {
      console.log({ error });
    }
  };
  const deleteConversation = async (conversationSid) => {
    try {
      getSubscribedConversations();
      const requiredConvo = twilioState.conversations.filter(
        (conversation) => conversation.sid === conversationSid
      );
      const deleteConversationResult = await requiredConvo[0].delete();
      // console.log("deleteConversationResult", deleteConversationResult);
    } catch (error) {
      console.log({ error });
    }
  };
  const getAllMessages = async (conversationSid) => {
    try {
      getSubscribedConversations();
      const requiredConvo = twilioState.conversations.filter(
        (conversation) => conversation.sid === conversationSid
      );
      const getMessagesResult = await requiredConvo[0].getMessages();
      // console.log("getMessagesResultIN", getMessagesResult);
      return getMessagesResult;
    } catch (error) {
      console.log({ error });
    }
  };
  const getAllParticipent = async (conversationSid) => {
    try {
      getSubscribedConversations();
      const requiredConvo = twilioState.conversations.filter(
        (conversation) => conversation.sid === conversationSid
      );
      const getAllParticipentResult = await requiredConvo[0].getParticipants();
      // console.log("getMessagesResultIN", getAllParticipentResult);
      return getAllParticipentResult;
    } catch (error) {
      console.log({ error });
    }
  };
  const logoutChat = () => {
    try {
      removeUserFromList()
        .then((result) => {
          globalConversationsClient.shutdown();
        })
        .catch((error) => {
          console.log({ error });
        });
    } catch (error) {
      console.log({ error });
    }
  };
  // const createConversation = async (name) => {
  //   try {
  //     console.log("createConversation");
  //     const { data } = await axios.post(
  //       "http://localhost:3000/room",
  //       { friendlyName: name },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("CreateConversationdata", data);
  //     getAllConversation();
  //     return data;
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };
  const createConversationClient = async (name) => {
    // console.log("createConversationClient", window.globalConversationsClient);
    const data = await window.globalConversationsClient?.createConversation({
      friendlyName: name,
    });
    // console.log("createconversatoinClientData", data);
    return data;
  };
  const joinConversation = async (conversationSid, userId) => {
    try {
      const requiredConvo = twilioState.conversations.filter(
        (conversation) => conversation.sid === conversationSid
      );
      const joinReturnData = await requiredConvo[0].join();
      // console.log("JoinConversationReturnData", joinReturnData);
      // const data = await axios.post(
      //   `http://localhost:3000/room/${conversationSid}/users/${userId}`,
      //   {},
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // console.log("JoinConversationReturnData", data);
    } catch (error) {
      // console.log({ error });
    }
  };

  const sendMessage = async (dialogId, message) => {
    try {
      const requiredConvo = twilioState.conversations.filter(
        (conversation) => conversation.sid === dialogId
      );
      const messageReturnData = await requiredConvo[0].sendMessage(message);
      // console.log("MessageReturnData", messageReturnData);
    } catch (error) {
      // console.log({ error });
    }

    // const messageReturnData = await axios.post(
    //   `http://localhost:3000/room/${dialogId}/message`,
    //   { body: message, author: localStorage.getItem("username") }
    // );
  };

  return (
    <TwilioContext.Provider
      value={{
        twilioState,
        initConversations,
        // createConversation,
        getSubscribedConversations,
        localUser,
        onlineUsers,
        createConversationClient,
        joinConversation,
        addParticipent,
        removeParticipent,
        initTwilioSync,
        sendMessage,
        getAllMessages,
        deleteConversation,
        getAllParticipent,
        logoutChat,
      }}
    >
      {children}
    </TwilioContext.Provider>
  );  
};

export default TwilioProvider;
