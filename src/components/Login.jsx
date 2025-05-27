import axios from "axios";
import React, { cloneElement, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailVerification from "./EmailVerification";
import HomePage from "./HomePage";
import Cookies from "js-cookie";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [responseError, setResponseError] = useState("Something went wrong.");
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  useEffect(() => {
    if (loggedIn && isVerified) {
      navigate("/home-page", { state: user });
    }
  }, [loggedIn, isVerified, user]);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Check required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      setShowErrorMsg(false);
      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/login`, formData)
        .then((res) => {
          setIsLoading(false);

          console.log(res);
          setIsVerified(res.data.user.is_verified);
          setUser(res.data.user);
          setLoggedIn(true);
          Cookies.set("user", res.data.user.user_id, { expires: 7 }); // expires in 7 days
          //   if(res.data.success) {
        })
        .catch((res) => {
          console.log(res);
          setIsLoading(false);
          setResponseError(
            res.response?.data?.error_msg || "Something went wrong."
          );
          setShowErrorMsg(true);
        });
    }
  };
  return loggedIn && !isVerified ? (
    <EmailVerification user={user} />
  ) : (
    <>
      <div
        className="d-flex justify-content-center align-items-center  "
        style={{ height: "600px", width: "100%" }}
      >
        <div
          className="card shadow p-4"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h3 className="mb-4 text-center">Sign In To LinkSpark</h3>
          <form onSubmit={handleSubmit}>
            {isLoading ? (
              <div
                class="d-flex justify-content-center align-items-center h-100"
                style={{ minHeight: "120px" }}
              >
                <div
                  class="spinner-border text-primary "
                  role="status"
                  style={{ width: "50px", height: "50px" }}
                ></div>
              </div>
            ) : (
              <div className="inputs-wrapper" style={{ minHeight: "120px" }}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    value={formData.username}
                    onChange={handleChange}
                    id="username"
                    placeholder="Username"
                  />
                  <div className="invalid-feedback">{errors.username}</div>
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    id="password"
                    placeholder="Password"
                  />
                  <div className="invalid-feedback">{errors.password}</div>
                </div>
              </div>
            )}
            {showErrorMsg && (
              <div className="alert alert-danger" role="alert">
                {responseError}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="mt-3 text-center">
            Dont have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
