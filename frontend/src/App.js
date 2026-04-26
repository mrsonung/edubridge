import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import RegisterStudent from './pages/RegisterStudent';
import RegisterTeacher from './pages/RegisterTeacher';
import Login from './pages/Login';
import DashboardStudent from './pages/DashboardStudent';
import DashboardTeacher from './pages/DashboardTeacher';
import ProfileTeacher from './pages/ProfileTeacher';
import ProfileTeacherWrapper from './wrappers/ProfileTeacherWrapper';

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "710819961819-pb1h2j8b2lj5i3ovrst0gn3haj7l2jdh.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* AUTH */}
          <Route path="/register-student" element={<RegisterStudent />} />
          <Route path="/register-teacher" element={<RegisterTeacher />} />
          <Route path="/login" element={<Login />} />

          {/* PROFILE */}
          <Route path="/teacher/:id" element={<ProfileTeacher />} />
          <Route path="/profile-teacher" element={<ProfileTeacherWrapper />} />

          {/* DASHBOARDS (DIRECT) */}
          <Route path="/dashboard-student" element={<DashboardStudent />} />
          <Route path="/dashboard-teacher" element={<DashboardTeacher />} />

          <Route
            path="/dashboard"
            element={
              localStorage.getItem('role') === 'teacher'
                ? <DashboardTeacher />
                : <DashboardStudent />
            }
          />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;