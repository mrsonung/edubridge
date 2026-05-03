import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', form.role);
      localStorage.setItem('user', JSON.stringify(data.user));

      // toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      // toast.error(err.response?.data?.error || 'Failed to login.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit">Login</button>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Don't have an account?&nbsp;
          <Link to="/register-student" style={{ color: '#21b573', fontWeight: 'bold' }}>
            Register as Student
          </Link>
          &nbsp;|&nbsp;
          <Link to="/register-teacher" style={{ color: '#ff9900', fontWeight: 'bold' }}>
            Register as Teacher
          </Link>
        </p>
      </form>


    </>
  );
};

export default Login;
