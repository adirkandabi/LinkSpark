import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
const apiUrl = import.meta.env.VITE_API_URL;

function sendVerificationEmail(userId) {
  return axios.post(`${apiUrl}/auth/send-code`, { user_id: userId });
}
export default function EmailVerification({ user }) {
  const isEmailSent = useRef(false);
  const navigator = useNavigate();
  const [code, setCode] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("something went wrong");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!isEmailSent.current) {
      isEmailSent.current = true;
      sendVerificationEmail(user.user_id);
    }
  }, []);

  const resetInputs = () => {
    setCode(Array(6).fill("")); // clear state
    inputsRef.current.forEach((input) => {
      if (input) input.value = ""; // clear DOM values
    });
    inputsRef.current[0]?.focus(); // focus first input
  };
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      setTimeout(() => {
        inputsRef.current[index + 1]?.focus();
      }, 10);
    }

    if (index === 5 && value) {
      setIsLoading(true);
      resetInputs();
      // Send the code to the server
      const finalCode = newCode.join("");
      console.log(finalCode);
      const body = {
        user_id: user.user_id,
        code: finalCode,
      };
      axios
        .post(`${apiUrl}/auth/verify-email`, body)
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          Cookies.set("user", user.user_id, { expires: 7 }); // expires in 7 days
          navigator("/fill-profile");
        })
        .catch((res) => {
          console.log(res);
          setIsLoading(false);
          setError(res.response?.data?.error_msg || "Something went wrong.");
          setShowErrorMsg(true);
        });
    }
    // if (!value && index > 0) {
    //   inputsRef.current[index - 1]?.focus();
    // }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center p-10"
      style={{ height: "100vh", width: "100%", padding: "10px" }}
    >
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="mb-4 text-center">Verify Your Email</h3>
        <p className="text-center">
          A verification code has been sent to <strong>{user.email}</strong>.
          Enter it below:
        </p>

        {isLoading ? (
          <div
            class="d-flex justify-content-center align-items-center h-100"
            style={{ minHeight: "50px" }}
          >
            <div
              class="spinner-border text-primary "
              role="status"
              // style={{ width: "100px", height: "100px" }}
            ></div>
          </div>
        ) : (
          <div
            className="code-input-wrapper d-flex justify-content-center gap-1 gap-lg-2 mb-3"
            style={{ minHeight: "50px" }}
          >
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                className="form-control text-center"
                style={{ width: "3rem", fontSize: "1.5rem" }}
                value={code[index]}
                disabled={index > 0 && !code[index - 1]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) =>
                  e.key === "Backspace" && inputsRef.current[index - 1]?.focus()
                }
              />
            ))}
          </div>
        )}
        {showErrorMsg && (
          <div className="alert alert-danger" role="alert">
            {error.charAt(0).toUpperCase() + error.slice(1)}
          </div>
        )}
        <p className="text-center">
          Didn't get the email?{" "}
          <a
            onClick={() => sendVerificationEmail(user.user_id)}
            role="button"
            tabIndex="0"
            style={{ cursor: "pointer" }}
          >
            Resend
          </a>
          .
        </p>
      </div>
    </div>
  );
}
