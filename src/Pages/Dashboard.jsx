import React, { useContext, useEffect, useState } from "react";
import "../Sass/Dashboard.scss";
import {
  getContactList,
  getGroupDialog,
  getPrivatemessages,
  retrivePublicDialogList,
  retriveUsers,
} from "../api/api";

import PrivateMessagesContext from "../ContextandProvider/PrivateMessagesContext";
import LeftSideBar from "../components/LeftSideBar";
import RightSidebar from "../components/RightSidebar";
import MainChatCotent from "../components/MainChatContent";
import UsersContext from "../ContextandProvider/UserContext";
import DialogsContext from "../ContextandProvider/Dialogscontext";
import QuickBloxContext from "../ContextandProvider/QuickBloxContext";
import NewVideoContent from "../components/NewVideoContent";
import RequestedModal from "../components/RequestedModal";
import CallModal from "../components/CallModal";
import axios from "axios";
import TwilioLeftSidebar from "../components/TwilioLeftSidebar";
import TwilioContext from "../ContextandProvider/TwilioContext";
import PubNub from "pubnub";

import { PubNubProvider, usePubNub } from "pubnub-react";
const Dashboard = () => {
  // const [pubnub, setPubnub] = useState();
  const [timeoutUsers, setTimeoutUsers] = useState([]);
  const { callState, connectChat } = useContext(QuickBloxContext);
  const [messages, setMessages] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [dialogId, setDialogId] = useState("");
  const [activeDialogName, setActiveDialogName] = useState("");
  const [twilioChat, setTwilioChat] = useState(true);
  const [notification, setNotification] = useState([]);
  const [showMessage, setShowMessage] = useState();

  const [userMessageList, setUserMessageList] = useState({
    userName: "",
    userMessages: [],
  });

  const [showPrMessage, setshowPrMessage] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  //Context
  const { getAllMessages } = useContext(TwilioContext);
  const { privateMessages } = useContext(PrivateMessagesContext);
  const { users, updateUsers } = useContext(UsersContext);
  const [pubnubUsers, setPubnubUsers] = useState([]);
  const [usersCheck, setUsersCheck] = useState([]);
  const { dialogs, updatePublicDialogList, updateGroupDialogList } =
    useContext(DialogsContext);
  const [createVideoCall, setCreateVideoCall] = useState(false);
  //Functions
  const getUsers = async () => {
    // const checking = await retriveUsers();
    const { data } = await axios.get("https://chatapppub.herokuapp.com/onlineUsers");
    console.log("SadyUsers", data);
    // const ourusers=await axios.get

    updateUsers(data);
    // updateUsers(checking.items);
  };
  let pubnub = null;
  const initializePubNub = () => {
    // return new Promise((resolve, reject) => {
    try {
      if (localStorage.getItem("loginStatus") === "true") {
        pubnub = new PubNub({
          publishKey: "pub-c-00e32a94-3d4e-4e5c-a3f2-29ba962fa997",
          subscribeKey: "sub-c-5c58d27a-2fa6-4dc4-a29a-5b4d9febd207",
          uuid: localStorage.getItem("userId"),
          // uuid: PubNub.generateUUID(),
          // heartbeatInterval: 60,
          // autoNetworkDetection: true, // enable for non-browser environment automatic reconnection
          // restore: true,
        });
        pubnub?.addListener({
          // Messages
          message: function (m) {
            const channelName = m.channel; // Channel on which the message was published
            const channelGroup = m.subscription; // Channel group or wildcard subscription match (if exists)
            const pubTT = m.timetoken; // Publish timetoken
            const msg = m.message; // Message payload
            const publisher = m.publisher; // Message publisher
            console.log(
              "messageINFront",
              channelName,
              channelGroup,
              pubTT,
              msg,
              publisher
            );
            setNotification([...notification, { msg, channelName }]);
            setMessages((prevState) => {
              if (prevState) {
                return [
                  ...prevState,
                  {
                    channel: channelName,
                    message: msg,
                    timeToken: pubTT,
                    uuid: publisher,
                  },
                ];
              }
            });
            getPubnubMessages(activeDialogName);
          },
          // Presence
          presence: function (p) {
            const action = p.action; // Can be join, leave, state-change, or timeout
            const channelName = p.channel; // Channel to which the message belongs
            const occupancy = p.occupancy; // Number of users subscribed to the channel
            const state = p.state; // User state
            const channelGroup = p.subscription; //  Channel group or wildcard subscription match, if any
            const publishTime = p.timestamp; // Publish timetoken
            const timetoken = p.timetoken; // Current timetoken
            const uuid = p.uuid; // UUIDs of users who are subscribed to the channel
            console.log("presence", p);
            console.log(
              "InPresenceEvent",
              { action },
              { channelName },
              { occupancy },
              { state },
              { channelGroup },
              { publishTime },
              { timetoken },
              { uuid }
            );
            if (action === "join") {
              console.log("join", uuid);
              getOnlineUsers(pubnub);
            }
            if (action === "leave") {
              console.log("leave", uuid);
              // const updatedHero = usersCheck.filter(item => item.id !== 1);

              // const checkdata=usersCheck.filter((user)=>user.uuid!==uuid);
              // console.log({checkdata});
              // setUsersCheck(checkdata);
              getOnlineUsers(pubnub);
            }
            if (action === "timeout") {
              console.log("timeout", uuid);
              setTimeoutUsers([...timeoutUsers, { state, uuid }]);
              getOnlineUsers(pubnub);
            }
            // const usersdata = await getOnlineUsers(pubnub);
            // console.log("userDataInPresence", usersdata);
            // setPubnubUsers(usersdata);
          },
          // Signals
          signal: function (s) {
            const channelName = s.channel; // Channel to which the signal belongs
            const channelGroup = s.subscription; // Channel group or wildcard subscription match, if any
            const pubTT = s.timetoken; // Publish timetoken
            const msg = s.message; // Payload
            const publisher = s.publisher; // Message publisher
            console.log("Signal", s);
          },
          objects: (objectEvent) => {
            const channel = objectEvent.channel; // Channel to which the event belongs
            const channelGroup = objectEvent.subscription; // Channel group
            const timetoken = objectEvent.timetoken; // Event timetoken
            const publisher = objectEvent.publisher; // UUID that made the call
            const event = objectEvent.event; // Name of the event that occurred
            const type = objectEvent.type; // Type of the event that occurred
            const data = objectEvent.data; // Data from the event that occurred
            console.log("objects", objectEvent);
          },
          messageAction: function (ma) {
            const channelName = ma.channel; // Channel to which the message belongs
            const publisher = ma.publisher; // Message publisher
            const event = ma.event; // Message action added or removed
            const type = ma.data.type; // Message action type
            const value = ma.data.value; // Message action value
            const messageTimetoken = ma.data.messageTimetoken; // Timetoken of the original message
            const actionTimetoken = ma.data.actionTimetoken; // Timetoken of the message action
            console.log("messageAction", ma);
          },
          file: function (event) {
            const channelName = event.channel; // Channel to which the file belongs
            const channelGroup = event.subscription; // Channel group or wildcard subscription match (if exists)
            const publisher = event.publisher; // File publisher
            const timetoken = event.timetoken; // Event timetoken

            const message = event.message; // Optional message attached to the file
            const fileId = event.file.id; // File unique id
            const fileName = event.file.name; // File name
            const fileUrl = event.file.url; // File direct URL
            console.log("file", event);
          },
          status: function (s) {
            const affectedChannelGroups = s.affectedChannelGroups; // Array of channel groups affected in the operation
            const affectedChannels = s.affectedChannels; // Array of channels affected in the operation
            const category = s.category; // Returns PNConnectedCategory
            const operation = s.operation; // Returns PNSubscribeOperation
            const lastTimetoken = s.lastTimetoken; // Last timetoken used in the subscribe request (type long)
            const currentTimetoken = s.currentTimetoken;
            /* Current timetoken fetched in subscribe response,
             * to be used in the next request (type long) */
            const subscribedChannels = s.subscribedChannels; // Array of all currently subscribed channels
            console.log("status", s);
          },
        });
        pubnub?.subscribe({
          channelGroups: ["all_users"],
          withPresence: true,
        });
        pubnub?.subscribe({
          channels: ["mainplayerlobby"],
          withPresence: true,
        });

        // pubnub?.subscribe({
        //   channels: ["mainplayerlobby",localStorage.getItem("username")],
        //   withPresence: true,
        // });
        window.pubnub = pubnub;
      }

      // resolve(pubnub);
    } catch (error) {
      console.log(error);
      // reject(error);
    }
    // });
  };

  const getOnlineUsers = async (pubnub) => {
    // return new Promise((resolve, reject) => {
    if (pubnub != null) {
      console.log("getOnlineUsers", pubnub);
      pubnub?.hereNow(
        {
          channels: ["mainplayerlobby"],
          includeState: true,
        },
        function (status, response) {
          console.log(
            "StatusAndOnlineResponse",
            response?.channels?.mainplayerlobby?.occupants
          );
          setUsersCheck(response?.channels?.mainplayerlobby?.occupants);
          if (status?.error === true) {
            // reject(status);
          }

          // resolve(response?.channels?.mainplayerlobby?.occupants);
        }
      );
    } else {
      window?.pubnub?.hereNow(
        {
          channels: ["mainplayerlobby"],
          includeState: true,
        },
        function (status, response) {
          console.log(
            "StatusAndOnlineResponse",
            status,
            response?.channels?.mainplayerlobby?.occupants
          );
          setUsersCheck(response?.channels?.mainplayerlobby?.occupants);
          if (status?.error === true) {
            // reject(status);
          }
          // resolve(response?.channels?.mainplayerlobby?.occupants);
        }
      );
    }
    // });
  };
  const unSubscribeChannel = async () => {
    try {
      const unsubscribeData = await window?.pubnub?.unsubscribe({
        channels: ["mainplayerlobby"],
      });
      window?.pubnub?.unsubscribeAll();
      // window?.pubnub?.removeListener()
      window?.pubnub?.stop();
      pubnub?.stop();
      window.pubnub = null;
      console.log("unsubscribeEvent", unsubscribeData);

      // pubnub.removeListener(listener);
    } catch (err) {
      console.log("FailedtoUnSub", err);
    }
  };
  const setUserState = async (name) => {
    window?.pubnub?.setState(
      {
        state: {
          name: name,
        },
        channels: ["mainplayerlobby"],
      },
      (status, response) => {
        // handle state setting response
        console.log("setUserState", status, response);
      }
    );
  };
  const getUserData = async (uuid) => {
    return new Promise((resolve, reject) => {
      try {
        window?.pubnub?.getState(
          {
            uuid: uuid,
            channels: ["mainplayerlobby"],
          },
          function (status, response) {
            if (status.error === true) {
              reject(status);
            }
            // handle status, response
            console.log(
              "getUserStateInChannel",
              status,
              response?.channels?.mainplayerlobby?.name
            );
            resolve(response?.channels?.mainplayerlobby?.name);
          }
        );
      } catch (error) {
        console.log({ error });
      }
    });
  };

  const getDataByUUID = async (users) => {
    // return new Promise((resolve, reject) => {
    try {
      users?.map(async (user) => {
        console.log("userINUUIDGET", user);
        // window?.pubnub?.objects
        //   ?.getUUIDMetadata(user?.uuid)
        //   .then((data) => {
        //     console.log("getDataINGetDataINUUID", user.uuid ,data?.data, users.length);
        //     setUsersCheck([...usersCheck, data?.data]);
        //   })
        //   .catch((err) => console.log("NOData",{ err }));
        const data = await getUserData(user?.uuid);
        console.log("IamData", data);
        setUsersCheck([...usersCheck, data]);
      });
      // setUsersCheck([...result]);

      // console.log(
      //   "UsersLen",
      //   users.length === usersCheck.length,
      //   users.length,
      //   usersCheck.length
      // );
      // if (users?.length === usersCheck?.length) {
      //   resolve(usersCheck);
      // }
      // resolve(usersCheck);
    } catch (error) {
      console.log("getDataError", { error });
      // reject(error);
    }
    // });
  };
  const setDataByUUID = async (uuid, email) => {
    const setdata = await window?.pubnub?.objects?.setUUIDMetadata({
      data: {
        uuid: uuid,
        name: email?.split("@")[0],
        email: email,
        // custom: {
        //     "nickname": "jonny"
        // }
      },
    });
    console.log("SETData", setdata);
  };

  useEffect(() => {
    initializePubNub();
    setDataByUUID(localStorage?.getItem("uuid"), localStorage.getItem("email"));
    setUserState(localStorage?.getItem("email")?.split("@")[0]);
    if (localStorage.getItem("firstLogin") === "true") {
      console.log("FirstLogin", localStorage.getItem("firstLogin"));
      addUserToAllUsersChannelGroup(localStorage.getItem("username"));
    }
    getOnlineUsers();
    getChannelsInGroup("all_users");

    // console.log("usersdataininit", usersdata);
    // setPubnubUsers(usersdata);

    // const intervalId = setInterval(() => {
    //   getUsers()
    //   console.log("In Interval")
    // }, 60000);

    // return () => clearInterval(intervalId);
  }, []);

  const getAllPublicDialogsList = async () => {
    const check = await retrivePublicDialogList();
    updatePublicDialogList(check.items);
  };

  const getGroupDialogList = async () => {
    const data = await getGroupDialog();
    updateGroupDialogList(data.items);
  };

  const updateUserMessageList = () => {
    users.map((user, index) => {
      const userMessages = privateMessages.filter(
        (message) => parseInt(message.extension.senderId) === user.user.id
      );
      if (userMessages.length > 0) {
        setUserMessageList((prevState) => {
          return { userName: user.user.login, userMessages: userMessages };
        });
      }
    });
  };

  // const getMessages = async (conversationSid) => {
  //   if (dialogId) {
  //     // const prevmessages = await getAllMessages(dialogId);
  //     // console.log("Prevmessages:", prevmessages);
  //     console.log("DialogID", dialogId);
  //     const MessageData = await getAllMessages(dialogId);
  //     console.log("Messages", MessageData?.items);
  //     setMessages(MessageData?.items);

  //     // const {data}=await axios.get(`http://localhost:3000/room/${dialogId}/messages`,{
  //     //   headers:{
  //     //     'Content-Type':'application/json',
  //     //   }
  //     // });
  //     // console.log("Messages:", {messages},{data});
  //     // setMessages(data)
  //     // setMessages(prevmessages.items);
  //   }
  // };
  const getPubnubMessages = (paramActiveDialogName) => {
    if (paramActiveDialogName) {
      console.log("activeDialogName", paramActiveDialogName);
      window?.pubnub?.fetchMessages(
        {
          channels: [paramActiveDialogName],
          count: 100,
        },
        function (status, response) {
          const { channels } = response;
          console.log(
            "ALLPubnubMessages",
            status,
            channels,
            channels[paramActiveDialogName]
          );
          setMessages(channels[paramActiveDialogName]);
        }
      );
    } else {
      console.log("activeDialogNameElse", activeDialogName);
      // window?.pubnub?.fetchMessages(
      //   {
      //     channels: [activeDialogName],
      //     count: 100
      //   },
      //   function(status, response) {
      //     const {channels} = response;
      //     console.log("ALLPubnubMessages",status, channels,channels[activeDialogName]);
      //     setMessages(channels[activeDialogName]);
      //   }
      // );
    }
  };
  //LocalStorage
  const loggeduserId = localStorage.getItem("userId");
  const loggeduserPassword = localStorage.getItem("password");

  useEffect(() => {
    connectChat({
      userId: parseInt(loggeduserId),
      password: loggeduserPassword,
    });

    // getUsers();
    getContactList();
    // getAllPublicDialogsList();
    // getGroupDialogList();
    // getPrivatemessages();
  }, []);

  useEffect(() => {
    // getMessages();
    getPubnubMessages(activeDialogName);
    updateUserMessageList();
    getAllChannels(localStorage.getItem("userId"));
    callState.incomingCall === true && setShowVideoModal(true);
    // getUsers();
  }, [
    dialogId,
    dialogs,
    activeDialogName,
    usersCheck,
    privateMessages,
    callState,
  ]);

  const getAllChannels = async (uuid) => {
    if (uuid) {
      try {
        console.log("getAllChannels", uuid);
        const { channels } = await window?.pubnub?.whereNow({
          uuid: uuid,
        });
        console.log("GetAllChannels", channels);
        if (channels.length > 0) {
          setAllChannels(channels);
        }
      } catch (status) {
        console.log(status);
      }
    }
  };
  const getChannelsInGroup = async (channelGroup) => {
    try {
      const result = await window?.pubnub?.channelGroups?.listChannels({
        channelGroup: channelGroup,
      });
      console.log("Listingpushchannelsforthedevice", result?.channels);
      result?.channels?.forEach(function (channel) {
        console.log("Channel_", channel);
      });
    } catch (status) {
      console.log("Operation failed w/ error:", status);
    }
  };
  const addUserToAllUsersChannelGroup = async (channelName) => {
    try {
      console.log("addUserToAllUsersChannelGroup", channelName);
      window?.pubnub?.channelGroups?.addChannels(
        {
          channels: [channelName],
          channelGroup: "all_users",
        },
        function (status) {
          console.log("addUserToAllUsersChannelGroup", status);
        }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <div
        className="row dashboardParent"
        style={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        {twilioChat ? (
          <TwilioLeftSidebar
            usersCheck={usersCheck}
            getPubnubMessages={getPubnubMessages}
            unSubscribeChannel={unSubscribeChannel}
            timeoutUsers={timeoutUsers}
            setDialogId={setDialogId}
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            notification={notification}
            setActiveDialogName={setActiveDialogName}
            allChannels={allChannels}
          />
        ) : (
          <LeftSideBar
            setDialogId={setDialogId}
            userMessageList={userMessageList}
            setUserMessageList={setUserMessageList}
            getAllPublicDialogsList={getAllPublicDialogsList}
            getGroupDialogList={getGroupDialogList}
            setMessages={setMessages}
            setActiveDialogName={setActiveDialogName}
            setshowPrMessage={setshowPrMessage}
            createVideoCall={createVideoCall}
            setCreateVideoCall={setCreateVideoCall}
          />
        )}

        {createVideoCall === true ||
        callState.incomingCall === true ||
        callState.acceptCall ? (
          <NewVideoContent />
        ) : (
          <MainChatCotent
            // getMessages={getMessages}
            getPubnubMessages={getPubnubMessages}
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            showPrMessage={showPrMessage}
            setMessages={setMessages}
            messages={messages}
            dialogId={dialogId}
            loggeduserId={loggeduserId}
            activeDialogName={activeDialogName}
            setActiveDialogName={setActiveDialogName}
          />
        )}

        {/* <RightSidebar
          pubnubUsers={pubnubUsers}
          usersCheck={usersCheck}
          dialogId={dialogId}
          setDialogId={setDialogId}
          getMessages={getMessages}
          getAllChannels={getAllChannels}
          setShowRequestModal={setShowRequestModal}
          getDataByUUID={getDataByUUID}
          setDataByUUID={setDataByUUID}
        /> */}
      </div>
      <RequestedModal
        showRequestModal={showRequestModal}
        setShowRequestModal={setShowRequestModal}
      />
      <CallModal
        showVideoModal={showVideoModal}
        setShowVideoModal={setShowVideoModal}
      />
    </>
  );
};

export default Dashboard;
