import { useContext, useState } from "react";
import { RecievedRequest } from "../api/api";
import DialogsContext from "./Dialogscontext";
import PrivateMessagesContext from "./PrivateMessagesContext";
import QuickBloxContext from "./QuickBloxContext";
import incommingCallSound from "../assets/incomingCall.wav";
import useSound from "use-sound";
var QuickBlox = require("quickblox/quickblox.min");
var PrivateChats = [];
var receiverSession = null;
var globalSession = null;
const QuickBloxProvider = ({ children }) => {
  const [play, { stop }] = useSound(incommingCallSound);
  const [checkSession, setCheckSession] = useState(null);
  const [recieverSessionStates, setRecieverSessionStates] = useState(null);
  var another;
  const InitialCallState = {
    incomingCall: false,
    acceptCall: false,
    rejectCall: false,
    stopCall: false,
  };
  const [callState, setCallState] = useState(InitialCallState);

  const { setPrivateMessages } = useContext(PrivateMessagesContext);

  const init = () => {
    try {
      
      const data = QuickBlox.init(
        process.env.REACT_APP_QUICKBLOX_APP_ID,
        process.env.REACT_APP_QUICKBLOX_AUTHORIZATION_KEY,
        process.env.REACT_APP_AUTHORIZATION_SECRET,
        process.env.REACT_APP_ACCOUNT_KEY,
        { debug: false }
      );
    } catch (error) {
      console.log("Error in init", error);
    }
    
  };

  const createSession = (params) => {
    console.log("ParamsIN",params)
    if(localStorage.getItem('loginStatus')==="false"){
      const defaultParams= {login: 'Umair', password: 'IamUmair'}
    QuickBlox.createSession(defaultParams, function (error, result) {
      if (error) {
        console.log("CreateSession Error", error);
      } else {
        console.log("I am CreateSessionResult:", result);
      }
    });
    }else{
      QuickBlox.createSession(params, function (error, result) {
        if (error) {
          console.log("CreateSession Error", error);
        } else {
          console.log("I am CreateSessionResult:", result);
        }
      });
    }
    
  };

  const connectChat = (params) => {
    let check={login: 'Umair', password: 'IamUmair'}
    QuickBlox.chat.connect(params, function (error, contactList) {
      if (error) {
        // console.log(error);
      } else {
        // console.log("I am contactList in ConnectChat", contactList);
        QuickBlox.chat.onMessageListener = messageRecieved;
        QuickBlox.chat.onSubscribeListener = RecievedRequest;
        var mediaParams = {
          audio: true,
          video: true,
          options: {
            muted: false,
            mirror: true,
          },
          elemId: "modelVideoElement",
        };
        QuickBlox.webrtc.onCallListener = function (session, extension) {
          // if you are going to take a call
          console.log("I am onCallListener", session, extension);
          setCallState((prevState) => {
            return {
              ...prevState,
              incomingCall: true,
            };
          });
          play();
          globalSession = session;
          setRecieverSessionStates(session);
          session.getUserMedia(mediaParams, function (error, stream) {
            if (error) {
              console.log("Error in onCallListener", error);
            } else {
              console.log("I am stream in onCallListener", stream);
              globalSession.attachMediaStream("localVideoElement", stream);

              //run accept function here
            }
          });
        };
        QuickBlox.webrtc.onRemoteStreamListener = function (
          session,
          userId,
          stream
        ) {
          console.log("I am onRemoteStreamListener", session, userId, stream);
          globalSession.attachMediaStream("remoteVideoElement", stream);
        };

        QuickBlox.webrtc.onRejectCallListener = function (
          session,
          userId,
          extension
        ) {
          console.log("I am onRejectCallListener", session, userId, extension);
        };
        QuickBlox.webrtc.onStopCallListener = function (
          session,
          userId,
          extension
        ) {
          console.log("onStopCallListener", session, userId, extension);
        };
        QuickBlox.webrtc.onAcceptCallListener = function (
          session,
          userId,
          extension
        ) {
          console.log("onAcceptCallListener", session, userId, extension);
        };
      }
    });
  };
  const messageRecieved = (userId, message) => {
    console.log("I am in messageRecieved", message);
    if (message.dialog_id === null) {
      PrivateChats.push(message);
      setPrivateMessages(PrivateChats);
    }
  };

  //Video Calls
  const createVideoCallSession = (calleesIds) => {
    var sessionType = QuickBlox.webrtc.CallType.VIDEO; // AUDIO is also possible
    var additionalOptions = {};
    var session = QuickBlox.webrtc.createNewSession(
      calleesIds,
      sessionType,
      null,
      additionalOptions
    );
    globalSession = session;
    setCheckSession(session);
  };
  const accessUserPrivileges = () => {
    var mediaParams = {
      audio: true,
      video: true,
      options: {
        muted: false,
        mirror: true,
      },
      elemId: "localVideoElement",
    };
    console.log("session in access", globalSession);
    try {
      globalSession.getUserMedia(mediaParams, function (error, stream) {
        if (error) {
          console.log("I am accessUserPrivilegesError", { error });
          throw error;
        } else {
          //run call function here
          console.log("I am accessUserPrivilegesStream", stream);
          globalSession.attachMediaStream("localVideoElement", stream);
          globalSession.call();
          // MakeCall();
        }
      });
    } catch (error) {
      console.log("I am accessUserPrivilegesError", { error });
    }
  };

  const MakeCall = () => {
    console.log("I am in MakeCall");
    try {
      var extension = {};
      console.log("Session In Make Call", { globalSession });
      globalSession.call(extension, function (error) {
        console.log("ErrorinMakeCall", error);
        throw error;
      });
    } catch (error) {
      console.log("ErrorinMakeCall", { error });
    }
  };

  const acceptCall = () => {
    console.log(
      "I am in AcceptCall",
      { globalSession },
      { checkSession },
      { another },
      { receiverSession },
      {
        recieverSessionStates,
      }
    );
    try {
      var extension = {};
      recieverSessionStates.accept(extension);
      stop();
      console.log("acptcal", globalSession);
      var mediaParams = {
        audio: true,
        video: true,
        options: {
          muted: false,
          mirror: true,
        },
        elemId: "localVideoElement",
      };
      recieverSessionStates.getUserMedia(mediaParams, function (error, stream) {
        if (error) {
          console.log("I am accessUserPrivilegesError", { error });
          throw error;
        } else {
          //run call function here
          console.log("I am accessUserPrivilegesStream", stream);
          recieverSessionStates.attachMediaStream("localVideoElement", stream);
        }
      });
      setCallState((prevState) => {
        return {
          ...prevState,
          acceptCall: true,
          incomingCall: false,
        };
      });
    } catch (error) {
      console.log("ErrorinAcceptCall", error);
    }
  };

  const rejectCall = () => {
    try {
      var extension = {};
      globalSession.reject(extension);
      setCallState((prevState) => {
        return {
          ...prevState,
          rejectCall: true,
          incomingCall: false,
          acceptCall: false,
        };
      });
    } catch (error) {
      console.log("ErrorinRejectCall", error);
    }
  };

  const endCall = () => {
    console.log("I am in EndCall");
    try {
      var extension = {};
      console.log("Session In End Call", { globalSession });
      globalSession.stop(extension);
    } catch (error) {
      console.log("ErrorinEndCall", error);
    }
  };
  const muteAudio = () => {
    console.log("I am in MuteAudio");

    globalSession.mute("audio");
  };
  const unmuteAudio = () => {
    console.log("I am in UnmuteAudio");
    globalSession.unmute("audio");
  };
  const startVideo = () => {
    globalSession.mute("video");
  };
  const stopVideo = () => {
    globalSession.unmute("video");
  };

  return (
    <QuickBloxContext.Provider
      value={{
        callState,
        init,
        createSession,
        connectChat,
        createVideoCallSession,
        accessUserPrivileges,
        MakeCall,
        acceptCall,
        rejectCall,
        EndCall: endCall,
        muteAudio,
        unmuteAudio,
        startVideo,
        stopVideo,
        globalSession,
      }}
    >
      {children}
    </QuickBloxContext.Provider>
  );
};
export default QuickBloxProvider;
