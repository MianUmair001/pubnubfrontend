import React from "react";
import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";

const RequestedModal = ({ showRequestModal, setShowRequestModal }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal
      open={showRequestModal}
      onClose={(e) => setShowRequestModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{ color: "white" }}
        >
          Request Send
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{ mt: 2 }}
          style={{ color: "white" }}
        >
          The request to add User to your contact list has been sent
        </Typography>
      </Box>
    </Modal>
  );
};

export default RequestedModal;
