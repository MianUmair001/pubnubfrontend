import { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import QuickBloxContext from "./ContextandProvider/QuickBloxContext";
import { Client } from "@twilio/conversations";
import { Identity } from "@mui/base";
import TwilioContext from "./ContextandProvider/TwilioContext";
import { usePubNub } from "pubnub-react";
import PubnubChat from "./components/PubnubChat/PubnubChat";
import NewChatUi from "./components/NewChatUi";



function App() {
  // const pubnub = usePubNub();

  //Contexts

  const { init, createSession, connectChat } = useContext(QuickBloxContext);
  const { twilioState, initConversations } = useContext(TwilioContext);
  //functions

  //useEffect
  // console.log("I am UserFromClient",{User});

  // console.log("I am UserFromClient",Client);

  useEffect(() => {
    init();
    createSession({ login: "amianumair", password: "IamUmair" });
    const initialize = async () => {
      const initdata = await initConversations();
      console.log("I am InitTwilio", initdata);
      console.log("I am TwilioState", twilioState);
    };
    initialize();
    // connectChat({
    //   userId: 134405889,
    //   password: "IamUsama",
    // });
  }, []);

  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login  />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pubnubchat" element={<PubnubChat />} />
            <Route path="newchatui" element={<NewChatUi />} />
            
            
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
