import React, { useState } from "react";
import "./Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//const API_URL = "https://community-trips-backend.onrender.com";
const API_URL = "http://localhost:6969";


export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/user/forgotPasswordOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Reset password email sent. Please check your inbox.");
        setTimeout(() => {
          window.location.href = `/change-password?email=${encodeURIComponent(email)}`;
        }, 2000);
      } else {
        toast.error(`Error: ${data.message || "Something went wrong."}`);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Could not send reset email. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Forgot Password</h2>
      <p>Enter your email below to request a reset password email</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="abc@example.com" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Password Email</button>
      </form>
      <p className="bottom-text">
        Go back to <a href="/signin">Sign in</a>
      </p>
    </div>
  );
}
