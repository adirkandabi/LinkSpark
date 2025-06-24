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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import axios from "axios";
import { meta } from "@eslint/js";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const searchBoxRef = useRef(null);

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
          .catch((err) => {
            console.error(err);
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

  // Hide dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Navigation buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button component={Link} to="/home-page" color="inherit">
            Home Page
          </Button>
          <Button
            component={Link}
            to={`/user-profile/${Cookies.get("user")}`}
            color="inherit"
          >
            Profile
          </Button>
          <Button component={Link} to="/my-groups" color="inherit">My Groups</Button>
        </Box>

        {/* Right: Search + Logout */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
          ref={searchBoxRef}
        >
          {/* Search input */}
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

          {/* Search results dropdown */}
          {showResults && results.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "50px",
                right: 110,
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
                      <Avatar src={user.profile_image || undefined}>
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

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: "#ffffff",
              color: "#d32f2f",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#f2f2f2",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
