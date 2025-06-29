import React, { useEffect, useState } from "react";
import Messenger from "./Messenger";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Box, Paper, Badge } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const currentUserId = Cookies.get("user");

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/messages/unread/${currentUserId}`
        );
        const unreadList = res.data.unread || [];
        setHasUnread(unreadList.length > 0);
      } catch (err) {
        console.error("Failed to fetch unread messages", err);
      }
    };

    fetchUnread();

    // Optionally poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
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

      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1400,
        }}
      >
        <Badge
          color="error"
          variant="dot"
          invisible={!hasUnread || open}
          overlap="circular"
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
          <IconButton
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
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
