import { Button } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const Privatechats = ({
  showPrivateChat,
  userMessageList,
  setshowPrMessage,
  setMessages,
}) => {
  return (
    <>
      {showPrivateChat &&
        userMessageList["userMessages"].length != 0 &&
        Object.keys(userMessageList).map((key) => {
          return (
            <>
              {console.log({ userMessageList })}
              <div className="d-flex" key={key}>
                <Button
                  style={{
                    width: "100%",
                    fontSize: "2rem",
                    display: "flex",
                    justifyContent: "start",
                    color: "#707070",
                  }}
                  onClick={() => {
                    setshowPrMessage(true);
                    setMessages(userMessageList["userMessages"]);
                  }}
                >
                  <img
                    src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                    style={{ width: "50px" }}
                  />
                  <p style={{ marginLeft: "20px" }}>
                    PrChat {userMessageList["userName"]}
                  </p>
                </Button>
                <Button>
                  <DeleteIcon style={{ width: "20px" }} />
                </Button>
              </div>
            </>
          );
        })}
    </>
  );
};

export default Privatechats;
