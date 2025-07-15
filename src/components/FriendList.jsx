import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Avatar, Box, Typography, Badge } from "@mui/material";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function FriendList({ onSelectUser }) {
  const [friends, setFriends] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const currentUserId = Cookies.get("user");

  useEffect(() => {
    socket.emit("join_room", currentUserId); // join personal room

    const fetchData = async () => {
      try {
        const [friendsRes, unreadRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/users/${currentUserId}/friends`
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/messages/unread/${currentUserId}`
          ),
        ]);

        const friends = friendsRes.data.friends || [];
        const unreadList = unreadRes.data.unread || [];

        const unreadCountMap = {};
        unreadList.forEach(({ user_id, unread_count }) => {
          unreadCountMap[user_id] = unread_count;
        });

        setFriends(friends);
        setUnreadMap(unreadCountMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    // Listen to unread updates
    const handleUnread = (count) => {
      // Re-fetch unread counts
      axios
        .get(`${import.meta.env.VITE_API_URL}/messages/unread/${currentUserId}`)
        .then((res) => {
          const updatedMap = {};
          (res.data.unread || []).forEach(({ user_id, unread_count }) => {
            updatedMap[user_id] = unread_count;
          });
          setUnreadMap(updatedMap);
        });
    };

    socket.on("unread_count", handleUnread);

    return () => {
      socket.off("unread_count", handleUnread);
      socket.emit("leave_room", currentUserId);
    };
  }, [currentUserId]);

  return (
    <div
      style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        padding: "1rem",
        overflowY: "auto",
        height: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Chats
      </Typography>

      {friends.map((f) => (
        <Box
          key={f.user_id}
          onClick={() => onSelectUser(f)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            padding: "0.5rem",
            borderRadius: 1,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              transform: "scale(1.02)",
            },
          }}
        >
          <Badge
            color="error"
            variant={unreadMap[f.user_id] > 0 ? "dot" : "standard"}
            invisible={!unreadMap[f.user_id]}
            sx={{
              "& .MuiBadge-badge": {
                width: 20,
                height: 20,
                minWidth: 14,
                borderRadius: "50%",
                border: "2px solid white",
              },
            }}
          >
            <Avatar src={f.profile_image}>{f.first_name?.[0]}</Avatar>
          </Badge>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {f.first_name} {f.last_name}
            </Typography>
          </Box>
        </Box>
      ))}
    </div>
  );
}
