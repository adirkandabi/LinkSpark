import React, { useEffect, useState } from "react";
import Messenger from "./Messenger";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Box, Paper, Badge } from "@mui/material";
import Cookies from "js-cookie";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const currentUserId = Cookies.get("user");

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/messages/unread/${currentUserId}`
        );
        const data = await res.json();
        const unreadList = data.unread || [];
        setHasUnread(unreadList.length > 0);
      } catch (err) {
        console.error("Failed to fetch unread messages", err);
      }
    };

    fetchUnread();

    // Listen to real-time unread updates
    socket.on("unread_count", (count) => {
      setHasUnread(count > 0);
    });

    return () => {
      socket.off("unread_count");
    };
  }, [currentUserId]);

  return (
    <>
      {open && (
        <Paper
          elevation={4}
          sx={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: { xs: "100%", sm: "400px", md: "600px" },
            height: "500px",
            zIndex: 1300,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Messenger />
        </Paper>
      )}

      <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1400 }}>
        <Badge
          color="error"
          variant="dot"
          invisible={!hasUnread || open}
          overlap="circular"
        >
          <IconButton
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": { backgroundColor: "#1565c0" },
              width: 56,
              height: 56,
            }}
          >
            {open ? <CloseIcon /> : <ChatIcon />}
          </IconButton>
        </Badge>
      </Box>
    </>
  );
}
