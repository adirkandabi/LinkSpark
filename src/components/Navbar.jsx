import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
} from "@mui/material";
import { Link } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side: Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} to="/" color="inherit">
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

        {/* Right side: Search input */}
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
            sx={{ color: "inherit", width: "100%" }}
            inputProps={{ "aria-label": "search" }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
