import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import TwilioContext from "../ContextandProvider/TwilioContext";
import ChatToolbar from "./ChatToolbar";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateTwilio from "./CreateTwilio";
import { Conversation } from "@twilio/conversations";
const TwilioLeftSidebar = ({
  setDialogId,
  setActiveDialogName,
  getPubnubMessages,
  unSubscribeChannel,
  showMessage,
  timeoutUsers,
  activeDialogName,
  setShowMessage,
  usersCheck,
  allChannels,
  notification,
}) => {
  const {
    twilioState,
    joinConversation,
    getSubscribedConversations,
    deleteConversation,
    addParticipent,
    initConversations,
  } = useContext(TwilioContext);
  const userId = localStorage.getItem("userId");
  // console.log("twilioStateINLeft", twilioState);
  const [channelMembers, setChannelMembers] = useState([]);
  console.log("UserCheck", usersCheck);
  const getChannelMembers = async (channelName) => {
    window?.pubnub?.hereNow(
      {
        channels: [channelName],
        includeState: true,
      },
      function (status, response) {
        console.log(
          "ChannelMambers",
          response?.channels?.mainplayerlobby?.occupants
        );
        // setUsersCheck(response?.channels?.mainplayerlobby?.occupants);
        setChannelMembers(response?.channels?.mainplayerlobby?.occupants);
        if (status?.error === true) {
          // reject(status);
        }

        // resolve(response?.channels?.mainplayerlobby?.occupants);
      }
    );
  };

  return (
    <div className="col-md-4" style={{ height: "100vh" }}>
      <ChatToolbar unSubscribeChannel={unSubscribeChannel} />
      {/* <CreateTwilio
        setActiveDialogName={setActiveDialogName}
        notification={notification}
      /> */}

      {/* {twilioState?.conversations?.map((conversation, index) => {
        return (
          <div className="" key={index} style={{ display: "flex" }}>
            <Button
              style={{
                width: "100%",
                fontSize: "2rem",
                display: "flex",
                justifyContent: "start",
                color: "#707070",
              }}
              onClick={(e) => {
                e.preventDefault()
                //  joinDialog(chatElement._id);
                // setActiveDialogName(chatElement?.name );
                setActiveDialogName(conversation.name);
                setDialogId(conversation.sid);
                // joinConversation(conversation.sid,userId);
                addParticipent(conversation.sid, localStorage.getItem("email"));
                // handleIt(conversation)
              }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                style={{ width: "50px" }}
              />
              <p style={{ marginLeft: "20px" }}>{conversation?.friendlyName}</p>
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault()
                // deleteDialog(chatElement._id);
                deleteConversation(conversation.sid);
                getSubscribedConversations()
              }}
            >
              <DeleteIcon style={{ width: "20px" }} />
            </Button>
          </div>
        );
      })} */}
      {allChannels?.map((chatElement, index) => {
        return (
          chatElement !== "mainplayerlobby" && (
            <div className="" key={index} style={{ display: "flex" }}>
              <Button
                style={{
                  width: "100%",
                  fontSize: "2rem",
                  display: "flex",
                  justifyContent: "start",
                  color: "#707070",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  //  joinDialog(chatElement._id);
                  // setActiveDialogName(chatElement?.name );
                  setActiveDialogName(chatElement);
                  setShowMessage(true);
                  // getPubnubMessages(chatElement);

                  // setDialogId(chatElement?.sid);
                  // joinConversation(conversation.sid,userId);
                  // addParticipent(chatElement.sid, localStorage.getItem("email"));
                  // handleIt(conversation)
                }}
              >
                <img
                  src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                  style={{ width: "50px" }}
                />
                <p style={{ marginLeft: "20px" }}>
                  {chatElement}{" "}
                  <span>
                    <b>
                      {usersCheck?.filter(
                        (value) => value?.state?.name === chatElement
                      )?.length > 0
                        ? " Online"
                        : timeoutUsers?.filter(
                            (value) => value?.state?.name === chatElement
                          )?.length > 0
                        ? " Timeout"
                        : "Offline"}
                    </b>
                  </span>
                </p>
              </Button>
              {/* <Button
              onClick={(e) => {
                e.preventDefault();
                
                // deleteDialog(chatElement._id);
                // deleteConversation(chatElement.sid);
                // getSubscribedConversations()
              }}
            >
              <DeleteIcon style={{ width: "20px" }} />
            </Button> */}
            </div>
          )
        );
      })}
    </div>
  );
};

export default TwilioLeftSidebar;
