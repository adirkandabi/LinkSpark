import React from "react";
import { AppBar, Toolbar, Button, Box, InputBase } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/login");
  };

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
          <Button color="inherit">My Groups</Button>
        </Box>

        {/* Right: Search + Logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
