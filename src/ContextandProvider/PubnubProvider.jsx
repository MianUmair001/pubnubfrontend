import { usePubNub } from "pubnub-react";
import React, { useState } from "react";
import PubnubContext from "./PubnubContext";
const PubnubProvider = ({ children }) => {
    const pubnub = usePubNub();

    const initialPubnubState = {
        pubnub: null,
        userId: null,
        channels:[],
        users: [],
        messages: [],
    }
  const [pubnubState, setPubnubState] = useState(initialPubnubState);

  const getDataByUUID = async (uuid) => {
    const getData=await pubnub.objects.getUUIDMetadata({
        uuid: uuid,
      });
  }
  const setDataByUUID = async (uuid,email) => {
    const setdata = await pubnub.objects.setUUIDMetadata({
        data: {
          uuid: uuid,
          name: email?.split("@")[0],
          email: email,
          // custom: {
          //     "nickname": "jonny"
          // }
        },
      });
      console.log("SETData",setdata)
  }
  const getChannelOnlineusers=(channel)=>{
    pubnub.hereNow(
        {
          channels: [channel],
          includeState: true
        },
        function (status, response) {
          console.log("INgetChannelOnlineusers",status, response);
        }
      );
  }
  pubnub.hereNow(
    {
      channels: ["chats.room1", "chats.room2"],
      includeState: true
    },
    function (status, response) {
      console.log(status, response);
    }
  );
//   const updateUsers = (users) => {
//     setUsers((prevState) => {
//       return [...users];
//     });
//   };

  return (
    <PubnubContext.Provider
      value={{
        
      }}
    >
      {children}
    </PubnubContext.Provider>
  );
};

export default PubnubProvider;
