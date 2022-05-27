import React, { useContext, useEffect, useState } from "react";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { Button } from "@mui/material";
import QuickBloxContext from "../ContextandProvider/QuickBloxContext";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import { getUserNameById } from "../api/api";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
const NewVideoContent = () => {
  const {
    callState,
    EndCall,
    globalSession,
    muteAudio,
    unmuteAudio,
    startVideo,
    stopVideo,
  } = useContext(QuickBloxContext);
  const [usersInCall, setUsersInCall] = useState([]);
  const [micOff, setMicOff] = useState(true);
  const [videoOff, setVideoOff] = useState(true);
  useEffect(() => {
    getUserName();
  }, [globalSession]);

  const getUserName = async () => {
    console.log({ globalSession });
    globalSession?.opponentsIDs?.map((id, index) =>
      getUserNameById(id)
        .then((res) => {
          setUsersInCall((prevStat) => [...prevStat, res]);
          console.log({ res });
        })
        .catch((err) => console.log(err))
    );
  };

  return (
    <>
      <div className="col-md-6">
        <p
          style={{
            textAlign: "center",
            color: "#707070",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Video Call
        </p>

        <div className="video-container">
          <div>
            <video
              id="localVideoElement"
              style={{
                position: "absolute",
                right: "305px",
                top: "300px",
                // border: "5px solid #707070",
                // borderRadius: "10px",
                zIndex: "1",
              }}
              width="250"
              height="250"
            ></video>
            <video id="remoteVideoElement"></video>

            {globalSession && (
              <div
                style={{
                  padding: "10px",
                  border: "5px solid #707070",
                  borderRadius: "10px",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  width: "640px",
                }}
              >
                {usersInCall?.map((username,index) => (
                  <div key={index}>
                    <img
                      src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                      style={{ width: "50px" }}
                    />
                    <h3>{username}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className=""
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button onClick={EndCall}>
              <span
                style={{
                  background: "red",
                  padding: "20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <CallEndIcon style={{ color: "white" }} />
              </span>
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setMicOff(!micOff);
                if (micOff) {
                  muteAudio();
                } else {
                  unmuteAudio();
                }
              }}
            >
              <span
                style={{
                  background: micOff ? "red" : "green",
                  padding: "20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                {micOff ? (
                  <MicOffIcon style={{ color: "white" }} />
                ) : (
                  <MicIcon style={{ color: "white" }} />
                )}
              </span>
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setVideoOff(!videoOff);
                if (videoOff) {
                  stopVideo();
                } else {
                  startVideo();
                }
              }}
            >
              <span
                style={{
                  background: videoOff ? "red" : "green",
                  padding: "20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                {videoOff ? (
                  <VideocamOffIcon style={{ color: "white" }} />
                ) : (
                  <VideocamIcon style={{ color: "white" }} />
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewVideoContent;
