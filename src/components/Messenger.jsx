import React, { useState } from "react";
import FriendList from "./FriendList";
import ChatBox from "./ChatBox";

export default function Messenger() {
  const [activeChatUser, setActiveChatUser] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "500px",
        width: "100%",
        maxWidth: "800px",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <FriendList onSelectUser={setActiveChatUser} />
      <div style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        {activeChatUser ? (
          <ChatBox user={activeChatUser} />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
            }}
          >
            Select a friend to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
