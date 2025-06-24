// src/components/RequireAuth.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const userId = Cookies.get("user");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  // If there's no cookie yet, don't flash the protected content
  if (!userId) return null;

  return children;
}
