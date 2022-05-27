import React, { useContext, useEffect, useState } from "react";
import { adduserToContactList } from "../api/api";
import UsersContext from "../ContextandProvider/UserContext";
import axios from "axios";
import TwilioContext from "../ContextandProvider/TwilioContext";
import { Button } from "@mui/material";
const RightSidebar = ({
  pubnubUsers,
  usersCheck,
  getMessages,
  getAllChannels,
  dialogId,
  setShowRequestModal,
  setDialogId,
  setDataByUUID,
  getDataByUUID,
}) => {
  const { users } = useContext(UsersContext);
  const { onlineUsers, localUser } = useContext(TwilioContext);
  const [ourUsers, setOurUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [pubnubName, setPubnubName] = useState("");
  const [pubnubUsersData, setPubnubUsersData] = useState([]);
  const getOurUsers = async () => {
    const { data } = await axios.get("https://chatapppub.herokuapp.com/ourusers");
    setOurUsers(data);
  };
  const {
    createConversation,
    createConversationClient,
    joinConversation,
    addParticipent,
    getSubscribedConversations,
    removeParticipent,
    sendMessage,
    getAllParticipent,
  } = useContext(TwilioContext);

  useEffect(() => {
    const getAllParticipants = async (dialogId) => {
      console.log("dialogID in ", dialogId);
      const data = await getAllParticipent(dialogId);
      // console.log("Participent", data);
      setParticipants(data);
      // console.log("Participants", participants);
    };
    getAllParticipants(dialogId);
  }, [dialogId]);

  const makePrConversation = async (user) => {
    console.log("user", user);
    createConversationClient(user.username).then((data) => {
      // console.log("createconvo", data);
      // console.log("res", data.sid);
      getSubscribedConversations();
      addParticipent(data.sid, user.email);
      joinConversation(data.sid, user.email);
      // joinConversation(data.sid,localStorage.getItem('userId'))
      setDialogId(data.sid);
      sendMessage(data.sid, "Hello");
      getMessages(data.sid);
    });
    // console.log("makePrConversationdata",data)
  };
  useEffect(() => {
    getOurUsers();
    // console.log("localusersINRightSideBar", { localUser });
    // console.log("onlineusersInRightSidebar", { onlineUsers });
  }, [onlineUsers, localUser]);
  // const getNameOutofData = async (pubnubUsers) => {
  //   try {
  //     if (pubnubUsers) {
  //       pubnubUsers?.map((user) => {
  //         getDataByUUID(user?.uuid).then((data) => {
  //           // console.log("data", data);
  //           setPubnubName(data?.name);
  //           setPubnubUsersData([...pubnubUsersData, data]);
  //         });
  //       });
  //       // console.log("uuidIS",uuid)
  //       // const data = await getDataByUUID(uuid);
  //       // console.log("UserfromPubnub", { data },data?.name);
  //       // setPubnubName(data?.name);
  //       // return data?.name;
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };
  const handelPubnubCreate = async (channelName) => {
    console.log("channelName", channelName);
    // window?.pubnub?.subscribe({
    //   channels: [channelName],
    //   withPresence: true,
    // });
    const addMemberData = await window?.pubnub?.objects.setChannelMembers({
      channel: channelName,
      uuids: [localStorage.getItem("userId")],
    });
    window?.pubnub?.subscribe({
      channels: [channelName],
      withPresence: true,
    });
    console.log("addMemberData", addMemberData);
    getAllChannels(localStorage.getItem("userId"));
  };

  console.log("usersCheck", usersCheck);
  return (
    <>
      <div className="col-md-2" style={{ padding: "10px", marginTop: "100px" }}>
        <h1>Online Users</h1>
        {/* {onlineUsers?.items?.map((user, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            <img
              src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
              style={{ width: "50px" }}
            />
            <p
              style={{
                fontWeight: "bold",
                marginLeft: "10px",
                fontSize: "15px",
                cursor: "pointer",
                color: "#707070",
              }}
              onClick={(e) => {
                e.preventDefault();
                makePrConversation(user);
                // adduserToContactList(user.user.id);
                // setShowRequestModal(true);
              }}
            >
              {user?.user?.login ||
                user?.username ||
                user?.identity?.split("@")[0] ||
                user?.data?.name}
              {/* <span>:{user?.isOnline ? "Online" : "Offline"}</span>
            </p>
          </div>
        ))} */}
        {/* {users.map((user) => (
        <div
          key={user?.id || user?._id}
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "5px",
          }}
        >
          <img
            src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
            style={{ width: "50px" }}
          />
          <p
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              fontSize: "15px",
              cursor: "pointer",
              color: "#707070",
            }}
            onClick={(e) => {
              e.preventDefault();
              // adduserToContactList(user.user.id);
              // setShowRequestModal(true);
            }}
          >
            {user?.user?.login ||
              user?.username ||
              user?.identity.split("@")[0]}
            <span>:{user.isOnline ? "Online" : "Offline"}</span>
          </p>
        </div>
      ))} */}
        {/* <h1>Our All Users</h1>

        {ourUsers?.map((user) => {
          // console.log("I am ALL users ", user);
          return (
            <div
              key={user?.id || user?._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                style={{ width: "50px" }}
              />
              <p
                style={{
                  fontWeight: "bold",
                  marginLeft: "10px",
                  fontSize: "15px",
                  cursor: "pointer",
                  color: "#707070",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  makePrConversation(user);
                  // adduserToContactList(user.user.id);
                  // setShowRequestModal(true);
                }}
              >
                {user?.user?.login ||
                  user?.username ||
                  user?.identity.split("@")[0]}
              </p>

              <Button
                style={{ color: "white", backgroundColor: "#80E491" }}
                onClick={(e) => {
                  addParticipent(dialogId, user?.email);
                  getAllParticipent(dialogId);
                }}
              >
                AddToOpenChat
              </Button>
            </div>
          );
        })} */}
        {/* <h1>All Chat Participants</h1>
        {participants?.map((participant, index) => {
          return (
            <div
              key={participant?.sid}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                style={{ width: "50px" }}
              />
              <p
                style={{
                  fontWeight: "bold",
                  marginLeft: "10px",
                  fontSize: "15px",
                  cursor: "pointer",
                  color: "#707070",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  // adduserToContactList(user.user.id);
                  // setShowRequestModal(true);
                }}
              >
                {participant?.identity?.split("@")[0]}
              </p>
              <Button
                style={{ color: "white", backgroundColor: "#80E491" }}
                onClick={(e) => {
                  removeParticipent(dialogId, participant?.identity);
                  getAllParticipent(dialogId);
                }}
              >
                Remove
              </Button>
            </div>
          );
        })} */}
        <h1>All Pubnub Users</h1>
        {usersCheck?.map((user, index) => {
          return (
            (user?.state?.name&&user.state.name!=localStorage.getItem('username'))  && (
              <div
                key={user?.uuid}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                <img
                  src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                  style={{ width: "50px" }}
                />
                <p
                  style={{
                    fontWeight: "bold",
                    marginLeft: "10px",
                    fontSize: "15px",
                    cursor: "pointer",
                    color: "#707070",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    // adduserToContactList(user.user.id);
                    // setShowRequestModal(true);
                    handelPubnubCreate(user?.state?.name);
                  }}
                >
                  {user?.state?.name}
                </p>
                {/* <Button
                  style={{ color: "white", backgroundColor: "#80E491" }}
                  onClick={(e) => {
                    // removeParticipent(dialogId, participant?.identity);
                    // getAllParticipent(dialogId);
                  }}
                >
                  Remove
                </Button> */}
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

export default RightSidebar;
