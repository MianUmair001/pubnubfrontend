import React, { useState, useEffect, useCallback, MouseEvent } from "react";
import { ChannelMetadataObject, ObjectCustom, BaseObjectsEvent } from "pubnub";
import { Picker } from "emoji-mart";
import { usePubNub } from "pubnub-react";
import "./PubnubParent.scss";
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
  ChannelList,
  Chat,
  MemberList,
  MessageEnvelope,
  MessageInput,
  MessageList,
  TypingIndicator,
  useChannelMembers,
  useChannels,
  usePresence,
  useUser,
  useUserMemberships,
  useUsers,
} from "@pubnub/react-chat-components";
import { CreateChatModal } from "./CreateChatModal";
import { PublicChannelsModal } from "./PublicChannelsModal";
import { ReportUserModal } from "./ReportUserModal";
import Brightness4Icon from '@mui/icons-material/Brightness4';

const defaultChannel = {
  id: "default",
  name: "Default Channel",
  description: "This is the default channel",
};
const PubchatParent = () => {
  const [theme, setTheme] = useState("dark");
  const [currentChannel, setCurrentChannel] = useState(defaultChannel);
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [showPublicChannelsModal, setShowPublicChannelsModal] = useState(false);
  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [showReportUserModal, setShowReportUserModal] = useState(false);
  const [channelsFilter, setChannelsFilter] = useState("");
  const [membersFilter, setMembersFilter] = useState("");
  const [reportedMessage, setReportedMessage] = useState();
  const pubnub = usePubNub();
  console.log("PubnubIs",pubnub)
  const uuid = pubnub.getUUID();
  console.log("UUID",uuid)
  const [currentUser] = useUser({ uuid });

  console.log("Currentuser",currentUser)
  const [allUsers] = useUsers({ include: { customFields: true } });
  console.log("Allusers",allUsers)
  const [allChannels] = useChannels({ include: { customFields: true } });
  console.log("allChannels",allChannels)

  const [joinedChannels, , refetchJoinedChannels] = useUserMemberships({
    include: { channelFields: true, customChannelFields: true },
  });
  console.log("joinedChannels",joinedChannels)
  const [channelMembers, , refetchChannelMemberships, totalChannelMembers] = useChannelMembers({
    channel: currentChannel.id,
    include: { customUUIDFields: true },
  });
 
  console.log("channelMembers",channelMembers)
  const [presenceData] = usePresence({
    channels: joinedChannels.length ? joinedChannels.map((c) => c.id) : [currentChannel.id],
  });
  console.log("presenceData",presenceData)
  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map((o) => o.uuid);
    console.log("presentUUIDs",presentUUIDs)
  const groupChannels = joinedChannels.filter(
    (c) =>
      c.id?.startsWith("space.") && c.name?.toLowerCase().includes(channelsFilter.toLowerCase())
  );
    console.log("groupChannels",groupChannels)
  const groupChannelsToJoin = allChannels.filter(
    (c) => c.id.startsWith("space.") && !joinedChannels.some((b) => c.id === b.id)
  );
  

  const directChannels = joinedChannels
    .filter((c) => c.id?.startsWith("direct.") || c.id?.startsWith("group."))
    .map((c) => {
      if (!c.id?.startsWith("direct.")) return c;
      const interlocutorId = c.id.replace(uuid, "").replace("direct.", "").replace("@", "");
      const interlocutor = allUsers.find((u) => u.id === interlocutorId);
      if (interlocutor) {
        c.custom = { thumb: interlocutor.profileUrl || "" };
        c.name = interlocutor.name;
      }
      return c;
    })
    .filter((c) => c.name?.toLowerCase().includes(channelsFilter.toLowerCase()));
    console.log("directChannels",directChannels)
    const isUserBanned = currentUser?.custom?.ban;
    const isUserMuted = (currentUser?.custom?.mutedChannels )
      ?.split(",")
      .includes(currentChannel.id);
    const isUserBlocked = (currentUser?.custom?.blockedChannels)
      ?.split(",")
      .includes(currentChannel.id);
  
    /**
     * Creating and removing channel memberships (not subscriptions!)
     */
    const leaveChannel = async (channel, event) => {
      event.stopPropagation();
      await pubnub.objects.removeMemberships({ channels: [channel.id] });
      setAnotherCurrentChannel(channel.id);
    };
  
    const refreshMemberships = useCallback(
      (event) => {
        if (event.channel.startsWith("user_")) refetchJoinedChannels();
        if (event.channel === currentChannel.id) refetchChannelMemberships();
      },
      [currentChannel, refetchJoinedChannels, refetchChannelMemberships]
    );
  
    const setAnotherCurrentChannel = (channelId) => {
      if (currentChannel.id === channelId) {
        const newCurrentChannel = joinedChannels?.find((ch) => ch.id !== channelId);
        if (newCurrentChannel) setCurrentChannel(newCurrentChannel);
      }
    };
  
    /**
     * Handling publish errors
     */
    const handleError = (e) => {
      if (
        (e.status?.operation === "PNPublishOperation" && e.status?.statusCode === 403) ||
        e.message.startsWith("Publish failed")
      ) {
        alert(
          "Your message was blocked. Perhaps you tried to use offensive language or send an image that contains nudity?"
        );
      }
    };
  
    useEffect(() => {
      if (currentChannel.id === "default" && joinedChannels.length)
        setCurrentChannel(joinedChannels[0]);
    }, [currentChannel, joinedChannels]);

  return (
    <div className={`app-moderated app-moderated--${theme}`}>
 
    <Chat
      theme={theme}
      users={allUsers}
      currentChannel={currentChannel.id}
      channels={[...joinedChannels.map((c) => c.id), uuid]}
      onError={handleError}
      onMembership={(e) => refreshMemberships(e)}
    >
      {/* {showPublicChannelsModal && (
        <PublicChannelsModal
          {...{
            groupChannelsToJoin,l
            hideModal: () => setShowPublicChannelsModal(false),
            setCurrentChannel,
          }}
        />
      )} */}
      {/* {showCreateChatModal && (
        <CreateChatModal
          {...{
            currentUser,
            hideModal: () => setShowCreateChatModal(false),
            setCurrentChannel,
            users: allUsers.filter((u) => u.id !== uuid),
          }}
        />
      )} */}
      {/* {showReportUserModal && (
        <ReportUserModal
          {...{
            currentUser,
            reportedMessage,
            hideModal: () => setShowReportUserModal(false),
            users: allUsers,
          }}
        />
      )} */}
        
      {isUserBanned ? (
        <strong className="error">Unfortunately, you were banned from the chat.</strong>
      ) : (
        <>
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

            <div className="filter-input">
              <input
                onChange={(e) => setChannelsFilter(e.target.value)}
                placeholder="Search in..."
                type="text"
                value={channelsFilter}
              />
              <SearchIcon />
              {/* <i className="material-icons-outlined">search</i> */}
              
            </div>

            <div className="channel-lists">
              
              <h2>
                Direct chats{" "}
              
              </h2>
              <div>
                <ChannelList
                  channels={directChannels}
                  onChannelSwitched={(channel) => setCurrentChannel(channel)}
                  extraActionsRenderer={(c) => (
                    <div onClick={(e) => leaveChannel(c, e)} title="Leave channel">
                      <i className="material-icons-outlined small">logout</i>
                    </div>
                  )}
                />
              </div>
            </div>

          </div>

          <div className="chat-window">
            <div className="channel-info">
              <button
                className="mobile material-icons-outlined"
                onClick={() => setShowChannels(true)}
              >
                menu
              </button>
              <span onClick={() => setShowMembers(!showMembers)}>
                <strong>
                  {currentChannel.name || currentChannel.id}
                  {!isUserBlocked && < ArrowRightIcon />}
                </strong>
                <p>{totalChannelMembers} members</p>
              </span>
              <hr />
            </div>

            {isUserBlocked ? (
              <strong className="error">
                Unfortunately, you were blocked from this channel.
              </strong>
            ) : (
              <>
                <MessageList
                  fetchMessages={20}
                />
                {/* <TypingIndicator /> */}
                <hr />
                <MessageInput
                  disabled={isUserMuted}
                  typingIndicator
                  placeholder={isUserMuted ? "You were muted from this channel" : "Send message"}
                />
              </>
            )}
          </div> 



          <div className="members-panel shown">
            <h2>
              Online Members
              {/* <button className="material-icons-outlined" onClick={() => setShowMembers(false)}>
                close
              </button> */}
            </h2>
            <div className="filter-input">
              <input
                onChange={(e) => setMembersFilter(e.target.value)}
                placeholder="Search in members"
                type="text"
                value={membersFilter}
              />
              <i className="material-icons-outlined">search</i>
            </div>
            <MemberList
              members={allUsers.filter(u=>u?.id?.length===24).filter((c) =>
                c.name?.toLowerCase().includes(membersFilter.toLowerCase())
              )}
              presentMembers={presentUUIDs}
            />
          </div>

          <div className={`members-panel ${showMembers && !isUserBlocked ? "shown" : "hidden"}`}>
            <h2>
              Members
              <button className="material-icons-outlined" onClick={() => setShowMembers(false)}>
                close
              </button>
            </h2>
            <div className="filter-input">
              <input
                onChange={(e) => setMembersFilter(e.target.value)}
                placeholder="Search in members"
                type="text"
                value={membersFilter}
              />
              <i className="material-icons-outlined">search</i>
            </div>
            <MemberList
              members={channelMembers.filter((c) =>
                c.name?.toLowerCase().includes(membersFilter.toLowerCase())
              )}
              presentMembers={presentUUIDs}
            />
          </div>
        </>
      )}
    </Chat>
  </div>
  );
};

export default PubchatParent;
