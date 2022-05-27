import React, { useContext } from "react";
import { deleteDialog, joinDialog } from "../api/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import DialogsContext from "../ContextandProvider/Dialogscontext";

const PublicChats = ({ showPublicChat, setActiveDialogName, setDialogId }) => {
  const { dialogs } = useContext(DialogsContext);
  return (
    <>
      {showPublicChat &&
        dialogs.publicDialogList?.map((chatElement, index) => (
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
                joinDialog(chatElement._id);
                setActiveDialogName(chatElement.name);
                setDialogId(chatElement._id);
              }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                style={{ width: "50px" }}
              />
              <p style={{ marginLeft: "20px" }}>{chatElement.name}</p>
            </Button>
            <Button
              onClick={(e) => {
                deleteDialog(chatElement._id);
              }}
            >
              <DeleteIcon style={{ width: "20px" }} />
            </Button>
          </div>
        ))}
    </>
  );
};

export default PublicChats;
