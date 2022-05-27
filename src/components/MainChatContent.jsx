import React, { useContext, useState } from "react";
import { Box } from "@mui/system";
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import axios from "axios";
import TwilioContext from "../ContextandProvider/TwilioContext";
const MainChatCotent = ({
  showPrMessage,
  messages,
  getMessages,
  setMessages,
  showMessage,
  setShowMessage,

  dialogId,
  loggeduserId,
  activeDialogName,
  setActiveDialogName,
  getPubnubMessages,
}) => {
  const [message, setMessage] = useState("");

  const { sendMessage } = useContext(TwilioContext);
  // console.log("MainChatCotentMessage", messages, "showPR", showPrMessage);
  console.log("Messages:", messages);
  const handleMessageSendSubmit = async (e) => {
    e.preventDefault();
    // console.log("Typed Messsage", message);
    // const messageReturnData=await axios.post(`http://localhost:3000/room/CH8e69b0af612b47e5b8076636107943f3/message`,{body:message,author:localStorage.getItem("username")});
    // console.log("MessageReturnData", messageReturnData);
    // sendMessage(dialogId, message);
    // window.pubnub.sendMessage()
    // sendMessage(message, dialogId);
    // window?.pubnub?.publish(
    //   {
    //     message: message,
    //     channel: activeDialogName,
    //   },
    //   (status, response) => {
    //     // handle status, response
    //     console.log("SendMessageStatus", status, response);
    //     getPubnubMessages(activeDialogName);
    //   }
    // );
    const data = await axios.post(
      `https://chatapppub.herokuapp.com/pubnbuser/${localStorage.getItem(
        "userId"
      )}/pubnubchannel/${activeDialogName}`,
      { text: message }
    );
    console.log("DataofMessageCommingFromBackend", data);
    console.log("activeDialogName", activeDialogName);
    // getPubnubMessages(activeDialogName);
    // setActiveDialogName("");
    // getPubnubMessages("");
    // setShowMessage(false);
    // setMessages([]);
    // getMessages();
  };
  return (
    <div className="col-md-8 textArea">
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#ffffff",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {activeDialogName}
      </div>
      <div style={{ overflowY: "auto", height: "80vh" }}>
        {showMessage && !showPrMessage
          ? messages &&
            messages?.map((message, index) => {
              console.log("Pmessage",message)
              return (
                typeof message?.message === "string" && (
                  <>
                    <div
                      key={index}
                      className={
                        message?.uuid === (localStorage.getItem("userId"))
                          ? "messages senderMessage"
                          : "messages"
                      }
                    >
                      {message?.author}:{" "}
                      {(typeof message?.message === "string" &&
                        message?.message) ||
                        message.body}
                    </div>
                    <br />
                  </>
                )
              )

              // );
            })
          : showMessage &&
            messages &&
            messages?.map((message, index) => {
              console.log("Singlemessage", message);
              return (
                <>
                  <div
                    key={index}
                    className={
                      message.sender_id === parseInt(loggeduserId)
                        ? "messages senderMessage"
                        : "messages"
                    }
                  >
                    {message.body}
                  </div>
                  <br />
                </>
              );
            })}
      </div>

      <Box
        fullWidth
        className="inputText"
        style={{ display: "flex", width: "100%" }}
      >
        <TextField
          fullWidth
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="fullWidth"
        />
        <Button
          className=""
          style={{
            padding: "10px",
            borderRadius: "10px",
            marginLeft: "10px",
            background: "#80E491",
          }}
          onClick={handleMessageSendSubmit}
        >
          <SendIcon style={{ color: "#707070" }} />
        </Button>
      </Box>
    </div>
  );
};

export default MainChatCotent;
