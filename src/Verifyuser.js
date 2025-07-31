import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//const API_URL = "http://localhost:6969";

const API_URL = "https://community-trips-backend.onrender.com";

export default function VerifyUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email");

  const [email, setEmail] = useState(emailFromQuery || "");
  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Email and OTP are required.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/verifyUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        toast.error(result.message || "Verification failed.");
      }
    } catch (err) {
      console.error("Error verifying user:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <h2>Verify Your Account</h2>
      <form onSubmit={handleVerify}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
