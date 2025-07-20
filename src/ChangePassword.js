import React, { useState } from 'react';
import './Auth.css';
const API_URL = process.env.REACT_APP_API_URL;


export default function ChangePassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (isNaN(otp)) {
            alert("OTP must be a number.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/user/verifyOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp: Number(otp), // ✅ send OTP as number
                    newPassword
                })
            });

            const data = await response.json();
            console.log("Change password response:", data);

            if (data.success) {
                alert("Password changed successfully!");
                window.location.href = "/signin";
            } else {
                alert(`Failed: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Change password error:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="auth-container">
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
