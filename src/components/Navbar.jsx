import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Badge,
  Divider,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchBoxRef = useRef(null);
  const notificationRef = useRef(null);
  const currentUserId = Cookies.get("user");

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/login");
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        axios
          .get(
            `${import.meta.env.VITE_API_URL}/user/list?q=${encodeURIComponent(
              searchTerm
            )}`
          )
          .then((res) => {
            setResults(res.data.users || []);
            setShowResults(true);
          })
          .catch(() => {
            setResults([]);
            setShowResults(false);
          });
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUserId) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/${currentUserId}/requests`
          );
          setFriendRequests(res.data.requests || []);
        } catch (err) {
          console.error("Failed to fetch friend requests", err);
        }
      }
    };

    fetchRequests();
  }, [currentUserId]);

  const handleAccept = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/accept-friend-request`,
        {
          friend_id: userId,
          user_id: currentUserId,
        }
      );
      setFriendRequests((prev) => prev.filter((r) => r.user_id !== userId));
    } catch (err) {
      console.error("Failed to accept request", err);
    }
  };

  const handleDeny = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/reject-friend-request`,
        {
          friend_id: userId,
          user_id: currentUserId,
        }
      );
      setFriendRequests((prev) => prev.filter((r) => r.user_id !== userId));
    } catch (err) {
      console.error("Failed to deny request", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button component={Link} to="/home-page" color="inherit">
            Home Page
          </Button>
          <Button
            component={Link}
            to={`/user-profile/${currentUserId}`}
            color="inherit"
          >
            Profile
          </Button>
          <Button component={Link} to="/my-groups" color="inherit">
            My Groups
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          <Box ref={searchBoxRef} sx={{ position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 1,
                paddingX: 1,
                width: { xs: "100%", sm: "300px" },
              }}
            >
              <SearchIcon sx={{ marginRight: 1 }} />
              <InputBase
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ color: "inherit", width: "100%" }}
                inputProps={{ "aria-label": "search" }}
              />
            </Box>

            {showResults && results.length > 0 && (
              <Paper
                sx={{
                  position: "absolute",
                  top: "50px",
                  width: "300px",
                  zIndex: 10,
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <List dense>
                  {results.map((user) => (
                    <ListItem
                      key={user.username}
                      button
                      onClick={() => {
                        navigate(`/user-profile/${user.user_id}`);
                        setSearchTerm("");
                        setShowResults(false);
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.profile_image}>
                          {user.first_name?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${user.first_name} ${user.last_name}`}
                        secondary={`@${user.username}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          <Box ref={notificationRef} sx={{ position: "relative" }}>
            <IconButton
              color="inherit"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              <Badge badgeContent={friendRequests.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {showNotifications && (
              <Paper
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50px",
                  width: "320px",
                  zIndex: 10,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {friendRequests.length === 0 ? (
                  <Box sx={{ p: 2 }}>
                    <Typography align="center" color="text.secondary">
                      No Friend Requests
                    </Typography>
                  </Box>
                ) : (
                  <List dense>
                    {friendRequests.map((user) => (
                      <Box key={user.user_id} sx={{ px: 2, py: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              navigate(`/user-profile/${user.user_id}`);
                              setShowNotifications(false);
                            }}
                          >
                            <Avatar src={user.profile_image} sx={{ mr: 1 }}>
                              {user.first_name?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body1">
                                {user.first_name} {user.last_name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                @{user.username}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAccept(user.user_id)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleDeny(user.user_id)}
                            >
                              Deny
                            </Button>
                          </Box>
                        </Box>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </List>
                )}
              </Paper>
            )}
          </Box>

          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: "#ffffff",
              color: "#d32f2f",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#f2f2f2" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
