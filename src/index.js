import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import PrivateMessagesProvider from "./ContextandProvider/PrivateMessagesProvider";
import QuickBloxProvider from "./ContextandProvider/QuickBloxProvider";
import ChatsProvider from "./ContextandProvider/ChatsProvider";
import DialogsProvider from "./ContextandProvider/DialogsProvider";
import UsersProvider from "./ContextandProvider/UsersProvider";
import TwilioProvider from "./ContextandProvider/TwilioProvider";
// import PubNub from "pubnub";
// import { PubNubProvider, usePubNub } from "pubnub-react";
// ;



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PrivateMessagesProvider>
    <DialogsProvider>
      <UsersProvider>
        <TwilioProvider>
          <QuickBloxProvider>
            <ChatsProvider>
              {/* <PubNubProvider client={pubnub}> */}
                <App />
              {/* </PubNubProvider> */}
            </ChatsProvider>
          </QuickBloxProvider>
        </TwilioProvider>
      </UsersProvider>
    </DialogsProvider>
  </PrivateMessagesProvider>
);
