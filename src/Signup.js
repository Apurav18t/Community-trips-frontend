import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode"; // fixed import (remove curly braces)
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

// Backend API URL
const API_URL = "https://community-trips-backend.onrender.com";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    new URLSearchParams(location.search).get("redirectTo") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Utility function to save user info and token in localStorage
  const saveUserToLocalStorage = (data, access_token) => {
    const userData = {
      _id: data._id || data.id,
      fullName: data.fullName || data.name || "Guest",
      email: data.email,
      isVerified: data.isVerified || "N", // store verification status
      access_token,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("userId", userData._id);
    return userData;
  };

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("access_token");
      if (user && token) navigate(redirectTo);
    } catch (err) {
      console.warn("Invalid user in localStorage:", err);
    }
  }, [navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/user/registerUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          role: "user",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Signup successful! Check your email for OTP.");
        setTimeout(() => {
          navigate(`/verifyUser?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        toast.error(`Signup failed: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await fetch(`${API_URL}/user/google-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decoded.email,
          fullName: decoded.name,
          role: "user",
        }),
      });

      const result = await response.json();

      if (result.success && result.data && result.data.access_token) {
        saveUserToLocalStorage(result.data, result.data.access_token);
        toast.success("Google Sign-Up successful!");
        setTimeout(() => navigate(redirectTo), 1000);
      } else {
        toast.error(`Google Signup failed: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Google Signup Error:", err);
      toast.error("Google Sign-Up failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Sign Up</h2>
      <p>Enter your details below to sign up to your account</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Sign up"}
        </button>
      </form>

      <div className="or-divider">OR</div>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google Sign-Up Failed")}
        useOneTap={false}
        text="signup_with"
      />

      <p className="bottom-text">
        Already have an account?{" "}
        <a href={`/signin?redirectTo=${encodeURIComponent(redirectTo)}`}>
          Sign in
        </a>
      </p>
    </div>
  );
}
