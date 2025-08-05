import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

const API_URL = "http://localhost:6969";
 //const API_URL = "https://community-trips-backend.onrender.com";

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectTo =
    new URLSearchParams(location.search).get("redirectTo") || "/dashboard";

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("access_token");
      if (user && token) navigate(redirectTo);
    } catch (err) {
      console.warn("Invalid user in localStorage:", err);
    }
  }, [navigate, redirectTo]);

  const saveUserToLocalStorage = (data, access_token) => {
    const userData = {
      _id: data._id || data.id,
      fullName: data.fullName || data.name || "Guest",
      email: data.email,
      access_token,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("userId", userData._id);
    return userData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        setTimeout(() => navigate(redirectTo), 1000);
      } else {
        const errorMsg =
          result.message || result.error?.message || "Signin failed.";
        if (
          errorMsg ===
          "USER NOT VERIFIED. OTP SENT TO YOUR EMAIL PLEASE CHECK"
        ) {
          toast.warn("Account not verified. OTP sent to your email.");
          setTimeout(() => navigate(`/verifyUser?email=${email}`), 2000);
        } else {
          toast.error(`Signin failed: ${errorMsg}`);
        }
      }
    } catch (err) {
      console.error("Signin error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
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
        setTimeout(() => navigate(redirectTo), 1000);
      } else {
        const errorMsg =
          result.message || result.error?.message || "Google login failed.";
        toast.error(`Google Sign-In failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Google Signin Error:", err);
      toast.error("Google Sign-In failed. Try again.");
    } finally {
      setLoading(false);
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
          disabled={loading}
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
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
        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Sign in"}
        </button>
      </form>

      <div className="or-divider"></div>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google Sign-In Failed")}
        useOneTap={false}
      />

      <p className="bottom-text">
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
