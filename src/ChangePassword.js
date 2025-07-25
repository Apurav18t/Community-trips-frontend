import React, { useState } from 'react';
import './Auth.css';
<<<<<<< HEAD
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
=======
const API_URL = process.env.REACT_APP_API_URL;

>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f

export default function ChangePassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
<<<<<<< HEAD
            toast.error("Passwords do not match.");
=======
            alert("Passwords do not match.");
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
            return;
        }

        if (isNaN(otp)) {
<<<<<<< HEAD
            toast.error("OTP must be a number.");
=======
            alert("OTP must be a number.");
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
            return;
        }

        try {
<<<<<<< HEAD
            const response = await fetch("http://localhost:6969/user/verifyOTP", {
=======
            const response = await fetch(`${API_URL}/user/verifyOTP`, {
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
<<<<<<< HEAD
                    otp: Number(otp),
=======
                    otp: Number(otp), // ✅ send OTP as number
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
                    newPassword
                })
            });

            const data = await response.json();
            console.log("Change password response:", data);

            if (data.success) {
<<<<<<< HEAD
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
=======
                alert("Password changed successfully!");
                window.location.href = "/signin";
            } else {
                alert(`Failed: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Change password error:", err);
            alert("Something went wrong. Please try again.");
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
        }
    };

    return (
        <div className="auth-container">
<<<<<<< HEAD
            <ToastContainer position="top-center" autoClose={3000} />
=======
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
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
