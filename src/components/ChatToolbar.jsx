import { Button } from "@mui/material";
import React, { useContext } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { logout } from "../api/api";
import { useNavigate } from "react-router-dom";
import TwilioContext from "../ContextandProvider/TwilioContext";

const ChatToolbar = ({unSubscribeChannel}) => {
  const navigate = useNavigate();
   const {logoutChat}=useContext(TwilioContext);
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.setItem("loginStatus", false);
    localStorage.setItem("firstLogin", false);
    unSubscribeChannel()
    logoutChat();
    logout();
    navigate("/");
  };
  return (
    <div className="d-flex" style={{ justifyContent: "space-between" }}>
      <div
        className=""
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          borderBottom: "2px dashed #707070",
          paddingBottom: "10px",
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
          style={{ width: "100px" }}
        />
        <h2>Hy {localStorage.getItem("username").slice(0,10)}</h2>
        <Button
          style={{
            padding: "10px",
            borderRadius: "10px",
            marginLeft: "10px",
            background: "#80E491",
            width: "20px",
          }}
          onClick={(e) => {
            handleLogout(e);
          }}
        >
          <ExitToAppIcon />
        </Button>
      </div>
    </div>
  );
};

export default ChatToolbar;
