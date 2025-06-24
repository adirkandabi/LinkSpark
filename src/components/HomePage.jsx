import axios from "axios";
import React, { useState, useEffect, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ChatBox from "./ChatBox";
import Posts from "./Posts";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";

export default function HomePage({ user: userProp }) {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data: userProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userHomePage", Cookies.get("user")],
    queryFn: async () => {
      if (!Cookies.get("user")) throw new Error("User ID is required");
      const res = await getProfile(Cookies.get("user"));
      console.log(res.data.user);
      return res.data.user;
    },
  });
  useEffect(() => {
    if (!isLoading && !userProfile) {
      navigate("/fill-profile");
    }
  }, [isLoading, userProfile, navigate]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh", width: "100%" }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "300px", height: "300px" }}
        ></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-5">
        {userProfile && <Posts user={userProfile} isHomePage={true} />}
      </div>
      {/* <ChatBox /> */}
    </>
  );
}
