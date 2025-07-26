import React, { useState } from 'react';
import './Auth.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = "http://localhost:6969";

export default function ChangePassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (isNaN(otp)) {
            toast.error("OTP must be a number.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/user/verifyOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: Number(otp),
                    newPassword
                })
            });

            const data = await response.json();
            console.log("Change password response:", data);

            if (data.success) {
                toast.success("Password changed successfully!");
                setTimeout(() => {
                    window.location.href = "/signin";
                }, 2000); // Delay for user to see toast
            } else {
                toast.error(`Failed: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Change password error:", err);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <ToastContainer position="top-center" autoClose={3000} />
            <h2>Change Password</h2>
            <p>Enter your Email, OTP and new password below</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Your Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="OTP"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Change Password</button>
            </form>
            <p className="bottom-text">
                <a href="/signin">Back to Sign In</a>
            </p>
        </div>
    );
}
