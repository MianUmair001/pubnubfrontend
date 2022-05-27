import { Button } from "@mui/material";
import React, { useContext } from "react";
import { deleteDialog, joinDialog } from "../api/api";
import DialogsContext from "../ContextandProvider/Dialogscontext";
import DeleteIcon from "@mui/icons-material/Delete";

const GroupChats = ({ showGroupChats, setDialogId }) => {
  const { dialogs } = useContext(DialogsContext);
  return (
    <>
      {showGroupChats &&
        dialogs.GroupDialogList?.map((groupchat, index) => (
          <div className="" key={index} style={{ display: "flex" }}>
            <Button
              style={{
                width: "100%",
                fontSize: "2rem",
                color: "#707070",
              }}
              onClick={(e) => {
                e.preventDefault();
                joinDialog(groupchat._id);
                setDialogId(groupchat._id);
              }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                style={{ width: "50px" }}
              />
              Room:{groupchat.name}
            </Button>
            <Button
              onClick={(e) => {
                deleteDialog(groupchat._id);
              }}
            >
              <DeleteIcon style={{ width: "20px" }} />
            </Button>
          </div>
        ))}
    </>
  );
};

export default GroupChats;
