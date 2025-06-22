import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EmailVerification from "./EmailVerification";
import ErrorModal from "./ErrorModal";
const apiUrl = import.meta.env.VITE_API_URL;

function formatFieldName(str) {
  return str
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter
}

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthday: "",
  });

  const [user, setUser] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [responseError, setResponseError] = useState("");
  const [showPopupError, setShowPopupError] = useState(false);
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
        newErrors[key] = `${formatFieldName(key)} is required`;
      }
    });

    // Password confirmation
    if (
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      const body = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        birthday: formData.birthday,
      };
      axios
        .post(apiUrl + "/auth/register", body)
        .then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.user) {
            setIsLoading(false);
            setIsRegistered(true);
            setUser(res.data.user);

            // Clear form data
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              username: "",
              password: "",
              confirmPassword: "",
              phone: "",
              birthday: "",
            });
          }
        })
        .catch((res) => {
          setResponseError(res.response.data.error_msg);
          setShowPopupError(true);
          setIsLoading(false);
        });
    }
  };

  return isRegistered ? (
    <EmailVerification user={user} />
  ) : (
    <>
      <div className="register-container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card shadow p-4"
          style={{ width: "100%", maxWidth: "600px" }}
        >
          <h3 className="mb-4 text-center">Sign Up To LinkSpark</h3>
          {isLoading ? (
            <div
              class="d-flex justify-content-center align-items-center h-100"
              style={{ minHeight: "400px" }}
            >
              <div
                class="spinner-border text-primary "
                role="status"
                style={{ width: "100px", height: "100px" }}
              ></div>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              style={{ minHeight: "400px" }}
            >
              <div className="row mb-3">
                <div className="col">
                  <input
                    name="firstName"
                    type="text"
                    className={`form-control ${
                      errors.firstName ? "is-invalid" : ""
                    }`}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.firstName}</div>
                </div>
                <div className="col">
                  <input
                    name="lastName"
                    type="text"
                    className={`form-control ${
                      errors.lastName ? "is-invalid" : ""
                    }`}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.lastName}</div>
                </div>
              </div>

              <div className="mb-3">
                <input
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="mb-3">
                <input
                  name="username"
                  type="text"
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.username}</div>
              </div>

              <div className="mb-3">
                <input
                  name="password"
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.password}</div>
              </div>
              <div className="mb-3">
                <input
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              </div>

              <div className="row mb-4">
                <div className="col-12 col-md mb-3">
                  <input
                    name="phone"
                    type="tel"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.phone}</div>
                </div>
                <div className="col-12 col-md">
                  <input
                    name="birthday"
                    type="date"
                    className={`form-control ${
                      errors.birthday ? "is-invalid" : ""
                    }`}
                    placeholder="Birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.birthday}</div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Sign Up
              </button>
            </form>
          )}
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
      <ErrorModal
        show={showPopupError}
        message={responseError}
        onClose={() => setShowPopupError(false)}
      />
    </>
  );
}
