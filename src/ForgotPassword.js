import React, { useState } from "react";
import "./Auth.css"; // reuse your auth styles

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:6969/user/forgotPasswordOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        alert("Reset password email sent. Please check your inbox.");
        window.location.href = `/change-password?email=${encodeURIComponent(email)}`;
      } else {
        alert(`Error: ${data.message || "Something went wrong."}`);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      alert("Could not send reset email. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <p>Enter your email below to request reset password email</p>
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
