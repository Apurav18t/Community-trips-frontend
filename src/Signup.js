import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

//const API_URL = "http://localhost:6969";
const API_URL = "https://community-trips-backend.onrender.com";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("redirectTo") || "/planner";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/planner");
  }, [navigate]);

  // 🔹 Regular Form Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
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
        // 🔁 Forward user to /signin *with redirectTo*
        setTimeout(() => {
          navigate(`/signin?redirectTo=${encodeURIComponent(redirectTo)}`);
        }, 1500);
      } else {
        toast.error(`Signup failed: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // 🔹 Google Sign Up
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
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

      if (result.success) {
        toast.success("Google Sign-Up successful! Check your email.");
        setTimeout(() => {
          navigate(`/signin?redirectTo=${encodeURIComponent(redirectTo)}`);
        }, 1500);
      } else {
        toast.error(`Google Signup failed: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Google Signup Error:", err);
      toast.error("Google Sign-Up failed. Try again.");
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
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
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
        <a href={`/signin?redirectTo=${encodeURIComponent(redirectTo)}`}>Sign in</a>
      </p>
    </div>
  );
}
