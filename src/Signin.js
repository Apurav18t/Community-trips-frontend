// Signin.js
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

const API_URL = "https://community-trips-backend.onrender.com";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/planner");
  }, [navigate]);

  const saveUserToLocalStorage = (data, access_token) => {
    const userData = {
      ...data,
      _id: data._id || data.id,
      access_token,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("userId", userData._id);
    return userData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.data && result.data.access_token) {
        saveUserToLocalStorage(result.data, result.data.access_token);
        toast.success("Sign in successful!");
        setTimeout(() => navigate("/planner"), 1000);
      } else {
        // 🔁 Handle unverified user separately
        if (
          result.message ===
          "USER NOT VERIFIED. OTP SENT TO YOUR EMAIL PLEASE CHECK"
        ) {
          toast.warn("Account not verified. OTP sent to your email.");
          setTimeout(() => navigate(`/verifyUser?email=${email}`), 2000);
        } else {
          toast.error(`Signin failed: ${result.message || "Unknown error"}`);
        }
      }
    } catch (err) {
      console.error("Signin error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await fetch(`${API_URL}/user/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: decoded.email, name: decoded.name }),
      });

      const result = await response.json();

      if (result.success && result.data && result.data.access_token) {
        saveUserToLocalStorage(result.data, result.data.access_token);
        toast.success("Google Sign-In successful!");
        setTimeout(() => navigate("/planner"), 1000);
      } else {
        toast.error(`Google Sign-In failed: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Google Signin Error:", err);
      toast.error("Google Sign-In failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Sign In</h2>
      <p>Enter your credentials below to login to your account</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="forgot-password">
          <a href="/forgot-password">Forgot your password?</a>
        </div>
        <button type="submit">Sign in</button>
      </form>

      <div className="or-divider"></div>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google Sign-In Failed")}
      />

      <p className="bottom-text">
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
