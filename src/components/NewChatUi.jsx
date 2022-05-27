import {
  ChannelList,
  Chat,
  MemberList,
  useUser,
} from "@pubnub/react-chat-components";
import { usePubNub } from "pubnub-react";
import React, { useCallback, useState } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import SearchIcon from "@mui/icons-material/Search";

const NewChatUi = ({
  usersCheck,
  activeDialogName,
  allChannels,
  activeDialogId,
}) => {
  const [theme, setTheme] = useState("dark");
  const pubnub = usePubNub();
  console.log("PubnubIs", pubnub);
  const uuid = pubnub?.getUUID();
  console.log("UUID", uuid);
  const [currentUser] = useUser({ uuid });
  const [showChannels, setShowChannels] = useState(true);
  const [membersFilter, setMembersFilter] = useState("");
  const [channelsFilter, setChannelsFilter] = useState("");

  const handleError = (e) => {
    if (
      (e.status?.operation === "PNPublishOperation" &&
        e.status?.statusCode === 403) ||
      e.message.startsWith("Publish failed")
    ) {
      alert(
        "Your message was blocked. Perhaps you tried to use offensive language or send an image that contains nudity?"
      );
    }
  };
  //   const refreshMemberships = useCallback(
  //     (event) => {
  //       if (event.channel.startsWith("user_")) refetchJoinedChannels();
  //       if (event.channel === currentChannel.id) refetchChannelMemberships();
  //     },
  //     [currentChannel, refetchJoinedChannels, refetchChannelMemberships]
  //   );
  return (
    <Chat
      theme="dark"
      users={usersCheck}
      currentChannel={activeDialogName}
      channels={allChannels}
      onError={handleError}
      // onMembership={(e) => refreshMemberships(e)}>
    >
      <div className={`channels-panel ${showChannels && "shown"}`}>
        <div className="user-info">
          {currentUser && <MemberList members={[currentUser]} selfText="" />}
          <button
            className="mobile material-icons-outlined"
            onClick={() => setShowChannels(false)}
          >
            close
          </button>
        </div>

        <div className="theme-switcher">
          {/* <i className="material-icons-outlined">brightness_4</i> */}
          <Brightness4Icon />
          <button
            className={theme}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <span></span>
          </button>
        </div>
      </div>
    </Chat>
  );
};

export default NewChatUi;
