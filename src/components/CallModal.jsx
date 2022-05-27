import React, { useContext } from "react";
import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import QuickBloxContext from "../ContextandProvider/QuickBloxContext";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CallIcon from "@mui/icons-material/Call";

const CallModal = ({ showVideoModal, setShowVideoModal }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#ffffff",
    border: "2px solid #000",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };
  const { rejectCall, acceptCall } = useContext(QuickBloxContext);

  return (
    <>
      <Modal
        style={{ width: "100%" }}
        className="video-modal"
        open={showVideoModal}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            setShowVideoModal(false);
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ color: "Black" }}
          >
            Incomming Call
          </Typography>
          <div className="video-container" style={{ width: "100%" }}>
            <div>
              <video id="modelVideoElement"></video>
            </div>
            <div
              className=""
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  rejectCall();
                  setShowVideoModal(false);
                }}
              >
                <span
                  style={{
                    background: "#80e491",
                    padding: "20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  <CallEndIcon style={{ color: "red" }} />
                </span>
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  acceptCall();
                  setShowVideoModal(false);
                }}
              >
                <span
                  style={{
                    background: "#80e491",
                    padding: "20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  <CallIcon style={{ color: "green" }} />
                </span>
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default CallModal;
