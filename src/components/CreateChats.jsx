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

import {
  createGroupDialog,
  createPublicChatDialog,
  sendPrivateMessage,
} from "../api/api";
import UsersContext from "../ContextandProvider/UserContext";
import QuickBloxContext from "../ContextandProvider/QuickBloxContext";
const CreateChats = ({
  createVideoCall,
  setCreateVideoCall,
  getGroupDialogList,
  getAllPublicDialogsList,
}) => {
  //Use Context
  const { createVideoCallSession, MakeCall, accessUserPrivileges } =
    useContext(QuickBloxContext);
  const { users } = useContext(UsersContext);

  //Styles

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  //LocalStorage
  const loggeduserId = localStorage.getItem("userId");
  //States
  const [createGroupChat, setCreateGroupChat] = useState(false);
  const [createPublicChat, setCreatePublicChat] = useState(false);
  const [createPrivateChat, setCreatePrivateChat] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [usersList, setUsersList] = useState([]);

  //HandleChange
  const handleGroupChatSubmit = (e) => {
    e.preventDefault();
    createGroupDialog(groupChatName, usersList);
    getGroupDialogList();
    setCreateGroupChat(false);
  };
  const handleVideoCallSubmit = () => {
    console.log("VideoCall", { usersList });
    createVideoCallSession(usersList);
    accessUserPrivileges();
    // MakeCall();
  };
  const handlePublicSubmit = (e) => {
    e.preventDefault();
    createPublicChatDialog(roomName);
    setCreatePublicChat(false);
    getAllPublicDialogsList();
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setUsersList(value);
  };

  const handlePrivateSubmit = (e) => {
    e.preventDefault();
    sendPrivateMessage(message, userId, parseInt(loggeduserId));
    setCreatePrivateChat(false);
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
                  setCreatePublicChat(!createPublicChat);
                  setCreatePrivateChat(false);
                  setCreateGroupChat(false);
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
                  setCreatePublicChat(false);
                  setCreatePrivateChat(!createPrivateChat);
                  setCreateGroupChat(false);
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
                  setCreatePublicChat(false);
                  setCreatePrivateChat(false);
                  setCreateGroupChat(!createGroupChat);
                }}
              >
                Create Group Chat
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
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
                  setCreateVideoCall(!createVideoCall);
                }}
              >
                Create Group Video Call
              </Button>
            </Dropdown.Item>
            {/* <Dropdown.Item>
              <Button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setCreatePublicChat(false);
                  setCreatePrivateChat(!createPrivateChat);
                  setCreateGroupChat(false);
                }}
              >
                Create Private Chat
              </Button>
            </Dropdown.Item> */}
            {/* <Dropdown.Item>
              <Button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setCreatePublicChat(false);
                  setCreatePrivateChat(false);
                  setCreateGroupChat(!createGroupChat);
                }}
              >
                Create Group Chat
              </Button>
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {createPublicChat && (
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
            onClick={(e) => handlePublicSubmit(e)}
          >
            Public Chat
          </Button>
        </>
      )}
      {createPrivateChat && (
        <>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userId}
              label="User"
              defaultValue=""
              onChange={(e) => setUserId(e.target.value)}
            >
              {users?.map(({ user }) => {
                return (
                  <MenuItem key={user.id} value={`${user.id}`}>
                    {user.login}
                  </MenuItem>
                );
              })}
            </Select>
            <TextField
              fullWidth
              label="Enter message"
              className="mt-2"
              variant="outlined"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </FormControl>
          <Button
            className="mt-2 btn btn-primary"
            style={{
              padding: "10px",
              borderRadius: "10px",
              marginLeft: "10px",
              background: "#80E491",
              color: "#ffffff",
            }}
            onClick={(e) => handlePrivateSubmit(e)}
          >
            Private Chat
          </Button>
        </>
      )}
      {createGroupChat && (
        <>
          <TextField
            fullWidth
            label="Group Name"
            variant="outlined"
            value={groupChatName}
            onChange={(e) => {
              setGroupChatName(e.target.value);
            }}
          />
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={usersList}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                </>
              )}
              MenuProps={MenuProps}
            >
              {users.map(({ user }) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  // style={getStyles(user.login, usersList, theme)}
                >
                  {user.login}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            className="mt-2 btn btn-primary"
            style={{
              padding: "10px",
              borderRadius: "10px",
              marginLeft: "10px",
              background: "#80E491",
              color: "#ffffff",
            }}
            onClick={(e) => handleGroupChatSubmit(e)}
          >
            Group Chat
          </Button>
        </>
      )}
      {createVideoCall && (
        <>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={usersList}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                </>
              )}
              MenuProps={MenuProps}
            >
              {users.map(({ user }) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  // style={getStyles(user.login, usersList, theme)}
                >
                  {user.login}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            className="mt-2 btn btn-primary"
            style={{
              padding: "10px",
              borderRadius: "10px",
              marginLeft: "10px",
              background: "#80E491",
              color: "#ffffff",
            }}
            onClick={(e) => {
              handleVideoCallSubmit(e);
              // setCreateVideoCall(false);
            }}
          >
            Initiate Call
          </Button>
        </>
      )}
    </div>
  );
};

export default CreateChats;
