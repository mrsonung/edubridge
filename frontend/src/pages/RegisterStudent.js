

import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const RegisterStudent = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', grade: '', subjects: ''

  });
  const [googleData, setGoogleData] = useState(null);
const [showRoleModal, setShowRoleModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register/student`, {
        ...form,
        subjects: form.subjects.split(',').map(s => s.trim())
      });

      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);

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
  console.log("LOGIN DATA:", data);
};

  const handleGoogleSuccess = (credentialResponse) => {
  setGoogleData(credentialResponse.credential);
  setShowRoleModal(true); // 🔥 open modal
};
const handleRoleSelect = async (role) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/google-signup`,
      {
        credential: googleData,
        role
      }
    );

    setShowRoleModal(false); // close modal
    handleLogin(res.data);

  } catch {
    toast.error("Google signup failed");
  }
};
  const handleGoogleError = () => {
    toast.error("Google sign-in failed");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Student Registration</h2>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="grade" placeholder="Grade" value={form.grade} onChange={handleChange} required />
        <input name="subjects" placeholder="Subjects" value={form.subjects} onChange={handleChange} required />

        <button type="submit" className="btn btn-primary">Register</button>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
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

      <ToastContainer position="top-center" />
    </>
  );
};

export default RegisterStudent;