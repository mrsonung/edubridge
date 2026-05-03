

import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const RegisterTeacher = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', grades: '', subjects: '', qualification: ''
  });
  const [googleData, setGoogleData] = useState(null);
const [showRoleModal, setShowRoleModal] = useState(false);

  const navigate = useNavigate();

  // ✅ CHANGE HANDLER
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ NORMAL REGISTER
  const handleSubmit = async e => {
  e.preventDefault();
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/auth/register/teacher`, {
      ...form,
      grades: form.grades.split(',').map(g => g.trim()),
      subjects: form.subjects.split(',').map(s => s.trim())
    });

    toast.success("Registered successfully!");
    setTimeout(() => navigate("/login"), 2000); // ✅ FIXED

  } catch {
    toast.error("Registration failed");
  }
  
};

const handleLogin = (data) => {
  if (!data?.token) {
    toast.error("Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("role", data.role);

  if (data.role === "teacher") {
    navigate("/dashboard-teacher");
  } else {
    navigate("/dashboard-student");
  }
};

  // ✅ GOOGLE SUCCESS
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/google-auth`,
      {
        credential: credentialResponse.credential
      }
    );

    // 🆕 NEW USER
    if (res.data.newUser) {
      setGoogleData(credentialResponse); // 🔥 IMPORTANT
      setShowRoleModal(true);
      return;
    }

    // ✅ EXISTING USER
    handleLogin(res.data);

  } catch (err) {
    console.log("GOOGLE ERROR:", err);
    toast.error("Google signup failed");
  }
};
const handleRoleSelect = async (role) => {
  try {
    if (!googleData?.credential) {
      toast.error("Something went wrong. Try again.");
      return;
    }

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/google-auth`,
      {
        credential: googleData.credential,
        role
      }
    );

    setShowRoleModal(false); // close modal
    handleLogin(res.data);

  } catch (err) {
    console.log("ROLE ERROR:", err);
    toast.error("Failed to complete signup");
  }
};

  // ✅ GOOGLE ERROR
  const handleGoogleError = () => {
    toast.error("Google sign-in failed");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Teacher Registration</h2>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="grades" placeholder="Grades" value={form.grades} onChange={handleChange} required />
        <input name="subjects" placeholder="Subjects" value={form.subjects} onChange={handleChange} required />
        <input name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange} required />

        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      {showRoleModal && (
  <div className="modal-overlay">
    <div className="role-modal">

      <h2>Select Your Role</h2>
      <p>Choose how you want to continue</p>

      <button
        className="btn btn-primary"
        onClick={() => handleRoleSelect("student")}
      >
        Continue as Student
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => handleRoleSelect("teacher")}
      >
        Continue as Teacher
      </button>

      <button
        className="modal-close"
        onClick={() => setShowRoleModal(false)}
      >
        ✕
      </button>

    </div>
  </div>
)}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
      </div>

      <ToastContainer position="top-center" />
    </>
  );
};

export default RegisterTeacher;