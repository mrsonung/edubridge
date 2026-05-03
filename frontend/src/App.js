import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Layout from './layout/Layout';

import Payment from "./pages/Payment";
import Home from './pages/Home';
import RegisterStudent from './pages/RegisterStudent';
import RegisterTeacher from './pages/RegisterTeacher';
import Login from './pages/Login';
import DashboardStudent from './pages/DashboardStudent';
import DashboardTeacher from './pages/DashboardTeacher';
import ProfileTeacher from './pages/ProfileTeacher';
import ProfileTeacherWrapper from './wrappers/ProfileTeacherWrapper';
import ProtectedRoute from "./pages/ProtectedRoute";

const clientId = "676239169272-7o3lmj0grk8duh2b2rud3g0tlr7b2eh5.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>



          <Route index element={<Home />} />
          <Route path="/" element={<Layout />}>

            {/* HOME */}


            {/* AUTH */}
            <Route path="register-student" element={<RegisterStudent />} />
            <Route path="register-teacher" element={<RegisterTeacher />} />
            <Route path="login" element={<Login />} />

            {/* PROFILE */}
            <Route path="teacher/:id" element={<ProfileTeacher />} />
            <Route path="profile-teacher" element={<ProfileTeacherWrapper />} />

            {/* DASHBOARDS */}
            <Route
              path="/dashboard-student"
              element={
                <ProtectedRoute role="student">
                  <DashboardStudent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard-teacher"
              element={
                <ProtectedRoute role="teacher">
                  <DashboardTeacher />
                </ProtectedRoute>
              }
            />

            <Route
              path="dashboard"
              element={
                localStorage.getItem('role') === 'teacher'
                  ? <DashboardTeacher />
                  : <DashboardStudent />
              }
            />

            {/* PAYMENT */}
            <Route path="payment" element={<Payment />} />

          </Route>

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;