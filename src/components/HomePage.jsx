import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
async function getUser(userId) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/user?id=${userId}`
    );
    return res.data.user;
  } catch (err) {
    console.log("Error fetching user:", err);
    return null;
  }
}

export default function HomePage({ user: userProp }) {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userFromNavigation = location.state;
    const userIdFromCookie = Cookies.get("user");
    console.log("userFromNavigation:", userFromNavigation);
    console.log("userIdFromCookie:", userIdFromCookie);
    if (userProp) {
      setUser(userProp);
    } else if (userFromNavigation) {
      setUser(userFromNavigation);
    } else if (userIdFromCookie) {
      getUser(userIdFromCookie)
        .then((fetchedUser) => {
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      navigate("/login");
    }
  }, [userProp, location.state]);

  if (!user) {
    return <p>Loading user data...</p>; // או spinner
  }

  return (
    <div className="container mt-5">
      <h1>Welcome to the Home Page</h1>
      <p>Hello, {user.username}!</p>
      <p>This is a protected route, accessible only after login.</p>
    </div>
  );
}
