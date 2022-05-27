import React from "react";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";

import PubchatParent from "./PubchatParent";
import "./PubnubParent.scss"
import NewChatUi from "../NewChatUi";
const pubnub = new PubNub({
  publishKey: process.env.REACT_APP_PUBLISHKEY,
  subscribeKey: process.env.REACT_APP_SUBSCRIBEKEY,
  uuid: localStorage.getItem("userId"),
  // uuid: PubNub.generateUUID(),
  autoNetworkDetection: true, // enable for non-browser environment automatic reconnection
  restore: true,
});
const setDataByUUID = async (uuid, email) => {
  const setdata =await pubnub?.objects?.setUUIDMetadata({
    data: {
      id: uuid,
      name: email?.split("@")[0],
      email: email,
      // custom: {
      //     "nickname": "jonny"
      // }
    },
  });
  console.log("SETData", setdata);
};
setDataByUUID(localStorage.getItem("userId"), localStorage.getItem("email"));


/** Detect PubNub access manager */
let pamEnabled = false;
pubnub.addListener({
  status: function (status) {
    if (status.category === "PNAccessDeniedCategory") {
      pamEnabled = true;
      PubnubChat();
    }
  },
});

const PamError = () => {
  return (
    <div className="pubnub-error">
      <h1>Warning! PubNub access manager enabled.</h1>
      <p>
        It looks like you have access manager enabled on your PubNub keyset.
        This sample app is not adapted to work with PAM by default.
      </p>
      <p>
        You can either disable PAM in the{" "}
        <a href="https://dashboard.pubnub.com/">PubNub Admin Portal</a> or add
        custom code to grant all necessary permissions by yourself. Please
        referer to the{" "}
        <a href="https://pubnub.github.io/react-chat-components/docs/?path=/story/introduction-pam--page">
          Chat Component docs
        </a>{" "}
        for more information.
      </p>
    </div>
  );
};

const KeysError = () => {
  return (
    <div className="pubnub-error">
      <h1>A PubNub account is required.</h1>
      <p>
        Visit the PubNub dashboard to create an account or login:
        <br />
        <a href="https://dashboard.pubnub.com/">
          https://dashboard.pubnub.com/
        </a>
        <br />
        Create a new app or locate your app in the dashboard. Enable the
        Presence, Files, Objects, and Storage features using a region of your
        choosing. For Objects, ensure the following are enabled:
      </p>
      <ul>
        <li>User Metadata Events</li>
        <li>Channel Metadata Events</li>
        <li>Membership Events</li>
      </ul>
      <p>Copy and paste your publish key and subscribe key into: </p>
      <pre>.env</pre>
      <p>before continuing.</p>
    </div>
  );
};

const PubnubChat = () => {

  return (
    <PubNubProvider client={pubnub}>
      <PubchatParent />
      {/* <NewChatUi/> */}
    </PubNubProvider>
  );
};

export default PubnubChat;
