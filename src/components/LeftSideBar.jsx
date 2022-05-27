import React, { useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import PublicChats from "./PublicChats";
import GroupChats from "./GroupChats";
import PrivateChats from "./Privatechats";
import ChatToolbar from "./ChatToolbar";
import CreateChats from "./CreateChats";
const LeftSideBar = ({
  userMessageList,
  setDialogId,
  groupChatName,
  setGroupchatName,
  setMessages,
  getGroupDialogList,
  setActiveDialogName,
  setshowPrMessage,
  getAllPublicDialogsList,
  createVideoCall,
  setCreateVideoCall,
}) => {
  //Use Context

  //States

  const [showPublicChat, setshowPublicChat] = useState(false);
  const [showPrivateChat, setshowPrivateChat] = useState(false);
  const [showGroupChats, setshowGroupChats] = useState(false);
  return (
    <div className="col-md-4" style={{ height: "100vh" }}>
      <ChatToolbar />

      <CreateChats
        getGroupDialogList={getGroupDialogList}
        getAllPublicDialogsList={getAllPublicDialogsList}
        groupChatName={groupChatName}
        setGroupchatName={setGroupchatName}
        createVideoCall={createVideoCall}
        setCreateVideoCall={setCreateVideoCall}
      />

      <div
        className=""
        style={{
          alignItems: "center",
          margin: "10px",
        }}
      >
        <div className="mb-3">
          <ButtonGroup
            fullWidth
            style={{ borderRadius: "none", boxShadow: "none" }}
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              className="btn btn-primary"
              style={{
                padding: "10px",
                borderRadius: "10px",
                marginLeft: "10px",
                background: "#80E491",
                color: "#ffffff",
              }}
              onClick={(e) => {
                setshowPublicChat(!showPublicChat);
                setshowPrivateChat(false);
                setshowGroupChats(false);
              }}
            >
              Show Public Chat
            </Button>

            <Button
              className="btn btn-primary"
              style={{
                padding: "10px",
                borderRadius: "10px",
                marginLeft: "10px",
                background: "#80E491",
                color: "#ffffff",
              }}
              onClick={(e) => {
                setshowPublicChat(false);
                setshowPrivateChat(!showPrivateChat);
                setshowGroupChats(false);
              }}
            >
              Show Private Chat
            </Button>

            <Button
              className="btn btn-primary"
              style={{
                padding: "10px",
                borderRadius: "10px",
                marginLeft: "10px",
                background: "#80E491",
                color: "#ffffff",
              }}
              onClick={(e) => {
                setshowPublicChat(false);
                setshowPrivateChat(false);
                setshowGroupChats(!showGroupChats);
              }}
            >
              Show Group Chat
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div
        className="mt-5"
        style={{
          overflowY: "scroll",
          //   height:
          //     createPrivateChat || createPublicChat || createGroupChat
          //       ? "700px"
          //       : "800px",
        }}
      >
        <PrivateChats
          showPrivateChat={showPrivateChat}
          userMessageList={userMessageList}
          setshowPrMessage={setshowPrMessage}
          setMessages={setMessages}
        />
        <PublicChats
          showPublicChat={showPublicChat}
          setActiveDialogName={setActiveDialogName}
          setDialogId={setDialogId}
        />
        <GroupChats showGroupChats={showGroupChats} setDialogId={setDialogId} />
      </div>
    </div>
  );
};

export default LeftSideBar;
