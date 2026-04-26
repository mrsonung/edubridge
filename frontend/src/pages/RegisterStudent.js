import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const RegisterStudent = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', grade: '', subjects: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register/student`, {
        ...form,
        subjects: form.subjects.split(',').map(s => s.trim())
      });
      toast.success('Student registered successfully!');
      setTimeout(() => {
        navigate('/login');  // Redirect to login after toast
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register student.');
    }
  };

  const handleGoogleSuccess = credentialResponse => {
    axios.post(`${process.env.REACT_APP_API_URL}/auth/google-signup`, {
  credential: credentialResponse.credential
})
      .then(() => {
        toast.success('Signed up with Google!');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      })
      .catch(() => {
        toast.error('Google signup failed.');
      });
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in failed');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Student Registration</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
        <input name="grade" placeholder="Grade" value={form.grade} onChange={handleChange} required />
        <input name="subjects" placeholder="Subjects (comma separated)" value={form.subjects} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      <div className="google-login-container" style={{ marginTop: '20px', textAlign: 'center' }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
      </div>

      <ToastContainer position="top-center" />
    </>
  );
};

export default RegisterStudent;
