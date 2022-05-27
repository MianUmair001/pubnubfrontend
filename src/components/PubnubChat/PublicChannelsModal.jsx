import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { ChannelMetadataObject, ObjectCustom } from "pubnub";
import { ChannelList } from "@pubnub/react-chat-components";


export const PublicChannelsModal = ({
  groupChannelsToJoin,
  setCurrentChannel,
  hideModal,
})  => {
  const pubnub = usePubNub();
  const [channelsFilter, setChannelsFilter] = useState("");

  const joinGroupChannel = async (channel) => {
    await pubnub.objects.setMemberships({ channels: [channel.id] });
    setCurrentChannel(channel);
    hideModal();
  };

  return (
    <div className="overlay">
      <div className="public-channels-modal modal">
        <div className="header">
          <strong>Join a channel</strong>
          <button className="material-icons-outlined" onClick={() => hideModal()}>
            close
          </button>
        </div>
        <div className="filter-input">
          <input
            onChange={(e) => setChannelsFilter(e.target.value)}
            placeholder="Search in channels"
            type="text"
            value={channelsFilter}
          />
          <i className="material-icons-outlined">search</i>
        </div>
        <h2>Channels</h2>
        <ChannelList
          channels={groupChannelsToJoin.filter((c) =>
            c.name?.toLowerCase().includes(channelsFilter)
          )}
          onChannelSwitched={(channel) => joinGroupChannel(channel)}
        />
      </div>
    </div>
  );
};