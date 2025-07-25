import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
=======
const API_URL = process.env.REACT_APP_API_URL;
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f

export default function ProfileSettings() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    website: '',
    location: '',
    phone: '',
    bio: '',
    email: '',
  });

  const [previewUrl, setPreviewUrl] = useState('https://via.placeholder.com/90');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") {
      alert("No user logged in.");
      navigate("/signin");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
      const token = parsedUser.access_token;

<<<<<<< HEAD
      fetch(`http://localhost:6969/user/details/${userId}`, {
=======
      fetch(`${API_URL}/user/details/${userId}`, {
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            const user = result.data;
            setFormData({
              fullName: user.fullName || '',
              email: user.email || '',
              website: user.website || '',
              location: user.location || '',
              phone: user.phone || '',
              bio: user.bio || ''
            });

            if (user.profileImage) {
              setPreviewUrl(user.profileImage);
            }

            localStorage.setItem("user", JSON.stringify({
              ...parsedUser,
              ...user
            }));
          } else {
            alert("Failed to load profile.");
          }
        });

    } catch (err) {
      console.error("Invalid user in localStorage:", err);
      navigate("/signin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please login first.");
      navigate("/signin");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;
    const token = user.access_token;

    if (!userId) {
      alert("User ID missing. Please log in again.");
      navigate("/signin");
      return;
    }

    try {
<<<<<<< HEAD
      const response = await fetch(`http://localhost:6969/user/updateProfile/${userId}`, {
=======
      const response = await fetch(`${API_URL}/user/updateProfile/${userId}`, {
>>>>>>> d74fa2308f9aaebe8d1c7f1dc9520e3ab7462e9f
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          website: formData.website,
          location: formData.location,
          phone: formData.phone,
          bio: formData.bio
        })
      });

      const result = await response.json();

      if (result.success) {
        const updatedUser = {
          ...user,
          ...formData
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated successfully!");
      } else {
        alert(`Update failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Something went wrong while updating your profile.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#fff' }}>
      <div style={{ flex: 1, padding: '50px', maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '25px', fontSize: '24px' }}>Edit Profile</h2>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <img
            src={previewUrl}
            alt="Profile"
            style={{ borderRadius: '50%', width: '90px', height: '90px', marginRight: '20px' }}
          />
          <input type="file" accept="image/*" disabled />
          <span style={{ color: 'gray', fontSize: '12px', marginLeft: '10px' }}>(Image upload coming soon)</span>
        </div>

        <Input label="Name" name="fullName" value={formData.fullName} onChange={handleChange} />
        <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
        <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
        <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Bio</label>
          <textarea
            name="bio"
            rows={4}
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>

        <button onClick={handleSave} style={saveBtnStyle}>Save Changes</button>
        <button onClick={handleLogout} style={logoutBtnStyle}>Log Out</button>
      </div>
    </div>
  );
}

const Input = ({ label, name, value, onChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={labelStyle}>{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      style={inputStyle}
      placeholder={label}
    />
  </div>
);

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '500',
  color: '#333'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  backgroundColor: '#fafafa',
  fontSize: '14px'
};

const textareaStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  backgroundColor: '#fafafa',
  fontSize: '14px',
  resize: 'none'
};

const saveBtnStyle = {
  marginTop: '20px',
  padding: '12px 24px',
  backgroundColor: '#000',
  color: '#fff',
  fontWeight: '600',
  fontSize: '14px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  width: '100%'
};

const logoutBtnStyle = {
  marginTop: '15px',
  padding: '10px',
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontWeight: '500',
  fontSize: '14px',
  cursor: 'pointer',
  width: '100%'
};
