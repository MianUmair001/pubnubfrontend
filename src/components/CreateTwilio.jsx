import React, { useContext, useState } from "react";
import { Dropdown } from "react-bootstrap";
import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TwilioContext from "../ContextandProvider/TwilioContext";
const CreateTwilio = ({ notification }) => {
  const { createConversation, createConversationClient } =
    useContext(TwilioContext);
  const [createConversationState, setCreateConversationState] = useState(false);
  const [roomName, setRoomName] = useState("");
  const handleCreateConversation = async (e) => {
    e.preventDefault();
    console.log("Create Conversation", roomName);
    //  const createConvData=  await  createConversation(roomName)
    const createConvData = await createConversationClient(roomName);
    console.log("Create Conversation Return Data", createConvData);
  };
  return (
    <div
      className=""
      style={{
        width: "400px",
        alignItems: "center",
        margin: "10px",
      }}
    >
      <div
        className="mb-3"
        style={{
          textAlign: "end",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Dropdown>
          <Dropdown.Toggle
            variant="success"
            id="dropdown-basic"
            style={{ padding: "10px", borderRadius: "10px" }}
          >
            New Chat
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setCreateConversationState(!createConversationState);
                }}
              >
                Create Public Chat
              </Button>
            </Dropdown.Item>
            <Dropdown.Item>
              <Button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Create Private Chat
              </Button>
            </Dropdown.Item>
            <Dropdown.Item>
              <Button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Create Group Chat
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle>
            <NotificationsActiveIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {console.log("NotificationsInLeft", notification)}
            {notification?.map((notification, index) => {
              return (
                <Dropdown.Item key={index}>
                  <Button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    notification
                  </Button>
                </Dropdown.Item>
              );
            })}
            {/* <Dropdown.Item>
              <Button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Create Group Video Call
              </Button>
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
        {/* <Dropdown>
          <Dropdown.Toggle
            variant="success"
            id="dropdown-basic"
            style={{ padding: "10px", borderRadius: "10px" }}
          >
            Video Call
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Create Group Video Call
              </Button>
            </Dropdown.Item>
           
          </Dropdown.Menu>
        </Dropdown> */}
      </div>
      {createConversationState && (
        <>
          <TextField
            fullWidth
            label="Room Name"
            variant="outlined"
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
          />
          <Button
            className="mt-2 btn btn-primary"
            style={{
              padding: "10px",
              borderRadius: "10px",
              marginLeft: "10px",
              background: "#80E491",
              color: "#ffffff",
            }}
            onClick={(e) => handleCreateConversation(e)}
          >
            Create Conversation
          </Button>
        </>
      )}
    </div>
  );
};

export default CreateTwilio;
