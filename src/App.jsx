import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/login";
import Register from "./components/Register";
import EmailVerification from "./components/EmailVerification";
import HomePage from "./components/HomePage";
import FillProfile from "./components/FillProfile";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/fill-profile" element={<FillProfile />} />
        <Route path="/user-profile/:user_id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
