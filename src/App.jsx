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
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth"; // ✅ import auth wrapper

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/home-page"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="verify"
            element={
              <RequireAuth>
                <EmailVerification />
              </RequireAuth>
            }
          />
          <Route
            path="/fill-profile"
            element={
              <RequireAuth>
                <FillProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/user-profile/:user_id"
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
