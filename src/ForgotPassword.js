import React, { useState } from "react";
<<<<<<< HEAD
import "./Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
=======
import "./Auth.css"; // reuse your auth styles
const API_URL = process.env.REACT_APP_API_URL;

>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const response = await fetch("http://localhost:6969/user/forgotPasswordOTP", {
=======
      const response = await fetch(`${API_URL}/user/forgotPasswordOTP`, {
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
<<<<<<< HEAD

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
=======
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
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
    }
  };

  return (
    <div className="auth-container">
<<<<<<< HEAD
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Forgot Password</h2>
      <p>Enter your email below to request a reset password email</p>
=======
      <h2>Forgot Password</h2>
      <p>Enter your email below to request reset password email</p>
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
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
